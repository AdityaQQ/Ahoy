"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { ProfileResponse } from "@/lib/api";

interface Props { data: ProfileResponse; recruiter: boolean; }

export function AICoachBar({ data, recruiter }: Props) {
  const [input,    setInput]    = useState("");
  const [output,   setOutput]   = useState("");
  const [streaming,setStreaming]= useState(false);
  const [open,     setOpen]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const FG = recruiter?"#000":"#fff";
  const BG = recruiter?"#fff":"#000";
  const B  = `1px solid ${FG}`;
  const M  = { fontFamily:"'JetBrains Mono',monospace" } as const;

  const fire = async (query?: string) => {
    const q = (query ?? input).trim() || "how_to_get_into_stripe";
    setInput("");
    setOutput("");
    setStreaming(true);
    setOpen(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          username:     data.profile.username,
          tier:         data.scores.tier,
          score:        data.scores.overall,
          archetype:    data.analysis.archetype,
          top_language: Object.keys(data.profile.top_languages)[0] ?? "Unknown",
          strengths:    data.analysis.strengths,
          weaknesses:   data.analysis.weaknesses,
        }),
      });

      if (!res.ok) { setOutput("Coach unavailable. Check GROQ_API_KEY in .env.local"); setStreaming(false); return; }

      const reader = res.body?.getReader();
      const dec    = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const d = line.slice(6);
          if (d === "[DONE]") break;
          setOutput(p => p + d);
        }
      }
    } catch {
      setOutput("Connection error. Make sure the backend is running.");
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div style={{ borderTop:B, background:BG }}>
      {/* Output panel */}
      {open && (
        <div style={{ padding:"12px 24px", borderBottom:`1px solid ${recruiter?"#ccc":"#222"}`, maxHeight:"200px", overflowY:"auto" }}>
          <div style={{ ...M, fontSize:"9px", color:recruiter?"#777":"#555", letterSpacing:"3px", textTransform:"uppercase", marginBottom:"6px" }}>
            COACH OUTPUT
          </div>
          <div style={{ ...M, fontSize:"11px", lineHeight:1.9, whiteSpace:"pre-line", background:recruiter?"#f5f5f5":"#080808", padding:"12px", border:`1px solid ${recruiter?"#ddd":"#222"}` }}>
            {output || <span style={{ color:recruiter?"#aaa":"#444" }}>Ask anything about your career...</span>}
            {streaming && <span className="blink">█</span>}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"12px 24px" }}>
        <span style={{ ...M, fontSize:"11px", color:recruiter?"#777":"#555", whiteSpace:"nowrap" }}>
          [{data.username.toUpperCase()}@AHOY: ~]$&nbsp;
        </span>
        <span style={{ ...M, fontSize:"11px", color:recruiter?"#999":"#555" }}>ask_coach "​</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && fire()}
          placeholder="how_to_get_into_stripe"
          style={{ flex:1, background:"transparent", border:"none", outline:"none", color:FG, ...M, fontSize:"11px" }}
        />
        <span style={{ ...M, fontSize:"11px", color:recruiter?"#999":"#555" }}>"</span>
        <button onClick={() => fire()} disabled={streaming} style={{ background:"transparent", color:FG, border:B, padding:"5px 14px", cursor:"pointer", ...M, fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase" }}>
          {streaming?"...":"RUN"}
        </button>
        <button onClick={() => setOpen(o=>!o)} style={{ background:"transparent", border:"none", color:FG, cursor:"pointer", padding:"4px" }}>
          {open ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
        </button>
      </div>
    </div>
  );
}
