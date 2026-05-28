"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart2,
  Bell,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  Crop,
  FilePlus2,
  Headphones,
  Layers,
  Mic2,
  Music,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  Scissors,
  Settings2,
  Subtitles,
  Video,
  Wand2,
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

const toolsAndSkills = [
  { key: "generate", label: "Generate Video", icon: Clapperboard },
  { key: "captions", label: "Auto Captions", icon: Subtitles },
  { key: "enhance", label: "AI Enhance", icon: Wand2 },
  { key: "music", label: "Background Music", icon: Music },
  { key: "crop", label: "Smart Crop", icon: Crop },
];

export function HomeSidebar({ activePath = "/" }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [spacesOpen, setSpacesOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);

  return (
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
          onClick={() => setToolsOpen((v) => !v)}
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
            <Link
              href="/tools"
              className={cn("home-tool-item home-more-tools", activePath === "/tools" && "is-active")}
            >
              <span>More Tools</span>
              <ChevronRight className="home-more-tools-chevron" />
            </Link>
          </div>
        )}
      </div>

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
  );
}
