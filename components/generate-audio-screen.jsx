"use client";

import { useState } from "react";
import {
  Music4, Volume2, Mic, ArrowUp, LayoutGrid, Clock, Sparkles, Gauge, ArrowRight,
} from "lucide-react";
import { HomeSidebar } from "@/components/home-sidebar";
import { PromptBox } from "@/components/prompt-box";
import { ShowcaseCard, MarketplaceView, SHOWCASE_DATA } from "@/components/audio-showcase-cards";
import { cn } from "@/lib/utils";

const MODES = [
  { key: "audio",     label: "Music",     icon: Music4  },
  { key: "sfx",       label: "SFX",       icon: Volume2 },
  { key: "voiceover", label: "Voiceover", icon: Mic     },
];


const audioModels          = ["Suno v4", "Udio 2.0", "MusicGen 2"];
const audioMoodOptions     = ["Cinematic", "Ambient", "Electronic", "Jazz", "Hip-Hop", "Acoustic", "Lo-Fi", "Corporate"];
const audioDurationOptions = ["15s", "30s", "60s", "2min"];
const audioQualityOptions  = ["Standard", "HD"];
const sfxModels            = ["ElevenLabs SFX", "Audiocraft", "Stability Audio"];
const sfxDurationOptions   = ["1s", "3s", "5s", "10s"];
const voiceoverModels      = ["ElevenLabs", "OpenAI TTS", "Cartesia"];
const voiceOptions         = ["Nova", "Onyx", "Alloy", "Echo", "Fable", "Shimmer"];
const speedOptions         = ["0.75x", "1x", "1.25x", "1.5x"];
const languageOptions      = ["English", "Spanish", "French", "German"];

export default function GenerateAudioScreen() {
  const [selectedMode, setSelectedMode] = useState("audio");
  const [activeGrid, setActiveGrid] = useState("audio");
  const [prompt, setPrompt] = useState("");
  const [playingId, setPlayingId] = useState(null);
  const [audioSettings, setAudioSettings] = useState({ model: "Suno v4", mood: "Cinematic", duration: "30s", quality: "HD" });
  const [sfxSettings, setSfxSettings] = useState({ model: "ElevenLabs SFX", duration: "3s" });
  const [voiceoverSettings, setVoiceoverSettings] = useState({ model: "ElevenLabs", voice: "Nova", speed: "1x", language: "English" });

  function selectMode(mode) {
    setSelectedMode(mode);
    setActiveGrid(mode);
    setPrompt("");
    setPlayingId(null);
  }

  function togglePlay(id) {
    setPlayingId((prev) => (prev === id ? null : id));
  }

  function selectCard(cardPrompt) {
    setPrompt((prev) => (prev.trim() ? prev.trim() + " " : "") + cardPrompt);
  }

  const chipsMap = {
    audio: [
      { key: "aud-model",    icon: LayoutGrid, activeValue: audioSettings.model,    options: audioModels,          onSelect: (v) => setAudioSettings((s) => ({ ...s, model: v })) },
      { key: "aud-mood",     icon: Music4,     activeValue: audioSettings.mood,     options: audioMoodOptions,     onSelect: (v) => setAudioSettings((s) => ({ ...s, mood: v })) },
      { key: "aud-duration", icon: Clock,      activeValue: audioSettings.duration, options: audioDurationOptions, onSelect: (v) => setAudioSettings((s) => ({ ...s, duration: v })) },
      { key: "aud-quality",  icon: Sparkles,   activeValue: audioSettings.quality,  options: audioQualityOptions,  onSelect: (v) => setAudioSettings((s) => ({ ...s, quality: v })) },
    ],
    sfx: [
      { key: "sfx-model",    icon: LayoutGrid, activeValue: sfxSettings.model,    options: sfxModels,          onSelect: (v) => setSfxSettings((s) => ({ ...s, model: v })) },
      { key: "sfx-duration", icon: Clock,      activeValue: sfxSettings.duration, options: sfxDurationOptions, onSelect: (v) => setSfxSettings((s) => ({ ...s, duration: v })) },
    ],
    voiceover: [
      { key: "vo-model",    icon: LayoutGrid, activeValue: voiceoverSettings.model,    options: voiceoverModels, onSelect: (v) => setVoiceoverSettings((s) => ({ ...s, model: v })) },
      { key: "vo-voice",    icon: Mic,        activeValue: voiceoverSettings.voice,    options: voiceOptions,    onSelect: (v) => setVoiceoverSettings((s) => ({ ...s, voice: v })) },
      { key: "vo-speed",    icon: Gauge,      activeValue: voiceoverSettings.speed,    options: speedOptions,    onSelect: (v) => setVoiceoverSettings((s) => ({ ...s, speed: v })) },
      { key: "vo-language", icon: LayoutGrid, activeValue: voiceoverSettings.language, options: languageOptions, onSelect: (v) => setVoiceoverSettings((s) => ({ ...s, language: v })) },
    ],
  };

  return (
    <div className="home-shell">
      <HomeSidebar activePath="/generate-audio" />

      <main className="ga-main">
        <div className="ga-top">
          <div className="ga-header">
            <h1 className="ga-title">Generate Audio</h1>
            <p className="ga-subtitle">Create music, SFX, and voiceovers from a prompt</p>
          </div>

          <div className="ga-mode-tabs">
            {MODES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                className={cn("ga-mode-tab", selectedMode === key && "is-active")}
                onClick={() => selectMode(key)}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>

          <div className="ga-prompt-card">
            <PromptBox
              variant="home"
              value={prompt}
              onChange={setPrompt}
              placeholder={
                selectedMode === "audio"
                  ? "Describe the music you want to create..."
                  : selectedMode === "sfx"
                  ? "Describe the sound effect..."
                  : "Enter the text for your voiceover..."
              }
              activeGrid={activeGrid}
              onActiveGridChange={(g) => setActiveGrid(g ?? selectedMode)}
              chipsMap={chipsMap}
              renderSendButton={() => (
                <button type="button" className="home-prompt-send" aria-label="Generate">
                  <ArrowUp />
                </button>
              )}
            />
          </div>
        </div>

        <div className="ga-showcase">
          {selectedMode === "audio" ? (
            <>
              <div className="ga-showcase-header">
                <h2 className="ga-showcase-title">Staff Picks</h2>
                <button type="button" className="ga-showcase-see-all">
                  See all <ArrowRight />
                </button>
              </div>
              <div className="ga-scroll-row">
                {SHOWCASE_DATA.audio.map((item) => (
                  <ShowcaseCard
                    key={item.id}
                    item={item}
                    mode="audio"
                    isPlaying={playingId === item.id}
                    onPlayToggle={togglePlay}
                    onSelect={selectCard}
                  />
                ))}
              </div>
            </>
          ) : (
            <MarketplaceView
              mode={selectedMode}
              items={SHOWCASE_DATA[selectedMode]}
              playingId={playingId}
              onPlayToggle={togglePlay}
              onSelect={selectCard}
            />
          )}
        </div>
      </main>
    </div>
  );
}
