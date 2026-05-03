"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Github, ArrowRight, Zap, Terminal } from "lucide-react";

const BOOT = [
  "> initializing ahoy v1.0...",
  "> connecting to github api...",
  "> loading groq / llama-3.3-70b...",
  "> scoring engine: online",
  "> all systems ready.",
];

const STATS = [
  { label: "DEVS ANALYZED",    value: "12,441" },
  { label: "REPOS PROCESSED",  value: "890K+"  },
  { label: "INSIGHTS FIRED",   value: "2.1M"   },
  { label: "ELITE PLACEMENTS", value: "3,200"  },
];

const FEATURES = [
  "AI-powered repository quality scoring",
  "Signal-to-noise: real work vs tutorials",
  "Language DNA + tech stack depth mapping",
  "Resume bullet generation from GitHub data",
  "Recruiter-ready intelligence report",
  "Personalized growth roadmap",
];

const M = {
  mono: { fontFamily: "'JetBrains Mono',monospace" } as const,
  border: "1px solid #fff",
  faint:  "1px solid #333",
  label:  {
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: "9px", letterSpacing: "4px",
    textTransform: "uppercase" as const, color: "#888",
  },
};

export default function Landing() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [lines,    setLines]    = useState<string[]>([]);

  useEffect(() => {
    BOOT.forEach((l, i) => setTimeout(() => setLines(p => [...p, l]), i * 350));
  }, []);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim();
    if (!u) { setError("USERNAME REQUIRED"); return; }
    if (!/^[a-zA-Z0-9\-]+$/.test(u)) { setError("INVALID FORMAT"); return; }
    setLoading(true);
    router.push(`/dashboard?username=${encodeURIComponent(u)}`);
  };

  return (
    <div style={{ background:"#000", color:"#fff", minHeight:"100vh", border:M.border, display:"flex", flexDirection:"column", fontFamily:"'Inter',Helvetica,sans-serif" }}>

      {/* ── HEADER ── */}
      <header style={{ borderBottom:M.border, padding:"16px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ ...M.mono, fontSize:"9px", letterSpacing:"4px", color:"#555", textTransform:"uppercase" }}>AHOY / V1.0</div>
          <div style={{ fontWeight:900, fontSize:"22px", letterSpacing:"-1px", textTransform:"uppercase" }}>GITHUB INTELLIGENCE</div>
        </div>
        <div style={{ display:"flex", gap:"20px", alignItems:"center" }}>
          <a href="https://github.com/AdityaQQ" target="_blank" rel="noreferrer"
            style={{ ...M.mono, fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none", color:"#888" }}>
            GITHUB.COM/ADITYAQQ
          </a>
          <div style={{ ...M.mono, fontSize:"9px", color:"#444", letterSpacing:"2px", textTransform:"uppercase" }}>
            BY ADITYA UPADHYAY
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <main style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1px 1fr" }}>

        {/* LEFT */}
        <div style={{ padding:"60px 48px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
          <div>
            <div style={M.label}>DEVELOPER INTELLIGENCE PLATFORM</div>
            <h1 style={{ fontSize:"clamp(72px,10vw,128px)", fontWeight:900, lineHeight:0.88, letterSpacing:"-5px", textTransform:"uppercase", marginTop:"16px", marginBottom:"40px" }}>
              AH<br />OY
            </h1>
            <p style={{ ...M.mono, fontSize:"12px", lineHeight:1.9, color:"#888", maxWidth:"380px" }}>
              Your GitHub profile decoded into a<br />
              career-grade intelligence report.<br />
              Not a resume builder. An analysis engine.
            </p>
            <div style={{ marginTop:"28px", borderTop:M.faint, paddingTop:"20px" }}>
              {FEATURES.map(f => (
                <div key={f} style={{ ...M.mono, fontSize:"11px", color:"#555", lineHeight:"2.2" }}>→ {f}</div>
              ))}
            </div>
          </div>

          {/* STATS */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", border:M.border, marginTop:"48px" }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{ padding:"18px", borderRight:i%2===0?M.border:"none", borderBottom:i<2?M.border:"none" }}>
                <div style={M.label}>{s.label}</div>
                <div style={{ fontSize:"28px", fontWeight:900, letterSpacing:"-1px", marginTop:"4px" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{ background:"#fff" }} />

        {/* RIGHT */}
        <div style={{ padding:"60px 48px", display:"flex", flexDirection:"column", justifyContent:"center" }}>

          {/* Terminal */}
          <div style={{ border:M.faint, padding:"16px", background:"#050505", marginBottom:"36px" }}>
            <div style={{ ...M.mono, fontSize:"9px", color:"#444", letterSpacing:"3px", textTransform:"uppercase", marginBottom:"10px", display:"flex", alignItems:"center", gap:"6px" }}>
              <Terminal size={10} /> SYSTEM BOOT
            </div>
            {lines.map((l, i) => (
              <div key={i} style={{ ...M.mono, fontSize:"11px", color:"#4a4", lineHeight:"1.9" }}>{l}</div>
            ))}
            {lines.length < BOOT.length && (
              <span style={{ ...M.mono, fontSize:"11px", color:"#4a4" }}><span className="blink">█</span></span>
            )}
          </div>

          {/* Form */}
          <div style={M.label}>ENTER GITHUB USERNAME</div>
          <form onSubmit={go} style={{ marginTop:"10px" }}>
            <div style={{ border:M.border, display:"flex" }}>
              <span style={{ ...M.mono, fontSize:"12px", color:"#555", padding:"16px", borderRight:M.faint, display:"flex", alignItems:"center" }}>
                github.com/
              </span>
              <input
                value={username}
                onChange={e => { setUsername(e.target.value); setError(""); }}
                placeholder="AdityaQQ"
                disabled={loading}
                style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#fff",
                  fontFamily:"'JetBrains Mono',monospace", fontSize:"14px", fontWeight:700, padding:"16px" }}
              />
            </div>
            {error && <div style={{ ...M.mono, fontSize:"10px", color:"#f55", marginTop:"6px", letterSpacing:"2px" }}>✗ {error}</div>}
            <button type="submit" disabled={loading} style={{
              width:"100%", marginTop:"10px", padding:"18px",
              background:loading?"#fff":"#000", color:loading?"#000":"#fff",
              border:M.border, fontFamily:"'Inter',sans-serif", fontWeight:700,
              fontSize:"12px", letterSpacing:"4px", textTransform:"uppercase",
              cursor:loading?"default":"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:"12px",
              transition:"background 0.15s,color 0.15s",
            }}>
              {loading
                ? <><Zap size={16} /> ANALYZING...</>
                : <><Github size={16} /> ANALYZE GITHUB PROFILE <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div style={{ ...M.mono, fontSize:"10px", color:"#333", marginTop:"14px", lineHeight:1.8, textAlign:"center" }}>
            No OAuth required. Public profiles only.<br />Results cached 30 minutes.
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:M.border, padding:"12px 28px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px" }}>
        <span style={{ ...M.mono, fontSize:"10px", color:"#444", textTransform:"uppercase", letterSpacing:"2px" }}>
          © 2025 AHOY
        </span>
        <span style={{ ...M.mono, fontSize:"10px", color:"#555", textTransform:"uppercase", letterSpacing:"2px" }}>
          BUILT BY ADITYA UPADHYAY
        </span>
        <a href="https://github.com/AdityaQQ" target="_blank" rel="noreferrer"
          style={{ ...M.mono, fontSize:"10px", color:"#555", textTransform:"uppercase", letterSpacing:"2px", textDecoration:"none" }}>
          GITHUB.COM/ADITYAQQ
        </a>
        <span style={{ ...M.mono, fontSize:"10px", color:"#333", textTransform:"uppercase", letterSpacing:"2px" }}>
          POWERED BY GROQ AI
        </span>
      </footer>
    </div>
  );
}
