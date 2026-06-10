"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clapperboard,
  Download,
  FilePlus2,
  Film,
  ImageUp,
  Mic,
  Music4,
  Search,
  Sparkles,
  Video,
} from "lucide-react";
import { createNewProjectHref, newProjectOptions } from "@/lib/new-projects";
import { getProjectHref, recentProjects } from "@/lib/projects";
import { cn } from "@/lib/utils";

const optionIcons = {
  empty: FilePlus2,
  record: Video,
  video: Film,
  image: ImageUp,
  audio: Music4,
  voiceover: Mic,
  import: Download,
  aimg: Sparkles,
};

export function NewProjectScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();

  const filteredOptions = useMemo(() => {
    if (!normalizedSearch) return newProjectOptions;
    return newProjectOptions.filter((option) =>
      `${option.label} ${option.description}`.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch]);

  const filteredProjects = useMemo(() => {
    if (!normalizedSearch) return recentProjects;
    return recentProjects.filter((project) =>
      `${project.title} ${project.time}`.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch]);

  return (
    <main className="new-project-page">
      <section className="new-project-panel" aria-labelledby="new-project-title">
        <div className="new-project-location">
          <span>Create project in:</span>
          <span className="new-project-space-dot" />
          <button type="button" className="new-project-space-button">
            Pratiksha Ekbote&apos;s team / Team project
          </button>
        </div>

        <h1 id="new-project-title" className="new-project-title">New project</h1>

        <div className="new-project-options" aria-label="Project creation options">
          {filteredOptions.map((option) => {
            const Icon = optionIcons[option.id] ?? Clapperboard;
            return (
              <button
                key={option.id}
                type="button"
                className="new-project-option"
                aria-label={`Create ${option.label}`}
                onClick={() => router.push(createNewProjectHref(option.id))}
              >
                <span className="new-project-option-icon" style={{ background: option.accent }}>
                  <Icon />
                </span>
                <span className="new-project-option-label">{option.label}</span>
                <span className="new-project-option-desc">{option.description}</span>
              </button>
            );
          })}
        </div>

        <label className="new-project-search">
          <Search />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            aria-label="Search creation options and recent projects"
          />
        </label>

        <div className="new-project-recents">
          <h2>Recent projects</h2>
          <div className="new-project-recents-list">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <Link key={project.id} href={getProjectHref(project.id)} className="new-project-recent-row">
                  <span className={cn("new-project-recent-thumb", index === 0 && "is-bright")} style={{ background: project.color }}>
                    {index === 0 && <FilePlus2 />}
                  </span>
                  <span className="new-project-recent-name">{project.title}</span>
                  <span className="new-project-recent-time">{project.time.replace("Last edited ", "")}</span>
                  {index === 1 && <span className="new-project-avatar">P</span>}
                </Link>
              ))
            ) : (
              <p className="new-project-empty">No matching recent projects.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
