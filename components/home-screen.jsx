"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Check,
  Video,
  Layers,
  Sparkles,
  FileText,
  RefreshCw,
  Scissors,
  Mic2,
  ArrowUp,
  ArrowUpRight,
  Headphones,
  Music,
  Music4,
  Clapperboard,
  ImageUp,
  LayoutGrid,
  RectangleHorizontal,
  ArrowUpDown,
  Clock,
  Gauge,
  Mic,
  X,
} from "lucide-react";
import { PromptBox } from "@/components/prompt-box";
import { HomeSidebar } from "@/components/home-sidebar";
import { IMAGE_STYLES, getImageStyleUrl } from "@/lib/image-styles";
import { ShowcaseCard, ShowcaseListRow, MUSIC_SHOWCASE, SFX_SHOWCASE, VO_SHOWCASE } from "@/components/audio-showcase-cards";
import { cn } from "@/lib/utils";

const recentProjectsMain = [
  { id: 1, title: "Untitled Project", time: "Last edited 9 hrs ago", color: "#5a3a4a" },
  { id: 2, title: "Rough Cuts Project", time: "Last edited 9 hrs ago", color: "#2a2a3a" },
];

const actionChips = [
  { key: "generate", label: "Generate", icon: Sparkles },
  { key: "script", label: "Script & Strategy", icon: FileText },
  { key: "repurpose", label: "Repurpose", icon: RefreshCw },
  { key: "edit", label: "Edit", icon: Scissors },
  { key: "captions", label: "Captions & Voice", icon: Mic2 },
];

const homeImageStyles = IMAGE_STYLES;

const imageStylePrompts = {
  "Illustration":   "A cozy village street in autumn with colorful falling leaves, soft illustration style with warm golden tones",
  "Anime":          "A determined young hero standing atop a skyscraper overlooking a neon-lit cyberpunk city at night, anime style",
  "3D Render":      "A sleek futuristic workspace with floating holographic screens, ultra-realistic 3D render with volumetric lighting",
  "Comic Book":     "A hero leaping across rooftops in a rainy city, dynamic perspective, bold comic book art style with halftone dots",
  "Pixel Art":      "A vibrant 8-bit fantasy dungeon scene with glowing torches and treasure chests, retro pixel art style",
  "Watercolor":     "A misty Japanese garden with cherry blossoms reflecting in a still pond, delicate watercolor painting style",
  "Oil Painting":   "A dramatic storm-swept ocean with a lone lighthouse at dusk, rich textures, classical oil painting style",
  "Cinematic":      "A lone astronaut standing on a red rocky alien planet with twin moons rising on the horizon, cinematic wide shot",
  "Pencil Sketch":  "A detailed pencil sketch of a wise old owl perched on a twisted oak branch, fine cross-hatching texture",
  "Monochrome":     "A dramatic close-up portrait of a weathered sailor in a storm, high-contrast black and white photography",
  "Minecraft":      "An epic Minecraft castle fortress built on a floating island surrounded by clouds and waterfalls",
  "Neon Noir":      "A shadowy detective silhouetted against a rain-soaked neon-lit alley, moody neon noir aesthetic",
  "Cyberpunk":      "A bustling cyberpunk street market at night with holographic advertisements and augmented people",
  "Vintage Film":   "A romantic couple walking through Paris in the 1960s, grainy vintage film photography aesthetic",
  "Surreal":        "A giant whale swimming through clouds above a tranquil desert landscape, surrealist dreamscape painting",
  "Studio Ghibli":  "A young girl with a magical spirit companion exploring an enchanted forest, Studio Ghibli animation style",
  "Impressionist":  "A sun-drenched French countryside with lavender fields and a distant château, loose impressionist brushwork",
  "Photorealistic": "A majestic snow leopard resting on a rocky mountain ledge at sunset, ultra-photorealistic photography",
  "Abstract":       "Swirling vortex of electric blue and magenta forming a cosmic nebula, abstract generative digital art",
};

