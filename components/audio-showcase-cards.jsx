"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export const MODE_BADGE = {
  audio:     { bg: "rgba(167, 139, 250, 0.15)", color: "#a78bfa" },
  sfx:       { bg: "rgba(94, 234, 212, 0.15)",  color: "#5eead4" },
  voiceover: { bg: "rgba(253, 186, 116, 0.15)", color: "#fdba74" },
};

export const MUSIC_SHOWCASE = [
  {
    id: 1, title: "Summer Vibes",  tag: "Cinematic",  duration: "0:30",
    img: "/audio-thumbnails/summer-vibes.png",
    prompt: "Upbeat cinematic summer track with warm piano, bright brass, and energetic percussion. 120 BPM, major key, joyful and optimistic mood.",
  },
  {
    id: 2, title: "Deep Focus",    tag: "Ambient",    duration: "1:00",
    img: "/audio-thumbnails/deep-focus.png",
    prompt: "Ambient electronic study music with soft synthesizer pads, gentle arpeggios, and subtle rain textures. 70 BPM, calm and focused atmosphere.",
  },
  {
    id: 3, title: "Urban Flow",    tag: "Hip-Hop",    duration: "0:45",
    img: "/audio-thumbnails/urban-flow.png",
    prompt: "Hip-hop beat with heavy 808 bass, crisp hi-hats, and soulful vocal chops. 90 BPM, dark and confident energy.",
  },
  {
    id: 4, title: "Morning Calm",  tag: "Acoustic",   duration: "0:30",
    img: "/audio-thumbnails/morning-calm.png",
    prompt: "Soft acoustic guitar with gentle fingerpicking, light strings, and morning bird ambience. 65 BPM, peaceful and uplifting.",
  },
  {
    id: 5, title: "Night Drive",   tag: "Electronic", duration: "1:00",
    img: "/audio-thumbnails/night-drive.png",
    prompt: "Dark electronic track with pulsing synths, deep bass, and cinematic textures. 100 BPM, moody and atmospheric.",
  },
  {
    id: 6, title: "Coffee Shop",   tag: "Lo-Fi",      duration: "0:30",
    img: "/audio-thumbnails/coffee-shop.png",
    prompt: "Lo-fi jazz with mellow piano, brushed drums, vinyl crackle, and warm bass. 75 BPM, cozy and relaxed.",
  },
  {
    id: 7, title: "Epic Quest",    tag: "Cinematic",  duration: "0:45",
    img: "/audio-thumbnails/epic-quest.png",
    prompt: "Orchestral adventure music with powerful brass, dramatic strings, and thunderous percussion. 130 BPM, heroic and triumphant.",
  },
  {
    id: 8, title: "Chill Wave",    tag: "Ambient",    duration: "0:30",
    img: "/audio-thumbnails/chill-wave.png",
    prompt: "Smooth ambient electronic with soft reverb pads, gentle bass, and dreamy textures. 85 BPM, relaxed and introspective.",
  },
];

