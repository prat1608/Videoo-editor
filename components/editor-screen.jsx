"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  Captions,
  CircleAlert,
  CircleDot,
  Clock,
  Crop,
  CloudCheck,
  CloudUpload,
  FileText,
  Film,
  Gauge,
  GitMerge,
  Hand,
  History,
  ImageUp,
  LayoutGrid,
  LoaderCircle,
  Mic,
  Minus,
  MousePointer2,
  Music4,
  Palette,
  Pipette,
  Plug,
  Plus,
  RectangleHorizontal,
  Redo2,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Scissors,
  Search,
  Shapes,
  SkipBack,
  SkipForward,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  Download,
  Upload,
  Volume2,
  VolumeX,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import logoMark from "@/assets/Logo.svg";
import { DEFAULT_PROJECT_ID, getProjectTitle } from "@/lib/projects";

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PromptBox } from "@/components/prompt-box";

const editorModels = [
  { id: "deepseek-v4-pro", label: "DeepSeek V4 Pro", tag: "Recommended", gradient: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)" },
  { id: "deepseek-v3", label: "DeepSeek V3", gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)" },
  { id: "gpt-4o", label: "GPT-4o", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
  { id: "claude-sonnet-4", label: "Claude Sonnet 4", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
  { id: "gemini-2-pro", label: "Gemini 2.0 Pro", gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" },
];

const editorSuggestions = [
  { key: "review", label: "Review this project", icon: FileText },
  { key: "captions", label: "Add animated captions", icon: Type },
  { key: "music", label: "Create background music", icon: Music4 },
  { key: "reframe", label: "Reframe for 9:16", icon: Crop },
];

const IMPORT_PLATFORMS = [
  { label: "YouTube", domains: ["youtube.com", "youtu.be"] },
  { label: "TikTok", domains: ["tiktok.com"] },
  { label: "Instagram", domains: ["instagram.com"] },
  { label: "Vimeo", domains: ["vimeo.com"] },
  { label: "Twitch", domains: ["twitch.tv"] },
  { label: "Loom", domains: ["loom.com"] },
  { label: "Streamable", domains: ["streamable.com"] },
  { label: "X / Twitter", domains: ["x.com", "twitter.com"] },
  { label: "Facebook", domains: ["facebook.com", "fb.watch"] },
];

const IMPORT_STEPS = [
  { key: "fetching", label: "Fetching media" },
  { key: "preparing", label: "Preparing video" },
  { key: "adding", label: "Adding to canvas" },
];

function detectImportPlatform(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    return IMPORT_PLATFORMS.find((item) =>
      item.domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))
    )?.label ?? "URL";
  } catch {
    return "URL";
  }
}

function shortenImportUrl(url) {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/$/, "");
    const displayPath = path && path !== "/" ? path : "";
    const text = `${parsed.hostname.replace(/^www\./, "")}${displayPath}`;
    return text.length > 34 ? `${text.slice(0, 31)}...` : text;
  } catch {
    return url.length > 34 ? `${url.slice(0, 31)}...` : url;
  }
}

const imageStyles = [
  { name: "Illustration",   file: "Illustration.png"  },
  { name: "Anime",          file: "Anime.png"          },
  { name: "3D Render",      file: "3D render.png"      },
  { name: "Comic Book",     file: "Comic book.png"     },
  { name: "Pixel Art",      file: "Pixel art.png"      },
  { name: "Watercolor",     file: "Water color.png"    },
  { name: "Oil Painting",   file: "Oil painting.png"   },
  { name: "Cinematic",      file: "Cinematic.png"      },
  { name: "Pencil Sketch",  file: "Pencil Sketch.png"  },
  { name: "Monochrome",     file: "Monochrome.png"     },
  { name: "Minecraft",      file: "Minecraft.png"      },
  { name: "Neon Noir",      file: "Neon Noir.png"      },
  { name: "Cyberpunk",      file: "Cyberpunk.png"      },
  { name: "Vintage Film",   file: "Vintage.png"        },
  { name: "Surreal",        file: "Surreal.png"        },
  { name: "Studio Ghibli",  file: "Studio Ghibli.png"  },
  { name: "Impressionist",  file: "Impressionist.png"  },
  { name: "Photorealistic", file: "Photorealistic.png" },
  { name: "Abstract",       file: "Abstract.png"       },
];

const videoClips = [
  { file: "Urban Timelapse.mp4", name: "Urban Timelapse", ratio: "16 / 9", prompt: "A cinematic urban timelapse of a busy city intersection at night, streaking car lights, glowing storefronts, time-lapse motion blur, 4K" },
  { file: "Ocean waves.mp4",     name: "Ocean Waves",     ratio: "16 / 9", prompt: "Slow-motion ocean waves crashing against jagged coastal rocks at golden hour, sea spray catching sunlight, cinematic wide shot" },
  { file: "Forest Trails.mp4",   name: "Forest Trail",    ratio: "16 / 9", prompt: "A peaceful walk along a misty forest trail at dawn, soft dappled light filtering through tall trees, gentle camera dolly forward" },
  { file: "Abstract.mp4",        name: "Abstract",        ratio: "1 / 1",  prompt: "Abstract macro footage of iridescent liquid bubbles and shifting colors, slow flowing movement, dreamlike bokeh atmosphere" },
  { file: "Lifestyle.mp4",       name: "Lifestyle",       ratio: "1 / 1",  prompt: "Bright lifestyle scene of a person enjoying a morning coffee at a sunlit café table, warm tones, shallow depth of field, candid feel" },
  { file: "Close up.mp4",        name: "Close Up",        ratio: "1 / 1",  prompt: "Extreme close-up of human eye reflecting a city skyline, dramatic lighting, cinematic color grade, ultra-sharp detail" },
  { file: "Street Style.mp4",    name: "Street Style",    ratio: "9 / 16", prompt: "Street style fashion video, slow-motion walk through a vibrant urban market, bold colors, dynamic handheld camera, editorial mood" },
  { file: "Portrait.mp4",        name: "Portrait",        ratio: "9 / 16", prompt: "Cinematic vertical portrait of a person in soft studio lighting, subtle wind effect on hair, smooth rack focus, elegant and minimal" },
  { file: "Vertical.mp4",        name: "Vertical",        ratio: "9 / 16", prompt: "Vertical cinematic clip of autumn forest with falling leaves, golden hour light shafts through trees, gentle slow-motion drift" },
];

const audioMoods = [
  { name: "Cinematic",  desc: "Epic orchestral" },
  { name: "Ambient",    desc: "Atmospheric beds" },
  { name: "Electronic", desc: "Modern synths" },
  { name: "Jazz",       desc: "Laid-back grooves" },
  { name: "Hip-Hop",    desc: "Punchy beats" },
  { name: "Acoustic",   desc: "Warm & organic" },
  { name: "Lo-Fi",      desc: "Chill vibes" },
  { name: "Corporate",  desc: "Clean & upbeat" },
];

const sfxCategories = [
  { name: "Nature",         desc: "Rain, wind, birds" },
  { name: "Foley",          desc: "Steps, cloth, props" },
  { name: "Impacts",        desc: "Hits & explosions" },
  { name: "UI / Interface", desc: "Clicks & alerts" },
  { name: "Transitions",    desc: "Whooshes & sweeps" },
  { name: "Ambience",       desc: "Room tone & spaces" },
];

const voiceProfiles = [
  { name: "Nova",    desc: "Warm, feminine" },
  { name: "Onyx",    desc: "Deep, masculine" },
  { name: "Alloy",   desc: "Neutral, clear" },
  { name: "Echo",    desc: "Smooth, conversational" },
  { name: "Fable",   desc: "British, articulate" },
  { name: "Shimmer", desc: "Bright, energetic" },
];

const recordSources = [
  { name: "Screen", desc: "Record a browser, app, or full display" },
  { name: "Camera", desc: "Capture camera footage for talking-head clips" },
  { name: "Audio", desc: "Record voiceover or microphone notes" },
  { name: "Screen + Camera", desc: "Capture a walkthrough with presenter overlay" },
];

const EDITOR_TOOL_SUGGESTION_CONFIG = {
  video:     { icon: Film,    label: "Generate Video",     slug: "generate-video" },
  image:     { icon: ImageUp, label: "Generate Image",     slug: "generate-image" },
  audio:     { icon: Music4,  label: "Generate Audio",     slug: "generate-audio" },
  sfx:       { icon: Volume2, label: "Generate SFX",       slug: "generate-sfx" },
  voiceover: { icon: Mic,     label: "Generate Voiceover", slug: "generate-voiceover" },
};

const TOOL_GRID_MAP = {
  "generate-video":     "video",
  "generate-image":     "image",
  "generate-music":     "audio",
  "generate-voiceover": "voiceover",
  "generate-sfx":       "sfx",
};

const toolsSections = [
  {
    id: "generation",
    title: "Generation Tools",
    tools: [
      { id: "generate-image", name: "Generate Image", desc: "Create from text prompt", icon: ImageUp },
      { id: "generate-video", name: "Generate Video", desc: "Text or image to video", icon: Film },
      { id: "generate-music", name: "Generate Music", desc: "AI background tracks", icon: Music4 },
      { id: "generate-voiceover", name: "Generate Voiceover", desc: "Natural AI narration", icon: Mic },
      { id: "generate-sfx", name: "Generate SFX", desc: "Sound effects on demand", icon: Volume2 },
    ],
  },
  {
    id: "skills",
    title: "Skills",
    tools: [
      { id: "autodemo", name: "Autodemo", desc: "Auto-generate product demos", icon: Zap },
      { id: "roughcuts", name: "Roughcuts", desc: "AI-assembled rough edit", icon: Scissors },
      { id: "clipping",  name: "Clipping",      desc: "Extract best moments", icon: Film },
      { id: "ytimport", name: "Import Video",   desc: "Import from YouTube, TikTok, Vimeo, and 1,800+ platforms", icon: Download },
    ],
  },
  {
    id: "basic",
    title: "Basic Tools",
    tools: [
      { id: "trim", name: "Trim", desc: "Cut clip in & out points", icon: Scissors },
      { id: "merge", name: "Merge", desc: "Join clips together", icon: GitMerge },
      { id: "speed", name: "Speed", desc: "Ramp or constant speed", icon: Gauge },
      { id: "reverse", name: "Reverse", desc: "Play footage backwards", icon: RotateCcw },
      { id: "rotate", name: "Rotate", desc: "Flip or rotate frame", icon: RotateCw },
      { id: "crop", name: "Crop", desc: "Trim frame edges", icon: Crop },
    ],
  },
];

const railTopItems = [
  { key: "tools", label: "Tools & Skills", icon: Plug },
  { key: "files", label: "Files", icon: FileText },
  { key: "media", label: "Media", icon: CloudUpload },
  { key: "audio", label: "Audio", icon: Music4 },
  { key: "text", label: "Text", icon: Type },
  { key: "captions", label: "Captions", icon: Captions },
  { key: "elements", label: "Elements", icon: Shapes },
  { key: "record", label: "Record", icon: CircleDot },
];

const railBottomItems = [
  { key: "aimg", label: "AIMG", icon: Sparkles },
];

const railItems = [...railTopItems, ...railBottomItems];

function PanelBottomGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="3" />
      <path d="M4.5 10.5h7" />
    </svg>
  );
}

function PanelRightGlyph({ open = false, className }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={cn("panel-glyph", open && "is-open", className)}>
      <rect x="2" y="2" width="12" height="12" rx="3" />
      <path className="panel-glyph-divider panel-glyph-divider-right" d="M10.5 4.5v7" />
    </svg>
  );
}

function PlayFilledGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}


function SendArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function AutoplayVideo({ src, className }) {
  const ref = useRef(null);
  const onMouseEnter = () => ref.current?.play().catch(() => {});
  const onMouseLeave = () => { if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; } };
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
    />
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTimelineLabel(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatTransportTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.00`;
}

function IconButton({
  icon: Icon,
  label,
  className,
  selected = false,
  filled = false,
  ghost = false,
  ...props
}) {
  const variant = ghost ? "ghost" : filled ? "default" : "secondary";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size="icon"
          className={cn(
            "icon-button",
            ghost && "icon-button-ghost",
            selected && "is-selected",
            filled && "is-filled",
            className
          )}
          {...props}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function PanelButton({ children, className, variant = "surface", ...props }) {
  return (
    <Button
      type="button"
      variant={variant}
      className={cn("justify-start text-left font-medium", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

function PublishButton() {
  return (
    <Button type="button" variant="ghost" className="publish-button">
      <span>Publish</span>
      <ChevronDown />
    </Button>
  );
}

function SyncStatus({ state = "saved" }) {
  const config = {
    saved: {
      icon: CloudCheck,
      label: "Changes saved",
      className: "is-saved",
    },
    syncing: {
      icon: LoaderCircle,
      label: "Syncing",
      className: "is-syncing",
    },
    uploading: {
      icon: CloudUpload,
      label: "Uploading",
      className: "is-uploading",
    },
  };

  const { icon: Icon, label, className } = config[state] ?? config.saved;

  return (
    <div className={cn("sync-status", className)} aria-label={label} title={label}>
      <Icon className={cn(state === "syncing" && "animate-spin")} />
    </div>
  );
}

function FilesPanel() {
  return (
    <>
      <section className="panel-section">
        <label className="field-label" htmlFor="fileSearch">
          Add files to get started
        </label>
        <div className="search-field">
          <Input id="fileSearch" placeholder="Search assets, clips or references" />
        </div>
      </section>

      <section className="panel-section">
        <p className="section-title">Size</p>
        <PanelButton className="select-card justify-between">
          <span>Original (16:9)</span>
          <ChevronDown />
        </PanelButton>
      </section>

      <section className="panel-section">
        <PanelButton className="feature-card">
          <span className="mini-icon">
            <WandSparkles />
          </span>
          <span>
            <strong>Auto Resize</strong>
            <small>Resize for social media</small>
          </span>
        </PanelButton>
      </section>

      <section className="panel-section">
        <p className="section-title">Version History</p>
        <PanelButton className="feature-card compact">
          <span className="mini-icon">
            <History />
          </span>
          <span>
            <strong>Restore to a previous version</strong>
          </span>
        </PanelButton>
      </section>

      <section className="panel-section">
        <p className="section-title">Background</p>
        <Tabs defaultValue="color">
          <TabsList className="grid h-auto w-full grid-cols-2 rounded-[14px] border border-[var(--border)] bg-[var(--theme-secondary)] p-1">
            <TabsTrigger value="color" className="rounded-[10px]">
              Color
            </TabsTrigger>
            <TabsTrigger value="image" className="rounded-[10px]">
              Image
            </TabsTrigger>
          </TabsList>
          <TabsContent value="color">
            <div className="color-row">
              <button className="swatch" aria-label="Current color"></button>
              <Input className="color-input" defaultValue="#000000" />
              <Button type="button" variant="secondary" size="icon" className="picker-button" aria-label="Open picker">
                <Pipette />
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="image">
            <PanelButton className="feature-card">
              <span className="mini-icon">
                <ImageUp />
              </span>
              <span>
                <strong>Choose background image</strong>
                <small>Use stills, gradients, or textures</small>
              </span>
            </PanelButton>
          </TabsContent>
        </Tabs>
      </section>

      <section className="panel-section">
        <p className="section-title">Frames Per Second</p>
        <PanelButton className="select-card justify-between">
          <span>30</span>
          <ChevronDown />
        </PanelButton>
      </section>
    </>
  );
}

function SimpleCardPanel({ title, cards }) {
  return (
    <section className="panel-section">
      <p className="section-title">{title}</p>
      <div className="stack-list">
        {cards.map((card) => (
          <PanelButton className="stack-item" key={card.title}>
            <span>
              <strong>{card.title}</strong>
              <small>{card.subtitle}</small>
            </span>
          </PanelButton>
        ))}
      </div>
    </section>
  );
}

const brandKitThemes = [
  { id: "broadside", name: "Broadside", description: "Industrial newsprint poster — raw cream on ink, Barlow display, fire-orange register", swatches: ["#E8501A", "#0D0D0D", "#F5F0E8", "#C73E10"] },
  { id: "midnight",  name: "Midnight",  description: "Deep indigo editorial — cool blue on near-black",                                      swatches: ["#1B3A6B", "#080D1A", "#E8F0FF", "#4A80D0"] },
  { id: "forest",    name: "Forest",    description: "Organic editorial — sage green on dark earth",                                         swatches: ["#2D5A3D", "#0D1A11", "#F0F7F2", "#7BC67A"] },
  { id: "ember",     name: "Ember",     description: "Smouldering burgundy — deep red on near-black",                                        swatches: ["#7C1D2A", "#140508", "#FFF0F0", "#C0394A"] },
  { id: "arctic",    name: "Arctic",    description: "Icy minimalism — pale steel on deep slate",                                            swatches: ["#B8D4E8", "#0A1520", "#E8F4FF", "#5A9EC8"] },
  { id: "noir",      name: "Noir",      description: "Pure contrast — stark white on absolute black",                                        swatches: ["#F5F5F5", "#080808", "#CCCCCC", "#444444"] },
];

const brandKitFonts = [
  { id: "barlow",     name: "Barlow",     label: "Barlow 900 · IBM Plex Mono" },
  { id: "playfair",   name: "Editorial",  label: "Playfair Display · Inter" },
  { id: "space",      name: "Space",      label: "Space Grotesk · Space Mono" },
  { id: "oswald",     name: "Oswald",     label: "Oswald 700 · Roboto Mono" },
  { id: "bebas",      name: "Bebas",      label: "Bebas Neue · Source Code Pro" },
  { id: "montserrat", name: "Montserrat", label: "Montserrat 900 · Fira Code" },
];

function parseColor(raw) {
  const s = raw.trim();
  if (/^#([0-9a-fA-F]{3}){1,2}$/.test(s)) return s;
  if (/^rgba?\(/.test(s)) return s;
  return null;
}

function rgbaToHex(rgba) {
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return "#000000";
  return "#" + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, "0")).join("");
}

function colorToHex(c) {
  if (!c) return "#000000";
  if (c.startsWith("#")) return c;
  return rgbaToHex(c);
}

function AddThemeModal({ open, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [colors, setColors] = useState([
    { id: 1, hex: "#E8501A", text: "#E8501A" },
    { id: 2, hex: "#0D0D0D", text: "#0D0D0D" },
    { id: 3, hex: "#F5F0E8", text: "#F5F0E8" },
    { id: 4, hex: "#C73E10", text: "#C73E10" },
  ]);
  const [nextId, setNextId] = useState(5);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setColors([
        { id: 1, hex: "#E8501A", text: "#E8501A" },
        { id: 2, hex: "#0D0D0D", text: "#0D0D0D" },
        { id: 3, hex: "#F5F0E8", text: "#F5F0E8" },
        { id: 4, hex: "#C73E10", text: "#C73E10" },
      ]);
      setNextId(5);
      setNameError("");
    }
  }, [open]);

  if (!open) return null;

  function updateColorHex(id, hex) {
    setColors(prev => prev.map(c => c.id === id ? { ...c, hex, text: hex } : c));
  }

  function updateColorText(id, text) {
    setColors(prev => prev.map(c => {
      if (c.id !== id) return c;
      const parsed = parseColor(text);
      return { ...c, text, hex: parsed ? colorToHex(parsed) : c.hex };
    }));
  }

  function addColor() {
    if (colors.length >= 8) return;
    setColors(prev => [...prev, { id: nextId, hex: "#888888", text: "#888888" }]);
    setNextId(n => n + 1);
  }

  function removeColor(id) {
    if (colors.length <= 1) return;
    setColors(prev => prev.filter(c => c.id !== id));
  }

  function handleAdd() {
    if (!name.trim()) { setNameError("Theme name is required"); return; }
    setNameError("");
    onAdd({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: "Custom theme",
      swatches: colors.map(c => c.hex),
      custom: true,
    });
    onClose();
  }

  return createPortal(
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#141414", borderRadius: 16, width: 420,
          boxShadow: "0 30px 80px rgba(0,0,0,0.8)", border: "1px solid #242424",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: "1px solid #1e1e1e" }}>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>New Theme</span>
          <button
            type="button" onClick={onClose}
            style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 7, padding: 6, cursor: "pointer", color: "#666", display: "flex", lineHeight: 0 }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Name field */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ color: "#888", fontSize: 11.5, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Theme Name</label>
            <input
              type="text"
              placeholder="e.g. Ocean, Sunset, Corporate…"
              value={name}
              onChange={e => { setName(e.target.value); setNameError(""); }}
              style={{
                background: "#1a1a1a", border: `1px solid ${nameError ? "#e05252" : "#2e2e30"}`,
                borderRadius: 8, padding: "9px 12px", color: "#fff", fontSize: 13,
                outline: "none", width: "100%", boxSizing: "border-box",
              }}
            />
            {nameError && <span style={{ color: "#e05252", fontSize: 11.5 }}>{nameError}</span>}
          </div>

          {/* Colors */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ color: "#888", fontSize: 11.5, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Colors</label>
              <span style={{ color: "#555", fontSize: 11 }}>{colors.length}/8</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 240, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#2a2a2a transparent" }}>
              {colors.map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Native color picker */}
                  <div style={{ position: "relative", width: 32, height: 32, borderRadius: 8, overflow: "hidden", border: "1px solid #2e2e30", flexShrink: 0 }}>
                    <div style={{ width: "100%", height: "100%", background: c.hex }} />
                    <input
                      type="color"
                      value={c.hex}
                      onChange={e => updateColorHex(c.id, e.target.value)}
                      style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer", padding: 0, border: "none" }}
                    />
                  </div>
                  {/* Text input */}
                  <input
                    type="text"
                    value={c.text}
                    onChange={e => updateColorText(c.id, e.target.value)}
                    placeholder="#hex or rgba(…)"
                    style={{
                      flex: 1, background: "#1a1a1a", border: "1px solid #2e2e30",
                      borderRadius: 8, padding: "7px 10px", color: "#d0d0d0",
                      fontSize: 12, fontFamily: "monospace", outline: "none",
                    }}
                  />
                  {/* Remove */}
                  <button
                    type="button" onClick={() => removeColor(c.id)}
                    disabled={colors.length <= 1}
                    style={{
                      background: "none", border: "none", cursor: colors.length <= 1 ? "not-allowed" : "pointer",
                      color: colors.length <= 1 ? "#333" : "#555", padding: 4, borderRadius: 6, lineHeight: 0,
                      flexShrink: 0,
                    }}
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>

            {colors.length < 8 && (
              <button
                type="button" onClick={addColor}
                style={{
                  display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "7px 10px",
                  background: "none", border: "1px dashed #2e2e30", borderRadius: 8,
                  color: "#666", fontSize: 12, cursor: "pointer", marginTop: 2,
                }}
              >
                <Plus size={13} /> Add Color
              </button>
            )}
          </div>

          {/* Preview swatches */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {colors.map(c => (
              <div key={c.id} style={{ width: 22, height: 22, borderRadius: 7, background: c.hex, border: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }} />
            ))}
            {name.trim() && (
              <span style={{ marginLeft: 6, color: "#ccc", fontSize: 12, fontWeight: 500 }}>{name.trim()}</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 8, padding: "14px 20px 18px", justifyContent: "flex-end", borderTop: "1px solid #1e1e1e" }}>
          <button
            type="button" onClick={onClose}
            style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #2e2e30", background: "transparent", color: "#888", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="button" onClick={handleAdd}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#d6d6d6", color: "#3a3a3a", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Add to Presets
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function BrandKitPanel() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(brandKitThemes[0]);
  const [selectedFont, setSelectedFont] = useState(brandKitFonts[0]);
  const [addThemeOpen, setAddThemeOpen] = useState(false);
  const [customThemes, setCustomThemes] = useState([]);

  const brandVideos = [
    { id: 1, src: "/video-styles/Ocean waves.mp4", duration: "00:13" },
    { id: 2, src: "/video-styles/Portrait.mp4", duration: "06:37" },
  ];

  return (
    <>
      {/* Design system header */}
      <section className="panel-section bk-theme-header-section">
        <h2 className="bk-theme-name">Design System</h2>
        <p className="bk-theme-desc">Define your brand's visual foundation — colors, typography, and style across all content.</p>
      </section>

      {/* Palette accordion */}
      <section className="panel-section">
        <div className="bk-accordion">
          <button type="button" className="bk-accordion-header" onClick={() => setPaletteOpen((v) => !v)}>
            <span>Palette</span>
            <ChevronDown size={13} className={cn("bk-chevron", paletteOpen && "is-open")} />
          </button>
          {paletteOpen && (
            <div className="bk-accordion-body">
              {brandKitThemes.map((t) => (
                <div
                  key={t.id}
                  className={cn("bk-accordion-item", selectedTheme.id === t.id && "is-selected")}
                  onClick={() => setSelectedTheme(t)}
                >
                  <div className="bk-swatches">
                    {t.swatches.map((c, i) => (
                      <span key={i} className="bk-swatch" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="bk-item-name">{t.name}</span>
                </div>
              ))}
              {customThemes.map((t) => (
                <div
                  key={t.id}
                  className={cn("bk-accordion-item", selectedTheme.id === t.id && "is-selected")}
                  onClick={() => setSelectedTheme(t)}
                >
                  <div className="bk-swatches">
                    {t.swatches.slice(0, 4).map((c, i) => (
                      <span key={i} className="bk-swatch" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="bk-item-name">{t.name}</span>
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#888", background: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: 4, padding: "2px 5px", flexShrink: 0 }}>Custom</span>
                </div>
              ))}
              <div className="bk-accordion-divider" />
              <button type="button" className="bk-add-item" onClick={() => setAddThemeOpen(true)}>
                <Plus size={14} />
                <span>Add Theme</span>
              </button>
            </div>
          )}
          <AddThemeModal
            open={addThemeOpen}
            onClose={() => setAddThemeOpen(false)}
            onAdd={(theme) => {
              setCustomThemes(prev => [...prev, theme]);
              setSelectedTheme(theme);
            }}
          />
        </div>
      </section>

      {/* Typography accordion */}
      <section className="panel-section">
        <div className="bk-accordion">
          <button type="button" className="bk-accordion-header" onClick={() => setTypographyOpen((v) => !v)}>
            <span>Typography</span>
            <ChevronDown size={13} className={cn("bk-chevron", typographyOpen && "is-open")} />
          </button>
          {typographyOpen && (
            <div className="bk-accordion-body">
              {brandKitFonts.map((f) => (
                <div
                  key={f.id}
                  className={cn("bk-accordion-item bk-font-item", selectedFont.id === f.id && "is-selected")}
                  onClick={() => setSelectedFont(f)}
                >
                  <div className="bk-font-item-text">
                    <span className="bk-item-name">{f.name}</span>
                    <span className="bk-item-sub">{f.label}</span>
                  </div>
                </div>
              ))}
              <div className="bk-accordion-divider" />
              <button type="button" className="bk-add-item">
                <Plus size={14} />
                <span>Add Font</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="bk-divider" />

      <section className="panel-section">
        <div className="media-section-header">
          <span className="media-section-title">Videos</span>
          <button type="button" className="media-show-all">
            Show all <ChevronRight size={14} />
          </button>
        </div>
        <div className="media-video-grid">
          <div className="media-video-card media-add-card">
            <Film size={20} className="media-add-icon" />
            <span className="media-add-label">Add Video</span>
          </div>
          {brandVideos.map((video) => (
            <div key={video.id} className="media-video-card">
              <AutoplayVideo src={video.src} className="media-video-thumb" />
              <span className="media-video-duration">{video.duration}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel-section">
        <div className="media-section-header">
          <span className="media-section-title">Images</span>
        </div>
        <div className="media-video-grid">
          <div className="media-video-card media-add-card">
            <ImageUp size={20} className="media-add-icon" />
            <span className="media-add-label">Add Image</span>
          </div>
        </div>
      </section>

      <section className="panel-section">
        <div className="media-section-header">
          <span className="media-section-title">Audio</span>
        </div>
        <div className="media-add-card media-audio-add-card">
          <Mic size={20} className="media-add-icon" />
          <span className="media-add-label">Add Audio</span>
        </div>
      </section>
    </>
  );
}

function MediaPanel({ onOpenBrandKit }) {
  const [activeTab, setActiveTab] = useState("video");

  const stockVideos = [
    { id: 1, duration: "01:04" },
    { id: 2, src: "/video-styles/Ocean waves.mp4", duration: "00:17" },
    { id: 3, duration: "00:09" },
    { id: 4, src: "/video-styles/Abstract.mp4", duration: "00:14" },
  ];

  const generatedVideos = [
    { id: 1, duration: "00:00" },
    { id: 2, src: "/video-styles/Lifestyle.mp4", duration: "00:05" },
  ];

  return (
    <>
      <section className="panel-section">
        <div className="media-tabs">
          <button
            type="button"
            className={cn("media-tab", activeTab === "video" && "is-active")}
            onClick={() => setActiveTab("video")}
          >
            Video
          </button>
          <button
            type="button"
            className={cn("media-tab", activeTab === "image" && "is-active")}
            onClick={() => setActiveTab("image")}
          >
            Image
          </button>
        </div>
      </section>

      <section className="panel-section">
        <Button type="button" variant="secondary" className="media-action-btn" onClick={onOpenBrandKit}>
          <Palette size={16} />
          <span>Brand Kit</span>
        </Button>
      </section>

      <section className="panel-section">
        <Button type="button" variant="secondary" className="media-action-btn">
          <Sparkles size={16} />
          <span>Generate Video</span>
        </Button>
      </section>

      <section className="panel-section">
        <div className="media-section-header">
          <span className="media-section-title">Stock Video</span>
          <button type="button" className="media-show-all">
            Show all <ChevronRight size={14} />
          </button>
        </div>
        <div className="media-video-grid">
          {stockVideos.map((video) => (
            <div key={video.id} className="media-video-card">
              {video.src && <AutoplayVideo src={video.src} className="media-video-thumb" />}
              <span className="media-video-duration">{video.duration}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel-section">
        <div className="media-section-header">
          <span className="media-section-title">Generated Video</span>
          <div className="media-section-actions">
            <button type="button" className="media-icon-btn" aria-label="Refresh">
              <RefreshCw size={14} />
            </button>
            <button type="button" className="media-show-all">
              Show all <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="media-video-grid">
          {generatedVideos.map((video) => (
            <div key={video.id} className="media-video-card">
              {video.src && <AutoplayVideo src={video.src} className="media-video-thumb" />}
              <span className="media-video-duration">{video.duration}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function PanelContent({ panel, selectedTools, onToggle, brandKitOpen, onOpenBrandKit }) {
  switch (panel) {
    case "aimg":
      return (
        <SimpleCardPanel
          title="AIMG"
          cards={[
            { title: "Generate Image", subtitle: "Create visuals from a prompt" },
            { title: "Image Style", subtitle: "Pick a look for generated media" },
            { title: "Enhance Prompt", subtitle: "Refine image direction" },
          ]}
        />
      );
    case "media":
      return brandKitOpen ? <BrandKitPanel /> : <MediaPanel onOpenBrandKit={onOpenBrandKit} />;
    case "audio":
      return (
        <SimpleCardPanel
          title="Tracks"
          cards={[
            { title: "Ambient Pulse", subtitle: "Looped bed" },
            { title: "Voice Over", subtitle: "Ready to record" },
          ]}
        />
      );
    case "text":
      return (
        <SimpleCardPanel
          title="Text styles"
          cards={[
            { title: "Hero Title", subtitle: "Bold headline for openers" },
            { title: "Caption", subtitle: "Clean lower-third" },
          ]}
        />
      );
    case "captions":
      return (
        <SimpleCardPanel
          title="Captions"
          cards={[
            { title: "Auto Captions", subtitle: "Generate timed subtitles" },
            { title: "Lower Third", subtitle: "Name and title preset" },
            { title: "Kinetic Captions", subtitle: "Animated word highlights" },
          ]}
        />
      );
    case "elements":
      return (
        <section className="panel-section two-up">
          {[
            ["Arrow", "Shape"],
            ["Glow", "Effect"],
            ["Card", "Layout"],
            ["Callout", "Sticker"],
          ].map(([title, subtitle]) => (
            <PanelButton className="preset-card" key={title}>
              <span>
                <strong>{title}</strong>
                <small>{subtitle}</small>
              </span>
            </PanelButton>
          ))}
        </section>
      );
    case "record":
      return (
        <SimpleCardPanel
          title="Record"
          cards={recordSources.map((source) => ({ title: source.name, subtitle: source.desc }))}
        />
      );
    case "tools":
      return <ToolsPanel selectedTools={selectedTools} onToggle={onToggle} />;
    case "settings":
      return (
        <SimpleCardPanel
          title="Project"
          cards={[
            { title: "Autosave", subtitle: "Every 30 seconds" },
            { title: "Canvas Dots", subtitle: "Visible" },
          ]}
        />
      );
    case "files":
    default:
      return <FilesPanel />;
  }
}

function ToolsPanel({ selectedTools, onToggle }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const toolsAndSkills = toolsSections.flatMap((section) =>
    section.tools.map((tool) => ({ ...tool, sectionId: section.id, sectionTitle: section.title }))
  );
  const visibleTools = toolsAndSkills.filter((tool) => {
    const matchesCategory =
      activeCategory === "All" ||
      (activeCategory === "Generation" && tool.sectionId === "generation") ||
      (activeCategory === "Skills" && tool.sectionId === "skills") ||
      (activeCategory === "Basic" && tool.sectionId === "basic");
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.desc.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="ts-panel">
      <section className="panel-section ts-featured-section">
        <h3 className="ts-featured-title">Tools &amp; Skills</h3>
        <div className="ts-control-surface">
          <div className="ts-search-field">
            <Search className="ts-search-icon" />
            <Input
              className="ts-search-input"
              placeholder="Search tools and skills"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ts-search-clear"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X />
              </Button>
            )}
          </div>

          <div className="ts-filter-chips" aria-label="Tool categories">
            {["All", "Generation", "Skills", "Basic"].map((cat) => (
              <button
                key={cat}
                type="button"
                className={cn("ts-filter-chip", activeCategory === cat && "is-active")}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="ts-featured-list">
          {visibleTools.map((tool) => {
            const selected = selectedTools?.some((t) => t.id === tool.id);
            const actionLabel = tool.sectionId === "skills" ? "Use skill" : "Use tool";

            return (
              <div className="ts-featured-row" key={tool.id}>
                <button
                  type="button"
                  className="ts-featured-main"
                  onClick={() => onToggle?.(tool)}
                  aria-label={`${selected ? "Remove" : "Use"} ${tool.name}`}
                >
                  <span className="ts-featured-copy">
                    <span className="ts-featured-name">{tool.name}</span>
                    <span className="ts-featured-desc">{tool.desc}</span>
                  </span>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  className={cn("ts-featured-action", selected && "is-selected")}
                  onClick={() => onToggle?.(tool)}
                >
                  {selected ? <CheckCircle2 /> : <span>{actionLabel}</span>}
                </Button>
              </div>
            );
          })}
        </div>

        {visibleTools.length === 0 && (
          <Card className="ts-empty">
            <Search />
            <p>No tools or skills found</p>
          </Card>
        )}
      </section>
    </div>
  );
}

export default function EditorScreen() {
  const onlineCollaborators = [
    { id: "pratiksha", initials: "P", label: "Pratiksha (You)" },
    { id: "am", initials: "AM", label: "Aman" },
    { id: "rk", initials: "RK", label: "Riya" },
  ];
  const [activePanel, setActivePanel] = useState("files");
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [mediaBrandKitOpen, setMediaBrandKitOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [chatPanelWidth, setChatPanelWidth] = useState(560);
  const [timelineOpen, setTimelineOpen] = useState(true);
  const [timelineHeight, setTimelineHeight] = useState(168);
  const [syncState] = useState("saved");
  const [interactionMode, setInteractionMode] = useState("hand");
  const [canvasZoom, setCanvasZoom] = useState(70);
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);
  const [timelineScale, setTimelineScale] = useState(100);
  const [timelineRulerWidth, setTimelineRulerWidth] = useState(0);
  const [playhead, setPlayhead] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [chatThreads, setChatThreads] = useState([{ id: "chat-1", title: "New chat", draft: "" }]);
  const [activeChatId, setActiveChatId] = useState("chat-1");
  const [chatModelOpen, setChatModelOpen] = useState(false);
  const [chatSelectedModel, setChatSelectedModel] = useState(editorModels[0]);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [selectedImageStyle, setSelectedImageStyle] = useState(null);
  const [imageStylesExpanded, setImageStylesExpanded] = useState(false);
  const [videoStartImage, setVideoStartImage] = useState(null);
  const [videoEndImage, setVideoEndImage] = useState(null);
  const searchParams = useSearchParams();
  const currentProjectId = searchParams.get("projectId") || DEFAULT_PROJECT_ID;
  const currentProjectTitle = getProjectTitle(currentProjectId);
  const [activeGrid, setActiveGrid] = useState(null);
  const [selectedTools, setSelectedTools] = useState([]);
  const [importJob, setImportJob] = useState(null);
  const processedImportUrlRef = useRef(null);

  useEffect(() => {
    const tool = searchParams.get("tool");
    if (tool) setActiveGrid(tool);
    const importUrl = searchParams.get("importUrl");
    if (importUrl && processedImportUrlRef.current !== importUrl) {
      processedImportUrlRef.current = importUrl;
      startImportFromUrl(importUrl);
    }
  }, [searchParams]);
  const [videoSettings, setVideoSettings] = useState({
    model: "Veo 3.1 Lite",
    ratio: "16:9",
    resolution: "1080p",
    duration: "15s",
    audio: false,
  });
  const [imageSettings, setImageSettings] = useState({
    model: "Imagen 4",
    ratio: "1:1",
    resolution: "1024px",
    quality: "Standard",
  });
  const [audioSettings, setAudioSettings] = useState({ model: "Suno v4", mood: "Cinematic", duration: "30s", quality: "HD" });
  const [sfxSettings, setSfxSettings] = useState({ model: "ElevenLabs SFX", duration: "3s" });
  const [voiceoverSettings, setVoiceoverSettings] = useState({ model: "ElevenLabs", voice: "Nova", speed: "1x", language: "English" });
  const [selectedAudioMood, setSelectedAudioMood] = useState(null);
  const [selectedSfxCategory, setSelectedSfxCategory] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedRecordSource, setSelectedRecordSource] = useState("Screen");
  const [promptSuggestion, setPromptSuggestion] = useState(null);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const [videoTemplatesExpanded, setVideoTemplatesExpanded] = useState(false);
  const [imageErrorVisible, setImageErrorVisible] = useState(false);

  const videoModels = ["Veo 3.1 Lite", "Veo 3.0", "Kling 1.6 Pro", "Wan 2.1", "Hailuo"];
  const ratioOptions = ["16:9", "1:1", "9:16"];
  const resolutionOptions = ["480p", "720p", "1080p", "4K"];
  const durationOptions = ["5s", "8s", "10s", "15s", "20s", "30s"];

  const imageModels = ["Imagen 4", "Flux 1.1 Pro", "DALL·E 3", "Stable Diffusion 3.5"];
  const imageRatioOptions = ["1:1", "4:3", "3:4", "16:9", "9:16"];
  const imageResolutionOptions = ["512px", "768px", "1024px", "2048px"];
  const imageQualityOptions = ["Standard", "HD"];

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

  function setVideoSetting(key, value) { setVideoSettings((s) => ({ ...s, [key]: value })); }
  function setImageSetting(key, value) { setImageSettings((s) => ({ ...s, [key]: value })); }
  function setAudioSetting(key, value) { setAudioSettings((s) => ({ ...s, [key]: value })); }
  function setSfxSetting(key, value) { setSfxSettings((s) => ({ ...s, [key]: value })); }
  function setVoiceoverSetting(key, value) { setVoiceoverSettings((s) => ({ ...s, [key]: value })); }

  const timelineRulerRef = useRef(null);
  const workspaceBodyRef = useRef(null);
  const canvasStageRef = useRef(null);
  const canvasArtboardRef = useRef(null);
  const chatPromptRef = useRef(null);
  const chatCardRef = useRef(null);
  const chatModelRef = useRef(null);
  const nextChatIdRef = useRef(2);
  const focusChatComposerRef = useRef(false);
  const playheadDragRef = useRef({
    pointerId: null,
  });
  const panSessionRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });
  const chatResizeSessionRef = useRef({
    pointerId: null,
    startX: 0,
    startWidth: 660,
  });
  const timelineResizeSessionRef = useRef({
    pointerId: null,
    startY: 0,
    startHeight: 196,
  });

  const isLeftPanelVisible = leftPanelOpen && Boolean(activePanel);
  const compactTopbar = rightPanelOpen;
  const denseTopbar = compactTopbar && isLeftPanelVisible;
  const allSectionsVisible = isLeftPanelVisible && rightPanelOpen;
  const TimelinePanelIcon = PanelBottomGlyph;
  const activeChat = chatThreads.find((thread) => thread.id === activeChatId) ?? chatThreads[0] ?? null;
  const chatDraft = activeChat?.draft ?? "";
  const showVideoGrid     = activeGrid === "video";
  const showImageGrid     = activeGrid === "image";
  const showAudioGrid     = activeGrid === "audio";
  const showSfxGrid       = activeGrid === "sfx";
  const showVoiceoverGrid = activeGrid === "voiceover";
  const showRecordGrid    = activeGrid === "record";

  useLayoutEffect(() => {
    if (!chatDraft) {
      setPromptSuggestion(null);
      setSuggestionDismissed(false);
      return;
    }
    const videoMatch     = /\bvideo\b|\b(generate|create|make)\s+(?:a\s+)?video\b|\banimate\b|\bcreate\s+(?:a\s+)?clip\b|\/generate-video\b/i.test(chatDraft);
    const imageMatch     = /\bimage\b|\b(generate|create|make)\s+(?:an?\s+)?image\b|\bdraw\b|\billustrate\b|\brender\b|\b(photo|picture)\s+of\b|\/generate-image\b/i.test(chatDraft);
    const voiceoverMatch = /\b(generate|create|make|add)\s+(?:a\s+)?(?:voiceover|voice\s+over|narration)\b|\bnarrate\b|\bnarration\b|\btext\s+to\s+speech\b|\bvoiceover\b|\bvoice\s+over\b|\/generate-voiceover\b/i.test(chatDraft);
    const audioMatch     = /\b(generate|create|make|add)\s+(?:an?\s+)?(?:background\s+)?(?:audio|music|soundtrack)\b|\bmusic\b|\bsoundtrack\b|\bbackground\s+music\b|\/generate-audio\b/i.test(chatDraft);
    const sfxMatch       = /\b(generate|create|make|add)\s+(?:sound\s+effects?|sfx)\b|\bsound\s+effects?\b|\bsfx\b|\/generate-sfx\b/i.test(chatDraft);
    const detected = videoMatch ? "video" : imageMatch ? "image" : voiceoverMatch ? "voiceover" : audioMatch ? "audio" : sfxMatch ? "sfx" : null;
    setPromptSuggestion((prev) => {
      if (detected !== prev) { setSuggestionDismissed(false); return detected; }
      return prev;
    });
  }, [chatDraft]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setVideoTemplatesExpanded(false);
  }, [activeGrid]);

  useEffect(() => {
    if (activeGrid !== "video" || !["Luma Dream Machine"].includes(videoSettings.model)) {
      setImageErrorVisible(false);
      return;
    }
    const card = chatCardRef.current;
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

  function acceptEditorSuggestion() {
    setActiveGrid(promptSuggestion);
    setSuggestionDismissed(true);
    if (chatPromptRef.current) chatPromptRef.current.textContent = "";
    setChatThreads((cur) => cur.map((t) => t.id === activeChatId ? { ...t, draft: "" } : t));
  }

  function startImportFromUrl(url) {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    setRightPanelOpen(true);
    setTimelineOpen(true);
    setActiveGrid("ytimport");
    setImportJob({
      id: `import-${Date.now()}`,
      url: trimmedUrl,
      platform: detectImportPlatform(trimmedUrl),
      displayUrl: shortenImportUrl(trimmedUrl),
      status: "fetching",
    });
  }

  function retryImportJob() {
    if (!importJob?.url) return;
    startImportFromUrl(importJob.url);
  }

  function removeImportJob() {
    setImportJob(null);
    if (activeGrid === "ytimport") setActiveGrid(null);
  }

  useEffect(() => {
    if (!importJob || importJob.status === "complete" || importJob.status === "error") return;

    const timers = [
      setTimeout(() => setImportJob((job) => job?.id === importJob.id ? { ...job, status: "preparing" } : job), 900),
      setTimeout(() => setImportJob((job) => job?.id === importJob.id ? { ...job, status: "adding" } : job), 1900),
      setTimeout(() => {
        setImportJob((job) => {
          if (job?.id !== importJob.id) return job;
          if (job.url.includes("simulate-error")) return { ...job, status: "error" };
          return { ...job, status: "complete" };
        });
      }, 3100),
    ];

    return () => timers.forEach(clearTimeout);
  }, [importJob?.id]);
  const visibleCollaborators = onlineCollaborators.slice(0, 3);
  const extraCollaboratorCount = Math.max(0, onlineCollaborators.length - visibleCollaborators.length);

  const timelineStepSeconds = useMemo(() => {
    if (timelineScale <= 80) return 6;
    if (timelineScale >= 135) return 2;
    return 3;
  }, [timelineScale]);

  const timelineTickWidth = useMemo(() => clamp(160 * (timelineScale / 100), 104, 216), [timelineScale]);

  const timelineTicks = useMemo(() => {
    const visibleWidth = timelineRulerWidth || 960;
    const tickCount = Math.max(12, Math.ceil(visibleWidth / timelineTickWidth) + 6);

    return Array.from({ length: tickCount }, (_, index) => ({
      label: formatTimelineLabel((index + 1) * timelineStepSeconds),
      width: timelineTickWidth,
    }));
  }, [timelineRulerWidth, timelineStepSeconds, timelineTickWidth]);

  useEffect(() => {
    function syncPlayhead() {
      const width = timelineRulerRef.current?.getBoundingClientRect().width ?? 0;
      if (!width) return;
      setTimelineRulerWidth(width);
      setPlayhead((current) => clamp(current, 0, Math.max(0, width - 2)));
    }

    syncPlayhead();
    window.addEventListener("resize", syncPlayhead);
    return () => window.removeEventListener("resize", syncPlayhead);
  }, [timelineOpen, timelineScale]);

  useEffect(() => {
    if (!chatPromptRef.current) return;
    chatPromptRef.current.textContent = activeChat?.draft ?? "";

    if (focusChatComposerRef.current) {
      chatPromptRef.current.focus();
      focusChatComposerRef.current = false;
    }
  }, [activeChatId]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (chatModelRef.current && !chatModelRef.current.contains(e.target)) {
        setChatModelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function togglePanel(nextPanel) {
    if (activePanel === nextPanel) {
      setLeftPanelOpen((current) => !current);
      return;
    }

    setActivePanel(nextPanel);
    setLeftPanelOpen(true);
  }

  useEffect(() => {
    function handleChatResizeMove(event) {
      const session = chatResizeSessionRef.current;
      if (session.pointerId === null) return;

      const workspaceWidth = workspaceBodyRef.current?.getBoundingClientRect().width ?? 0;
      const maxWidth = workspaceWidth ? Math.max(360, workspaceWidth - 320) : 620;
      const nextWidth = clamp(session.startWidth + (session.startX - event.clientX), 360, maxWidth);
      setChatPanelWidth(nextWidth);
    }

    function handleChatResizeEnd() {
      chatResizeSessionRef.current.pointerId = null;
    }

    window.addEventListener("pointermove", handleChatResizeMove);
    window.addEventListener("pointerup", handleChatResizeEnd);
    window.addEventListener("pointercancel", handleChatResizeEnd);

    return () => {
      window.removeEventListener("pointermove", handleChatResizeMove);
      window.removeEventListener("pointerup", handleChatResizeEnd);
      window.removeEventListener("pointercancel", handleChatResizeEnd);
    };
  }, []);

  useEffect(() => {
    function handleTimelineResizeMove(event) {
      const session = timelineResizeSessionRef.current;
      if (session.pointerId === null) return;

      const nextHeight = clamp(session.startHeight + (session.startY - event.clientY), 140, 360);
      setTimelineHeight(nextHeight);
    }

    function handleTimelineResizeEnd() {
      timelineResizeSessionRef.current.pointerId = null;
    }

    window.addEventListener("pointermove", handleTimelineResizeMove);
    window.addEventListener("pointerup", handleTimelineResizeEnd);
    window.addEventListener("pointercancel", handleTimelineResizeEnd);

    return () => {
      window.removeEventListener("pointermove", handleTimelineResizeMove);
      window.removeEventListener("pointerup", handleTimelineResizeEnd);
      window.removeEventListener("pointercancel", handleTimelineResizeEnd);
    };
  }, []);

  useEffect(() => {
    function handlePlayheadDragMove(event) {
      if (playheadDragRef.current.pointerId !== event.pointerId) return;
      updatePlayhead(event.clientX);
    }

    function handlePlayheadDragEnd(event) {
      if (playheadDragRef.current.pointerId !== event.pointerId) return;
      playheadDragRef.current.pointerId = null;
    }

    window.addEventListener("pointermove", handlePlayheadDragMove);
    window.addEventListener("pointerup", handlePlayheadDragEnd);
    window.addEventListener("pointercancel", handlePlayheadDragEnd);

    return () => {
      window.removeEventListener("pointermove", handlePlayheadDragMove);
      window.removeEventListener("pointerup", handlePlayheadDragEnd);
      window.removeEventListener("pointercancel", handlePlayheadDragEnd);
    };
  }, []);

  function handleChatResizeStart(event) {
    if (event.button !== 0) return;
    chatResizeSessionRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth: chatPanelWidth,
    };
    event.preventDefault();
  }

  function handleTimelineResizeStart(event) {
    if (event.button !== 0) return;
    timelineResizeSessionRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight: timelineHeight,
    };
    event.preventDefault();
  }

  function handleCanvasPointerDown(event) {
    if (event.button !== 0) return;
    if (interactionMode !== "hand") return;

    panSessionRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      initialX: pan.x,
      initialY: pan.y,
    };

    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleCanvasPointerMove(event) {
    if (panSessionRef.current.pointerId !== event.pointerId) return;

    setPan({
      x: panSessionRef.current.initialX + (event.clientX - panSessionRef.current.startX),
      y: panSessionRef.current.initialY + (event.clientY - panSessionRef.current.startY),
    });
  }

  function finishCanvasPan(event) {
    if (panSessionRef.current.pointerId !== event.pointerId) return;

    panSessionRef.current.pointerId = null;
    setIsDragging(false);
  }

  function handleCanvasWheel(event) {
    if (!event.ctrlKey && !event.metaKey) return;

    event.preventDefault();
    setCanvasZoom((current) => clamp(current - Math.sign(event.deltaY) * 4, 25, 200));
  }

  function applyZoom(nextZoom, { recenter = true } = {}) {
    setCanvasZoom((current) =>
      clamp(typeof nextZoom === "function" ? nextZoom(current) : nextZoom, 25, 200)
    );
    if (recenter) {
      setPan({ x: 0, y: 0 });
    }
  }

  function setZoom(value) {
    applyZoom(value);
  }

  function runZoomAction(action) {
    action();
    setZoomMenuOpen(false);
  }

  function zoomIn() {
    applyZoom((current) => current + 10);
  }

  function zoomOut() {
    applyZoom((current) => current - 10);
  }

  function zoomToFit() {
    const stageBounds = canvasStageRef.current?.getBoundingClientRect();
    const artboard = canvasArtboardRef.current;

    if (!stageBounds || !artboard) {
      applyZoom(rightPanelOpen ? 104 : 96);
      return;
    }

    const currentScale = canvasZoom / 100 || 1;
    const artboardBounds = artboard.getBoundingClientRect();
    const artboardWidth = artboardBounds.width / currentScale;
    const artboardHeight = artboardBounds.height / currentScale;

    if (!artboardWidth || !artboardHeight) {
      applyZoom(rightPanelOpen ? 104 : 96);
      return;
    }

    const horizontalPadding = Math.max(72, Math.min(stageBounds.width * 0.1, 112));
    const verticalPadding = Math.max(48, Math.min(stageBounds.height * 0.1, 84));
    const availableWidth = Math.max(stageBounds.width - horizontalPadding * 2, artboardWidth * 0.6);
    const availableHeight = Math.max(stageBounds.height - verticalPadding * 2, artboardHeight * 0.6);
    const fitScale = Math.min(availableWidth / artboardWidth, availableHeight / artboardHeight);

    applyZoom(Math.round(fitScale * 100));
  }

  function updatePlayhead(clientX) {
    const bounds = timelineRulerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setPlayhead(clamp(clientX - bounds.left, 0, Math.max(0, bounds.width - 2)));
  }

  function startPlayheadDrag(event) {
    if (event.button !== 0) return;
    playheadDragRef.current.pointerId = event.pointerId;
    updatePlayhead(event.clientX);
    event.preventDefault();
    event.stopPropagation();
  }

  function createChatThread(threads) {
    const untitledCount = threads.filter(
      (thread) => thread.title === "New Chat" || /^New Chat \d+$/.test(thread.title)
    ).length;
    const nextTitle = untitledCount === 0 ? "New Chat" : `New Chat ${untitledCount + 1}`;

    return {
      id: `chat-${nextChatIdRef.current++}`,
      title: nextTitle,
      draft: "",
    };
  }

  function startNewChat() {
    const nextThread = createChatThread(chatThreads);
    focusChatComposerRef.current = true;
    setChatThreads((current) => [...current, nextThread]);
    setActiveChatId(nextThread.id);
    setRightPanelOpen(true);
  }

  function selectChatThread(threadId) {
    setActiveChatId(threadId);
    setRightPanelOpen(true);
  }

  function toggleToolChip(tool) {
    const isSelected = selectedTools.some((t) => t.id === tool.id);
    setSelectedTools(isSelected ? [] : [tool]);
    const grid = TOOL_GRID_MAP[tool.id];
    if (grid) {
      setActiveGrid(isSelected ? null : grid);
      if (tool.id === "generate-image" && isSelected) setSelectedImageStyle(null);
    }
  }

  function removeToolChip(toolId) {
    setSelectedTools((current) => current.filter((t) => t.id !== toolId));
    if (TOOL_GRID_MAP[toolId]) {
      setActiveGrid(null);
      if (toolId === "generate-image") setSelectedImageStyle(null);
    }
  }

  const zoomMenuItems = (
    <>
      <button type="button" role="menuitem" className="zoom-menu-button" onClick={() => runZoomAction(zoomIn)}>
        <span>Zoom in</span>
        <DropdownMenuShortcut>&#8984; +</DropdownMenuShortcut>
      </button>
      <button type="button" role="menuitem" className="zoom-menu-button" onClick={() => runZoomAction(zoomOut)}>
        <span>Zoom out</span>
        <DropdownMenuShortcut>&#8984; -</DropdownMenuShortcut>
      </button>
      <DropdownMenuSeparator />
      <button type="button" role="menuitem" className="zoom-menu-button" onClick={() => runZoomAction(() => setZoom(100))}>
        <span>Zoom to 100%</span>
        <DropdownMenuShortcut>&#8984; 0</DropdownMenuShortcut>
      </button>
      <button type="button" role="menuitem" className="zoom-menu-button" onClick={() => runZoomAction(() => setZoom(200))}>
        <span>Zoom to 200%</span>
        <DropdownMenuShortcut>Shift + 2</DropdownMenuShortcut>
      </button>
      <DropdownMenuSeparator />
      <button type="button" role="menuitem" className="zoom-menu-button" onClick={() => runZoomAction(zoomToFit)}>
        <span>Zoom to Fit</span>
        <DropdownMenuShortcut>Shift + F</DropdownMenuShortcut>
      </button>
    </>
  );

  return (
    <>
    <TooltipProvider delayDuration={120}>
      <div className={cn("app-shell", isLeftPanelVisible && "left-panel-open", allSectionsVisible && "is-all-sections-visible")}>
        <aside className={cn("left-sidebar-shell", !isLeftPanelVisible && "is-collapsed")}>
          <div className="left-rail">
            <Link href="/" className="brand" aria-label="Go to home">
              <Image src={logoMark} alt="Videoo" priority />
            </Link>

            <nav className="rail-nav" aria-label="Editor tools">
              {railTopItems.map((item) => (
                <Tooltip key={item.key}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn("rail-button", activePanel === item.key && "is-active")}
                      data-panel={item.key}
                      aria-label={item.label}
                      onClick={() => togglePanel(item.key)}
                    >
                      <item.icon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ))}
            </nav>

            <nav className="rail-nav rail-nav-bottom" aria-label="Editor AI image tools">
              {railBottomItems.map((item) => (
                <Tooltip key={item.key}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn("rail-button", activePanel === item.key && "is-active")}
                      data-panel={item.key}
                      aria-label={item.label}
                      onClick={() => togglePanel(item.key)}
                    >
                      <item.icon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>

          <Collapsible open={isLeftPanelVisible} asChild>
            <div className={cn("left-panel", !isLeftPanelVisible && "is-collapsed")}>
              <div className="panel-header">
                {activePanel === "media" && mediaBrandKitOpen ? (
                  <>
                    <button type="button" className="panel-back-btn" onClick={() => setMediaBrandKitOpen(false)}>
                      <ArrowLeft size={15} />
                      <span>Brandkit</span>
                    </button>
                    <IconButton icon={ChevronsLeft} label="Collapse panel" onClick={() => setLeftPanelOpen(false)} />
                  </>
                ) : (
                  <>
                    <h1>{railItems.find((item) => item.key === activePanel)?.label ?? "Panel"}</h1>
                    <div className="panel-actions">
                      {/* <IconButton icon={Upload} label="Upload" /> */}
                      <IconButton icon={ChevronsLeft} label="Collapse panel" onClick={() => setLeftPanelOpen(false)} />
                    </div>
                  </>
                )}
              </div>

              <CollapsibleContent forceMount className="panel-scroll">
                {activePanel ? <PanelContent panel={activePanel} selectedTools={selectedTools} onToggle={toggleToolChip} brandKitOpen={mediaBrandKitOpen} onOpenBrandKit={() => setMediaBrandKitOpen(true)} /> : null}
              </CollapsibleContent>
            </div>
          </Collapsible>
        </aside>

        <main className="workspace-shell">
          <div
            ref={workspaceBodyRef}
            className={cn("workspace-body", !rightPanelOpen && "chat-collapsed")}
            style={{
              "--chat-panel-width": `${chatPanelWidth}px`,
              gridTemplateColumns: !rightPanelOpen ? "minmax(0, 1fr) 0" : `minmax(0, 1fr) ${chatPanelWidth}px`,
            }}
          >
            <section
              className={cn("editor-shell", !timelineOpen && "timeline-collapsed")}
              style={{
              gridTemplateRows: timelineOpen ? `48px minmax(0, 1fr) ${timelineHeight}px` : "48px minmax(0, 1fr) 46px",
              }}
            >
              <header className={cn("topbar", compactTopbar && "is-compact", denseTopbar && "is-dense")}>
                <div className="topbar-leading">
                  <div className="topbar-group topbar-nav">
                    <IconButton icon={Undo2} label="Undo" ghost />
                    <IconButton icon={Redo2} label="Redo" ghost />
                  </div>
                </div>

                <div className={cn("topbar-center", compactTopbar && "is-compact", denseTopbar && "is-dense")}>
                  <div className="project-meta">
                    <SyncStatus state={syncState} />
                    <span className="project-name">{currentProjectTitle}</span>
                  </div>
                </div>

                <div
                  className={cn(
                    "topbar-trailing",
                    compactTopbar && "is-compact",
                    denseTopbar && "is-dense",
                    !rightPanelOpen && "is-chat-collapsed"
                  )}
                >
                  <div className="file-presence" aria-label="Online collaborators">
                    <AvatarGroup className="file-presence-list">
                      {extraCollaboratorCount > 0 ? (
                        <AvatarGroupCount className="file-presence-count">{`+${extraCollaboratorCount}`}</AvatarGroupCount>
                      ) : null}
                      {visibleCollaborators.map((person) => (
                        <Tooltip key={person.id}>
                          <TooltipTrigger asChild>
                            <Avatar className="file-presence-avatar">
                              <AvatarFallback className="file-presence-fallback">{person.initials}</AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>{person.label}</TooltipContent>
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </div>
                  {!rightPanelOpen ? (
                    <>
                      <div className="topbar-divider" aria-hidden="true" />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button type="button" variant="ghost" className="topbar-credits" aria-label="Credits details">
                            <Sparkles />
                            <span>1760 credits</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="credits-menu">
                          <div className="credits-menu-top">
                            <div>
                              <div className="credits-plan">Pro</div>
                            </div>
                            <Button type="button" variant="default" className="credits-upgrade-button">
                              Upgrade
                            </Button>
                          </div>
                          <div className="credits-menu-divider" />
                          <div className="credits-menu-body">
                            <div className="credits-copy">
                              <strong>Credits</strong>
                              <span>2,000 per month on your plan</span>
                            </div>
                            <div className="credits-amount">1,760</div>
                          </div>
                          <button type="button" className="credits-usage-link">
                            <span>View usage</span>
                            <span aria-hidden="true">›</span>
                          </button>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button type="button" variant="ghost" className="share-button">
                        Share
                      </Button>
                      <PublishButton />
                    </>
                  ) : null}
                  {!compactTopbar ? (
                    <div className="topbar-layout-cluster" aria-label="Layout panels">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={rightPanelOpen ? "Hide right panel" : "Show right panel"}
                        className={cn("icon-button", "icon-button-ghost", "chat-header-button")}
                        onClick={() => setRightPanelOpen((current) => !current)}
                      >
                        <PanelRightGlyph open />
                      </Button>
                    </div>
                  ) : null}
                </div>
              </header>

              <section className="editor-area">
                <div className="floating-tools" role="tablist" aria-label="Canvas tools">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("floating-tool-button", interactionMode === "pointer" && "is-active")}
                    aria-pressed={interactionMode === "pointer"}
                    onClick={() => setInteractionMode("pointer")}
                  >
                    <MousePointer2 />
                  </Button>
                  <div className="floating-tools-divider" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn("floating-tool-button", interactionMode === "hand" && "is-active")}
                    aria-pressed={interactionMode === "hand"}
                    onClick={() => setInteractionMode("hand")}
                  >
                    <Hand />
                  </Button>
                </div>
                <div
                  ref={canvasStageRef}
                  className={cn(
                    "canvas-stage",
                    interactionMode === "hand" ? "is-hand-mode" : "is-pointer-mode",
                    interactionMode === "hand" && isDragging && "is-dragging"
                  )}
                  onPointerDown={handleCanvasPointerDown}
                  onPointerMove={handleCanvasPointerMove}
                  onPointerUp={finishCanvasPan}
                  onPointerCancel={finishCanvasPan}
                  onWheel={handleCanvasWheel}
                >
                  <div
                    className="canvas-world"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px)`,
                    }}
                  >
                    <div
                      className="canvas-zoom-layer"
                      style={{
                        transform: `scale(${canvasZoom / 100})`,
                      }}
                    >
                      <div className="infinite-grid" />
                      <div className="canvas-content">
                        <div
                          ref={canvasArtboardRef}
                          className={cn("canvas-artboard", importJob && "has-import-job")}
                          aria-label="Canvas"
                        >
                          {importJob && (
                            <div className={cn("canvas-import-placeholder", importJob.status === "complete" && "is-complete", importJob.status === "error" && "is-error")}>
                              <div className="canvas-import-icon">
                                {importJob.status === "complete" ? <CheckCircle2 /> : importJob.status === "error" ? <CircleAlert /> : <LoaderCircle />}
                              </div>
                              <span className="canvas-import-title">
                                {importJob.status === "complete" ? "Video added to canvas" : importJob.status === "error" ? "Import failed" : "Importing video..."}
                              </span>
                              <span className="canvas-import-source">{importJob.platform} · {importJob.displayUrl}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu open={zoomMenuOpen} onOpenChange={setZoomMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="outline" className="floating-zoom-trigger">
                        <span>{canvasZoom}%</span>
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="zoom-menu floating-zoom-menu">
                      {zoomMenuItems}
                    </DropdownMenuContent>
                  </DropdownMenu>

                </div>
              </section>

              {!timelineOpen ? (
                <section className="timeline-collapsed-bar">
                  <div className="timeline-collapsed-left">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="timeline-show-button"
                      onClick={() => setTimelineOpen(true)}
                    >
                      <TimelinePanelIcon />
                      <span>Show Timeline</span>
                    </Button>
                    <Button type="button" variant="secondary" size="sm" className="page-chip">
                      <span>Page 1</span>
                      <ChevronDown />
                    </Button>
                  </div>

                  <div className="transport timeline-collapsed-transport">
                    <span className="timecode">{`00:00.00 / ${formatTransportTime(timelineStepSeconds)}`}</span>
                    <IconButton icon={SkipBack} label="Skip back" ghost />
                    <IconButton icon={PlayFilledGlyph} label="Play" ghost />
                    <IconButton icon={SkipForward} label="Skip forward" ghost />
                  </div>

                  <div className="timeline-collapsed-right" />
                </section>
              ) : null}

              <Collapsible open={timelineOpen} asChild>
                <section className={cn("timeline-panel", !timelineOpen && "is-collapsed")}>
                  <div
                    className="timeline-resize-handle"
                    role="separator"
                    aria-orientation="horizontal"
                    aria-label="Resize timeline"
                    onPointerDown={handleTimelineResizeStart}
                  />
                  <div className="timeline-toolbar">
                    <div className="timeline-left-tools">
                      <IconButton
                        icon={TimelinePanelIcon}
                        label="Hide timeline"
                        ghost
                        onClick={() => setTimelineOpen(false)}
                      />
                      <IconButton icon={Scissors} label="Cut" />
                      <IconButton icon={Trash2} label="Delete track" />
                      <Button type="button" variant="secondary" size="sm" className="page-chip">
                        <span>Page 1</span>
                        <ChevronDown />
                      </Button>
                    </div>

                    <div className="transport">
                      <span className="timecode">{`00:00.00 / ${formatTransportTime(timelineStepSeconds)}`}</span>
                      <IconButton icon={SkipBack} label="Skip back" />
                      <IconButton icon={PlayFilledGlyph} label="Play" filled />
                      <IconButton icon={SkipForward} label="Skip forward" />
                    </div>

                    <div className="timeline-zoom">
                      <IconButton
                        icon={Minus}
                        label="Zoom out"
                        onClick={() => setTimelineScale((current) => clamp(current - 10, 60, 160))}
                      />
                      <Slider
                        value={[timelineScale]}
                        min={60}
                        max={160}
                        step={1}
                        className="w-[118px]"
                        onValueChange={([value]) => setTimelineScale(value)}
                      />
                      <IconButton
                        icon={Plus}
                        label="Zoom in"
                        onClick={() => setTimelineScale((current) => clamp(current + 10, 60, 160))}
                      />
                      <Button type="button" variant="ghost" size="sm" className="text-button subtle">
                        Fit
                      </Button>
                    </div>
                  </div>

                  <CollapsibleContent forceMount className="contents">
                    <div
                      ref={timelineRulerRef}
                      className="timeline-ruler"
                      onPointerDown={(event) => updatePlayhead(event.clientX)}
                    >
                      <span className="timeline-start-label">0:00</span>
                      <div className="timeline-ticks">
                        {timelineTicks.map((tick) => (
                          <div className="tick-group" key={tick.label} style={{ "--tick-width": `${tick.width}px` }}>
                            <span className="tick-dot tick-dot-first" />
                            <span className="tick-dot tick-dot-second" />
                            <span className="tick-label">{tick.label}</span>
                          </div>
                        ))}
                      </div>
                      <div
                        className="playhead"
                        style={{ left: `${playhead}px` }}
                        onPointerDown={startPlayheadDrag}
                      />
                    </div>

                    <div className="timeline-track-area" onPointerDown={(event) => updatePlayhead(event.clientX)}>
                      <div
                        className="playhead-track"
                        style={{ left: `${playhead}px` }}
                        onPointerDown={startPlayheadDrag}
                      />
                      <div className="track upload-track">
                        {importJob ? (
                          <Card className={cn("timeline-import-card", importJob.status === "complete" && "is-complete", importJob.status === "error" && "is-error")}>
                            {importJob.status === "complete" ? <CheckCircle2 /> : importJob.status === "error" ? <CircleAlert /> : <LoaderCircle />}
                            <span>{importJob.status === "complete" ? "Imported video" : importJob.status === "error" ? "Import failed" : "Importing from URL"}</span>
                            <small>{importJob.displayUrl}</small>
                          </Card>
                        ) : (
                          <Card className="upload-card">
                            <Upload />
                            <span>Upload Media</span>
                          </Card>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </section>
              </Collapsible>
            </section>

            <Collapsible open={rightPanelOpen} asChild>
              <aside className={cn("chat-panel", !rightPanelOpen && "is-collapsed")}>
                <div
                  className="chat-panel-resize-handle"
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Resize chat panel"
                  onPointerDown={handleChatResizeStart}
                />
                <div className="chat-panel-header">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="ghost" className="topbar-credits" aria-label="Credits details">
                        <Sparkles />
                        <span>1760 credits</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="credits-menu">
                      <div className="credits-menu-top">
                        <div>
                          <div className="credits-plan">Pro</div>
                        </div>
                        <Button type="button" variant="default" className="credits-upgrade-button">
                          Upgrade
                        </Button>
                      </div>
                      <div className="credits-menu-divider" />
                      <div className="credits-menu-body">
                        <div className="credits-copy">
                          <strong>Credits</strong>
                          <span>2,000 per month on your plan</span>
                        </div>
                        <div className="credits-amount">1,760</div>
                      </div>
                      <button type="button" className="credits-usage-link">
                        <span>View usage</span>
                        <span aria-hidden="true">›</span>
                      </button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="chat-panel-header-actions">
                    <Button type="button" variant="ghost" className="share-button">
                      Share
                    </Button>
                    <PublishButton />
                  </div>
                </div>
                <div className="chat-subbar">
                  <div className="chat-thread-list" aria-label="Chat tabs" role="tablist">
                    {chatThreads.map((thread) => (
                      <div key={thread.id} className={cn("chat-thread-pill", thread.id === activeChatId && "is-active")}>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={thread.id === activeChatId}
                          className="chat-thread-pill-trigger"
                          onClick={() => selectChatThread(thread.id)}
                        >
                          <span>{thread.title}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="chat-subbar-actions">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Start a new chat"
                      className={cn("icon-button", "icon-button-ghost", "chat-new-thread-button")}
                      onClick={startNewChat}
                    >
                      <Plus />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Open chat history"
                      className={cn("icon-button", "icon-button-ghost", "chat-new-thread-button", "chat-history-button")}
                    >
                      <History />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Hide chat panel"
                      className={cn("icon-button", "icon-button-ghost", "chat-header-button")}
                      onClick={() => setRightPanelOpen(false)}
                    >
                      <PanelRightGlyph open />
                    </Button>
                  </div>
                </div>

                <CollapsibleContent forceMount className="min-h-0 chat-panel-content">
                  <div className="chat-content-area">
                    {importJob && (
                      <div className={cn("import-process-card", importJob.status === "complete" && "is-complete", importJob.status === "error" && "is-error")}>
                        <div className="import-process-card-top">
                          <div className="import-process-icon">
                            {importJob.status === "complete" ? <CheckCircle2 /> : importJob.status === "error" ? <CircleAlert /> : <LoaderCircle />}
                          </div>
                          <div className="import-process-copy">
                            <h3>{importJob.status === "complete" ? "Added to canvas" : importJob.status === "error" ? "Import failed" : "Importing video from URL"}</h3>
                            <p>{importJob.platform} · {importJob.displayUrl}</p>
                          </div>
                        </div>
                        <div className="import-process-steps">
                          {IMPORT_STEPS.map((step) => {
                            const stepIndex = IMPORT_STEPS.findIndex((item) => item.key === step.key);
                            const currentIndex = IMPORT_STEPS.findIndex((item) => item.key === importJob.status);
                            const isDone = importJob.status === "complete" || currentIndex > stepIndex;
                            const isActive = importJob.status === step.key;
                            return (
                              <div key={step.key} className={cn("import-process-step", isDone && "is-done", isActive && "is-active", importJob.status === "error" && "is-muted")}>
                                <span className="import-process-step-dot" />
                                <span>{step.label}</span>
                              </div>
                            );
                          })}
                        </div>
                        {importJob.status === "error" && (
                          <div className="import-process-actions">
                            <button type="button" onClick={retryImportJob}>Try again</button>
                            <button type="button" onClick={removeImportJob}>Remove</button>
                          </div>
                        )}
                    {importJob.status === "complete" && (
                      <div className="import-process-actions">
                        <button type="button" onClick={removeImportJob}>Remove</button>
                      </div>
                    )}
                      </div>
                    )}
                    {showRecordGrid && (
                      <div className="image-style-panel">
                        <div className="image-style-header">
                          <span className="image-style-title">Recording setup</span>
                        </div>
                        <div className="image-style-grid">
                          {recordSources.map((source, i) => (
                            <button
                              key={source.name}
                              type="button"
                              className={cn("gen-text-card", `bento-item-${i}`, selectedRecordSource === source.name && "is-selected")}
                              onClick={() => setSelectedRecordSource(source.name)}
                            >
                              <span className="gen-text-card-name">{source.name}</span>
                              <span className="gen-text-card-desc">{source.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {showVideoGrid && (
                      <div className="video-style-panel">
                        <div className="video-template-grid">
                          {(videoTemplatesExpanded ? videoClips : videoClips.slice(0, 6)).map((vid, i) => {
                            const src = `/video-styles/${vid.file}`;
                            return (
                              <button
                                key={vid.file}
                                type="button"
                                className={cn("video-template-card", `template-item-${i}`, selectedAttachment?.file === vid.file && "is-selected")}
                                onClick={() => {
                                  setSelectedAttachment({ type: "video", file: vid.file, name: vid.name, src });
                                  setChatThreads((cur) => cur.map((t) => t.id === activeChatId ? { ...t, draft: vid.prompt } : t));
                                  if (chatPromptRef.current) {
                                    chatPromptRef.current.textContent = vid.prompt;
                                    chatPromptRef.current.focus();
                                    const range = document.createRange();
                                    range.selectNodeContents(chatPromptRef.current);
                                    range.collapse(false);
                                    const sel = window.getSelection();
                                    sel.removeAllRanges();
                                    sel.addRange(range);
                                  }
                                }}
                              >
                                <AutoplayVideo src={src} className="video-style-clip" />
                                <span className="image-style-label">{vid.name}</span>
                              </button>
                            );
                          })}
                        </div>
                        {!videoTemplatesExpanded && videoClips.length > 6 && (
                          <button type="button" className="style-more-btn" onClick={() => setVideoTemplatesExpanded(true)}>
                            More templates ({videoClips.length - 6} more)
                          </button>
                        )}
                      </div>
                    )}
                    {showImageGrid && (
                      <div className="image-style-panel">
                        <div className="image-style-grid">
                          {(imageStylesExpanded ? imageStyles : imageStyles.slice(0, 10)).map((style, i) => (
                            <button
                              key={style.name}
                              type="button"
                              className={cn("image-style-card", `bento-item-${i}`, selectedImageStyle?.name === style.name && "is-selected")}
                              onClick={() => { const url = `/image-styles/${encodeURIComponent(style.file)}`; setSelectedImageStyle(selectedImageStyle?.name === style.name ? null : { name: style.name, url }); }}
                            >
                              <img
                                src={`/image-styles/${encodeURIComponent(style.file)}`}
                                alt={style.name}
                                className="image-style-thumb"
                              />
                              <span className="image-style-label">{style.name}</span>
                            </button>
                          ))}
                        </div>
                        {!imageStylesExpanded && imageStyles.length > 10 && (
                          <button type="button" className="style-more-btn" onClick={() => setImageStylesExpanded(true)}>
                            More styles ({imageStyles.length - 10} more)
                          </button>
                        )}
                        {imageStylesExpanded && (
                          <button type="button" className="style-more-btn" onClick={() => setImageStylesExpanded(false)}>
                            Show less
                          </button>
                        )}
                      </div>
                    )}
                    {showAudioGrid && (
                      <div className="image-style-panel">
                        <div className="image-style-header">
                          <span className="image-style-title">Audio Moods</span>                        </div>
                        <div className="image-style-grid">
                          {audioMoods.map((mood, i) => (
                            <button
                              key={mood.name}
                              type="button"
                              className={cn("gen-text-card", `bento-item-${i}`, selectedAudioMood === mood.name && "is-selected")}
                              onClick={() => setSelectedAudioMood(selectedAudioMood === mood.name ? null : mood.name)}
                            >
                              <span className="gen-text-card-name">{mood.name}</span>
                              <span className="gen-text-card-desc">{mood.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {showSfxGrid && (
                      <div className="image-style-panel">
                        <div className="image-style-header">
                          <span className="image-style-title">SFX Categories</span>                        </div>
                        <div className="image-style-grid">
                          {sfxCategories.map((cat, i) => (
                            <button
                              key={cat.name}
                              type="button"
                              className={cn("gen-text-card", `bento-item-${i}`, selectedSfxCategory === cat.name && "is-selected")}
                              onClick={() => setSelectedSfxCategory(selectedSfxCategory === cat.name ? null : cat.name)}
                            >
                              <span className="gen-text-card-name">{cat.name}</span>
                              <span className="gen-text-card-desc">{cat.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {showVoiceoverGrid && (
                      <div className="image-style-panel">
                        <div className="image-style-header">
                          <span className="image-style-title">Voice Selection</span>                        </div>
                        <div className="image-style-grid">
                          {voiceProfiles.map((voice, i) => (
                            <button
                              key={voice.name}
                              type="button"
                              className={cn("gen-text-card", `bento-item-${i}`, selectedVoice === voice.name && "is-selected")}
                              onClick={() => setSelectedVoice(selectedVoice === voice.name ? null : voice.name)}
                            >
                              <span className="gen-text-card-name">{voice.name}</span>
                              <span className="gen-text-card-desc">{voice.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {!activeGrid && (
                      <div className="chat-empty-state">
                        <h2 className="chat-empty-heading">What would you like to do?</h2>
                        <div className="chat-suggestions">
                          {editorSuggestions.map((s) => (
                            <button key={s.key} type="button" className="chat-suggestion-item">
                              <s.icon />
                              <span>{s.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {promptSuggestion && !suggestionDismissed && !activeGrid && (() => {
                    const cfg = EDITOR_TOOL_SUGGESTION_CONFIG[promptSuggestion];
                    if (!cfg) return null;
                    return (
                      <div className="prompt-suggestion-widget">
                        <div className="prompt-suggestion-left">
                          <cfg.icon size={13} />
                          <span className="prompt-suggestion-label">{cfg.label}</span>
                          <span className="prompt-suggestion-key">Tab</span>
                        </div>
                        <div className="prompt-suggestion-right">
                          <button type="button" className="prompt-suggestion-confirm" onClick={acceptEditorSuggestion}>
                            Use {cfg.slug}
                          </button>
                          <button type="button" className="prompt-suggestion-dismiss" onClick={() => setSuggestionDismissed(true)}>
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {imageErrorVisible && (
                    <div className="prompt-image-error">
                      <div className="prompt-image-error-left">
                        <AlertTriangle size={13} />
                        <span className="prompt-image-error-text">Images you upload won't be used — Luma Dream Machine doesn't support image input for video generation</span>
                      </div>
                    </div>
                  )}

                  <Card className="chat-card" ref={chatCardRef}>
                    <PromptBox
                      variant="editor"
                      value={chatDraft}
                      onChange={(text) =>
                        setChatThreads((cur) =>
                          cur.map((t) => t.id === activeChatId ? { ...t, draft: text } : t)
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Tab" && promptSuggestion && !suggestionDismissed && !activeGrid) {
                          e.preventDefault();
                          acceptEditorSuggestion();
                        }
                      }}
                      inputRef={chatPromptRef}
                      activeGrid={activeGrid}
                      onActiveGridChange={(grid) => { setActiveGrid(grid); setPromptSuggestion(null); setSuggestionDismissed(false); }}
                      selectedAttachment={selectedAttachment?.type === "image" ? selectedAttachment : null}
                      onSelectedAttachmentChange={setSelectedAttachment}
                      imageStyleAttachment={selectedImageStyle}
                      onImageStyleAttachmentChange={setSelectedImageStyle}
                      videoStartAttachment={videoStartImage}
                      onVideoStartAttachmentChange={setVideoStartImage}
                      videoEndAttachment={videoEndImage}
                      onVideoEndAttachmentChange={setVideoEndImage}
                      chipsMap={{
                        image: [
                          { key: "img-model",      icon: LayoutGrid,          activeValue: imageSettings.model,      options: imageModels,           onSelect: (v) => setImageSetting("model", v) },
                          { key: "img-ratio",      icon: RectangleHorizontal, activeValue: imageSettings.ratio,      options: imageRatioOptions,     onSelect: (v) => setImageSetting("ratio", v) },
                          { key: "img-resolution", icon: ArrowUpDown,         activeValue: imageSettings.resolution, options: imageResolutionOptions, onSelect: (v) => setImageSetting("resolution", v) },
                          { key: "img-quality",    icon: Sparkles,            activeValue: imageSettings.quality,    options: imageQualityOptions,   onSelect: (v) => setImageSetting("quality", v) },
                        ],
                        video: [
                          { key: "model",      icon: LayoutGrid,          activeValue: videoSettings.model,      options: videoModels,       onSelect: (v) => setVideoSetting("model", v) },
                          { key: "ratio",      icon: RectangleHorizontal, activeValue: videoSettings.ratio,      options: ratioOptions,      onSelect: (v) => setVideoSetting("ratio", v) },
                          { key: "resolution", icon: ArrowUpDown,         activeValue: videoSettings.resolution, options: resolutionOptions, onSelect: (v) => setVideoSetting("resolution", v) },
                          { key: "duration",   icon: Clock,               activeValue: videoSettings.duration,   options: durationOptions,   onSelect: (v) => setVideoSetting("duration", v) },
                          { key: "audio",      icon: videoSettings.audio ? Volume2 : VolumeX, activeValue: videoSettings.audio ? "On" : "Off", options: ["Off", "On"], onSelect: (v) => setVideoSetting("audio", v === "On") },
                        ],
                        audio: [
                          { key: "aud-model",    icon: LayoutGrid, activeValue: audioSettings.model,    options: audioModels,         onSelect: (v) => setAudioSetting("model", v) },
                          { key: "aud-mood",     icon: Music4,     activeValue: audioSettings.mood,     options: audioMoodOptions,    onSelect: (v) => setAudioSetting("mood", v) },
                          { key: "aud-duration", icon: Clock,      activeValue: audioSettings.duration, options: audioDurationOptions, onSelect: (v) => setAudioSetting("duration", v) },
                          { key: "aud-quality",  icon: Sparkles,   activeValue: audioSettings.quality,  options: audioQualityOptions, onSelect: (v) => setAudioSetting("quality", v) },
                        ],
                        sfx: [
                          { key: "sfx-model",    icon: LayoutGrid, activeValue: sfxSettings.model,    options: sfxModels,         onSelect: (v) => setSfxSetting("model", v) },
                          { key: "sfx-duration", icon: Clock,      activeValue: sfxSettings.duration, options: sfxDurationOptions, onSelect: (v) => setSfxSetting("duration", v) },
                        ],
                        voiceover: [
                          { key: "vo-model",    icon: LayoutGrid, activeValue: voiceoverSettings.model,    options: voiceoverModels, onSelect: (v) => setVoiceoverSetting("model", v) },
                          { key: "vo-voice",    icon: Mic,        activeValue: voiceoverSettings.voice,    options: voiceOptions,    onSelect: (v) => setVoiceoverSetting("voice", v) },
                          { key: "vo-speed",    icon: Gauge,      activeValue: voiceoverSettings.speed,    options: speedOptions,    onSelect: (v) => setVoiceoverSetting("speed", v) },
                          { key: "vo-language", icon: FileText,   activeValue: voiceoverSettings.language, options: languageOptions, onSelect: (v) => setVoiceoverSetting("language", v) },
                        ],
                      }}
                      extraChips={selectedTools.map((tool) => (
                        <div key={tool.id} className="chat-tool-chip">
                          <span>{tool.name}</span>
                          <button type="button" className="chat-tool-chip-remove" aria-label={`Remove ${tool.name}`} onClick={() => removeToolChip(tool.id)}>
                            <X />
                          </button>
                        </div>
                      ))}
                      renderModelSelector={() => (
                        <div className="chat-model-selector-wrap" ref={chatModelRef}>
                          <button type="button" className="chat-model-button" onClick={() => setChatModelOpen((v) => !v)}>
                            <span className="chat-model-dot" style={{ background: chatSelectedModel.gradient }} />
                            <span>{chatSelectedModel.label}</span>
                            <ChevronDown className={cn("chat-model-chevron", chatModelOpen && "is-open")} />
                          </button>
                          {chatModelOpen && (
                            <div className="chat-model-dropdown">
                              {editorModels.map((m) => (
                                <button key={m.id} type="button"
                                  className={cn("chat-model-dropdown-item", chatSelectedModel.id === m.id && "is-selected")}
                                  onClick={() => { setChatSelectedModel(m); setChatModelOpen(false); }}>
                                  <span className="chat-model-dot" style={{ background: m.gradient }} />
                                  <span>{m.label}</span>
                                  {m.tag && <span className="chat-model-tag">{m.tag}</span>}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      renderSendButton={() => (
                        <Button type="button" variant="default" size="icon" className="chat-send" aria-label="Send message">
                          <span className="chat-send-rotator"><SendArrowGlyph /></span>
                        </Button>
                      )}
                      onImportFromUrl={startImportFromUrl}
                      supportNarrow
                      renderSettingsContent={() => (
                        <>
                          {showRecordGrid && (
                            <>
                              <div className="vsd-row">
                                <span className="vsd-label">Source</span>
                                <div className="vsd-res-pills">
                                  {recordSources.map((source) => (
                                    <button
                                      key={source.name}
                                      type="button"
                                      className={cn("vsd-res-btn", selectedRecordSource === source.name && "is-active")}
                                      onClick={() => setSelectedRecordSource(source.name)}
                                    >
                                      {source.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                          {showVideoGrid && (
                            <>
                              <div className="vsd-row">
                                <span className="vsd-label">Model</span>
                                <div className="vsd-dropdown-wrap">
                                  <button type="button" className="vsd-dropdown-trigger">
                                    <span>{videoSettings.model}</span><ChevronDown className="vsd-dropdown-chevron" />
                                  </button>
                                </div>
                              </div>
                              <div className="vsd-row">
                                <span className="vsd-label">Video ratio</span>
                                <div className="vsd-ratio-pills">
                                  {ratioOptions.map((r) => (
                                    <button key={r} type="button" className={cn("vsd-ratio-btn", videoSettings.ratio === r && "is-active")} onClick={() => setVideoSetting("ratio", r)}>
                                      <span className={cn("vsd-ratio-shape", `vsd-ratio-${r.replace(":", "-")}`)} /><span>{r}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="vsd-row">
                                <span className="vsd-label">Duration</span>
                                <div className="vsd-res-pills">
                                  {durationOptions.map((d) => (
                                    <button key={d} type="button" className={cn("vsd-res-btn", videoSettings.duration === d && "is-active")} onClick={() => setVideoSetting("duration", d)}>{d}</button>
                                  ))}
                                </div>
                              </div>
                              <div className="vsd-row">
                                <span className="vsd-label">Resolution</span>
                                <div className="vsd-res-pills">
                                  {resolutionOptions.map((r) => (
                                    <button key={r} type="button" className={cn("vsd-res-btn", videoSettings.resolution === r && "is-active")} onClick={() => setVideoSetting("resolution", r)}>{r}</button>
                                  ))}
                                </div>
                              </div>
                              <div className="vsd-row">
                                <span className="vsd-label">Audio</span>
                                <div className="vsd-res-pills">
                                  {["Off", "On"].map((a) => (
                                    <button key={a} type="button" className={cn("vsd-res-btn", videoSettings.audio === (a === "On") && "is-active")} onClick={() => setVideoSetting("audio", a === "On")}>{a}</button>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                          {showImageGrid && (
                            <>
                              <div className="vsd-row">
                                <span className="vsd-label">Ratio</span>
                                <div className="vsd-ratio-pills">
                                  {imageRatioOptions.map((r) => (
                                    <button key={r} type="button" className={cn("vsd-ratio-btn", imageSettings.ratio === r && "is-active")} onClick={() => setImageSetting("ratio", r)}>
                                      <span className={cn("vsd-ratio-shape", `vsd-ratio-${r.replace(":", "-")}`)} /><span>{r}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="vsd-row">
                                <span className="vsd-label">Resolution</span>
                                <div className="vsd-res-pills">
                                  {imageResolutionOptions.map((r) => (
                                    <button key={r} type="button" className={cn("vsd-res-btn", imageSettings.resolution === r && "is-active")} onClick={() => setImageSetting("resolution", r)}>{r}</button>
                                  ))}
                                </div>
                              </div>
                              <div className="vsd-row">
                                <span className="vsd-label">Quality</span>
                                <div className="vsd-res-pills">
                                  {imageQualityOptions.map((q) => (
                                    <button key={q} type="button" className={cn("vsd-res-btn", imageSettings.quality === q && "is-active")} onClick={() => setImageSetting("quality", q)}>{q}</button>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                          {showAudioGrid && (
                            <>
                              <div className="vsd-row">
                                <span className="vsd-label">Mood</span>
                                <div className="vsd-res-pills">
                                  {audioMoodOptions.map((m) => (
                                    <button key={m} type="button" className={cn("vsd-res-btn", audioSettings.mood === m && "is-active")} onClick={() => setAudioSetting("mood", m)}>{m}</button>
                                  ))}
                                </div>
                              </div>
                              <div className="vsd-row">
                                <span className="vsd-label">Duration</span>
                                <div className="vsd-res-pills">
                                  {audioDurationOptions.map((d) => (
                                    <button key={d} type="button" className={cn("vsd-res-btn", audioSettings.duration === d && "is-active")} onClick={() => setAudioSetting("duration", d)}>{d}</button>
                                  ))}
                                </div>
                              </div>
                              <div className="vsd-row">
                                <span className="vsd-label">Quality</span>
                                <div className="vsd-res-pills">
                                  {audioQualityOptions.map((q) => (
                                    <button key={q} type="button" className={cn("vsd-res-btn", audioSettings.quality === q && "is-active")} onClick={() => setAudioSetting("quality", q)}>{q}</button>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                          {showSfxGrid && (
                            <>
                              <div className="vsd-row">
                                <span className="vsd-label">Duration</span>
                                <div className="vsd-res-pills">
                                  {sfxDurationOptions.map((d) => (
                                    <button key={d} type="button" className={cn("vsd-res-btn", sfxSettings.duration === d && "is-active")} onClick={() => setSfxSetting("duration", d)}>{d}</button>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                          {showVoiceoverGrid && (
                            <>
                              <div className="vsd-row">
                                <span className="vsd-label">Voice</span>
                                <div className="vsd-res-pills">
                                  {voiceOptions.map((v) => (
                                    <button key={v} type="button" className={cn("vsd-res-btn", voiceoverSettings.voice === v && "is-active")} onClick={() => setVoiceoverSetting("voice", v)}>{v}</button>
                                  ))}
                                </div>
                              </div>
                              <div className="vsd-row">
                                <span className="vsd-label">Speed</span>
                                <div className="vsd-res-pills">
                                  {speedOptions.map((s) => (
                                    <button key={s} type="button" className={cn("vsd-res-btn", voiceoverSettings.speed === s && "is-active")} onClick={() => setVoiceoverSetting("speed", s)}>{s}</button>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    />
                  </Card>
                </CollapsibleContent>
              </aside>
            </Collapsible>
          </div>
        </main>
      </div>
    </TooltipProvider>
    </>
  );
}
