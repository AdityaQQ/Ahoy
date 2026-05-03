const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export interface RepoData {
  name: string; description: string | null; stars: number; forks: number;
  language: string | null; topics: string[]; pushed_at: string | null;
  html_url: string; is_fork: boolean; size: number; open_issues: number;
}

export interface GitHubProfile {
  username: string; name: string | null; bio: string | null; avatar_url: string;
  followers: number; following: number; public_repos: number; total_stars: number;
  account_age_days: number; created_at: string; location: string | null;
  company: string | null; blog: string | null;
  repos: RepoData[]; top_languages: Record<string, number>; commit_count_estimate: number;
}

export interface ScoreBreakdown {
  overall: number; projects: number; consistency: number; impact: number;
  diversity: number; collaboration: number; tier: "JUNIOR"|"MID"|"SENIOR"|"ELITE";
}

export interface RepoInsight {
  name: string; stack: string[]; summary: string;
  signal_type: "REAL_WORK"|"TUTORIAL"|"EXPERIMENTAL"; suggestion: string;
}

export interface AIAnalysis {
  summary: string; strengths: string[]; weaknesses: string[];
  resume_bullets: string[]; growth_suggestions: string[];
  repo_insights: RepoInsight[]; signal_ratio: number; archetype: string; one_liner: string;
}

export interface ProfileResponse {
  username: string; profile: GitHubProfile; scores: ScoreBreakdown;
  analysis: AIAnalysis; analyzed_at: string; cached: boolean;
}

async function req<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const ahoyApi = {
  analyze: (username: string, force = false) =>
    req<ProfileResponse>(`/analyze${force ? "?force=true" : ""}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    }),
  getProfile: (username: string) => req<ProfileResponse>(`/profile/${username}`),
};
