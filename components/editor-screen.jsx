"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpDown,
  ChevronDown,
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
  Pipette,
  Plus,
  RectangleHorizontal,
  Redo2,
  RotateCcw,
  RotateCw,
  Scissors,
  Settings2,
  Shapes,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  Upload,
  Volume2,
  VolumeX,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import logoMark from "@/assets/Logo.svg";

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
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

const imageStyles = [
  { name: "3D Render",       photoId: 3862132 },
  { name: "Monochrome",      photoId: 1266808 },
  { name: "Minecraft",       photoId: 1462726 },
  { name: "Anime",           photoId: 2110951 },
  { name: "Oil Painting",    photoId: 1568607 },
  { name: "Watercolor",      photoId: 1269968 },
  { name: "Comic Book",      photoId: 1762851 },
  { name: "Neon Noir",       photoId: 1183992 },
  { name: "Cyberpunk",       photoId: 2007647 },
  { name: "Vintage Film",    photoId: 1209843 },
  { name: "Pencil Sketch",   photoId: 958164  },
  { name: "Pixel Art",       photoId: 1563356 },
  { name: "Cinematic",       photoId: 1552212 },
  { name: "Surreal",         photoId: 1252869 },
  { name: "Studio Ghibli",   photoId: 1287145 },
  { name: "Impressionist",   photoId: 3621344 },
];

const videoClips = [
  { id: 856396,  name: "Urban Timelapse", ratio: "16 / 9" },
  { id: 1093662, name: "Ocean Waves",     ratio: "16 / 9" },
  { id: 2795750, name: "Forest Trail",    ratio: "16 / 9" },
  { id: 3195394, name: "Abstract",        ratio: "1 / 1"  },
  { id: 3584816, name: "Lifestyle",       ratio: "1 / 1"  },
  { id: 4098981, name: "Close Up",        ratio: "1 / 1"  },
  { id: 4226768, name: "Street Style",    ratio: "9 / 16" },
  { id: 6782462, name: "Portrait",        ratio: "9 / 16" },
  { id: 4207907, name: "Urban Walk",      ratio: "9 / 16" },
  { id: 5489782, name: "Vertical",        ratio: "9 / 16" },
];

const toolsSections = [
  {
    id: "generation",
    title: "Generation Tools",
    accent: "#7c3aed",
    tools: [
      { id: "generate-image",     name: "Generate Image",     desc: "Create from text prompt", icon: ImageUp  },
      { id: "generate-video",     name: "Generate Video",     desc: "Text or image to video",  icon: Film     },
      { id: "generate-music",     name: "Generate Music",     desc: "AI background tracks",    icon: Music4   },
      { id: "generate-voiceover", name: "Generate Voiceover", desc: "Natural AI narration",    icon: Mic      },
      { id: "generate-sfx",       name: "Generate SFX",       desc: "Sound effects on demand", icon: Volume2  },
    ],
  },
  {
    id: "skills",
    title: "Skills",
    accent: "#0891b2",
    tools: [
      { id: "autodemo",  name: "Autodemo",  desc: "Auto-generate product demos", icon: Zap       },
      { id: "roughcuts", name: "Roughcuts", desc: "AI-assembled rough edit",     icon: Scissors  },
      { id: "clipping",  name: "Clipping",  desc: "Extract best moments",        icon: Film      },
    ],
  },
  {
    id: "basic",
    title: "Basic Tools",
    accent: "#16a34a",
    tools: [
      { id: "trim",    name: "Trim",    desc: "Cut clip in & out points", icon: Scissors  },
      { id: "merge",   name: "Merge",   desc: "Join clips together",      icon: GitMerge  },
      { id: "speed",   name: "Speed",   desc: "Ramp or constant speed",   icon: Gauge     },
      { id: "reverse", name: "Reverse", desc: "Play footage backwards",   icon: RotateCcw },
      { id: "rotate",  name: "Rotate",  desc: "Flip or rotate frame",     icon: RotateCw  },
      { id: "crop",    name: "Crop",    desc: "Trim frame edges",         icon: Crop      },
    ],
  },
];

const railItems = [
  { key: "files",    label: "Files",           icon: FileText  },
  { key: "media",    label: "Media",           icon: ImageUp   },
  { key: "audio",    label: "Audio",           icon: Music4    },
  { key: "text",     label: "Text",            icon: Type      },
  { key: "elements", label: "Elements",        icon: Shapes    },
  { key: "tools",    label: "Tools & Skills",  icon: Zap       },
  { key: "settings", label: "Settings",        icon: Settings2 },
];

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

