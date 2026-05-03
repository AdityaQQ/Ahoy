from __future__ import annotations
import os
import httpx
from datetime import datetime, timezone
from collections import Counter
from typing import Optional
from models.schemas import GitHubProfile, RepoData

GITHUB_API = "https://api.github.com"
_TOKEN = os.getenv("GITHUB_TOKEN", "")
_HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    **({"Authorization": f"Bearer {_TOKEN}"} if _TOKEN else {}),
}


def _age_days(created_at: str) -> int:
    try:
        dt = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        return (datetime.now(timezone.utc) - dt).days
    except Exception:
        return 0


async def fetch_profile(username: str) -> GitHubProfile:
    async with httpx.AsyncClient(headers=_HEADERS, timeout=20) as client:
        r = await client.get(f"{GITHUB_API}/users/{username}")
        if r.status_code == 404:
            raise ValueError(f"GitHub user '{username}' not found.")
        if r.status_code == 403:
            raise RuntimeError("GitHub API rate limit exceeded. Set GITHUB_TOKEN env var.")
        r.raise_for_status()
        user = r.json()

        repos_raw: list[dict] = []
        page = 1
        while len(repos_raw) < 100:
            rr = await client.get(
                f"{GITHUB_API}/users/{username}/repos",
                params={"per_page": 100, "sort": "pushed", "page": page},
            )
            rr.raise_for_status()
            batch = rr.json()
            if not batch:
                break
            repos_raw.extend(batch)
            if len(batch) < 100:
                break
            page += 1

        repos: list[RepoData] = []
        lang_counter: Counter = Counter()

        for r_data in repos_raw:
            repo = RepoData(
                name=r_data.get("name", ""),
                description=r_data.get("description"),
                stars=r_data.get("stargazers_count", 0),
                forks=r_data.get("forks_count", 0),
                language=r_data.get("language"),
                topics=r_data.get("topics", []),
                pushed_at=r_data.get("pushed_at"),
                created_at=r_data.get("created_at"),
                size=r_data.get("size", 0),
                open_issues=r_data.get("open_issues_count", 0),
                html_url=r_data.get("html_url", ""),
                is_fork=r_data.get("fork", False),
            )
            repos.append(repo)
            if repo.language:
                lang_counter[repo.language] += 1

        total_stars = sum(r.stars for r in repos)
        commit_estimate = await _estimate_commits(client, username)

        return GitHubProfile(
            username=username,
            name=user.get("name"),
            bio=user.get("bio"),
            avatar_url=user.get("avatar_url", ""),
            followers=user.get("followers", 0),
            following=user.get("following", 0),
            public_repos=user.get("public_repos", 0),
            total_stars=total_stars,
            account_age_days=_age_days(user.get("created_at", "")),
            created_at=user.get("created_at", ""),
            location=user.get("location"),
            company=user.get("company"),
            blog=user.get("blog"),
            repos=repos,
            top_languages=dict(lang_counter.most_common(10)),
            commit_count_estimate=commit_estimate,
        )


async def _estimate_commits(client: httpx.AsyncClient, username: str) -> int:
    try:
        r = await client.get(
            f"{GITHUB_API}/users/{username}/events/public",
            params={"per_page": 100},
        )
        if r.status_code != 200:
            return 0
        events = r.json()
        push_events = [e for e in events if e.get("type") == "PushEvent"]
        return sum(len(e.get("payload", {}).get("commits", [])) for e in push_events)
    except Exception:
        return 0
