from fastapi import APIRouter, HTTPException, Query
from models.schemas import AnalyzeRequest, ProfileResponse
from services.github import fetch_profile
from services.scoring import compute_scores
from services.ai import analyze_profile
from cache.store import profile_cache

router = APIRouter()


async def _run(username: str) -> ProfileResponse:
    try:
        profile = await fetch_profile(username)
    except ValueError as e:
        raise HTTPException(404, str(e))
    except RuntimeError as e:
        raise HTTPException(429, str(e))
    except Exception as e:
        raise HTTPException(502, f"GitHub API error: {e}")

    scores = compute_scores(profile)
    try:
        analysis = await analyze_profile(profile, scores)
    except Exception as e:
        raise HTTPException(503, f"AI error: {e}")

    result = ProfileResponse(username=username, profile=profile, scores=scores, analysis=analysis)
    profile_cache.set(username, result)
    return result


@router.post("/analyze", response_model=ProfileResponse)
async def analyze(req: AnalyzeRequest, force: bool = Query(False)):
    u = req.username.lower().strip()
    if not force:
        cached = profile_cache.get(u)
        if cached:
            cached.cached = True
            return cached
    return await _run(u)


@router.get("/profile/{username}", response_model=ProfileResponse)
async def get_profile(username: str, force: bool = Query(False)):
    u = username.lower().strip()
    if not force:
        cached = profile_cache.get(u)
        if cached:
            cached.cached = True
            return cached
    return await _run(u)


@router.get("/cache/stats")
async def cache_stats():
    return {"cached_profiles": profile_cache.size()}


@router.delete("/cache/{username}")
async def evict(username: str):
    profile_cache.delete(username.lower())
    return {"evicted": username}
