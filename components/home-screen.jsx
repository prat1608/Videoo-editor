"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Check,
  Video,
  BarChart2,
  Layers,
  Sparkles,
  FileText,
  RefreshCw,
  Scissors,
  Mic2,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Headphones,
  Bell,
  FilePlus2,
  PanelLeftClose,
  PanelLeftOpen,
  Wand2,
  Subtitles,
  Music,
  Clapperboard,
  Crop,
  ImageUp,
  LayoutGrid,
  RectangleHorizontal,
  ArrowUpDown,
  Clock,
  X,
} from "lucide-react";
import logoMark from "@/assets/Logo.svg";
import { cn } from "@/lib/utils";

const sidebarRecentProjects = [
  { id: 1, title: "Untitled Project", color: "#5a3a4a" },
  { id: 2, title: "Rough Cuts Project", color: "#2a2a3a" },
  { id: 3, title: "Make roughcuts", color: "#3a2a2a" },
  { id: 4, title: "Lion in Snowy Mount...", color: "#1a1a1a" },
  { id: 5, title: "/generate-image ima...", color: "#1a1a1a" },
  { id: 6, title: "Untitled Project", color: "#252525" },
  { id: 7, title: "Untitled Project", color: "#30263a" },
  { id: 8, title: "Untitled Project", color: "#3a2a1a" },
  { id: 9, title: "Untitled Project", color: "#1a2a3a" },
  { id: 10, title: "Untitled Project", color: "#232323" },
  { id: 11, title: "Social Media Clip Cr...", color: "#1a1a2a" },
];

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

const homeImageStyles = [
  { name: "3D Render",     photoId: 3862132, ratio: "16 / 9" },
  { name: "Monochrome",    photoId: 1266808, ratio: "16 / 9" },
  { name: "Minecraft",     photoId: 1462726, ratio: "16 / 9" },
  { name: "Anime",         photoId: 2110951, ratio: "16 / 9" },
  { name: "Oil Painting",  photoId: 1568607, ratio: "16 / 9" },
  { name: "Impressionist", photoId: 3621344, ratio: "16 / 9" },
  { name: "Watercolor",    photoId: 1269968, ratio: "1 / 1"  },
  { name: "Comic Book",    photoId: 1762851, ratio: "1 / 1"  },
  { name: "Neon Noir",     photoId: 1183992, ratio: "1 / 1"  },
  { name: "Cyberpunk",     photoId: 2007647, ratio: "1 / 1"  },
  { name: "Vintage Film",  photoId: 1209843, ratio: "9 / 16" },
  { name: "Pencil Sketch", photoId: 958164,  ratio: "9 / 16" },
  { name: "Pixel Art",     photoId: 1563356, ratio: "9 / 16" },
  { name: "Cinematic",     photoId: 1552212, ratio: "9 / 16" },
  { name: "Surreal",       photoId: 1252869, ratio: "9 / 16" },
  { name: "Studio Ghibli", photoId: 1287145, ratio: "9 / 16" },
];

