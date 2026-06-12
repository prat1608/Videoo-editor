"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUp,
  ArrowUpRight,
  AudioLines,
  ChevronDown,
  FileText,
  Layers,
  Plus,
  RefreshCw,
  Scissors,
  Sparkles,
} from "lucide-react";
import { getProjectHref, recentProjects } from "@/lib/projects";
import { cn } from "@/lib/utils";

const actionChips = [
  { key: "generate", label: "Generate", icon: Sparkles },
  { key: "script", label: "Script & Strategy", icon: FileText },
  { key: "repurpose", label: "Repurpose", icon: RefreshCw },
  { key: "edit", label: "Edit", icon: Scissors },
  { key: "captions", label: "Captions & Voice", icon: AudioLines },
];

export function NewProjectScreen() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("recent");

  const projectRows = useMemo(() => recentProjects.slice(0, 2), []);

  return (
    <main className="home-main">
      <div className="home-focused-topbar" aria-label="Project actions">
        <button type="button" className="home-focused-credits">
          <Sparkles />
          <span>1,462 credits</span>
        </button>
        <button type="button" className="home-focused-space">
          <Layers />
          <span>Default Space</span>
        </button>
        <Link href={getProjectHref("untitled-editor")} className="home-focused-open-editor">
          <span>Open Editor</span>
          <ArrowUpRight />
        </Link>
      </div>

      <div className="home-main-inner">
        <h1 className="home-greeting">What do you want to create today?</h1>

        <div className="new-project-composer">
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe a scene, trim, or effect..."
            aria-label="Describe a scene, trim, or effect"
          />
          <div className="new-project-composer-footer">
            <button type="button" className="new-project-plus" aria-label="Attach media">
              <Plus />
            </button>
            <div className="new-project-composer-actions">
              <button type="button" className="new-project-model">
                <Layers />
                <span>DeepSeek V4 Flash</span>
                <ChevronDown />
              </button>
              <button
                type="button"
                className="new-project-send"
                aria-label="Create from prompt"
                onClick={() => router.push(getProjectHref(`untitled-${Date.now()}`))}
              >
                <ArrowUp />
              </button>
            </div>
          </div>
        </div>

        <div className="new-project-chips" aria-label="Creation modes">
          {actionChips.map((chip) => (
            <button key={chip.key} type="button" className="new-project-chip">
              <chip.icon />
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      <section className="new-project-recents-panel" aria-label="Recent projects">
        <div className="new-project-recents-header">
          <div className="new-project-recents-tabs" role="tablist" aria-label="Project lists">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "recent"}
              className={cn("new-project-recents-tab", activeTab === "recent" && "is-active")}
              onClick={() => setActiveTab("recent")}
            >
              Recent projects
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "examples"}
              className={cn("new-project-recents-tab", activeTab === "examples" && "is-active")}
              onClick={() => setActiveTab("examples")}
            >
              Examples
            </button>
          </div>
          <button type="button" className="new-project-view-all">
            <span>View all</span>
            <ArrowUpRight />
          </button>
        </div>

        <div className="new-project-recents-list">
          {activeTab === "recent" ? (
            projectRows.map((project, index) => (
              <Link key={project.id} href={getProjectHref(project.id)} className="new-project-recent-row">
                <span className={cn("new-project-recent-thumb", index === 0 ? "is-garage" : "is-autodemo")}>
                  <span />
                </span>
                <span className="new-project-recent-copy">
                  <strong>{project.title}</strong>
                  <small>{project.time}</small>
                </span>
              </Link>
            ))
          ) : (
            <p className="new-project-empty">No examples available yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
