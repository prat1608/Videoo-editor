"use client";

import { useRef, useState } from "react";
import {
  Play, Pause, RotateCcw,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const MODE_BADGE = {
  audio:     { bg: "rgba(167, 139, 250, 0.15)", color: "#a78bfa" },
  sfx:       { bg: "rgba(94, 234, 212, 0.15)",  color: "#5eead4" },
  voiceover: { bg: "rgba(253, 186, 116, 0.15)", color: "#fdba74" },
};

export const MUSIC_SHOWCASE = [
  {
    id: 1, title: "Summer Vibes",  tag: "Cinematic",  duration: "0:30", model: "Suno v4",    bpm: 120, created: "May 10, 2026",
    img: "/audio-thumbnails/summer-vibes.png",
    prompt: "Upbeat cinematic summer track, warm Steinway grand piano melody, bright French horn brass stabs, energetic live snare rolls, shimmering hi-hat groove. 120 BPM, C major, rich orchestral string swell on chorus, joyful and optimistic mood, mastered at -14 LUFS, no vocals, 30 seconds.",
  },
  {
    id: 2, title: "Deep Focus",    tag: "Ambient",    duration: "1:00", model: "Udio 2.0",   bpm: 70,  created: "May 7, 2026",
    img: "/audio-thumbnails/deep-focus.png",
    prompt: "Ambient electronic study music, lush Moog synthesizer pads with long attack and slow release, gentle rising arpeggios in Dorian mode, subtle rain texture foley, no percussion, wide stereo reverb, 70 BPM, calm and cognitively focused atmosphere, binaural-ready mix, 60 seconds loopable.",
  },
  {
    id: 3, title: "Urban Flow",    tag: "Hip-Hop",    duration: "0:45", model: "Suno v4",    bpm: 90,  created: "May 14, 2026",
    img: "/audio-thumbnails/urban-flow.png",
    prompt: "Trap-influenced hip-hop instrumental, heavy 808 sub-bass with pitch slides, crisp 32nd-note hi-hat rolls, punchy snare on 2 and 4, chopped R&B vocal sample loop, dark minor pentatonic Rhodes melody, vinyl crackle texture, 90 BPM, G minor, dark and confident energy, 45 seconds.",
  },
  {
    id: 4, title: "Morning Calm",  tag: "Acoustic",   duration: "0:30", model: "MusicGen 2", bpm: 65,  created: "Apr 30, 2026",
    img: "/audio-thumbnails/morning-calm.png",
    prompt: "Intimate solo acoustic fingerpicking guitar, Martin D-28 tone with room ambience, light pizzicato string quartet enters at bar 8, subtle morning birdsong field recording in background, 65 BPM, D major, fingerstyle technique, warm and peaceful mood, dynamic range preserved, 30 seconds.",
  },
  {
    id: 5, title: "Night Drive",   tag: "Electronic", duration: "1:00", model: "Udio 2.0",   bpm: 100, created: "May 3, 2026",
    img: "/audio-thumbnails/night-drive.png",
    prompt: "Dark synthwave electronic track, pulsing Prophet-5 synthesizer bassline, arpeggiating lead synth with analog delay, noir cinematic textures, four-on-the-floor kick with sidechain compression, gated reverb snare, 100 BPM, F# minor, moody and atmospheric, Blade Runner aesthetic, 60 seconds.",
  },
  {
    id: 6, title: "Coffee Shop",   tag: "Lo-Fi",      duration: "0:30", model: "MusicGen 2", bpm: 75,  created: "May 19, 2026",
    img: "/audio-thumbnails/coffee-shop.png",
    prompt: "Lo-fi jazz beat, mellow Rhodes electric piano with slight key wobble, brushed jazz drums on vinyl playback, deep upright bass walking line, vinyl surface noise and crackling throughout, soft tape saturation, 75 BPM, Eb major seventh chords, cozy café atmosphere, loopable, 30 seconds.",
  },
  {
    id: 7, title: "Epic Quest",    tag: "Cinematic",  duration: "0:45", model: "Suno v4",    bpm: 130, created: "May 16, 2026",
    img: "/audio-thumbnails/epic-quest.png",
    prompt: "Full orchestral adventure cue, Berlin Brass ensemble fanfare, swelling 60-piece string section, taiko drumline and orchestral timpani, choir of 80 voices on chorus hit, concert hall acoustics, 130 BPM, D minor with Mixolydian lifts, heroic and triumphant, Hans Zimmer production style, trailer-ready mastering, 45 seconds.",
  },
  {
    id: 8, title: "Chill Wave",    tag: "Ambient",    duration: "0:30", model: "Udio 2.0",   bpm: 85,  created: "May 21, 2026",
    img: "/audio-thumbnails/chill-wave.png",
    prompt: "Smooth chillwave electronic, washed-out Juno-106 chord pads with shimmer reverb, dreamy Telecaster guitar licks through chorus pedal, slow 4/4 groove with ghost-note rimshot, sub-bass hum, 85 BPM, A-flat major, laid-back and introspective mood, cassette tape lo-fi warmth, seamless loop, 30 seconds.",
  },
];

export const SFX_SHOWCASE = [
  {
    id: 1, title: "Thunder Crack",  tag: "Nature",      duration: "0:03", model: "ElevenLabs SFX", created: "May 12, 2026",
    img: "/audio-thumbnails/night-drive.png",
    prompt: "Powerful close-range thunderclap, initial sharp crack transient followed by 2-second low-frequency rumble decay, natural outdoor reverb, light rain fade at tail, stereo field width 90%, realistic field-recording texture, peak at -6 dBFS, 3 seconds.",
  },
  {
    id: 2, title: "Sword Clash",    tag: "Impacts",     duration: "0:02", model: "Audiocraft",     created: "May 5, 2026",
    img: "/audio-thumbnails/epic-quest.png",
    prompt: "Sharp metallic clang of two high-carbon steel swords colliding, bright 4–6 kHz ring on impact, short plate reverb tail 400ms, sub-bass body hit underlayer, slightly left-panned clash with right-side scrape, 2 seconds, medieval combat foley.",
  },
  {
    id: 3, title: "City Rain",      tag: "Ambience",    duration: "0:05", model: "Stability Audio", created: "Apr 28, 2026",
    img: "/audio-thumbnails/urban-flow.png",
    prompt: "Dense urban rain ambience, heavy rainfall on concrete and metal surfaces, distant car splashes and engine rumble, occasional mid-distance thunder roll, wide stereo, loopable 5-second segment with seamless crossfade points, -18 LUFS RMS.",
  },
  {
    id: 4, title: "Footsteps",      tag: "Foley",       duration: "0:03", model: "ElevenLabs SFX", created: "May 18, 2026",
    img: "/audio-thumbnails/coffee-shop.png",
    prompt: "Crisp leather-soled dress shoe footsteps on hardwood floor, 3 evenly-spaced steps at walking pace (~90 BPM), natural small-room acoustic with subtle reverb, slight creak on second step, no background noise, mono foley recording, 3 seconds.",
  },
  {
    id: 5, title: "Sci-Fi Whoosh",  tag: "Transitions", duration: "0:02", model: "Audiocraft",     created: "May 9, 2026",
    img: "/audio-thumbnails/deep-focus.png",
    prompt: "Fast futuristic transition whoosh, pitch rises 3 octaves over 200ms, digital data-stream glitch texture layered mid-sweep, sharp energy decay at end with slight stereo spread, subtle sub-thud on tail, 2 seconds, sci-fi UI transition sfx.",
  },
  {
    id: 6, title: "Notification",   tag: "UI",          duration: "0:01", model: "ElevenLabs SFX", created: "May 22, 2026",
    img: "/audio-thumbnails/morning-calm.png",
    prompt: "Clean digital notification ping, two ascending sine-wave tones at 880Hz and 1320Hz, soft 5ms attack, 300ms natural decay, slight harmonic warmth, no reverb, mono, normalized to -12 dBFS, friendly and unobtrusive mobile UI sound, 1 second.",
  },
  {
    id: 7, title: "Forest Birds",   tag: "Nature",      duration: "0:05", model: "Stability Audio", created: "May 1, 2026",
    img: "/audio-thumbnails/chill-wave.png",
    prompt: "Dawn forest ambience, 3–4 distinct birdsong species layered at varying distances, gentle breeze through deciduous leaves, faint babbling brook 20m away, wide natural stereo, binaural-ready, seamless loop, 5 seconds, -22 LUFS, spring morning.",
  },
  {
    id: 8, title: "Heavy Impact",   tag: "Impacts",     duration: "0:02", model: "Audiocraft",     created: "May 15, 2026",
    img: "/audio-thumbnails/summer-vibes.png",
    prompt: "Cinematic heavy impact, sub-bass punch below 80Hz, sharp high-transient crack at 3–5 kHz, wide hall reverb tail 800ms, slight LFO wobble on sub after impact, designed for fight scenes and trailer hits, stereo, 2 seconds, peak -3 dBFS.",
  },
];

export const VO_SHOWCASE = [
  {
    id: 1, title: "Product Intro",   tag: "Nova",    duration: "0:15", model: "ElevenLabs", voice: "Nova",    speed: "1x",    created: "May 11, 2026",
    img: "/audio-thumbnails/deep-focus.png",
    prompt: "Introducing Videoo — the AI video editor that transforms your ideas into stunning content. Create, edit, and share like never before. Voice: Nova, warm female tone, steady measured pace, slight upward inflection on brand name, subtle studio reverb, 15 seconds.",
  },
  {
    id: 2, title: "Ad Narration",    tag: "Onyx",    duration: "0:20", model: "OpenAI TTS", voice: "Onyx",    speed: "0.95x", created: "May 6, 2026",
    img: "/audio-thumbnails/summer-vibes.png",
    prompt: "When performance matters, choose Videoo. Professional-grade video editing powered by artificial intelligence, available to everyone. Voice: Onyx, deep authoritative male baritone, deliberate pacing with emphasis on 'performance' and 'professional', broadcast-quality EQ, 20 seconds.",
  },
  {
    id: 3, title: "Tutorial Guide",  tag: "Alloy",   duration: "0:30", model: "ElevenLabs", voice: "Alloy",   speed: "1x",    created: "Apr 25, 2026",
    img: "/audio-thumbnails/morning-calm.png",
    prompt: "Welcome to your first project. Start by dragging your footage into the timeline, then select a clip to begin editing. Voice: Alloy, clear and friendly neutral tone, instructional pacing with natural pauses between steps, e-learning style delivery, 30 seconds.",
  },
  {
    id: 4, title: "Podcast Intro",   tag: "Fable",   duration: "0:10", model: "Cartesia",   voice: "Fable",   speed: "1.1x",  created: "May 18, 2026",
    img: "/audio-thumbnails/urban-flow.png",
    prompt: "You're listening to The Creative Edge — where we explore the intersection of technology and storytelling. I'm your host. Voice: Fable, warm conversational male tone, confident opening cadence, podcast-style presence mic recording, slight compression, 10 seconds.",
  },
  {
    id: 5, title: "Explainer Clip",  tag: "Shimmer", duration: "0:25", model: "OpenAI TTS", voice: "Shimmer", speed: "1x",    created: "May 13, 2026",
    img: "/audio-thumbnails/chill-wave.png",
    prompt: "Here's how it works: describe what you want to create, our AI generates the perfect edit, and you're done in minutes. Voice: Shimmer, bright enthusiastic female tone, upbeat explainer energy, rising intonation on key features, clean studio recording, 25 seconds.",
  },
  {
    id: 6, title: "Brand Story",     tag: "Echo",    duration: "0:20", model: "ElevenLabs", voice: "Echo",    speed: "0.9x",  created: "May 8, 2026",
    img: "/audio-thumbnails/coffee-shop.png",
    prompt: "We started with a simple belief — everyone has a story worth telling. Videoo gives you the tools to tell yours beautifully. Voice: Echo, thoughtful reflective male tone, slower emotive pacing, slight pause before 'beautifully', brand film narration quality, 20 seconds.",
  },
  {
    id: 7, title: "Event Promo",     tag: "Nova",    duration: "0:15", model: "ElevenLabs", voice: "Nova",    speed: "1.1x",  created: "May 20, 2026",
    img: "/audio-thumbnails/epic-quest.png",
    prompt: "Join us this Friday for the biggest creative event of the year. Workshops, demos, and surprises await. Register now. Voice: Nova, energetic and urgent female tone, event-hype delivery, punchy ending call to action, radio commercial style, 15 seconds.",
  },
  {
    id: 8, title: "App Walkthrough", tag: "Alloy",   duration: "0:30", model: "Cartesia",   voice: "Alloy",   speed: "1x",    created: "May 2, 2026",
    img: "/audio-thumbnails/night-drive.png",
    prompt: "Step one: create a new project. Step two: upload your media. Step three: apply AI effects with a single click. Simple. Voice: Alloy, calm and methodical neutral tone, equal beats between numbered steps, clean diction, minimal reverb, software demo narration, 30 seconds.",
  },
];

export const SHOWCASE_DATA = {
  audio:     MUSIC_SHOWCASE,
  sfx:       SFX_SHOWCASE,
  voiceover: VO_SHOWCASE,
};

export function ShowcaseCard({ item, isPlaying, onPlayToggle, onSelect, onCardClick }) {
  return (
    <div
      className={cn("ga-scard", isPlaying && "is-playing")}
      onClick={() => onCardClick ? onCardClick(item) : onSelect(item.prompt)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (onCardClick ? onCardClick(item) : onSelect(item.prompt))}
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

        {isPlaying && (
          <div className="ga-scard-vinyl">
            <div className="ga-scard-vinyl-disc">
              <div className="ga-scard-vinyl-label">
                {item.img
                  ? <img src={item.img} alt={item.title} />
                  : <span className="ga-scard-vinyl-label-fallback" style={{ background: item.bg }} />
                }
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          className="ga-scard-play-btn"
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={(e) => { e.stopPropagation(); onPlayToggle(item.id); }}
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>

      </div>

      <div className="ga-scard-footer">
        <span className="ga-scard-title">{item.title}</span>
        <span className="ga-scard-footer-duration">{item.duration}</span>
      </div>
    </div>
  );
}

export function ShowcaseListRow({ item, mode, isPlaying, onPlayToggle, onSelect, onCardClick }) {
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

      {/* Track info — clicking opens the popover */}
      <div
        style={{ flex: 1, minWidth: 0, cursor: onCardClick ? "pointer" : "default" }}
        onClick={() => onCardClick && onCardClick(item)}
      >
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
        onClick={() => onCardClick ? onCardClick(item) : onSelect(item.prompt)}
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

/* ─────────────────────────────────────────────────────────────
   Marketplace view — used by SFX & Voiceover modes
   ─────────────────────────────────────────────────────────────*/

const SFX_CATEGORIES = [
  { label: "Nature",      img: "/audio-thumbnails/morning-calm.png" },
  { label: "Impacts",     img: "/audio-thumbnails/epic-quest.png"   },
  { label: "Ambience",    img: "/audio-thumbnails/night-drive.png"  },
  { label: "Foley",       img: "/audio-thumbnails/coffee-shop.png"  },
  { label: "Transitions", img: "/audio-thumbnails/deep-focus.png"   },
  { label: "UI Sounds",   img: "/audio-thumbnails/chill-wave.png"   },
  { label: "Cinematic",   img: "/audio-thumbnails/summer-vibes.png" },
  { label: "Experimental",img: "/audio-thumbnails/urban-flow.png"   },
];

const VO_CATEGORIES = [
  { label: "Commercial",  img: "/audio-thumbnails/night-drive.png"  },
  { label: "Tutorial",    img: "/audio-thumbnails/deep-focus.png"   },
  { label: "Podcast",     img: "/audio-thumbnails/urban-flow.png"   },
  { label: "Narration",   img: "/audio-thumbnails/epic-quest.png"   },
  { label: "Explainer",   img: "/audio-thumbnails/summer-vibes.png" },
  { label: "Brand Film",  img: "/audio-thumbnails/chill-wave.png"   },
  { label: "Events",      img: "/audio-thumbnails/morning-calm.png" },
  { label: "Walkthrough", img: "/audio-thumbnails/coffee-shop.png"  },
];


const WAVE_HEIGHTS = [4,6,10,8,5,9,13,10,7,5,8,11,9,5,7,12,9,6,4,8,14,11,7,5,9,12,8,5,6,10,7,4,6,9,12,10,6,5,8,4,6,10,13,9,6,4];

function WaveformViz() {
  return (
    <div className="ga-waveform">
      {WAVE_HEIGHTS.map((h, i) => (
        <span key={i} className="ga-waveform-bar" style={{ height: `${h}px` }} />
      ))}
    </div>
  );
}

function formatDur(dur) {
  const [m, s] = dur.split(":").map(Number);
  return m === 0 ? `${s}s` : `${m}m ${s}s`;
}

function MarketplaceRow({ item, mode, isPlaying, onPlayToggle, onSelect }) {
  const [thumbHov, setThumbHov] = useState(false);
  const showOverlay = thumbHov || isPlaying;
  const metricVal = mode === "voiceover" ? item.speed : (item.bpm ? String(item.bpm) : "—");
  const metaLine  = mode === "voiceover" ? `${item.model} | ${item.voice}` : `${item.model} | ${item.tag}`;

  return (
    <div className={cn("ga-market-row", isPlaying && "is-playing")}>
      <button
        type="button"
        className="ga-market-thumb"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={() => onPlayToggle(item.id)}
        onMouseEnter={() => setThumbHov(true)}
        onMouseLeave={() => setThumbHov(false)}
      >
        <img src={item.img} alt={item.title} className="ga-market-thumb-img" draggable={false} />
        <span className={cn("ga-market-thumb-overlay", showOverlay && "is-visible")}>
          {isPlaying
            ? <Pause style={{ width: 14, height: 14, fill: "#fff", stroke: "none" }} />
            : <Play  style={{ width: 14, height: 14, fill: "#fff", stroke: "none", marginLeft: 2 }} />
          }
        </span>
      </button>

      <div className="ga-market-row-info">
        <span className="ga-market-row-title">{item.title}</span>
        <span className="ga-market-row-meta">{metaLine}</span>
      </div>

      <WaveformViz />

      <span className="ga-market-row-dur">{formatDur(item.duration)}</span>
      <span className="ga-market-row-metric">{metricVal}</span>

      <div className="ga-market-row-actions">
        <button type="button" className="ga-market-try-btn" onClick={() => onSelect(item.prompt)}>
          <RotateCcw style={{ width: 13, height: 13 }} />
          Try it
        </button>
      </div>
    </div>
  );
}

export function MarketplaceView({ mode, items, playingId, onPlayToggle, onSelect }) {
  const catsRef = useRef(null);

  const categories  = mode === "sfx" ? SFX_CATEGORIES : VO_CATEGORIES;
  const metricLabel = mode === "voiceover" ? "Speed" : "BPM";
  const filtered = items;

  return (
    <div className="ga-market">
      <h2 className="image-style-title">For Every Mood</h2>

      {/* Category cards */}
      <div className="ga-market-cats-wrap">
        <div className="ga-market-cats" ref={catsRef}>
          {categories.map(cat => (
            <button key={cat.label} type="button" className="ga-market-cat">
              <img src={cat.img} alt={cat.label} className="ga-market-cat-img" draggable={false} />
              <span className="ga-market-cat-label">{cat.label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="ga-market-cats-arrow"
          aria-label="Scroll categories"
          onClick={() => catsRef.current?.scrollBy({ left: 330, behavior: "smooth" })}
        >
          <ChevronRight style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* List header */}
      <div className="ga-market-list-head">
        <span className="ga-market-head-spacer" />
        <span className="ga-market-head-track">Track</span>
        <span className="ga-market-head-wave" />
        <span className="ga-market-head-dur">Duration</span>
        <span className="ga-market-head-metric">{metricLabel}</span>
        <span className="ga-market-head-actions" />
      </div>

      {/* Rows */}
      {filtered.map(item => (
        <MarketplaceRow
          key={item.id}
          item={item}
          mode={mode}
          isPlaying={playingId === item.id}
          onPlayToggle={onPlayToggle}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
