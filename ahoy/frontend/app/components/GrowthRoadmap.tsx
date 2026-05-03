"use client";
interface Props { suggestions: string[]; recruiter: boolean; }

export function GrowthRoadmap({ suggestions, recruiter }: Props) {
  const FG = recruiter?"#000":"#fff";
  const B  = `1px solid ${FG}`;
  const BF = `1px solid ${recruiter?"#ccc":"#333"}`;
  const M  = { fontFamily:"'JetBrains Mono',monospace" } as const;

  const PRIORITY = ["CRITICAL","CRITICAL","HIGH","MEDIUM"];

  return (
    <div>
      <div style={{ ...M, fontSize:"9px", letterSpacing:"4px", textTransform:"uppercase", color:recruiter?"#555":"#888", marginBottom:"16px" }}>
        GROWTH ROADMAP — NEXT 6 MONTHS
      </div>
      <div style={{ display:"flex", flexDirection:"column", border:B }}>
        {suggestions.map((s, i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"48px 1fr auto", padding:"16px", gap:"16px", alignItems:"start", borderBottom:i<suggestions.length-1?BF:"none" }}>
            <span style={{ ...M, fontSize:"10px", color:recruiter?"#777":"#666", letterSpacing:"2px", paddingTop:"2px" }}>
              0{i+1}
            </span>
            <div style={{ ...M, fontSize:"12px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", lineHeight:1.6 }}>
              {s}
            </div>
            <span style={{ display:"inline-block", background:i<2?FG:"transparent", color:i<2?(recruiter?"#fff":"#000"):FG, border:B, padding:"3px 10px", ...M, fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", whiteSpace:"nowrap" }}>
              {PRIORITY[i] || "MEDIUM"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
