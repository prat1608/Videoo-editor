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
  FilePlus2,
  Film,
  Headphones,
  ImageUp,
  Layers,
  ListVideo,
  ArrowRight,
  Ban,
  Mic,
  Monitor,
  MonitorPlay,
  Music4,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  ScissorsLineDashed,
  Settings2,
  Sparkles,
  Video,
  Volume2,
  Wand2,
} from "lucide-react";
import logoMark from "@/assets/Logo.svg";
import { getProjectHref, recentProjects } from "@/lib/projects";
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
      { key: "autodemo",  label: "Autodemo",  icon: Clapperboard,      disabled: true },
      { key: "roughcuts", label: "Roughcuts", icon: ScissorsLineDashed },
      { key: "clipping",  label: "Clipping",  icon: ListVideo },
    ],
  },
];

const recordSourceMenu = [
  { key: "audio", label: "Audio", icon: Mic },
  { key: "camera", label: "Camera", icon: Video },
  { key: "screen", label: "Screen", icon: Monitor },
  { key: "screen-camera", label: "Screen + Camera", icon: MonitorPlay },
];

const TOOLS_POPOVER_GAP = 16;

export function HomeSidebar({ activePath = "/", onToolSelect }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [spacesOpen, setSpacesOpen] = useState(true);
  const [recordPopoverOpen, setRecordPopoverOpen] = useState(false);
  const [recordPopoverPos, setRecordPopoverPos] = useState({ top: 96, left: 256 });
  const [toolsPopoverOpen, setToolsPopoverOpen] = useState(false);
  const [toolsPopoverPos, setToolsPopoverPos] = useState({ top: 150, left: 256 });
  const [disabledTooltipKey, setDisabledTooltipKey] = useState(null);

  const recordTriggerRef = useRef(null);
  const recordPopoverRef = useRef(null);
  const toolsTriggerRef = useRef(null);
  const toolsPopoverRef = useRef(null);

  useEffect(() => {
    if (!recordPopoverOpen && !toolsPopoverOpen) return;
    function handleClickOutside(e) {
      if (
        !recordTriggerRef.current?.contains(e.target) &&
        !recordPopoverRef.current?.contains(e.target) &&
        !toolsTriggerRef.current?.contains(e.target) &&
        !toolsPopoverRef.current?.contains(e.target)
      ) {
        setRecordPopoverOpen(false);
        setToolsPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [recordPopoverOpen, toolsPopoverOpen]);

  function openRecordPopover() {
    if (recordPopoverOpen) {
      setRecordPopoverOpen(false);
      return;
    }
    const rect = recordTriggerRef.current?.getBoundingClientRect();
    setRecordPopoverPos({
      top: rect?.top ?? 96,
      left: (rect?.right ?? 220) + TOOLS_POPOVER_GAP,
    });
    setToolsPopoverOpen(false);
    setRecordPopoverOpen(true);
  }

  function openToolsPopover() {
    if (toolsPopoverOpen) {
      setToolsPopoverOpen(false);
      return;
    }
    const rect = toolsTriggerRef.current?.getBoundingClientRect();
    setToolsPopoverPos({
      top: rect?.top ?? 150,
      left: (rect?.right ?? 220) + TOOLS_POPOVER_GAP,
    });
    setRecordPopoverOpen(false);
    setToolsPopoverOpen(true);
  }

  function handleRecordSelect() {
    setRecordPopoverOpen(false);
  }

  function handleToolSelect(key) {
    setToolsPopoverOpen(false);
    setDisabledTooltipKey(null);
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
        <Link href="/new" className="home-nav-item">
          <span className="home-nav-icon"><FilePlus2 /></span>
          <span>New Project</span>
        </Link>
        <button
          ref={recordTriggerRef}
          type="button"
          className={cn("home-nav-item", recordPopoverOpen && "is-active")}
          onClick={openRecordPopover}
        >
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
          {recentProjects.map((project) => (
            <Link key={project.id} href={getProjectHref(project.id)} className="home-recent-item">
              <span className="home-recent-thumb" style={{ background: project.color }} />
              <span className="home-recent-title">{project.title}</span>
            </Link>
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

    {recordPopoverOpen && (
      <div
        ref={recordPopoverRef}
        className="assets-popup home-record-popover"
        style={{ position: "fixed", top: recordPopoverPos.top, left: recordPopoverPos.left }}
      >
        <div className="assets-popup-label">Record source</div>
        {recordSourceMenu.map((item) => (
          <button
            key={item.key}
            type="button"
            className="assets-popup-item"
            onClick={handleRecordSelect}
          >
            <item.icon className="assets-popup-item-icon" />
            <span>{item.label}</span>
          </button>
        ))}
        <div className="assets-popup-sep" />
        <button
          type="button"
          className="assets-popup-item"
          onClick={handleRecordSelect}
        >
          <Settings2 className="assets-popup-item-icon" />
          <span>Settings</span>
        </button>
      </div>
    )}

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
              <div
                key={item.key}
                className="home-tools-popover-item-wrap"
                onMouseEnter={() => setDisabledTooltipKey(item.disabled ? item.key : null)}
              >
                <button
                  type="button"
                  className={cn("home-tools-popover-item", item.disabled && "is-disabled")}
                  onClick={() => !item.disabled && handleToolSelect(item.key)}
                >
                  <item.icon size={14} />
                  <span>{item.label}</span>
                  {item.disabled && <Ban size={11} className="home-tools-popover-item-lock" />}
                </button>
                {item.disabled && disabledTooltipKey === item.key && (
                  <div className="home-tools-disabled-tooltip">
                    <div className="home-tools-disabled-tooltip-body">
                      <p className="home-tools-disabled-tooltip-title">Skill not available</p>
                      <p className="home-tools-disabled-tooltip-desc">Enable this skill in Settings to get started.</p>
                    </div>
                    <button
                      type="button"
                      className="home-tools-disabled-tooltip-btn"
                      onClick={() => { setToolsPopoverOpen(false); handleToolSelect("settings"); }}
                    >
                      Open Settings <ArrowRight size={11} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    )}

    </>
  );
}
