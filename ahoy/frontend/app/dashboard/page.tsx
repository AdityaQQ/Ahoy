"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ahoyApi, ProfileResponse } from "@/lib/api";
import { ScorePanel }      from "@/app/components/ScorePanel";
import { LanguageDNA }     from "@/app/components/LanguageDNA";
import { AIAnalysisPanel } from "@/app/components/AIAnalysisPanel";
import { ResumeBullets }   from "@/app/components/ResumeBullets";
import { RepoGrid }        from "@/app/components/RepoGrid";
import { GrowthRoadmap }   from "@/app/components/GrowthRoadmap";
import { RecruiterView }   from "@/app/components/RecruiterView";
import { AICoachBar }      from "@/app/components/AICoachBar";
import { ProfileHeader }   from "@/app/components/ProfileHeader";
import { ArrowLeft, RefreshCw } from "lucide-react";

const TABS = ["OVERVIEW","AI BRAIN","REPOS","ROADMAP"] as const;
type Tab = typeof TABS[number];

function DashboardInner() {
  const params   = useSearchParams();
  const router   = useRouter();
  const username = params.get("username") ?? "";

  const [data,        setData]        = useState<ProfileResponse | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [tab,         setTab]         = useState<Tab>("OVERVIEW");
  const [recruiterOn, setRecruiterOn] = useState(false);
  const [refreshing,  setRefreshing]  = useState(false);

  const BG = recruiterOn ? "#fff" : "#000";
  const FG = recruiterOn ? "#000" : "#fff";
  const B  = `1px solid ${FG}`;

  const load = async (force = false) => {
    if (!username) { router.push("/"); return; }
    try {
      const d = await ahoyApi.analyze(username, force);
      setData(d);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, [username]);

  const refresh = () => { setRefreshing(true); load(true); };

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ background:"#000", color:"#fff", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"24px", border:"1px solid #fff", fontFamily:"'Inter',sans-serif" }}>
      <div style={{ fontSize:"clamp(48px,10vw,96px)", fontWeight:900, letterSpacing:"-3px", textTransform:"uppercase" }}>AHOY</div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:"#888", letterSpacing:"3px", textTransform:"uppercase" }}>
        ANALYZING {username.toUpperCase()}
        <span className="blink"> █</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"6px", width:"280px" }}>
        {["FETCHING GITHUB DATA","COMPUTING SCORES","RUNNING AI ANALYSIS"].map((s,i) => (
          <div key={s} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ width:"6px", height:"6px", background:"#fff", animation:`blink ${1+i*0.3}s step-end infinite` }} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", color:"#666", letterSpacing:"2px" }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── ERROR ─────────────────────────────────────────────────────────────────
  if (error) return (
    <div style={{ background:"#000", color:"#fff", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"20px", border:"1px solid #fff", fontFamily:"'Inter',sans-serif" }}>
      <div style={{ fontSize:"48px", fontWeight:900, textTransform:"uppercase" }}>ERROR</div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"12px", color:"#888", maxWidth:"400px", textAlign:"center" }}>{error}</div>
      <button onClick={() => router.push("/")} style={{ background:"#fff", color:"#000", border:"1px solid #fff", padding:"12px 28px", fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", cursor:"pointer" }}>
        ← BACK
      </button>
    </div>
  );

  if (!data) return null;

  return (
    <div style={{ background:BG, color:FG, minHeight:"100vh", display:"flex", flexDirection:"column", border:B, fontFamily:"'Inter',Helvetica,sans-serif", transition:"background 0.2s,color 0.2s" }}>

      {/* ── HEADER ── */}
      <header style={{ borderBottom:B, padding:"14px 24px", display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
          <button onClick={() => router.push("/")} style={{ background:"transparent", border:"none", color:FG, cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", padding:0 }}>
            <ArrowLeft size={12} /> AHOY
          </button>
          <div style={{ width:"1px", height:"16px", background:FG, opacity:0.3 }} />
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", color:recruiterOn?"#555":"#888", letterSpacing:"2px", textTransform:"uppercase" }}>
            {data.profile.username.toUpperCase()} / {data.scores.tier}
          </div>
        </div>
        <div style={{ textAlign:"center", fontWeight:900, fontSize:"20px", letterSpacing:"-1px", textTransform:"uppercase" }}>
          AHOY
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"16px", justifyContent:"flex-end" }}>
          {/* Recruiter toggle */}
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:recruiterOn?"#555":"#888" }}>RECRUITER</span>
            <button onClick={() => setRecruiterOn(r=>!r)} style={{ width:"40px", height:"20px", background:recruiterOn?FG:"#222", border:B, cursor:"pointer", position:"relative", padding:0, flexShrink:0 }}>
              <div style={{ width:"16px", height:"16px", background:recruiterOn?BG:FG, position:"absolute", top:"1px", left:recruiterOn?"21px":"2px", transition:"left 0.15s" }} />
            </button>
          </div>
          <button onClick={refresh} disabled={refreshing} style={{ background:"transparent", border:"none", color:FG, cursor:"pointer", padding:0, opacity:refreshing?0.4:1 }}>
            <RefreshCw size={14} />
          </button>
        </div>
      </header>

      {/* ── TABS ── */}
      <div style={{ borderBottom:B, display:"flex" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:"11px 20px", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase",
            fontWeight:700, fontFamily:"'Inter',sans-serif", cursor:"pointer",
            background:tab===t?FG:BG, color:tab===t?BG:FG,
            border:"none", borderRight:B,
          }}>{t}</button>
        ))}
        <div style={{ flex:1 }} />
        {data.cached && (
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:recruiterOn?"#777":"#555", letterSpacing:"2px", textTransform:"uppercase", padding:"0 16px", display:"flex", alignItems:"center" }}>
            CACHED
          </div>
        )}
      </div>

      {/* ── PROFILE HEADER STRIP ── */}
      <ProfileHeader profile={data.profile} scores={data.scores} recruiter={recruiterOn} />

      {/* ── CONTENT ── */}
      <main style={{ flex:1 }}>

        {/* OVERVIEW */}
        {tab === "OVERVIEW" && (
          <>
            <ScorePanel scores={data.scores} recruiter={recruiterOn} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderBottom:B }}>
              <div style={{ borderRight:B, padding:"24px" }}>
                <LanguageDNA languages={data.profile.top_languages} recruiter={recruiterOn} />
              </div>
              <div style={{ padding:"24px" }}>
                <AIAnalysisPanel analysis={data.analysis} recruiter={recruiterOn} signalOnly />
              </div>
            </div>
            {recruiterOn && (
              <div style={{ padding:"24px", borderBottom:B }}>
                <RecruiterView scores={data.scores} analysis={data.analysis} recruiter={recruiterOn} />
              </div>
            )}
          </>
        )}

        {/* AI BRAIN */}
        {tab === "AI BRAIN" && (
          <div style={{ padding:"24px", display:"flex", flexDirection:"column", gap:"24px" }}>
            <AIAnalysisPanel analysis={data.analysis} recruiter={recruiterOn} />
            <ResumeBullets bullets={data.analysis.resume_bullets} recruiter={recruiterOn} />
          </div>
        )}

        {/* REPOS */}
        {tab === "REPOS" && (
          <div style={{ padding:"24px" }}>
            <RepoGrid repos={data.profile.repos} insights={data.analysis.repo_insights} recruiter={recruiterOn} />
          </div>
        )}

        {/* ROADMAP */}
        {tab === "ROADMAP" && (
          <div style={{ padding:"24px", display:"flex", flexDirection:"column", gap:"24px" }}>
            <GrowthRoadmap suggestions={data.analysis.growth_suggestions} recruiter={recruiterOn} />
            <ResumeBullets bullets={data.analysis.resume_bullets} recruiter={recruiterOn} />
          </div>
        )}
      </main>

      {/* ── AI COACH ── */}
      <AICoachBar data={data} recruiter={recruiterOn} />

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:B, padding:"10px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"6px", background:BG }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:recruiterOn?"#555":"#444", textTransform:"uppercase", letterSpacing:"2px" }}>
          © 2025 AHOY
        </span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:recruiterOn?"#666":"#555", textTransform:"uppercase", letterSpacing:"2px" }}>
          BUILT BY ADITYA UPADHYAY
        </span>
        <a href="https://github.com/AdityaQQ" target="_blank" rel="noreferrer"
          style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:recruiterOn?"#666":"#555", textTransform:"uppercase", letterSpacing:"2px", textDecoration:"none" }}>
          GITHUB.COM/ADITYAQQ
        </a>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:recruiterOn?"#888":"#333", textTransform:"uppercase", letterSpacing:"2px" }}>
          POWERED BY GROQ AI
        </span>
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  return <Suspense><DashboardInner /></Suspense>;
}
