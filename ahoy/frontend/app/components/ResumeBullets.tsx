"use client";
import { useState } from "react";
import { Zap, Copy, Check } from "lucide-react";

interface Props { bullets: string[]; recruiter: boolean; }

export function ResumeBullets({ bullets, recruiter }: Props) {
  const [shown,   setShown]   = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [copied,  setCopied]  = useState(false);

  const FG = recruiter?"#000":"#fff";
  const BG = recruiter?"#fff":"#000";
  const B  = `1px solid ${FG}`;
  const M  = { fontFamily:"'JetBrains Mono',monospace" } as const;

  const generate = () => {
    setShown([]);
    setRunning(true);
    bullets.forEach((b, i) => {
      setTimeout(() => {
        setShown(p => [...p, b]);
        if (i === bullets.length-1) setRunning(false);
      }, i * 220);
    });
  };

  const copy = async () => {
    await navigator.clipboard.writeText(shown.map((b,i)=>`${i+1}. ${b}`).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
        <div style={{ ...M, fontSize:"9px", letterSpacing:"4px", textTransform:"uppercase", color:recruiter?"#555":"#888" }}>AI RESUME ARCHITECT</div>
        {shown.length > 0 && (
          <button onClick={copy} style={{ background:"transparent", border:`1px solid ${recruiter?"#ccc":"#333"}`, color:FG, padding:"4px 12px", cursor:"pointer", ...M, fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", display:"flex", alignItems:"center", gap:"6px" }}>
            {copied ? <><Check size={10}/>COPIED</> : <><Copy size={10}/>COPY ALL</>}
          </button>
        )}
      </div>

      <div style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom:"16px", flexWrap:"wrap" }}>
        <button onClick={generate} disabled={running} style={{
          background:FG, color:BG, border:B, padding:"12px 28px",
          fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"11px",
          letterSpacing:"3px", textTransform:"uppercase", cursor:running?"default":"pointer",
          display:"flex", alignItems:"center", gap:"8px",
        }}>
          <Zap size={14} />{running?"GENERATING...":"PRODUCE BULLETS"}
        </button>
        <span style={{ ...M, fontSize:"10px", color:recruiter?"#777":"#555" }}>
          ACTION-VERB CARDS FROM GITHUB DATA
        </span>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
        {shown.map((b, i) => (
          <div key={i} className="fade-up" style={{ display:"grid", gridTemplateColumns:"32px 1fr", gap:"12px", border:B, padding:"14px", alignItems:"start" }}>
            <span style={{ ...M, fontSize:"10px", color:recruiter?"#777":"#666" }}>0{i+1}</span>
            <span style={{ ...M, fontSize:"11px", lineHeight:1.8 }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