export const SFX_SHOWCASE = [
  {
    id: 1, title: "Thunder Crack",  tag: "Nature",      duration: "0:03",
    img: "/audio-thumbnails/night-drive.png",
    prompt: "Powerful thunderclap with natural rumble, distant echo, and rain fade. Realistic outdoor thunder sound effect.",
  },
  {
    id: 2, title: "Sword Clash",    tag: "Impacts",     duration: "0:02",
    img: "/audio-thumbnails/epic-quest.png",
    prompt: "Sharp metallic clang of two swords colliding with resonant ring and short reverb tail. Medieval combat sound effect.",
  },
  {
    id: 3, title: "City Rain",      tag: "Ambience",    duration: "0:05",
    img: "/audio-thumbnails/urban-flow.png",
    prompt: "Dense urban rain ambience with heavy rainfall, distant traffic, and occasional thunder. Loopable, 5 seconds.",
  },
  {
    id: 4, title: "Footsteps",      tag: "Foley",       duration: "0:03",
    img: "/audio-thumbnails/coffee-shop.png",
    prompt: "Crisp footsteps on wooden floor, steady walking pace, 3 steps, natural room acoustics. Foley sound effect.",
  },
  {
    id: 5, title: "Sci-Fi Whoosh",  tag: "Transitions", duration: "0:02",
    img: "/audio-thumbnails/deep-focus.png",
    prompt: "Fast futuristic whoosh with rising pitch, digital glitch elements, and energy decay. 2 seconds, sci-fi transition.",
  },
  {
    id: 6, title: "Notification",   tag: "UI",          duration: "0:01",
    img: "/audio-thumbnails/morning-calm.png",
    prompt: "Clean digital notification ping with soft attack and quick decay. Modern UI sound, friendly and subtle.",
  },
  {
    id: 7, title: "Forest Birds",   tag: "Nature",      duration: "0:05",
    img: "/audio-thumbnails/chill-wave.png",
    prompt: "Morning forest ambience with birdsong, gentle breeze through leaves, and distant stream. Natural and peaceful.",
  },
  {
    id: 8, title: "Heavy Impact",   tag: "Impacts",     duration: "0:02",
    img: "/audio-thumbnails/summer-vibes.png",
    prompt: "Deep powerful impact hit with sub-bass punch, sharp crack, and long reverb tail. Cinematic action sound.",
  },
];

export const VO_SHOWCASE = [
  {
    id: 1, title: "Product Intro",   tag: "Nova",    duration: "0:15",
    img: "/audio-thumbnails/deep-focus.png",
    prompt: "Introducing Videoo — the AI video editor that transforms your ideas into stunning content. Create, edit, and share like never before.",
  },
  {
    id: 2, title: "Ad Narration",    tag: "Onyx",    duration: "0:20",
    img: "/audio-thumbnails/summer-vibes.png",
    prompt: "When performance matters, choose Videoo. Professional-grade video editing powered by artificial intelligence, available to everyone.",
  },
  {
    id: 3, title: "Tutorial Guide",  tag: "Alloy",   duration: "0:30",
    img: "/audio-thumbnails/morning-calm.png",
    prompt: "Welcome to your first project. Start by dragging your footage into the timeline, then select a clip to begin editing.",
  },
  {
    id: 4, title: "Podcast Intro",   tag: "Fable",   duration: "0:10",
    img: "/audio-thumbnails/urban-flow.png",
    prompt: "You're listening to The Creative Edge — where we explore the intersection of technology and storytelling. I'm your host.",
  },
  {
    id: 5, title: "Explainer Clip",  tag: "Shimmer", duration: "0:25",
    img: "/audio-thumbnails/chill-wave.png",
    prompt: "Here's how it works: describe what you want to create, our AI generates the perfect edit, and you're done in minutes.",
  },
  {
    id: 6, title: "Brand Story",     tag: "Echo",    duration: "0:20",
    img: "/audio-thumbnails/coffee-shop.png",
    prompt: "We started with a simple belief — everyone has a story worth telling. Videoo gives you the tools to tell yours beautifully.",
  },
  {
    id: 7, title: "Event Promo",     tag: "Nova",    duration: "0:15",
    img: "/audio-thumbnails/epic-quest.png",
    prompt: "Join us this Friday for the biggest creative event of the year. Workshops, demos, and surprises await. Register now.",
  },
  {
    id: 8, title: "App Walkthrough", tag: "Alloy",   duration: "0:30",
    img: "/audio-thumbnails/night-drive.png",
    prompt: "Step one: create a new project. Step two: upload your media. Step three: apply AI effects with a single click. Simple.",
  },
];

export const SHOWCASE_DATA = {
  audio:     MUSIC_SHOWCASE,
  sfx:       SFX_SHOWCASE,
  voiceover: VO_SHOWCASE,
};

