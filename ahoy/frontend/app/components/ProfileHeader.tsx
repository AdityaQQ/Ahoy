"use client";
import Image from "next/image";
import { MapPin, Building, Link as LinkIcon, Users } from "lucide-react";
import type { GitHubProfile, ScoreBreakdown } from "@/lib/api";

interface Props { profile: GitHubProfile; scores: ScoreBreakdown; recruiter: boolean; }

export function ProfileHeader({ profile, scores, recruiter }: Props) {
  const FG = recruiter ? "#000" : "#fff";
  const BG = recruiter ? "#fff" : "#000";
  const B  = `1px solid ${FG}`;
  const M  = { fontFamily:"'JetBrains Mono',monospace" } as const;

  const kpis = [
    { label:"REPOS",      value: profile.public_repos  },
    { label:"STARS",      value: profile.total_stars   },
    { label:"FOLLOWERS",  value: profile.followers     },
    { label:"FOLLOWING",  value: profile.following     },
    { label:"COMMITS~",   value: profile.commit_count_estimate },
    { label:"SCORE",      value: `${scores.overall}/100` },
  ];

  return (
    <div style={{ borderBottom:B, display:"grid", gridTemplateColumns:"auto 1fr", background:BG }}>
      {/* Avatar + bio */}
      <div style={{ borderRight:B, padding:"20px 24px", display:"flex", gap:"16px", alignItems:"flex-start" }}>
        {profile.avatar_url && (
          <Image src={profile.avatar_url} alt={profile.username} width={64} height={64}
            style={{ border:B, filter:recruiter?"none":"grayscale(100%)", flexShrink:0 }} />
        )}
        <div>
          <div style={{ fontWeight:900, fontSize:"16px", letterSpacing:"-0.5px", textTransform:"uppercase" }}>
            {profile.name || profile.username}
          </div>
          <div style={{ ...M, fontSize:"10px", color:recruiter?"#555":"#888", marginTop:"2px" }}>@{profile.username}</div>
          {profile.bio && (
            <div style={{ ...M, fontSize:"10px", color:recruiter?"#444":"#aaa", marginTop:"6px", maxWidth:"260px", lineHeight:1.6 }}>
              {profile.bio.slice(0,100)}{profile.bio.length>100?"...":""}
            </div>
          )}
          <div style={{ display:"flex", gap:"12px", marginTop:"8px", flexWrap:"wrap" }}>
            {profile.location && (
              <span style={{ ...M, fontSize:"9px", color:recruiter?"#666":"#666", display:"flex", alignItems:"center", gap:"3px" }}>
                <MapPin size={9} />{profile.location}
              </span>
            )}
            {profile.company && (
              <span style={{ ...M, fontSize:"9px", color:recruiter?"#666":"#666", display:"flex", alignItems:"center", gap:"3px" }}>
                <Building size={9} />{profile.company}
              </span>
            )}
            {profile.blog && (
              <a href={profile.blog.startsWith("http")?profile.blog:`https://${profile.blog}`}
                target="_blank" rel="noreferrer"
                style={{ ...M, fontSize:"9px", color:recruiter?"#555":"#888", display:"flex", alignItems:"center", gap:"3px", textDecoration:"none" }}>
                <LinkIcon size={9} />WEBSITE
              </a>
            )}
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)" }}>
        {kpis.map((k, i) => (
          <div key={k.label} style={{ padding:"16px 12px", borderRight:i<5?B:"none", textAlign:"center" }}>
            <div style={{ ...M, fontSize:"8px", letterSpacing:"3px", textTransform:"uppercase", color:recruiter?"#777":"#666", marginBottom:"4px" }}>
              {k.label}
            </div>
            <div style={{ fontSize:"22px", fontWeight:900, letterSpacing:"-1px" }}>{k.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
