"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  CloudCheck,
  CloudUpload,
  FileText,
  Hand,
  History,
  ImageUp,
  Inbox,
  LoaderCircle,
  Minus,
  MousePointer2,
  Music4,
  Pipette,
  Plus,
  Redo2,
  Scissors,
  Settings2,
  Shapes,
  SkipBack,
  SkipForward,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  Upload,
  WandSparkles,
} from "lucide-react";
import logoMark from "@/assets/Logo.svg";

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
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const railItems = [
  { key: "files", label: "Files", icon: FileText },
  { key: "media", label: "Media", icon: ImageUp },
  { key: "audio", label: "Audio", icon: Music4 },
  { key: "text", label: "Text", icon: Type },
  { key: "elements", label: "Elements", icon: Shapes },
  { key: "settings", label: "Settings", icon: Settings2 },
];

function PanelLeftGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="3" />
      <path d="M5.5 4.5v7" />
    </svg>
  );
}

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

function ClaudeGlyph() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" fill="currentColor" stroke="none">
      <path
        fill="currentColor"
        stroke="none"
        d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"
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

function PanelContent({ panel }) {
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

  const timelineRulerRef = useRef(null);
  const workspaceBodyRef = useRef(null);
  const canvasStageRef = useRef(null);
  const canvasArtboardRef = useRef(null);
  const chatPromptRef = useRef(null);
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
  const LeftPanelIcon = PanelLeftGlyph;
  const TimelinePanelIcon = PanelBottomGlyph;
  const activeChat = chatThreads.find((thread) => thread.id === activeChatId) ?? chatThreads[0] ?? null;
  const chatDraft = activeChat?.draft ?? "";
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
            <div className="brand">
              <Image src={logoMark} alt="Videoo" priority />
            </div>

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
                {activePanel ? <PanelContent panel={activePanel} /> : null}
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
                  <Card className="chat-card">
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
                            const nextDraft = event.currentTarget.textContent ?? "";
                            setChatThreads((current) =>
                              current.map((thread) =>
                                thread.id === activeChatId
                                  ? {
                                    ...thread,
                                    draft: nextDraft,
                                  }
                                  : thread
                              )
                            );
                          }}
                        />
                        <div className="chat-prompt-overlay" style={{ opacity: chatDraft ? 0 : 1 }}>
                          Describe your next shot…
                        </div>
                      </div>

                      <div className="chat-prompt-actions">
                        <div className="chat-prompt-left">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="chat-plus"
                            aria-label="Attach or record"
                          >
                            <Plus />
                          </Button>
                        </div>

                        <div className="chat-prompt-right">
                          <Button type="button" variant="ghost" className="chat-model-button">
                            <ClaudeGlyph />
                            <span>Haiku 4.5</span>
                          </Button>
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
