"use client";
import type { ScoreBreakdown, AIAnalysis } from "@/lib/api";

interface Props { scores: ScoreBreakdown; analysis: AIAnalysis; recruiter: boolean; }

export function RecruiterView({ scores, analysis, recruiter }: Props) {
  const FG = recruiter?"#000":"#fff";
  const B  = `1px solid ${FG}`;
  const BF = `1px solid ${recruiter?"#ccc":"#333"}`;
  const M  = { fontFamily:"'JetBrains Mono',monospace" } as const;
  const L  = { ...M, fontSize:"9px", letterSpacing:"4px", textTransform:"uppercase" as const, color:recruiter?"#555":"#888", marginBottom:"8px" };

  const hireConf = Math.min(scores.overall + 12, 99);
  const comp = scores.tier === "ELITE" ? "$160–200K"
             : scores.tier === "SENIOR" ? "$120–160K"
             : scores.tier === "MID"    ? "$90–120K"
             : "$60–90K";
  const roles = scores.tier === "ELITE" || scores.tier === "SENIOR"
    ? ["Senior Backend Eng.","Staff Engineer","Platform Engineer"]
    : ["Backend Engineer","Full-Stack Engineer","Software Engineer"];

  return (
    <div>
      <div style={L}>RECRUITER INTELLIGENCE VIEW</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", border:B }}>
        <div style={{ padding:"18px", borderRight:B }}>
          <div style={L}>HIRE CONFIDENCE</div>
          <div style={{ fontSize:"36px", fontWeight:900, letterSpacing:"-2px" }}>{hireConf}%</div>
          <div style={{ ...M, fontSize:"9px", color:recruiter?"#777":"#666" }}>AI RECOMMENDATION</div>
        </div>
        <div style={{ padding:"18px", borderRight:B }}>
          <div style={L}>BEST FIT ROLES</div>
          {roles.map(r => <div key={r} style={{ ...M, fontSize:"11px", lineHeight:"2" }}>→ {r}</div>)}
        </div>
        <div style={{ padding:"18px" }}>
          <div style={L}>COMPENSATION BAND</div>
          <div style={{ fontSize:"24px", fontWeight:900, letterSpacing:"-1px" }}>{comp}</div>
          <div style={{ ...M, fontSize:"9px", color:recruiter?"#777":"#666" }}>US MARKET / 2025</div>
        </div>
      </div>
      <div style={{ border:B, borderTop:"none", padding:"14px" }}>
        <div style={L}>RED FLAGS</div>
        {analysis.weaknesses.map(w => (
          <div key={w} style={{ ...M, fontSize:"11px", lineHeight:"2" }}>→ {w}</div>
        ))}
      </div>
    </div>
  );
}
