from __future__ import annotations
import math
from models.schemas import GitHubProfile, ScoreBreakdown


def _clamp(v: float) -> int:
    return max(0, min(100, int(round(v))))


def _score_projects(p: GitHubProfile) -> int:
    original = [r for r in p.repos if not r.is_fork]
    count   = min(len(original) / 20, 1.0) * 40
    starred = min(len([r for r in original if r.stars >= 5]) / 5, 1.0) * 30
    desc    = (len([r for r in original if r.description and len(r.description) > 20]) / max(len(original), 1)) * 20
    topics  = (len([r for r in original if len(r.topics) >= 2]) / max(len(original), 1)) * 10
    return _clamp(count + starred + desc + topics)


def _score_consistency(p: GitHubProfile) -> int:
    from datetime import datetime, timezone
    age     = min(p.account_age_days / 730, 1.0) * 30
    commits = min(p.commit_count_estimate / 50, 1.0) * 50
    now     = datetime.now(timezone.utc)
    recent  = sum(1 for r in p.repos if r.pushed_at and
                  (now - datetime.fromisoformat(r.pushed_at.replace("Z", "+00:00"))).days <= 90)
    return _clamp(age + commits + min(recent / 5, 1.0) * 20)


def _score_impact(p: GitHubProfile) -> int:
    stars   = min(math.log1p(p.total_stars) / math.log1p(500), 1.0) * 50
    forks   = min(math.log1p(sum(r.forks for r in p.repos)) / math.log1p(200), 1.0) * 30
    follow  = min(p.followers / 100, 1.0) * 20
    return _clamp(stars + forks + follow)


def _score_diversity(p: GitHubProfile) -> int:
    langs   = min(len(p.top_languages) / 5, 1.0) * 50
    topics  = set(t for r in p.repos for t in r.topics)
    topic_s = min(len(topics) / 10, 1.0) * 30
    lset    = {l.lower() for l in p.top_languages}
    domains = sum([
        bool(lset & {"javascript","typescript","html","css"}),
        bool(lset & {"python","go","java","rust","c++","c#","ruby"}),
        bool(lset & {"jupyter notebook","r","matlab"}),
    ])
    return _clamp(langs + topic_s + min(domains / 2, 1.0) * 20)


def _score_collaboration(p: GitHubProfile) -> int:
    forks  = min(len([r for r in p.repos if r.is_fork]) / 10, 1.0) * 30
    ratio  = min((p.followers / max(p.following, 1)) / 3, 1.0) * 40
    bio    = 15 if p.bio else 0
    blog   = 15 if p.blog else 0
    return _clamp(forks + ratio + bio + blog)


def _tier(s: int) -> str:
    if s >= 88: return "ELITE"
    if s >= 74: return "SENIOR"
    if s >= 55: return "MID"
    return "JUNIOR"


def compute_scores(profile: GitHubProfile) -> ScoreBreakdown:
    p = _score_projects(profile)
    c = _score_consistency(profile)
    i = _score_impact(profile)
    d = _score_diversity(profile)
    col = _score_collaboration(profile)
    overall = _clamp(p*0.30 + c*0.20 + i*0.20 + d*0.15 + col*0.15)
    return ScoreBreakdown(overall=overall, projects=p, consistency=c,
                          impact=i, diversity=d, collaboration=col, tier=_tier(overall))