function AutoplayVideo({ src, poster, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.play().catch(() => {});
  }, [src]);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
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

function MediaPanel() {
  return (
    <>
      <section className="panel-section">
        <p className="section-title">Upload media</p>
        <PanelButton className="empty-dropzone">
          <strong>Drop video, image or GIF files</strong>
          <small>Drag them straight into the canvas or timeline</small>
        </PanelButton>
      </section>

      <section className="panel-section two-up">
        <PanelButton className="preset-card">
          <span>
            <strong>Brand Intro</strong>
            <small>5 clips</small>
          </span>
        </PanelButton>
        <PanelButton className="preset-card">
          <span>
            <strong>Social Reel</strong>
            <small>9:16</small>
          </span>
        </PanelButton>
      </section>
    </>
  );
}

function PanelContent({ panel, selectedTools, onToggle }) {
  switch (panel) {
    case "media":
      return <MediaPanel />;
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
  return (
    <>
      {toolsSections.map((section) => (
        <section className="panel-section" key={section.id}>
          <p className="section-title">{section.title}</p>
          <div className="tools-grid">
            {section.tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={cn("tool-card", selectedTools?.some((t) => t.id === tool.id) && "is-selected")}
                onClick={() => onToggle?.(tool)}
              >
                <span className="tool-card-icon" style={{ background: `${section.accent}22`, color: section.accent }}>
                  <tool.icon />
                </span>
                <span className="tool-card-body">
                  <span className="tool-card-name">{tool.name}</span>
                  <span className="tool-card-desc">{tool.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </>
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
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [chatPanelWidth, setChatPanelWidth] = useState(400);
  const [timelineOpen, setTimelineOpen] = useState(true);
  const [timelineHeight, setTimelineHeight] = useState(196);
  const [syncState] = useState("saved");
  const [interactionMode, setInteractionMode] = useState("hand");
  const [canvasZoom, setCanvasZoom] = useState(80);
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
  const [activeGrid, setActiveGrid] = useState(null);
  const [selectedTools, setSelectedTools] = useState([]);
  const [videoSettings, setVideoSettings] = useState({
    model: "Veo 3.1 Lite",
    ratio: "16:9",
    resolution: "1080p",
    duration: "15s",
    audio: false,
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chatNarrow, setChatNarrow] = useState(false);
  const [openChip, setOpenChip] = useState(null);

  const videoModels      = ["Veo 3.1 Lite", "Veo 3.0", "Kling 1.6 Pro", "Wan 2.1", "Hailuo"];
  const ratioOptions     = ["16:9", "1:1", "9:16"];
  const resolutionOptions = ["480p", "720p", "1080p", "4K"];
  const durationOptions  = ["5s", "8s", "10s", "15s", "20s", "30s"];

  function setVideoSetting(key, value) {
    setVideoSettings((s) => ({ ...s, [key]: value }));
  }

  function toggleChip(key) {
    setOpenChip((c) => (c === key ? null : key));
  }

  const timelineRulerRef = useRef(null);
  const workspaceBodyRef = useRef(null);
  const canvasStageRef = useRef(null);
  const canvasArtboardRef = useRef(null);
  const chatPromptRef = useRef(null);
  const chatModelRef = useRef(null);
  const chatActionsRef = useRef(null);
  const settingsRef = useRef(null);
  const chipSettingsRef = useRef(null);
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
    startWidth: 400,
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
  const showVideoGrid = activeGrid === "video";
  const showImageGrid = activeGrid === "image";

  useLayoutEffect(() => {
    if (!chatDraft) {
      setActiveGrid(null);
      return;
    }
    const videoMatch = /\bvideo\b/i.test(chatDraft);
    const imageMatch = /\bimage\b/i.test(chatDraft);
    if (videoMatch) setActiveGrid("video");
    else if (imageMatch) setActiveGrid("image");
    // Keep current grid if text exists but neither keyword is present
  }, [chatDraft]); // eslint-disable-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    const el = chatActionsRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setChatNarrow(entry.contentRect.width < 400);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!settingsOpen) return;
    function handleOutside(e) {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [settingsOpen]);

  useEffect(() => {
    if (!openChip) return;
    function handleOutside(e) {
      if (chipSettingsRef.current && !chipSettingsRef.current.contains(e.target)) {
        setOpenChip(null);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [openChip]);

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
    if (tool.id === "generate-video") setActiveGrid(isSelected ? null : "video");
    if (tool.id === "generate-image") setActiveGrid(isSelected ? null : "image");
  }

  function removeToolChip(toolId) {
    setSelectedTools((current) => current.filter((t) => t.id !== toolId));
    if (toolId === "generate-video") setActiveGrid(null);
    if (toolId === "generate-image") setActiveGrid(null);
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
    <TooltipProvider delayDuration={120}>
      <div className={cn("app-shell", isLeftPanelVisible && "left-panel-open", allSectionsVisible && "is-all-sections-visible")}>
        <aside className={cn("left-sidebar-shell", !isLeftPanelVisible && "is-collapsed")}>
          <div className="left-rail">
            <Link href="/" className="brand" aria-label="Go to home">
              <Image src={logoMark} alt="Videoo" priority />
            </Link>

            <nav className="rail-nav" aria-label="Editor tools">
              {railItems.map((item) => (
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
                <h1>{railItems.find((item) => item.key === activePanel)?.label ?? "Panel"}</h1>
                <div className="panel-actions">
                  <IconButton icon={Upload} label="Upload" />
                  <IconButton icon={Trash2} label="Delete" />
                </div>
              </div>

              <CollapsibleContent forceMount className="panel-scroll">
                {activePanel ? <PanelContent panel={activePanel} selectedTools={selectedTools} onToggle={toggleToolChip} /> : null}
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
                gridTemplateRows: timelineOpen ? `52px minmax(0, 1fr) ${timelineHeight}px` : "52px minmax(0, 1fr) 50px",
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
                    <span className="project-name">Untitled Project</span>
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
                        <div ref={canvasArtboardRef} className="canvas-artboard" aria-label="Canvas" />
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
                        <Card className="upload-card">
                          <Upload />
                          <span>Upload Media</span>
                        </Card>
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
                    {showVideoGrid && (
                      <div className="video-style-panel">
                        <div className="video-bento-grid">
                          {videoClips.map((vid, i) => {
                            const poster = `https://images.pexels.com/videos/${vid.id}/free-video-${vid.id}.jpg?auto=compress&cs=tinysrgb&dpr=1&fit=crop`;
                            const src = `https://videos.pexels.com/video-files/${vid.id}/free-${vid.id}-hd_1920_1080_25fps.mp4`;
                            return (
                              <button
                                key={vid.id}
                                type="button"
                                className={cn("video-style-card", `bento-item-${i}`, selectedAttachment?.id === vid.id && "is-selected")}
                                onClick={() => setSelectedAttachment({ type: "video", id: vid.id, name: vid.name, poster, src })}
                              >
                                <AutoplayVideo src={src} poster={poster} className="video-style-clip" />
                                <span className="image-style-label">{vid.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {showImageGrid && (
                      <div className="image-style-panel">
                        <div className="image-style-grid">
                          {imageStyles.map((style) => (
                            <button
                              key={style.name}
                              type="button"
                              className={cn("image-style-card", selectedAttachment?.name === style.name && "is-selected")}
                              onClick={() => setSelectedAttachment({ type: "image", name: style.name, url: `https://images.pexels.com/photos/${style.photoId}/pexels-photo-${style.photoId}.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop` })}
                            >
                              <img
                                src={`https://images.pexels.com/photos/${style.photoId}/pexels-photo-${style.photoId}.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop`}
                                alt={style.name}
                                className="image-style-thumb"
                              />
                              <span className="image-style-label">{style.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {!showVideoGrid && !showImageGrid && (
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

                  <Card className="chat-card">
                    {(selectedAttachment || selectedTools.length > 0) && (
                      <div className="chat-prompt-refs">
                        {selectedAttachment && (
                          <div className="chat-attachment-card">
                            <div className="chat-attachment-inner">
                              <img
                                src={selectedAttachment.poster ?? selectedAttachment.url}
                                alt={selectedAttachment.name}
                                className="chat-attachment-thumb"
                              />
                              {selectedAttachment.type === "video" && (
                                <div className="chat-attachment-play">
                                  <PlayFilledGlyph />
                                </div>
                              )}
                              <span className="chat-attachment-label">{selectedAttachment.name}</span>
                            </div>
                            <button
                              type="button"
                              className="chat-attachment-remove"
                              aria-label={`Remove ${selectedAttachment.name}`}
                              onClick={() => setSelectedAttachment(null)}
                            >
                              <X />
                            </button>
                          </div>
                        )}
                        {selectedTools.map((tool) => (
                          <div key={tool.id} className="chat-tool-chip">
                            <span>{tool.name}</span>
                            <button
                              type="button"
                              className="chat-tool-chip-remove"
                              aria-label={`Remove ${tool.name}`}
                              onClick={() => removeToolChip(tool.id)}
                            >
                              <X />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="chat-prompt-input-shell">
                      <div className="chat-prompt-editor-wrap">
                        <div
                          ref={chatPromptRef}
                          contentEditable
                          suppressContentEditableWarning
                          className="chat-prompt-editor"
                          role="textbox"
                          aria-multiline="true"
                          aria-label="Video prompt input"
                          onInput={(event) => {
                            const text = event.currentTarget.textContent ?? "";
                            setChatThreads((current) =>
                              current.map((thread) =>
                                thread.id === activeChatId ? { ...thread, draft: text } : thread
                              )
                            );
                          }}
                        />
                        <div className="chat-prompt-overlay" style={{ opacity: chatDraft ? 0 : 1 }}>
                          Write your idea or edit instructions...
                        </div>
                      </div>

                      <div className="chat-prompt-actions" ref={chatActionsRef}>
                        <div className="chat-prompt-left">
                          <Button type="button" variant="ghost" size="icon" className="chat-plus" aria-label="Attach or record">
                            <Plus />
                          </Button>
                          {showVideoGrid && (
                            chatNarrow ? (
                              <div className="video-settings-wrap" ref={settingsRef}>
                                <button
                                  type="button"
                                  className={cn("video-settings-trigger", settingsOpen && "is-open")}
                                  onClick={() => setSettingsOpen((v) => !v)}
                                  aria-label="Video settings"
                                >
                                  <SlidersHorizontal />
                                </button>
                                {settingsOpen && (
                                  <div className="video-settings-dialog">
                                    <div className="vsd-row">
                                      <span className="vsd-label">Model</span>
                                      <div className="vsd-res-pills">
                                        {videoModels.map((m) => (
                                          <button
                                            key={m}
                                            type="button"
                                            className={cn("vsd-res-btn", videoSettings.model === m && "is-active")}
                                            onClick={() => setVideoSetting("model", m)}
                                          >
                                            {m}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="vsd-row">
                                      <span className="vsd-label">Video ratio</span>
                                      <div className="vsd-ratio-pills">
                                        {ratioOptions.map((r) => (
                                          <button
                                            key={r}
                                            type="button"
                                            className={cn("vsd-ratio-btn", videoSettings.ratio === r && "is-active")}
                                            onClick={() => setVideoSetting("ratio", r)}
                                          >
                                            <span className={cn("vsd-ratio-shape", `vsd-ratio-${r.replace(":", "-")}`)} />
                                            <span>{r}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="vsd-row">
                                      <span className="vsd-label">Duration</span>
                                      <div className="vsd-res-pills">
                                        {durationOptions.map((d) => (
                                          <button
                                            key={d}
                                            type="button"
                                            className={cn("vsd-res-btn", videoSettings.duration === d && "is-active")}
                                            onClick={() => setVideoSetting("duration", d)}
                                          >
                                            {d}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="vsd-row">
                                      <span className="vsd-label">Resolution</span>
                                      <div className="vsd-res-pills">
                                        {resolutionOptions.map((r) => (
                                          <button
                                            key={r}
                                            type="button"
                                            className={cn("vsd-res-btn", videoSettings.resolution === r && "is-active")}
                                            onClick={() => setVideoSetting("resolution", r)}
                                          >
                                            {r}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="vsd-row">
                                      <span className="vsd-label">Audio</span>
                                      <div className="vsd-res-pills">
                                        {["Off", "On"].map((a) => (
                                          <button
                                            key={a}
                                            type="button"
                                            className={cn("vsd-res-btn", videoSettings.audio === (a === "On") && "is-active")}
                                            onClick={() => setVideoSetting("audio", a === "On")}
                                          >
                                            {a}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="video-gen-settings" ref={chipSettingsRef}>
                                {/* Model chip */}
                                <div className="video-chip-wrap">
                                  <button
                                    type="button"
                                    className={cn("video-gen-chip", openChip === "model" && "is-active")}
                                    onClick={() => toggleChip("model")}
                                  >
                                    <LayoutGrid /><span>{videoSettings.model}</span><ChevronDown />
                                  </button>
                                  {openChip === "model" && (
                                    <div className="video-chip-dropdown">
                                      {videoModels.map((m) => (
                                        <button
                                          key={m}
                                          type="button"
                                          className={cn("video-chip-option", videoSettings.model === m && "is-active")}
                                          onClick={() => { setVideoSetting("model", m); setOpenChip(null); }}
                                        >
                                          {m}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {/* Ratio chip */}
                                <div className="video-chip-wrap">
                                  <button
                                    type="button"
                                    className={cn("video-gen-chip", openChip === "ratio" && "is-active")}
                                    onClick={() => toggleChip("ratio")}
                                  >
                                    <RectangleHorizontal /><span>{videoSettings.ratio}</span><ChevronDown />
                                  </button>
                                  {openChip === "ratio" && (
                                    <div className="video-chip-dropdown">
                                      {ratioOptions.map((r) => (
                                        <button
                                          key={r}
                                          type="button"
                                          className={cn("video-chip-option", videoSettings.ratio === r && "is-active")}
                                          onClick={() => { setVideoSetting("ratio", r); setOpenChip(null); }}
                                        >
                                          {r}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {/* Resolution chip */}
                                <div className="video-chip-wrap">
                                  <button
                                    type="button"
                                    className={cn("video-gen-chip", openChip === "resolution" && "is-active")}
                                    onClick={() => toggleChip("resolution")}
                                  >
                                    <ArrowUpDown /><span>{videoSettings.resolution}</span><ChevronDown />
                                  </button>
                                  {openChip === "resolution" && (
                                    <div className="video-chip-dropdown">
                                      {resolutionOptions.map((r) => (
                                        <button
                                          key={r}
                                          type="button"
                                          className={cn("video-chip-option", videoSettings.resolution === r && "is-active")}
                                          onClick={() => { setVideoSetting("resolution", r); setOpenChip(null); }}
                                        >
                                          {r}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {/* Duration chip */}
                                <div className="video-chip-wrap">
                                  <button
                                    type="button"
                                    className={cn("video-gen-chip", openChip === "duration" && "is-active")}
                                    onClick={() => toggleChip("duration")}
                                  >
                                    <Clock /><span>{videoSettings.duration}</span><ChevronDown />
                                  </button>
                                  {openChip === "duration" && (
                                    <div className="video-chip-dropdown">
                                      {durationOptions.map((d) => (
                                        <button
                                          key={d}
                                          type="button"
                                          className={cn("video-chip-option", videoSettings.duration === d && "is-active")}
                                          onClick={() => { setVideoSetting("duration", d); setOpenChip(null); }}
                                        >
                                          {d}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {/* Audio chip */}
                                <div className="video-chip-wrap">
                                  <button
                                    type="button"
                                    className={cn("video-gen-chip", openChip === "audio" && "is-active")}
                                    onClick={() => toggleChip("audio")}
                                  >
                                    {videoSettings.audio ? <Volume2 /> : <VolumeX />}
                                    <span>{videoSettings.audio ? "On" : "Off"}</span><ChevronDown />
                                  </button>
                                  {openChip === "audio" && (
                                    <div className="video-chip-dropdown">
                                      {["Off", "On"].map((a) => (
                                        <button
                                          key={a}
                                          type="button"
                                          className={cn("video-chip-option", videoSettings.audio === (a === "On") && "is-active")}
                                          onClick={() => { setVideoSetting("audio", a === "On"); setOpenChip(null); }}
                                        >
                                          {a}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        <div className="chat-prompt-right">
                          <div className="chat-model-selector-wrap" ref={chatModelRef}>
                            <button
                              type="button"
                              className="chat-model-button"
                              onClick={() => setChatModelOpen((v) => !v)}
                            >
                              <span className="chat-model-dot" style={{ background: chatSelectedModel.gradient }} />
                              <span>{chatSelectedModel.label}</span>
                              <ChevronDown className={cn("chat-model-chevron", chatModelOpen && "is-open")} />
                            </button>
                            {chatModelOpen && (
                              <div className="chat-model-dropdown">
                                {editorModels.map((m) => (
                                  <button
                                    key={m.id}
                                    type="button"
                                    className={cn("chat-model-dropdown-item", chatSelectedModel.id === m.id && "is-selected")}
                                    onClick={() => { setChatSelectedModel(m); setChatModelOpen(false); }}
                                  >
                                    <span className="chat-model-dot" style={{ background: m.gradient }} />
                                    <span>{m.label}</span>
                                    {m.tag && <span className="chat-model-tag">{m.tag}</span>}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button type="button" variant="default" size="icon" className="chat-send" aria-label="Send message">
                            <span className="chat-send-rotator">
                              <SendArrowGlyph />
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </CollapsibleContent>
              </aside>
            </Collapsible>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