const homeVideoClips = [
  { name: "Urban Timelapse", src: "/video-styles/Urban Timelapse.mp4", ratio: "16 / 9", prompt: "A cinematic timelapse of a busy city intersection at night with streaking car light trails and glowing storefronts" },
  { name: "Street Style",    src: "/video-styles/Street Style.mp4",    ratio: "9 / 16", prompt: "A confident model walking through a vibrant urban neighborhood, vertical cinematic street style video" },
  { name: "Forest Trail",    src: "/video-styles/Forest Trails.mp4",   ratio: "16 / 9", prompt: "A first-person walk through a lush green forest trail with dappled sunlight filtering through the canopy" },
  { name: "Ocean Waves",     src: "/video-styles/Ocean waves.mp4",     ratio: "16 / 9", prompt: "Slow-motion turquoise ocean waves gently breaking on a white sandy beach at golden hour" },
  { name: "Abstract",        src: "/video-styles/Abstract.mp4",        ratio: "16 / 9", prompt: "Flowing liquid metallic shapes morphing and transforming in slow motion against a dark background, abstract motion" },
  { name: "Portrait",        src: "/video-styles/Portrait.mp4",        ratio: "9 / 16", prompt: "A cinematic vertical portrait of a musician playing guitar in a warmly lit studio, shallow depth of field" },
  { name: "Lifestyle",       src: "/video-styles/Lifestyle.mp4",       ratio: "16 / 9", prompt: "A warm lifestyle montage of friends laughing and sharing a meal at a sunlit outdoor café" },
  { name: "Vertical",        src: "/video-styles/Vertical.mp4",        ratio: "9 / 16", prompt: "Aerial drone shot slowly descending through morning mist over rolling mountain peaks, vertical video" },
  { name: "Close Up",        src: "/video-styles/Close up.mp4",        ratio: "16 / 9", prompt: "Extreme macro close-up of water droplets falling in slow motion onto a blooming flower" },
];

const homeAimgTemplates = [
  { id: 1,  name: "Logo Reveal",      category: "Branding",    gradient: "135deg,#7c3aed 0%,#c026d3 100%",  prompt: "Animated logo reveal with glowing particles and smooth scale-up, purple and gold light rays" },
  { id: 2,  name: "Kinetic Title",    category: "Typography",  gradient: "135deg,#0ea5e9 0%,#6366f1 100%",  prompt: "Kinetic typography animation with bold text flying in from multiple angles, dynamic blue-indigo palette" },
  { id: 3,  name: "Story Countdown",  category: "Social",      gradient: "135deg,#ef4444 0%,#f97316 100%",  prompt: "Energetic countdown timer for social media stories, bouncy numerals with red-orange gradient burst" },
  { id: 4,  name: "Data Viz",         category: "Infographic", gradient: "135deg,#10b981 0%,#0ea5e9 100%",  prompt: "Smooth animated infographic with growing bar charts and pie charts, clean teal and blue palette" },
  { id: 5,  name: "Particle Burst",   category: "VFX",         gradient: "135deg,#1e1b4b 0%,#7c3aed 100%",  prompt: "Explosive particle burst with thousands of colorful sparks scattering from center, dark purple background" },
  { id: 6,  name: "Lower Third",      category: "Broadcast",   gradient: "135deg,#0f172a 0%,#1d4ed8 100%",  prompt: "Professional broadcast lower third with smooth slide-in line and name reveal, dark navy and blue" },
  { id: 7,  name: "Social Intro",     category: "Social",      gradient: "135deg,#ec4899 0%,#8b5cf6 100%",  prompt: "Eye-catching social media intro with trendy stacked typography and pink-purple gradient transitions" },
  { id: 8,  name: "Glitch Effect",    category: "VFX",         gradient: "135deg,#042f2e 0%,#0d0d0d 100%",  prompt: "Cyberpunk glitch with RGB channel splitting, scanlines and digital distortion on black background" },
  { id: 9,  name: "Minimal Text",     category: "Typography",  gradient: "135deg,#1e293b 0%,#475569 100%",  prompt: "Elegant minimal text animation with slow fade and scale, sophisticated slate palette and serif font" },
  { id: 10, name: "Neon Glow",        category: "VFX",         gradient: "135deg,#0a0a0a 0%,#00c47a 100%",  prompt: "Neon glow animation with bright green light trails and flicker on pure black, futuristic aesthetic" },
  { id: 11, name: "Cinematic Title",  category: "Film",        gradient: "135deg,#0a0a0a 0%,#92400e 100%",  prompt: "Epic cinematic title sequence with golden light ray reveal and dramatic letter spacing, orchestral feel" },
  { id: 12, name: "Explainer Scene",  category: "Business",    gradient: "135deg,#1e40af 0%,#7c3aed 100%",  prompt: "Flat-design explainer animation with icons drawing on screen to illustrate a product concept, blue-purple" },
];

