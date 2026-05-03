"use client";
import { ExternalLink, Star, GitFork } from "lucide-react";
import type { RepoData, RepoInsight } from "@/lib/api";

interface Props { repos: RepoData[]; insights: RepoInsight[]; recruiter: boolean; }

const SIG_LABEL: Record<string,string> = {
  REAL_WORK: "REAL WORK", TUTORIAL: "TUTORIAL", EXPERIMENTAL: "EXPERIMENTAL"
};

export function RepoGrid({ repos, insights, recruiter }: Props) {
  const FG = recruiter?"#000":"#fff";
  const B  = `1px solid ${FG}`;
  const BF = `1px solid ${recruiter?"#ccc":"#333"}`;
  const M  = { fontFamily:"'JetBrains Mono',monospace" } as const;
  const L  = { ...M, fontSize:"9px", letterSpacing:"3px", textTransform:"uppercase" as const, color:recruiter?"#555":"#888" };

  const insightMap = Object.fromEntries(insights.map(i=>[i.name, i]));
  const top = repos.filter(r=>!r.is_fork).sort((a,b)=>b.stars-a.stars).slice(0,9);

  return (
    <div>
      <div style={{ ...L, marginBottom:"16px" }}>REPOSITORY INTELLIGENCE — TOP {top.length}</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"0" }}>
        {top.map(repo => {
          const insight = insightMap[repo.name];
          const isReal  = insight?.signal_type === "REAL_WORK";
          return (
            <div key={repo.name} style={{ border:isReal?B:BF, padding:"16px", opacity:isReal?1:0.65, display:"flex", flexDirection:"column", gap:"8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <a href={repo.html_url} target="_blank" rel="noreferrer"
                  style={{ ...M, fontSize:"12px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", textDecoration:"none", color:FG, display:"flex", alignItems:"center", gap:"4px" }}>
                  {repo.name.slice(0,22)}{repo.name.length>22?"...":""}
                  <ExternalLink size={9} />
                </a>
                {insight && (
                  <span style={{ ...M, fontSize:"8px", letterSpacing:"2px", background:isReal?FG:"transparent", color:isReal?(recruiter?"#fff":"#000"):FG, border:isReal?B:BF, padding:"2px 6px" }}>
                    {SIG_LABEL[insight.signal_type]}
                  </span>
                )}
              </div>

              {repo.description && (
                <div style={{ ...M, fontSize:"10px", color:recruiter?"#444":"#aaa", lineHeight:1.6 }}>
                  {repo.description.slice(0,80)}{repo.description.length>80?"...":""}
                </div>
              )}

              <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                {repo.language && (
                  <span style={{ ...M, fontSize:"9px", color:recruiter?"#555":"#888" }}>{repo.language}</span>
                )}
                <span style={{ ...M, fontSize:"9px", color:recruiter?"#666":"#777", display:"flex", alignItems:"center", gap:"3px" }}>
                  <Star size={9}/>{repo.stars}
                </span>
                <span style={{ ...M, fontSize:"9px", color:recruiter?"#666":"#777", display:"flex", alignItems:"center", gap:"3px" }}>
                  <GitFork size={9}/>{repo.forks}
                </span>
              </div>

              {insight?.suggestion && (
                <div style={{ ...M, fontSize:"9px", color:recruiter?"#777":"#555", borderTop:`1px solid ${recruiter?"#eee":"#222"}`, paddingTop:"8px", lineHeight:1.7 }}>
                  → {insight.suggestion}
                </div>
              )}

              {insight?.stack && insight.stack.length > 0 && (
                <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
                  {insight.stack.map(s=>(
                    <span key={s} style={{ ...M, fontSize:"8px", border:BF, padding:"2px 6px", letterSpacing:"1px" }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