export function ShowcaseCard({ item, mode, isPlaying, onPlayToggle, onSelect }) {
  const badge = MODE_BADGE[mode];

  return (
    <div
      className={cn("ga-scard", isPlaying && "is-playing")}
      onClick={() => onSelect(item.prompt)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(item.prompt)}
    >
      <div className="ga-scard-art" style={item.img ? undefined : { background: item.bg }}>
        {item.img ? (
          <img src={item.img} alt={item.title} className="ga-scard-img" draggable={false} />
        ) : (
          <>
            <span className="ga-scard-blob ga-scard-blob-1" />
            <span className="ga-scard-blob ga-scard-blob-2" />
          </>
        )}

        <div className="ga-scard-dim" />

        <button
          type="button"
          className="ga-scard-play-btn"
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={(e) => { e.stopPropagation(); onPlayToggle(item.id); }}
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>

        <span className="ga-scard-duration">{item.duration}</span>
      </div>

      <div className="ga-scard-footer">
        <span className="ga-scard-title">{item.title}</span>
        <span className="ga-scard-badge" style={{ background: badge.bg, color: badge.color }}>
          {item.tag}
        </span>
      </div>
    </div>
  );
}

export function ShowcaseListRow({ item, mode, isPlaying, onPlayToggle, onSelect }) {
  const [thumbHovered, setThumbHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const badge = MODE_BADGE[mode];
  const showOverlay = thumbHovered || isPlaying;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "10px 0",
        borderBottom: "0.6px solid var(--border)",
      }}
    >
      {/* Thumbnail + play overlay */}
      <button
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={() => onPlayToggle(item.id)}
        onMouseEnter={() => setThumbHovered(true)}
        onMouseLeave={() => setThumbHovered(false)}
        style={{
          position: "relative",
          flexShrink: 0,
          width: "62px",
          height: "62px",
          borderRadius: "8px",
          overflow: "hidden",
          cursor: "pointer",
          border: 0,
          padding: 0,
          background: "none",
        }}
      >
        <img
          src={item.img}
          alt={item.title}
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <span style={{
          position: "absolute", bottom: "4px", left: "5px",
          fontSize: "0.68rem", fontWeight: 700, color: "#fff",
          background: "rgba(0,0,0,0.62)", padding: "1px 5px", borderRadius: "4px",
          letterSpacing: "0.02em", pointerEvents: "none",
        }}>
          {item.duration}
        </span>
        <span style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.42)",
          opacity: showOverlay ? 1 : 0,
          transition: "opacity 160ms ease",
        }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isPlaying
              ? <Pause style={{ width: 18, height: 18, fill: "#fff", stroke: "none" }} />
              : <Play  style={{ width: 18, height: 18, fill: "#fff", stroke: "none", marginLeft: 2 }} />
            }
          </span>
        </span>
      </button>

      {/* Track info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
          <span style={{ fontSize: "0.98rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.015em" }}>
            {item.title}
          </span>
          <span style={{
            fontSize: "0.7rem", fontWeight: 600, padding: "2px 9px",
            borderRadius: "999px", border: `1px solid ${badge.color}`,
            color: badge.color, letterSpacing: "0.02em", flexShrink: 0,
          }}>
            {item.tag}
          </span>
        </div>
        <p style={{
          margin: 0, fontSize: "0.78rem", color: "var(--text-dim)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "680px",
        }}>
          {item.prompt}
        </p>
      </div>

      {/* Use Prompt button */}
      <button
        type="button"
        onClick={() => onSelect(item.prompt)}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          flexShrink: 0,
          display: "flex", alignItems: "center", gap: "6px",
          height: "34px", padding: "0 14px",
          borderRadius: "8px",
          background: btnHovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)",
          border: `0.6px solid ${btnHovered ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.14)"}`,
          color: "var(--text)", fontSize: "0.83rem", fontWeight: 500,
          cursor: "pointer", transition: "background 140ms ease, border-color 140ms ease",
        }}
      >
        <RotateCcw style={{ width: 13, height: 13 }} />
        Use Prompt
      </button>
    </div>
  );
}