const TOOL_SUGGESTION_CONFIG = {
  video:      { icon: Video,        label: "Generate Video",     slug: "generate-video" },
  image:      { icon: ImageUp,      label: "Generate Image",     slug: "generate-image" },
  audio:      { icon: Music,        label: "Generate Audio",     slug: "generate-audio" },
  sfx:        { icon: Headphones,   label: "Generate SFX",       slug: "generate-sfx" },
  voiceover:  { icon: Mic2,         label: "Generate Voiceover", slug: "generate-voiceover" },
  autodemo:   { icon: Clapperboard, label: "Auto Demo",          slug: "autodemo" },
  roughcuts:  { icon: RefreshCw,    label: "Rough Cuts",         slug: "roughcuts" },
  clipping:   { icon: Scissors,     label: "Clipping",           slug: "clipping" },
};

const imageModels = ["Imagen 4", "Flux 1.1 Pro", "DALL·E 3", "Stable Diffusion 3.5"];
const imageRatioOptions = ["1:1", "4:3", "3:4", "16:9", "9:16"];
const imageResolutionOptions = ["512px", "768px", "1024px", "2048px"];
const imageQualityOptions = ["Standard", "HD"];

const videoModels = ["Sora", "Runway Gen-3", "Kling 1.6", "Luma Dream Machine"];
const videoRatioOptions = ["16:9", "9:16", "1:1", "4:3"];
const videoDurationOptions = ["5s", "10s", "15s", "30s"];
const videoQualityOptions = ["360p", "720p", "1080p", "4K"];

const audioModels = ["Suno v4", "Udio 2.0", "MusicGen 2"];
const audioMoodOptions = ["Cinematic", "Ambient", "Electronic", "Jazz", "Hip-Hop", "Acoustic", "Lo-Fi", "Corporate"];
const audioDurationOptions = ["15s", "30s", "60s", "2min"];
const audioQualityOptions = ["Standard", "HD"];

const sfxModels = ["ElevenLabs SFX", "Audiocraft", "Stability Audio"];
const sfxDurationOptions = ["1s", "3s", "5s", "10s"];

const voiceoverModels = ["ElevenLabs", "OpenAI TTS", "Cartesia"];
const voiceOptions = ["Nova", "Onyx", "Alloy", "Echo", "Fable", "Shimmer"];
const speedOptions = ["0.75x", "1x", "1.25x", "1.5x"];
const languageOptions = ["English", "Spanish", "French", "German"];


const modelProviders = [
  {
    id: "claude",
    label: "Claude",
    subBrand: "Anthropic",
    iconBg: "#f0ece7",
    iconColor: "#cc5533",
    submodels: [
      { id: "claude-haiku-4-5", label: "Haiku 4.5" },
      { id: "claude-sonnet-4-5", label: "Sonnet 4.5" },
    ],
  },
  {
    id: "deepseek-v4-pro",
    label: "DeepSeek V4 Pro",
    subBrand: "DeepSeek",
    iconBg: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)",
    submodels: [],
  },
  {
    id: "kimi-k2-6",
    label: "Kimi K2.6",
    subBrand: null,
    iconBg: "#18181f",
    iconColor: "#fff",
    iconLetter: "K",
    submodels: [],
  },
  {
    id: "qwen",
    label: "Qwen",
    subBrand: "Qwen",
    iconBg: "linear-gradient(135deg, #6d28d9 0%, #4338ca 100%)",
    submodels: [],
  },
];

