"use client";
import type { AIAnalysis } from "@/lib/api";

interface Props { analysis: AIAnalysis; recruiter: boolean; signalOnly?: boolean; }

export function AIAnalysisPanel({ analysis, recruiter, signalOnly }: Props) {
  const FG = recruiter?"#000":"#fff";
  const BG = recruiter?"#fff":"#000";
  const B  = `1px solid ${FG}`;
  const BF = `1px solid ${recruiter?"#ccc":"#333"}`;
  const M  = { fontFamily:"'JetBrains Mono',monospace" } as const;
  const L  = { ...M, fontSize:"9px", letterSpacing:"4px", textTransform:"uppercase" as const, color:recruiter?"#555":"#888", marginBottom:"10px" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      {/* Archetype + one-liner */}
      <div>
        <div style={L}>ARCHETYPE</div>
        <div style={{ fontSize:"clamp(18px,3vw,28px)", fontWeight:900, letterSpacing:"-1px", textTransform:"uppercase" }}>
          {analysis.archetype}
        </div>
        <div style={{ ...M, fontSize:"11px", color:recruiter?"#444":"#aaa", marginTop:"6px", lineHeight:1.6 }}>
          {analysis.one_liner}
        </div>
      </div>

      {/* Signal ratio */}
      <div>
        <div style={L}>SIGNAL RATIO</div>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ flex:1, height:"8px", background:recruiter?"#eee":"#111", border:BF }}>
            <div style={{ height:"100%", background:FG, width:`${analysis.signal_ratio}%`, transition:"width 1s" }} />
          </div>
          <span style={{ ...M, fontSize:"12px", fontWeight:700 }}>{analysis.signal_ratio}%</span>
        </div>
        <div style={{ ...M, fontSize:"9px", color:recruiter?"#777":"#555", marginTop:"4px" }}>REAL WORK VS TUTORIALS</div>
      </div>

      {signalOnly ? null : (
        <>
          {/* Summary */}
          <div>
            <div style={L}>SUMMARY</div>
            <div style={{ ...M, fontSize:"11px", lineHeight:1.8, color:recruiter?"#333":"#ccc" }}>{analysis.summary}</div>
          </div>

          {/* Strengths + Weaknesses */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
            <div style={{ border:B, padding:"14px" }}>
              <div style={L}>STRENGTHS</div>
              {analysis.strengths.map(s => (
                <div key={s} style={{ ...M, fontSize:"11px", lineHeight:"2.0", color:recruiter?"#222":"#ddd" }}>→ {s}</div>
              ))}
            </div>
            <div style={{ border:BF, padding:"14px", opacity:0.7 }}>
              <div style={L}>GAPS</div>
              {analysis.weaknesses.map(w => (
                <div key={w} style={{ ...M, fontSize:"11px", lineHeight:"2.0" }}>→ {w}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
