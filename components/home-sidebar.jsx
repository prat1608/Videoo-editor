"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart2,
  Bell,
  BookOpen,
  ChevronDown,
  Clapperboard,
  Download,
  FilePlus2,
  Film,
  Headphones,
  ImageUp,
  Layers,
  Mic,
  Music4,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  Scissors,
  Settings2,
  Sparkles,
  Video,
  Volume2,
  Wand2,
} from "lucide-react";
import logoMark from "@/assets/Logo.svg";
import { cn } from "@/lib/utils";

const toolsAndSkillsMenu = [
  {
    group: "Generation",
    items: [
      { key: "image",     label: "Generate Image",     icon: ImageUp },
      { key: "video",     label: "Generate Video",     icon: Film },
      { key: "audio",     label: "Generate Music",     icon: Music4 },
      { key: "voiceover", label: "Generate Voiceover", icon: Mic },
      { key: "sfx",       label: "Generate SFX",       icon: Volume2 },
      { key: "aimg",      label: "AI Motion Graphics", icon: Sparkles },
    ],
  },
  {
    group: "Skills",
    items: [
      { key: "autodemo",  label: "Autodemo",  icon: Clapperboard },
      { key: "roughcuts", label: "Roughcuts", icon: RefreshCw },
      { key: "clipping",  label: "Clipping",  icon: Scissors },
      { key: "ytimport",  label: "Import Video", icon: Download },
    ],
  },
];

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

export function HomeSidebar({ activePath = "/", onToolSelect }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [spacesOpen, setSpacesOpen] = useState(true);
  const [toolsPopoverOpen, setToolsPopoverOpen] = useState(false);
  const [toolsPopoverPos, setToolsPopoverPos] = useState({ top: 150, left: 256 });

  const toolsTriggerRef = useRef(null);
  const toolsPopoverRef = useRef(null);

  useEffect(() => {
    if (!toolsPopoverOpen) return;
    function handleClickOutside(e) {
      if (
        !toolsTriggerRef.current?.contains(e.target) &&
        !toolsPopoverRef.current?.contains(e.target)
      ) {
        setToolsPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [toolsPopoverOpen]);

  function openToolsPopover() {
    if (toolsPopoverOpen) {
      setToolsPopoverOpen(false);
      return;
    }
    const rect = toolsTriggerRef.current?.getBoundingClientRect();
    setToolsPopoverPos({
      top: rect?.top ?? 150,
      left: (rect?.right ?? 220) + 8,
    });
    setToolsPopoverOpen(true);
  }

  function handleToolSelect(key) {
    setToolsPopoverOpen(false);
    onToolSelect?.(key);
  }

  return (
    <>
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
        <button
          ref={toolsTriggerRef}
          type="button"
          className={cn("home-nav-item", toolsPopoverOpen && "is-active")}
          onClick={openToolsPopover}
        >
          <span className="home-nav-icon"><Wand2 /></span>
          <span>Tools &amp; Skills</span>
        </button>
      </nav>

      <div className="home-sidebar-section">
        <button
          type="button"
          className="home-sidebar-section-header"
          onClick={() => setSpacesOpen((v) => !v)}
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
          <Link
            href="/settings/workspace/5628820d-75f4-47be-8221-029b5723f2c6/integrations"
            className={cn("home-footer-icon-button", activePath.startsWith("/settings") && "is-active")}
            aria-label="Settings"
          >
            <Settings2 />
          </Link>
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

    {toolsPopoverOpen && (
      <div
        ref={toolsPopoverRef}
        className="home-tools-popover"
        style={{ position: "fixed", top: toolsPopoverPos.top, left: toolsPopoverPos.left }}
      >
        {toolsAndSkillsMenu.map((group) => (
          <div key={group.group} className="home-tools-popover-group">
            <div className="home-tools-popover-group-label">{group.group}</div>
            {group.items.map((item) => (
              <button
                key={item.key}
                type="button"
                className="home-tools-popover-item"
                onClick={() => handleToolSelect(item.key)}
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    )}
    </>
  );
}