export default function HomeScreen() {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [modelOpen, setModelOpen] = useState(false);
  const [hoveredProvider, setHoveredProvider] = useState(null);
  const [selectedModel, setSelectedModel] = useState({
    providerId: "deepseek-v4-pro",
    submodelId: null,
    label: "DeepSeek V4 Pro",
    iconBg: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)",
  });
  const [isFocused, setIsFocused] = useState(false);
  const [activeGrid, setActiveGrid] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedAimgTemplate, setSelectedAimgTemplate] = useState(null);

  const [imageSettings, setImageSettings] = useState({ model: "Imagen 4", ratio: "1:1", resolution: "1024px", quality: "Standard" });
  const [videoSettings, setVideoSettings] = useState({ model: "Sora", ratio: "16:9", duration: "5s", quality: "1080p" });
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const modelRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState(null);
  const promptCardRef = useRef(null);
  const [videoStartAttachment, setVideoStartAttachment] = useState(null);
  const [videoEndAttachment, setVideoEndAttachment] = useState(null);
  const [promptSuggestion, setPromptSuggestion] = useState(null);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const [audioSettings, setAudioSettings] = useState({ model: "Suno v4", mood: "Cinematic", duration: "30s", quality: "HD" });
  const [sfxSettings, setSfxSettings] = useState({ model: "ElevenLabs SFX", duration: "3s" });
  const [voiceoverSettings, setVoiceoverSettings] = useState({ model: "ElevenLabs", voice: "Nova", speed: "1x", language: "English" });
  const [playingId, setPlayingId] = useState(null);

  const [imageErrorVisible, setImageErrorVisible] = useState(false);
  const hasPromptText = prompt.trim().length > 0;
  const showPromptSuggestion = Boolean(promptSuggestion && !suggestionDismissed && !activeGrid && hasPromptText);

  useEffect(() => {
    if (activeGrid !== "video" || !["Luma Dream Machine"].includes(videoSettings.model)) {
      setImageErrorVisible(false);
      return;
    }
    const card = promptCardRef.current;
    if (card) {
      card.classList.remove("is-shaking");
      void card.offsetWidth;
      card.classList.add("is-shaking");
      setTimeout(() => card.classList.remove("is-shaking"), 400);
    }
    setImageErrorVisible(true);
  }, [videoSettings.model]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeGrid !== "video") setImageErrorVisible(false);
  }, [activeGrid]);

  function setAudioSetting(key, value) { setAudioSettings((s) => ({ ...s, [key]: value })); }
  function setSfxSetting(key, value) { setSfxSettings((s) => ({ ...s, [key]: value })); }
  function setVoiceoverSetting(key, value) { setVoiceoverSettings((s) => ({ ...s, [key]: value })); }

  useLayoutEffect(() => {
    if (!prompt) {
      setPromptSuggestion(null);
      setSuggestionDismissed(false);
      return;
    }
    const videoMatch     = /\bvideo\b|\b(generate|create|make)\s+(?:a\s+)?video\b|\banimate\b|\bcreate\s+(?:a\s+)?clip\b|\/generate-video\b/i.test(prompt);
    const imageMatch     = /\bimage\b|\b(generate|create|make)\s+(?:an?\s+)?image\b|\bdraw\b|\billustrate\b|\brender\b|\b(photo|picture)\s+of\b|\/generate-image\b/i.test(prompt);
    const voiceoverMatch = /\b(generate|create|make|add)\s+(?:a\s+)?(?:voiceover|voice\s+over|narration)\b|\bnarrate\b|\bnarration\b|\btext\s+to\s+speech\b|\bvoiceover\b|\bvoice\s+over\b|\/generate-voiceover\b/i.test(prompt);
    const audioMatch     = /\b(generate|create|make|add)\s+(?:an?\s+)?(?:background\s+)?(?:audio|music|soundtrack)\b|\bmusic\b|\bsoundtrack\b|\bbackground\s+music\b|\/generate-audio\b/i.test(prompt);
    const sfxMatch       = /\b(generate|create|make|add)\s+(?:sound\s+effects?|sfx)\b|\bsound\s+effects?\b|\bsfx\b|\/generate-sfx\b/i.test(prompt);
    const autodemoMatch  = /\bauto\s*demo\b|\b(create|generate|make)\s+(?:a\s+)?(?:product\s+)?demo\b|\bdemo\s+video\b|\/autodemo\b/i.test(prompt);
    const roughcutsMatch = /\brough\s*cuts?\b|\b(create|make|assemble)\s+(?:a\s+)?(?:rough|first)\s+cut\b|\/roughcuts\b/i.test(prompt);
    const clippingMatch  = /\b(create|make|generate|extract)\s+(?:short\s+|social\s+)?clips?\b|\bclipping\b|\bhighlight\s+(?:reel|clips?)\b|\/clipping\b/i.test(prompt);
    const detected = videoMatch ? "video" : imageMatch ? "image" : voiceoverMatch ? "voiceover" : audioMatch ? "audio" : sfxMatch ? "sfx" : autodemoMatch ? "autodemo" : roughcutsMatch ? "roughcuts" : clippingMatch ? "clipping" : null;
    if (detected !== promptSuggestion) {
      setPromptSuggestion(detected);
      setSuggestionDismissed(false);
    }
  }, [prompt]); // eslint-disable-line react-hooks/exhaustive-deps

  function acceptSuggestion() {
    setActiveGrid(promptSuggestion);
    setSuggestionDismissed(true);
    setPrompt("");
  }

  function openModelDropdown() {
    if (modelRef.current) {
      const rect = modelRef.current.getBoundingClientRect();
      setDropdownPos({
        bottom: window.innerHeight - rect.top + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setModelOpen(true);
    setHoveredProvider(null);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      const inSelector = modelRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);
      if (!inSelector && !inDropdown) {
        setModelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isFocused) return;
    function handleClickOutside(e) {
      if (promptCardRef.current && !promptCardRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFocused]);

  return (
    <div className={cn("home-shell", isFocused && "is-focused", activeGrid && "has-grid")}>
      <HomeSidebar
        activePath="/"
        onToolSelect={(key) => {
          setActiveGrid(key);
          setPromptSuggestion(null);
          setSuggestionDismissed(false);
        }}
      />

      <main className="home-main">
        <div className="home-focused-topbar">
          <button type="button" className="home-focused-credits">
            <Sparkles />
            <span>9,261 credits</span>
          </button>
          <button type="button" className="home-focused-space">
            <Layers />
            <span>Default Space</span>
          </button>
          <Link href="/editor" className="home-focused-open-editor">
            <span>Open Editor</span>
            <ArrowUpRight />
          </Link>
        </div>
        <div className="home-main-inner">
          <h1 className="home-greeting">Ready to direct, Pratiksha?</h1>

          {imageErrorVisible && (
            <div className="prompt-image-error">
              <div className="prompt-image-error-left">
                <AlertTriangle size={13} />
                <span className="prompt-image-error-text">Images you upload won't be used — Luma Dream Machine doesn't support image input for video generation</span>
              </div>
            </div>
          )}

          <div className="home-prompt-card" ref={promptCardRef}>
            <PromptBox
              variant="home"
              value={prompt}
              onChange={setPrompt}
              onKeyDown={(e) => {
                if (e.key === "Tab" && promptSuggestion && !suggestionDismissed && !activeGrid) {
                  e.preventDefault();
                  acceptSuggestion();
                }
              }}
              placeholder={isFocused ? "Type / for commands" : "Describe your next shot..."}
              activeGrid={activeGrid}
              onActiveGridChange={(grid) => { setActiveGrid(grid); setPromptSuggestion(null); setSuggestionDismissed(false); }}
              selectedAttachment={selectedAttachment}
              onSelectedAttachmentChange={setSelectedAttachment}
              videoStartAttachment={videoStartAttachment}
              onVideoStartAttachmentChange={setVideoStartAttachment}
              videoEndAttachment={videoEndAttachment}
              onVideoEndAttachmentChange={setVideoEndAttachment}
              chipsMap={{
                image: [
                  { key: "model",      icon: LayoutGrid,          activeValue: imageSettings.model,      options: imageModels,           onSelect: (v) => setImageSettings((s) => ({ ...s, model: v })) },
                  { key: "ratio",      icon: RectangleHorizontal, activeValue: imageSettings.ratio,      options: imageRatioOptions,     onSelect: (v) => setImageSettings((s) => ({ ...s, ratio: v })) },
                  { key: "resolution", icon: ArrowUpDown,         activeValue: imageSettings.resolution, options: imageResolutionOptions, onSelect: (v) => setImageSettings((s) => ({ ...s, resolution: v })) },
                  { key: "quality",    icon: Sparkles,            activeValue: imageSettings.quality,    options: imageQualityOptions,   onSelect: (v) => setImageSettings((s) => ({ ...s, quality: v })) },
                ],
                video: [
                  { key: "model",    icon: LayoutGrid,          activeValue: videoSettings.model,    options: videoModels,         onSelect: (v) => setVideoSettings((s) => ({ ...s, model: v })) },
                  { key: "ratio",    icon: RectangleHorizontal, activeValue: videoSettings.ratio,    options: videoRatioOptions,   onSelect: (v) => setVideoSettings((s) => ({ ...s, ratio: v })) },
                  { key: "duration", icon: Clock,               activeValue: videoSettings.duration, options: videoDurationOptions, onSelect: (v) => setVideoSettings((s) => ({ ...s, duration: v })) },
                  { key: "quality",  icon: Sparkles,            activeValue: videoSettings.quality,  options: videoQualityOptions, onSelect: (v) => setVideoSettings((s) => ({ ...s, quality: v })) },
                ],
                audio: [
                  { key: "aud-model",    icon: LayoutGrid, activeValue: audioSettings.model,    options: audioModels,          onSelect: (v) => setAudioSetting("model", v) },
                  { key: "aud-mood",     icon: Music4,     activeValue: audioSettings.mood,     options: audioMoodOptions,     onSelect: (v) => setAudioSetting("mood", v) },
                  { key: "aud-duration", icon: Clock,      activeValue: audioSettings.duration, options: audioDurationOptions, onSelect: (v) => setAudioSetting("duration", v) },
                  { key: "aud-quality",  icon: Sparkles,   activeValue: audioSettings.quality,  options: audioQualityOptions,  onSelect: (v) => setAudioSetting("quality", v) },
                ],
                sfx: [
                  { key: "sfx-model",    icon: LayoutGrid, activeValue: sfxSettings.model,    options: sfxModels,        onSelect: (v) => setSfxSetting("model", v) },
                  { key: "sfx-duration", icon: Clock,      activeValue: sfxSettings.duration, options: sfxDurationOptions, onSelect: (v) => setSfxSetting("duration", v) },
                ],
                voiceover: [
                  { key: "vo-model",    icon: LayoutGrid, activeValue: voiceoverSettings.model,    options: voiceoverModels, onSelect: (v) => setVoiceoverSetting("model", v) },
                  { key: "vo-voice",    icon: Mic,        activeValue: voiceoverSettings.voice,    options: voiceOptions,    onSelect: (v) => setVoiceoverSetting("voice", v) },
                  { key: "vo-speed",    icon: Gauge,      activeValue: voiceoverSettings.speed,    options: speedOptions,    onSelect: (v) => setVoiceoverSetting("speed", v) },
                  { key: "vo-language", icon: LayoutGrid, activeValue: voiceoverSettings.language, options: languageOptions, onSelect: (v) => setVoiceoverSetting("language", v) },
                ],
              }}
              renderModelSelector={() => (
                <div className="home-model-selector-wrap" ref={modelRef}>
                  <button
                    type="button"
                    className={cn("home-model-selector", modelOpen && "is-open")}
                    onClick={() => modelOpen ? (setModelOpen(false), setHoveredProvider(null)) : openModelDropdown()}
                  >
                    <span className="home-model-icon" style={{ background: selectedModel.iconBg }} />
                    <span>{selectedModel.label}</span>
                    <ChevronDown className={cn("home-model-chevron", modelOpen && "is-open")} />
                  </button>
                  {modelOpen && dropdownPos && createPortal(
                    <div
                      ref={dropdownRef}
                      className="home-model-dropdown"
                      style={{ position: "fixed", bottom: dropdownPos.bottom, right: dropdownPos.right }}
                    >
                      <div className="home-model-provider-list">
                        {modelProviders.map((provider) => (
                          <div
                            key={provider.id}
                            className={cn("home-model-provider-row", hoveredProvider === provider.id && "is-hovered")}
                            onMouseEnter={() => setHoveredProvider(provider.id)}
                            onMouseLeave={() => provider.submodels.length === 0 && setHoveredProvider(null)}
                            onClick={() => {
                              if (provider.submodels.length === 0) {
                                setSelectedModel({ providerId: provider.id, submodelId: null, label: provider.label, iconBg: provider.iconBg });
                                setModelOpen(false);
                                setHoveredProvider(null);
                              }
                            }}
                          >
                            <span className="home-model-provider-icon" style={{ background: provider.iconBg, color: provider.iconColor }}>
                              {provider.iconLetter ?? null}
                              {provider.id === "claude" && (
                                <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
                                  <path d="M12 2l1.09 3.36L16.5 4l-2.18 2.91L17 10l-3.5-.55L12 13l-1.5-3.55L7 10l2.68-3.09L7.5 4l3.41 1.36z" />
                                </svg>
                              )}
                            </span>
                            <span className="home-model-provider-name">{provider.label}</span>
                            {provider.subBrand && <span className="home-model-provider-brand">{provider.subBrand}</span>}
                            {provider.submodels.length > 0
                              ? <ChevronRight className="home-model-row-end" />
                              : selectedModel.providerId === provider.id && <Check className="home-model-row-end home-model-row-check" />
                            }
                          </div>
                        ))}
                      </div>
                      {hoveredProvider && modelProviders.find(p => p.id === hoveredProvider)?.submodels.length > 0 && (
                        <div className="home-model-submenu">
                          <div className="home-model-submenu-header">
                            {modelProviders.find(p => p.id === hoveredProvider).label}
                          </div>
                          {modelProviders.find(p => p.id === hoveredProvider).submodels.map((sub) => {
                            const provider = modelProviders.find(p => p.id === hoveredProvider);
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                className={cn("home-model-sub-option", selectedModel.submodelId === sub.id && "is-selected")}
                                onClick={() => {
                                  setSelectedModel({ providerId: provider.id, submodelId: sub.id, label: sub.label, iconBg: provider.iconBg });
                                  setModelOpen(false);
                                  setHoveredProvider(null);
                                }}
                              >
                                <span className="home-model-provider-icon" style={{ background: provider.iconBg, color: provider.iconColor }}>
                                  {provider.id === "claude" && (
                                    <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
                                      <path d="M12 2l1.09 3.36L16.5 4l-2.18 2.91L17 10l-3.5-.55L12 13l-1.5-3.55L7 10l2.68-3.09L7.5 4l3.41 1.36z" />
                                    </svg>
                                  )}
                                </span>
                                <span>{sub.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>,
                    document.body
                  )}
                </div>
              )}
              renderSendButton={() => (
                <button type="button" className="home-prompt-send" aria-label="Send">
                  <ArrowUp />
                </button>
              )}
            />
          </div>

          {showPromptSuggestion && (() => {
            const cfg = TOOL_SUGGESTION_CONFIG[promptSuggestion];
            if (!cfg) return null;
            return (
              <div className="prompt-suggestion-widget prompt-suggestion-widget--below">
                <div className="prompt-suggestion-left">
                  <cfg.icon size={13} />
                  <span className="prompt-suggestion-label">{cfg.label}</span>
                  <span className="prompt-suggestion-key">Tab</span>
                </div>
                <div className="prompt-suggestion-right">
                  <button type="button" className="prompt-suggestion-confirm" onClick={acceptSuggestion}>
                    Use {cfg.slug}
                  </button>
                  <button type="button" className="prompt-suggestion-dismiss" onClick={() => setSuggestionDismissed(true)}>
                    <X size={12} />
                  </button>
                </div>
              </div>
            );
          })()}

          {!hasPromptText && (
            <div className="home-action-chips">
              {actionChips.map((chip) => (
                <button key={chip.key} type="button" className="home-action-chip">
                  <chip.icon />
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {activeGrid === "image" && (
          <div className="home-style-grid-wrap">
            <div className="home-gen-text-header">
              <span className="image-style-title">Trending: 2026 picks</span>
            </div>
            <div className="home-image-style-grid">
              {homeImageStyles.map((style, i) => (
                <button
                  key={style.name}
                  type="button"
                  className={cn("image-style-card", selectedStyle === style.name && "is-selected")}
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() => {
                    const isDeselecting = selectedStyle === style.name;
                    setSelectedStyle(isDeselecting ? null : style.name);
                    if (!isDeselecting) setPrompt(imageStylePrompts[style.name] ?? style.name);
                  }}
                >
                  <img
                    src={getImageStyleUrl(style)}
                    alt={style.name}
                    className="image-style-thumb"
                  />
                  <span className="image-style-label">{style.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeGrid === "video" && (
          <div className="home-style-grid-wrap">
            <div className="home-gen-text-header">
              <span className="image-style-title">For You</span>
            </div>
            <div className="home-video-style-grid">
              {homeVideoClips.map((vid, i) => (
                <button
                  key={vid.name}
                  type="button"
                  className={cn("video-style-card", selectedStyle === vid.name && "is-selected")}
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() => {
                    const isDeselecting = selectedStyle === vid.name;
                    setSelectedStyle(isDeselecting ? null : vid.name);
                    if (!isDeselecting) setPrompt(vid.prompt);
                  }}
                >
                  <div className="video-clip-wrap" style={{ aspectRatio: vid.ratio }}>
                    <video
                      src={vid.src}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="video-style-clip"
                    />
                    <span className="image-style-label">{vid.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeGrid === "audio" && (
          <div className="home-style-grid-wrap">
            <div className="home-gen-text-header">
              <span className="image-style-title">Vibe on them</span>
            </div>
            <div
              className="ga-scard-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "14px" }}
            >
              {MUSIC_SHOWCASE.map((item) => (
                <ShowcaseCard
                  key={item.id}
                  item={item}
                  mode="audio"
                  isPlaying={playingId === item.id}
                  onPlayToggle={(id) => setPlayingId((p) => (p === id ? null : id))}
                  onSelect={(p) => setPrompt((prev) => (prev.trim() ? prev.trim() + " " : "") + p)}
                />
              ))}
            </div>
          </div>
        )}

        {(activeGrid === "sfx" || activeGrid === "voiceover") && (
          <div className="home-style-grid-wrap">
            <div className="home-gen-text-header">
              <span className="image-style-title">Vibe on them</span>
            </div>
            <div className="ga-list" style={{ display: "flex", flexDirection: "column" }}>
              {(activeGrid === "sfx" ? SFX_SHOWCASE : VO_SHOWCASE).map((item) => (
                <ShowcaseListRow
                  key={item.id}
                  item={item}
                  mode={activeGrid}
                  isPlaying={playingId === item.id}
                  onPlayToggle={(id) => setPlayingId((p) => (p === id ? null : id))}
                  onSelect={(p) => setPrompt((prev) => (prev.trim() ? prev.trim() + " " : "") + p)}
                />
              ))}
            </div>
          </div>
        )}

        {activeGrid === "aimg" && (
          <div className="home-style-grid-wrap">
            <div className="home-gen-text-header">
              <span className="image-style-title">Motion Graphics Templates</span>
              <span className="image-style-subtitle">Click a template to auto-fill a prompt</span>
            </div>
            <div className="home-aimg-grid">
              {homeAimgTemplates.map((tmpl, i) => (
                <button
                  key={tmpl.id}
                  type="button"
                  className={cn("aimg-template-card", selectedAimgTemplate === tmpl.id && "is-selected")}
                  style={{ animationDelay: `${i * 35}ms` }}
                  onClick={() => {
                    const isDeselecting = selectedAimgTemplate === tmpl.id;
                    setSelectedAimgTemplate(isDeselecting ? null : tmpl.id);
                    if (!isDeselecting) setPrompt(tmpl.prompt);
                  }}
                >
                  <div className="aimg-card-visual" style={{ background: `linear-gradient(${tmpl.gradient})` }}>
                    <span className="aimg-card-category">{tmpl.category}</span>
                  </div>
                  <span className="aimg-card-name">{tmpl.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!hasPromptText && (
          <div className="home-main-inner home-main-inner--projects">
            <div className="home-projects-section">
              <div className="home-projects-header">
                <div className="home-projects-tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "recent"}
                    className={cn("home-tab-button", activeTab === "recent" && "is-active")}
                    onClick={() => setActiveTab("recent")}
                  >
                    Recent projects
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "examples"}
                    className={cn("home-tab-button", activeTab === "examples" && "is-active")}
                    onClick={() => setActiveTab("examples")}
                  >
                    Examples
                  </button>
                </div>
                <button type="button" className="home-view-all">
                  View all <span aria-hidden="true">→</span>
                </button>
              </div>

              <div className="home-projects-list">
                {activeTab === "recent"
                  ? recentProjectsMain.map((project) => (
                      <Link key={project.id} href="/editor" className="home-project-card">
                        <div
                          className="home-project-thumb"
                          style={{ background: project.color }}
                        />
                        <div className="home-project-info">
                          <strong>{project.title}</strong>
                          <span>{project.time}</span>
                        </div>
                      </Link>
                    ))
                  : (
                    <p className="home-empty-state">No examples available yet.</p>
                  )}
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
