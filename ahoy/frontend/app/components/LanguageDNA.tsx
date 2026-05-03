"use client";
import { useEffect, useState } from "react";

interface Props { languages: Record<string,number>; recruiter: boolean; }

export function LanguageDNA({ languages, recruiter }: Props) {
  const [anim, setAnim] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setAnim(true),200); return ()=>clearTimeout(t); }, []);

  const FG = recruiter?"#000":"#fff";
  const M  = { fontFamily:"'JetBrains Mono',monospace" } as const;

  const total = Object.values(languages).reduce((a,b)=>a+b, 0) || 1;
  const entries = Object.entries(languages).slice(0,8);

  return (
    <div>
      <div style={{ ...M, fontSize:"9px", letterSpacing:"4px", textTransform:"uppercase", color:recruiter?"#555":"#888", marginBottom:"16px" }}>LANGUAGE DNA</div>
      <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
        {entries.map(([lang, count]) => {
          const pct = Math.round((count/total)*100);
          return (
            <div key={lang}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                <span style={{ ...M, fontSize:"11px", textTransform:"uppercase", letterSpacing:"1px" }}>{lang}</span>
                <span style={{ ...M, fontSize:"11px" }}>{pct}%</span>
              </div>
              <div style={{ height:"7px", background:recruiter?"#eee":"#111", border:`1px solid ${recruiter?"#ccc":"#333"}` }}>
                <div style={{ height:"100%", background:FG, width:anim?`${pct}%`:"0%", transition:"width 1.1s cubic-bezier(0.16,1,0.3,1)" }} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Stacked DNA bar */}
      <div style={{ marginTop:"20px" }}>
        <div style={{ ...M, fontSize:"9px", color:recruiter?"#777":"#555", letterSpacing:"3px", textTransform:"uppercase", marginBottom:"6px" }}>STACK COMPOSITION</div>
        <div style={{ height:"12px", display:"flex", border:`1px solid ${recruiter?"#ccc":"#333"}`, overflow:"hidden" }}>
          {entries.map(([lang, count], i) => {
            const shades = ["#fff","#ccc","#aaa","#888","#666","#555","#444","#333"];
            const rShades= ["#000","#222","#333","#444","#555","#777","#999","#bbb"];
            return (
              <div key={lang} style={{
                width:`${Math.round((count/total)*100)}%`,
                background: recruiter ? rShades[i] : shades[i],
                height:"100%",
                transition:"width 1.2s cubic-bezier(0.16,1,0.3,1)",
              }} title={lang} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
