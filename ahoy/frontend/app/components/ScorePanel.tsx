"use client";
import { useEffect, useState } from "react";
import type { ScoreBreakdown } from "@/lib/api";

interface Props { scores: ScoreBreakdown; recruiter: boolean; }

const DIMS = [
  { key:"projects",      label:"PROJECTS"      },
  { key:"consistency",   label:"CONSISTENCY"   },
  { key:"impact",        label:"IMPACT"        },
  { key:"diversity",     label:"DIVERSITY"     },
  { key:"collaboration", label:"COLLABORATION" },
] as const;

export function ScorePanel({ scores, recruiter }: Props) {
  const [anim, setAnim] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setAnim(true),150); return ()=>clearTimeout(t); }, []);

  const FG = recruiter?"#000":"#fff";
  const BG = recruiter?"#fff":"#000";
  const B  = `1px solid ${FG}`;
  const M  = { fontFamily:"'JetBrains Mono',monospace" } as const;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderBottom:B }}>
      <div style={{ borderRight:B, padding:"28px" }}>
        <div style={{ ...M, fontSize:"9px", letterSpacing:"4px", textTransform:"uppercase", color:recruiter?"#555":"#888", marginBottom:"8px" }}>AHOY SCORE</div>
        <div style={{ fontSize:"clamp(80px,12vw,128px)", fontWeight:900, lineHeight:1, letterSpacing:"-4px" }}>
          {scores.overall}
        </div>
        <div style={{ ...M, fontSize:"11px", color:recruiter?"#555":"#888", marginTop:"4px" }}>/ 100 INTELLIGENCE INDEX</div>
        <div style={{ marginTop:"20px", display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {[scores.tier, scores.overall>=75?"HIREABLE":null, scores.impact>=70?"OSS ACTIVE":null].filter(Boolean).map(tag=>(
            <span key={tag} style={{ display:"inline-block", background:tag===scores.tier?FG:"transparent", color:tag===scores.tier?BG:FG, border:B, padding:"4px 12px", ...M, fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div style={{ padding:"28px" }}>
        <div style={{ ...M, fontSize:"9px", letterSpacing:"4px", textTransform:"uppercase", color:recruiter?"#555":"#888", marginBottom:"16px" }}>SCORE BREAKDOWN</div>
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          {DIMS.map(({ key, label }) => {
            const val = scores[key] as number;
            return (
              <div key={key}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                  <span style={{ ...M, fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px" }}>{label}</span>
                  <span style={{ ...M, fontSize:"10px" }}>{val}</span>
                </div>
                <div style={{ height:"6px", background:recruiter?"#eee":"#111", border:`1px solid ${recruiter?"#ccc":"#333"}` }}>
                  <div style={{ height:"100%", background:FG, width:anim?`${val}%`:"0%", transition:"width 1.1s cubic-bezier(0.16,1,0.3,1)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