const homeVideoClips = [
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

const toolsAndSkills = [
  { key: "generate", label: "Generate Video", icon: Clapperboard },
  { key: "captions", label: "Auto Captions", icon: Subtitles },
  { key: "enhance", label: "AI Enhance", icon: Wand2 },
  { key: "music", label: "Background Music", icon: Music },
  { key: "crop", label: "Smart Crop", icon: Crop },
];

const imageModels = ["Imagen 4", "Flux 1.1 Pro", "DALL·E 3", "Stable Diffusion 3.5"];
const imageRatioOptions = ["1:1", "4:3", "3:4", "16:9", "9:16"];
const imageResolutionOptions = ["512px", "768px", "1024px", "2048px"];
const imageQualityOptions = ["Standard", "HD"];

const videoModels = ["Sora", "Runway Gen-3", "Kling 1.6", "Luma Dream Machine"];
const videoRatioOptions = ["16:9", "9:16", "1:1", "4:3"];
const videoDurationOptions = ["5s", "10s", "15s", "30s"];
const videoQualityOptions = ["360p", "720p", "1080p", "4K"];

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
  const [spacesOpen, setSpacesOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [modelOpen, setModelOpen] = useState(false);
  const [hoveredProvider, setHoveredProvider] = useState(null);
  const [selectedModel, setSelectedModel] = useState({
    providerId: "deepseek-v4-pro",
    submodelId: null,
    label: "DeepSeek V4 Pro",
    iconBg: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)",
  });
  const [isFocused, setIsFocused] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeGrid, setActiveGrid] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [imageSettings, setImageSettings] = useState({ model: "Imagen 4", ratio: "1:1", resolution: "1024px", quality: "Standard" });
  const [videoSettings, setVideoSettings] = useState({ model: "Sora", ratio: "16:9", duration: "5s", quality: "1080p" });
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [openChip, setOpenChip] = useState(null);
  const [chipDropdownPos, setChipDropdownPos] = useState(null);
  const chipRefs = useRef({});
  const chipDropdownRef = useRef(null);
  const modelRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState(null);
  const promptCardRef = useRef(null);
  const imageRefInputRef = useRef(null);
  const [videoStartAttachment, setVideoStartAttachment] = useState(null);
  const [videoEndAttachment, setVideoEndAttachment] = useState(null);
  const videoStartInputRef = useRef(null);
  const videoEndInputRef = useRef(null);

  useLayoutEffect(() => {
    if (!prompt) { setActiveGrid(null); return; }
    const videoMatch = /\bvideo\b/i.test(prompt);
    const imageMatch = !videoMatch && /\bimage\b/i.test(prompt);
    setActiveGrid(videoMatch ? "video" : imageMatch ? "image" : null);
  }, [prompt]);

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

  useEffect(() => {
    if (!openChip) return;
    function handleClickOutside(e) {
      const inChipBtn = Object.values(chipRefs.current).some((el) => el?.contains(e.target));
      const inChipDropdown = chipDropdownRef.current?.contains(e.target);
      if (!inChipBtn && !inChipDropdown) setOpenChip(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openChip]);

  function openChipFn(key) {
    const el = chipRefs.current[key];
    if (el) {
      const rect = el.getBoundingClientRect();
      setChipDropdownPos({ bottom: window.innerHeight - rect.top + 8, left: rect.left });
    }
    setOpenChip((prev) => (prev === key ? null : key));
  }

  return (
    <div className={cn("home-shell", isFocused && "is-focused", activeGrid && "has-grid")}>
      <aside className={cn("home-sidebar", sidebarCollapsed && "is-collapsed")}>
        <div className="home-sidebar-logo">
          {!sidebarCollapsed && <Image src={logoMark} alt="Videoo" priority />}
          <button
            type="button"
            className="home-sidebar-collapse-btn"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setSidebarCollapsed((v) => !v)}
          >
            {sidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </button>
        </div>

        <nav className="home-sidebar-nav">
          <Link href="/editor" className="home-nav-item">
            <span className="home-nav-icon"><FilePlus2 /></span>
            <span>New Project</span>
          </Link>
          <button type="button" className="home-nav-item">
            <span className="home-nav-icon"><Video /></span>
            <span>Record</span>
            <span className="home-nav-badge">New</span>
          </button>
          <button type="button" className="home-nav-item">
            <span className="home-nav-icon"><BarChart2 /></span>
            <span>Assets</span>
          </button>
        </nav>

        <div className="home-sidebar-section">
          <button
            type="button"
            className="home-sidebar-section-header"
            onClick={() => setToolsOpen(!toolsOpen)}
          >
            <Wand2 />
            <span>Tools &amp; Skills</span>
            <ChevronDown className={cn("home-section-chevron", toolsOpen && "is-open")} />
          </button>
          {toolsOpen && (
            <div className="home-tools-list">
              {toolsAndSkills.map((tool) => (
                <button key={tool.key} type="button" className="home-tool-item">
                  <tool.icon className="home-tool-icon" />
                  <span>{tool.label}</span>
                </button>
              ))}
              <button type="button" className="home-tool-item home-more-tools">
                <span>More Tools</span>
                <ChevronRight className="home-more-tools-chevron" />
              </button>
            </div>
          )}
        </div>

        <div className="home-sidebar-section">
          <button
            type="button"
            className="home-sidebar-section-header"
            onClick={() => setSpacesOpen(!spacesOpen)}
          >
            <Layers />
            <span>Spaces</span>
            <ChevronDown className={cn("home-section-chevron", spacesOpen && "is-open")} />
          </button>
          {spacesOpen && (
            <div className="home-spaces-list">
              <button type="button" className="home-space-item is-active">
                <span className="home-space-avatar">D</span>
                <span>Default Space</span>
              </button>
              <button type="button" className="home-nav-item home-new-space">
                <Plus className="home-new-space-icon" />
                <span>New Space</span>
              </button>
            </div>
          )}
        </div>

        <div className="home-sidebar-section home-recent-section">
          <div className="home-sidebar-section-label">Recent</div>
          <div className="home-recent-list">
            {sidebarRecentProjects.map((project) => (
              <button key={project.id} type="button" className="home-recent-item">
                <span className="home-recent-thumb" style={{ background: project.color }} />
                <span className="home-recent-title">{project.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="home-sidebar-footer">
          <div className="home-sidebar-footer-icons">
            <button type="button" className="home-footer-icon-button" aria-label="Docs">
              <BookOpen />
            </button>
            <button type="button" className="home-footer-icon-button" aria-label="Support">
              <Headphones />
            </button>
            <button type="button" className="home-footer-icon-button" aria-label="Notifications">
              <Bell />
            </button>
          </div>
          <button type="button" className="home-user-button" aria-label="Account">
            <span className="home-user-avatar">P</span>
          </button>
        </div>
      </aside>

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

          <div className="home-prompt-card" ref={promptCardRef}>
            {activeGrid === "image" && (
              <div className="home-image-ref-row">
                {selectedAttachment ? (
                  <div className="chat-attachment-card">
                    <div className="chat-attachment-inner">
                      <img src={selectedAttachment.url} alt="ref" className="chat-attachment-thumb" />
                      <span className="chat-attachment-label">{selectedAttachment.name}</span>
                      <button type="button" className="chat-attachment-remove" onClick={() => setSelectedAttachment(null)}>
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" className="chat-image-ref-placeholder" onClick={() => imageRefInputRef.current?.click()}>
                    <ImageUp size={14} className="chat-image-ref-icon" />
                    <span className="chat-image-ref-label">Add image reference</span>
                    <span className="chat-image-ref-optional">Optional</span>
                  </button>
                )}
                <input ref={imageRefInputRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setSelectedAttachment({ name: f.name, url: URL.createObjectURL(f) }); e.target.value = ""; }} />
              </div>
            )}

            {activeGrid === "video" && (
              <div className="home-image-ref-row home-video-ref-row">
                {videoStartAttachment ? (
                  <div className="chat-attachment-card">
                    <div className="chat-attachment-inner">
                      <img src={videoStartAttachment.url} alt="start" className="chat-attachment-thumb" />
                      <span className="chat-attachment-label">{videoStartAttachment.name}</span>
                      <button type="button" className="chat-attachment-remove" onClick={() => setVideoStartAttachment(null)}>
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" className="chat-image-ref-placeholder" onClick={() => videoStartInputRef.current?.click()}>
                    <ImageUp size={14} className="chat-image-ref-icon" />
                    <span className="chat-image-ref-label">Start image</span>
                    <span className="chat-image-ref-optional">Optional</span>
                  </button>
                )}
                <input ref={videoStartInputRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setVideoStartAttachment({ name: f.name, url: URL.createObjectURL(f) }); e.target.value = ""; }} />

                {videoEndAttachment ? (
                  <div className="chat-attachment-card">
                    <div className="chat-attachment-inner">
                      <img src={videoEndAttachment.url} alt="end" className="chat-attachment-thumb" />
                      <span className="chat-attachment-label">{videoEndAttachment.name}</span>
                      <button type="button" className="chat-attachment-remove" onClick={() => setVideoEndAttachment(null)}>
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" className="chat-image-ref-placeholder" onClick={() => videoEndInputRef.current?.click()}>
                    <ImageUp size={14} className="chat-image-ref-icon" />
                    <span className="chat-image-ref-label">End image</span>
                    <span className="chat-image-ref-optional">Optional</span>
                  </button>
                )}
                <input ref={videoEndInputRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setVideoEndAttachment({ name: f.name, url: URL.createObjectURL(f) }); e.target.value = ""; }} />
              </div>
            )}
            <div className="home-prompt-editor-wrap">
              <textarea
                className="home-prompt-editor"
                placeholder={isFocused ? "Type / for commands" : "Describe your next shot..."}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsFocused(true)}
                rows={2}
              />
            </div>
            <div className="home-prompt-actions">
              <button type="button" className="home-prompt-plus" aria-label="Attach">
                <Plus />
              </button>
              {(activeGrid === "image" || activeGrid === "video") && (
                <div className="video-gen-settings home-image-settings">
                  <div className="video-chip-wrap">
                    <button ref={(el) => { chipRefs.current.model = el; }} type="button"
                      className={cn("video-gen-chip", openChip === "model" && "is-active")}
                      onClick={() => openChipFn("model")}>
                      <LayoutGrid size={13} />
                      <span>{activeGrid === "image" ? imageSettings.model : videoSettings.model}</span>
                      <ChevronDown size={11} />
                    </button>
                  </div>
                  <div className="video-chip-wrap">
                    <button ref={(el) => { chipRefs.current.ratio = el; }} type="button"
                      className={cn("video-gen-chip", openChip === "ratio" && "is-active")}
                      onClick={() => openChipFn("ratio")}>
                      <RectangleHorizontal size={13} />
                      <span>{activeGrid === "image" ? imageSettings.ratio : videoSettings.ratio}</span>
                      <ChevronDown size={11} />
                    </button>
                  </div>
                  <div className="video-chip-wrap">
                    <button ref={(el) => { chipRefs.current.third = el; }} type="button"
                      className={cn("video-gen-chip", openChip === "third" && "is-active")}
                      onClick={() => openChipFn("third")}>
                      {activeGrid === "image" ? <ArrowUpDown size={13} /> : <Clock size={13} />}
                      <span>{activeGrid === "image" ? imageSettings.resolution : videoSettings.duration}</span>
                      <ChevronDown size={11} />
                    </button>
                  </div>
                  <div className="video-chip-wrap">
                    <button ref={(el) => { chipRefs.current.quality = el; }} type="button"
                      className={cn("video-gen-chip", openChip === "quality" && "is-active")}
                      onClick={() => openChipFn("quality")}>
                      <Sparkles size={13} />
                      <span>{activeGrid === "image" ? imageSettings.quality : videoSettings.quality}</span>
                      <ChevronDown size={11} />
                    </button>
                  </div>
                </div>
              )}
              <div className="home-prompt-right">
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
                </div>
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
                          <span
                            className="home-model-provider-icon"
                            style={{ background: provider.iconBg, color: provider.iconColor }}
                          >
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
                <button type="button" className="home-prompt-send" aria-label="Send">
                  <ArrowUp />
                </button>
              </div>
            </div>
          </div>

          <div className="home-action-chips">
            {actionChips.map((chip) => (
              <button key={chip.key} type="button" className="home-action-chip">
                <chip.icon />
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeGrid === "image" && (
          <div className="home-style-grid-wrap">
            <div className="video-bento-grid">
              {homeImageStyles.slice(0, 10).map((style, i) => (
                <button
                  key={style.name}
                  type="button"
                  className={cn("image-style-card", `bento-item-${i}`, selectedStyle === style.name && "is-selected")}
                  onClick={() => setSelectedStyle(style.name === selectedStyle ? null : style.name)}
                >
                  <img
                    src={`https://images.pexels.com/photos/${style.photoId}/pexels-photo-${style.photoId}.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop`}
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
            <div className="video-bento-grid">
              {homeVideoClips.map((vid, i) => {
                const poster = `https://images.pexels.com/videos/${vid.id}/free-video-${vid.id}.jpg?auto=compress&cs=tinysrgb&dpr=1&fit=crop`;
                const src    = `https://videos.pexels.com/video-files/${vid.id}/free-${vid.id}-hd_1920_1080_25fps.mp4`;
                return (
                  <button
                    key={vid.id}
                    type="button"
                    className={cn("video-style-card", `bento-item-${i}`, selectedStyle === String(vid.id) && "is-selected")}
                    onClick={() => setSelectedStyle(String(vid.id) === selectedStyle ? null : String(vid.id))}
                  >
                    <video src={src} poster={poster} muted loop playsInline autoPlay className="video-style-clip" />
                    <span className="image-style-label">{vid.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
      </main>

      {openChip && chipDropdownPos && createPortal(
        <div
          ref={chipDropdownRef}
          className="video-chip-dropdown"
          style={{ position: "fixed", bottom: chipDropdownPos.bottom, left: chipDropdownPos.left }}
        >
          {openChip === "model" && (activeGrid === "image" ? imageModels : videoModels).map((m) => {
            const active = activeGrid === "image" ? imageSettings.model === m : videoSettings.model === m;
            const setter = activeGrid === "image" ? setImageSettings : setVideoSettings;
            return (
              <button key={m} type="button"
                className={cn("video-chip-option", active && "is-active")}
                onClick={() => { setter((s) => ({ ...s, model: m })); setOpenChip(null); }}>
                {m}{active && <Check size={12} />}
              </button>
            );
          })}
          {openChip === "ratio" && (activeGrid === "image" ? imageRatioOptions : videoRatioOptions).map((r) => {
            const active = activeGrid === "image" ? imageSettings.ratio === r : videoSettings.ratio === r;
            const setter = activeGrid === "image" ? setImageSettings : setVideoSettings;
            return (
              <button key={r} type="button"
                className={cn("video-chip-option", active && "is-active")}
                onClick={() => { setter((s) => ({ ...s, ratio: r })); setOpenChip(null); }}>
                {r}{active && <Check size={12} />}
              </button>
            );
          })}
          {openChip === "third" && activeGrid === "image" && imageResolutionOptions.map((res) => (
            <button key={res} type="button"
              className={cn("video-chip-option", imageSettings.resolution === res && "is-active")}
              onClick={() => { setImageSettings((s) => ({ ...s, resolution: res })); setOpenChip(null); }}>
              {res}{imageSettings.resolution === res && <Check size={12} />}
            </button>
          ))}
          {openChip === "third" && activeGrid === "video" && videoDurationOptions.map((d) => (
            <button key={d} type="button"
              className={cn("video-chip-option", videoSettings.duration === d && "is-active")}
              onClick={() => { setVideoSettings((s) => ({ ...s, duration: d })); setOpenChip(null); }}>
              {d}{videoSettings.duration === d && <Check size={12} />}
            </button>
          ))}
          {openChip === "quality" && (activeGrid === "image" ? imageQualityOptions : videoQualityOptions).map((q) => {
            const active = activeGrid === "image" ? imageSettings.quality === q : videoSettings.quality === q;
            const setter = activeGrid === "image" ? setImageSettings : setVideoSettings;
            return (
              <button key={q} type="button"
                className={cn("video-chip-option", active && "is-active")}
                onClick={() => { setter((s) => ({ ...s, quality: q })); setOpenChip(null); }}>
                {q}{active && <Check size={12} />}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}
