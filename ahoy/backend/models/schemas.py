from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AnalyzeRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=100, pattern=r"^[a-zA-Z0-9\-]+$")


class RepoData(BaseModel):
    name: str
    description: Optional[str] = None
    stars: int = 0
    forks: int = 0
    language: Optional[str] = None
    topics: list[str] = []
    pushed_at: Optional[str] = None
    created_at: Optional[str] = None
    size: int = 0
    open_issues: int = 0
    html_url: str = ""
    is_fork: bool = False


class GitHubProfile(BaseModel):
    username: str
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: str = ""
    followers: int = 0
    following: int = 0
    public_repos: int = 0
    total_stars: int = 0
    account_age_days: int = 0
    created_at: str = ""
    location: Optional[str] = None
    company: Optional[str] = None
    blog: Optional[str] = None
    repos: list[RepoData] = []
    top_languages: dict[str, int] = {}
    commit_count_estimate: int = 0


class ScoreBreakdown(BaseModel):
    overall: int = Field(..., ge=0, le=100)
    projects: int = Field(..., ge=0, le=100)
    consistency: int = Field(..., ge=0, le=100)
    impact: int = Field(..., ge=0, le=100)
    diversity: int = Field(..., ge=0, le=100)
    collaboration: int = Field(..., ge=0, le=100)
    tier: str


class RepoInsight(BaseModel):
    name: str
    stack: list[str]
    summary: str
    signal_type: str
    suggestion: str


class AIAnalysis(BaseModel):
    summary: str
    strengths: list[str]
    weaknesses: list[str]
    resume_bullets: list[str]
    growth_suggestions: list[str]
    repo_insights: list[RepoInsight]
    signal_ratio: int
    archetype: str
    one_liner: str


class ProfileResponse(BaseModel):
    username: str
    profile: GitHubProfile
    scores: ScoreBreakdown
    analysis: AIAnalysis
    analyzed_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    cached: bool = False
