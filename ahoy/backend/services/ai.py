from __future__ import annotations
import os, json, re
from groq import Groq
from models.schemas import GitHubProfile, ScoreBreakdown, AIAnalysis, RepoInsight

_client: Groq | None = None

def _get_client() -> Groq:
    global _client
    if _client is None:
        key = os.getenv("GROQ_API_KEY", "")
        if not key:
            raise RuntimeError("GROQ_API_KEY not set.")
        _client = Groq(api_key=key)
    return _client


def _build_prompt(profile: GitHubProfile, scores: ScoreBreakdown) -> str:
    top_repos = sorted(profile.repos, key=lambda r: r.stars, reverse=True)[:10]
    repos_text = "\n".join(
        f"  - {r.name} | stars:{r.stars} | lang:{r.language or 'unknown'} "
        f"| fork:{r.is_fork} | topics:{','.join(r.topics[:4]) or 'none'} "
        f"| desc:{(r.description or '')[:80]}"
        for r in top_repos
    )
    langs_text = ", ".join(f"{l}({c})" for l, c in list(profile.top_languages.items())[:8])

    return f"""Analyze this GitHub profile. Return ONLY raw JSON — no markdown, no backticks.

PROFILE: username:{profile.username} | name:{profile.name or 'N/A'} | bio:{profile.bio or 'N/A'}
followers:{profile.followers} | repos:{profile.public_repos} | stars:{profile.total_stars}
age_days:{profile.account_age_days} | languages:{langs_text} | recent_commits:{profile.commit_count_estimate}

SCORES: overall:{scores.overall} tier:{scores.tier} | projects:{scores.projects}
consistency:{scores.consistency} | impact:{scores.impact} | diversity:{scores.diversity} | collab:{scores.collaboration}

TOP REPOS:
{repos_text}

Return this exact JSON:
{{
  "summary": "2-3 sentence professional assessment",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "resume_bullets": ["Architected ...", "Engineered ...", "Deployed ...", "Built ...", "Contributed ..."],
  "growth_suggestions": ["Build X using Y", "Deploy Z", "Contribute to A", "Create B"],
  "repo_insights": [
    {{"name":"repo","stack":["tech"],"summary":"one sentence","signal_type":"REAL_WORK","suggestion":"improvement"}}
  ],
  "signal_ratio": 75,
  "archetype": "BACKEND ARCHITECT",
  "one_liner": "Single recruiter sentence"
}}
Rules: top 5 non-fork repos in insights. signal_type = REAL_WORK or TUTORIAL or EXPERIMENTAL. Raw JSON only."""


def _fallback(profile: GitHubProfile, scores: ScoreBreakdown) -> AIAnalysis:
    top_lang = next(iter(profile.top_languages), "Unknown")
    original = [r for r in profile.repos if not r.is_fork]
    insights = [
        RepoInsight(name=r.name, stack=[r.language or "Unknown"],
                    summary=r.description or "No description.",
                    signal_type="REAL_WORK" if (r.stars > 0 or r.description) else "TUTORIAL",
                    suggestion="Add a README with setup instructions.")
        for r in sorted(original, key=lambda r: r.stars, reverse=True)[:5]
    ]
    return AIAnalysis(
        summary=f"{profile.username} is a {scores.tier.lower()}-tier developer with {profile.public_repos} repos and {profile.total_stars} stars. Primary focus: {top_lang}.",
        strengths=[f"Strong {top_lang} expertise", f"{profile.total_stars} total stars earned", f"{profile.public_repos} public projects"],
        weaknesses=["Limited repo descriptions", "Needs more cross-domain projects", "Commit visibility could improve"],
        resume_bullets=[
            f"Developed {len(original)} original GitHub projects accumulating {profile.total_stars}+ stars",
            f"Built production-grade {top_lang} applications",
            f"Maintained open-source presence with {profile.followers} followers",
            "Applied consistent software development practices across multiple domains",
            "Contributed to open-source ecosystem through public repositories",
        ],
        growth_suggestions=[
            "Deploy a distributed task queue using Celery + Redis",
            "Build an observable microservice with Prometheus + Grafana",
            "Create a type-safe fullstack app with Next.js + tRPC",
            "Contribute merged PRs to a top-100 GitHub repository",
        ],
        repo_insights=insights,
        signal_ratio=70,
        archetype=f"{top_lang.upper()} ENGINEER",
        one_liner=f"A {scores.tier.lower()}-tier {top_lang} developer with {profile.public_repos} repos.",
    )


async def analyze_profile(profile: GitHubProfile, scores: ScoreBreakdown) -> AIAnalysis:
    try:
        client = _get_client()
    except RuntimeError:
        return _fallback(profile, scores)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=2000,
        temperature=0.3,
        messages=[
            {"role": "system", "content": "You are an elite developer career analyst. Respond with valid raw JSON only. No markdown, no backticks."},
            {"role": "user", "content": _build_prompt(profile, scores)},
        ],
    )

    raw = re.sub(r"^```(?:json)?\s*", "", response.choices[0].message.content.strip())
    raw = re.sub(r"\s*```$", "", raw)
    data: dict = json.loads(raw)

    return AIAnalysis(
        summary=data.get("summary", ""),
        strengths=data.get("strengths", []),
        weaknesses=data.get("weaknesses", []),
        resume_bullets=data.get("resume_bullets", []),
        growth_suggestions=data.get("growth_suggestions", []),
        repo_insights=[
            RepoInsight(name=r["name"], stack=r.get("stack", []), summary=r.get("summary", ""),
                        signal_type=r.get("signal_type", "REAL_WORK"), suggestion=r.get("suggestion", ""))
            for r in data.get("repo_insights", [])
        ],
        signal_ratio=int(data.get("signal_ratio", 70)),
        archetype=data.get("archetype", "ENGINEER"),
        one_liner=data.get("one_liner", ""),
    )
