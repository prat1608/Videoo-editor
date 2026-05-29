"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Crop,
  Film,
  Gauge,
  GitMerge,
  ImageUp,
  Mic,
  Music4,
  RotateCcw,
  RotateCw,
  Scissors,
  Volume2,
  Clapperboard,
  RefreshCw,
  Search,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { HomeSidebar } from "@/components/home-sidebar";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Generation", "Skills", "Basic Tools"];
const ART_VARIANTS = ["requests", "forms", "channels", "integrations", "showcase"];

const SECTIONS = [
  {
    id: "generation",
    title: "Generation Tools",
    subtitle: "Create anything from a prompt",
    category: "Generation",
    tools: [
      { id: "generate-image",     grid: "image",      name: "Generate Image",     desc: "Create polished visuals from a simple text prompt.", icon: ImageUp, art: "generate-image" },
      { id: "generate-video",     grid: "video",      name: "Generate Video",     desc: "Turn text or images into ready-to-edit video clips.", icon: Film },
      { id: "generate-music",     grid: "music",      name: "Generate Music",     desc: "Produce custom background tracks that fit your edit.", icon: Music4 },
      { id: "generate-voiceover", grid: "voiceover",  name: "Generate Voiceover", desc: "Create natural AI narration for scenes, ads, and explainers.", icon: Mic },
      { id: "generate-sfx",       grid: "sfx",        name: "Generate SFX",       desc: "Generate clean sound effects exactly when your timeline needs them.", icon: Volume2 },
    ],
  },
  {
    id: "skills",
    title: "Skills",
    subtitle: "Intelligent workflows powered by AI",
    category: "Skills",
    tools: [
      { id: "autodemo",  grid: "autodemo",  name: "Autodemo",  desc: "Auto-generate product demos with structure, pacing, and highlights.", icon: Clapperboard },
      { id: "roughcuts", grid: "roughcuts", name: "Roughcuts", desc: "Let AI assemble a first-pass rough edit from your footage.", icon: RefreshCw },
      { id: "clipping",  grid: "clipping",  name: "Clipping",  desc: "Pull out the best moments for reels, shorts, and social posts.", icon: Scissors },
    ],
  },
  {
    id: "basic",
    title: "Basic Tools",
    subtitle: "Precise controls for every edit",
    category: "Basic Tools",
    tools: [
      { id: "trim",    grid: "trim",    name: "Trim",    desc: "Adjust precise in and out points for every clip.", icon: Scissors },
      { id: "merge",   grid: "merge",   name: "Merge",   desc: "Join multiple clips into one seamless sequence.", icon: GitMerge },
      { id: "speed",   grid: "speed",   name: "Speed",   desc: "Use constant speed changes or smooth ramp effects.", icon: Gauge },
      { id: "reverse", grid: "reverse", name: "Reverse", desc: "Play footage backward for stylized moments and transitions.", icon: RotateCcw },
      { id: "rotate",  grid: "rotate",  name: "Rotate",  desc: "Rotate or flip the frame to fix orientation quickly.", icon: RotateCw },
      { id: "crop",    grid: "crop",    name: "Crop",    desc: "Reframe shots and trim away edges you do not need.", icon: Crop },
    ],
  },
];

function ToolCardArtwork({ art }) {
  switch (art) {
    case "generate-image":
      return (
        <div className="tc-scene tc-scene-generate-image" aria-hidden="true">
          <img
            className="tc-generate-image-art"
            src="/tools/generate-image-card.png"
            alt=""
            draggable="false"
          />
        </div>
      );
    case "requests":
      return (
        <div className="tc-scene tc-scene-requests" aria-hidden="true">
          <div className="tc-request-node tc-request-node-left">
            <span className="tc-request-tag">Requested</span>
            <span className="tc-request-avatar tc-request-avatar-gold" />
            <span className="tc-request-person">James Knot</span>
          </div>
          <div className="tc-request-node tc-request-node-center">
            <span className="tc-request-tag">Requested</span>
            <span className="tc-request-avatar tc-request-avatar-mint" />
            <span className="tc-request-person">Alison Parke</span>
          </div>
          <div className="tc-request-node tc-request-node-right">
            <span className="tc-request-tag">Requested</span>
            <span className="tc-request-avatar tc-request-avatar-coral" />
            <span className="tc-request-person">Skylor Saib</span>
          </div>
          <span className="tc-request-line tc-request-line-left" />
          <span className="tc-request-line tc-request-line-center" />
          <span className="tc-request-line tc-request-line-right" />
          <div className="tc-action-chip tc-request-cta">Request Sent!</div>
        </div>
      );
    case "forms":
      return (
        <div className="tc-scene tc-scene-form" aria-hidden="true">
          <div className="tc-form-sheet">
            <span className="tc-form-ribbon">Ready</span>
            <p className="tc-form-title">Share Your Experience</p>
            <div className="tc-form-row">
              <div className="tc-form-field tc-form-field-small">
                <span className="tc-form-label">First Name</span>
                <span className="tc-form-input">James</span>
              </div>
              <div className="tc-form-field tc-form-field-small">
                <span className="tc-form-label">Last Name</span>
                <span className="tc-form-input">Squat</span>
              </div>
            </div>
            <div className="tc-form-field">
              <span className="tc-form-label">Email Address</span>
              <span className="tc-form-input">example@abc.com</span>
            </div>
            <div className="tc-form-field tc-form-field-area">
              <span className="tc-form-label">Testimonial</span>
              <span className="tc-form-textarea">Message</span>
            </div>
            <div className="tc-form-submit">Submit Feedback!</div>
          </div>
        </div>
      );
    case "channels":
      return (
        <div className="tc-scene tc-scene-channels" aria-hidden="true">
          <span className="tc-channel-badge tc-channel-badge-facebook">fb</span>
          <span className="tc-channel-badge tc-channel-badge-mail">mail</span>
          <span className="tc-channel-badge tc-channel-badge-tiktok">tt</span>
          <span className="tc-channel-badge tc-channel-badge-link">link</span>
          <span className="tc-channel-badge tc-channel-badge-instagram">ig</span>
          <span className="tc-channel-badge tc-channel-badge-x">x</span>
          <div className="tc-channel-feed">
            {[0, 1, 2].map((item) => (
              <div key={item} className="tc-channel-row">
                <span className="tc-channel-star" />
                <span className="tc-channel-line tc-channel-line-long" />
                <span className="tc-channel-line" />
              </div>
            ))}
          </div>
          <div className="tc-channel-box">
            <span className="tc-channel-flap tc-channel-flap-left" />
            <span className="tc-channel-flap tc-channel-flap-right" />
          </div>
        </div>
      );
    case "integrations":
      return (
        <div className="tc-scene tc-scene-integrations" aria-hidden="true">
          <span className="tc-integration-tile tc-integration-zapier">zapier</span>
          <span className="tc-integration-tile tc-integration-slack">slack</span>
          <span className="tc-integration-tile tc-integration-stripe">stripe</span>
          <span className="tc-integration-tile tc-integration-notion">N</span>
          <span className="tc-integration-tile tc-integration-sheets">sheets</span>
          <span className="tc-integration-tile tc-integration-circle">C</span>
          <span className="tc-integration-line tc-integration-line-left" />
          <span className="tc-integration-line tc-integration-line-center" />
          <span className="tc-integration-line tc-integration-line-right" />
          <div className="tc-action-chip tc-integration-pill">Integrated</div>
        </div>
      );
    case "showcase":
    default:
      return (
        <div className="tc-scene tc-scene-showcase" aria-hidden="true">
          <div className="tc-showcase-note tc-showcase-note-top-left">
            <span className="tc-showcase-note-name">Lucas Grant</span>
            <span className="tc-showcase-note-line" />
          </div>
          <div className="tc-showcase-note tc-showcase-note-top-right">
            <span className="tc-showcase-note-avatar" />
            <div className="tc-showcase-note-copy">
              <span className="tc-showcase-note-name">Sabrina Joseph</span>
              <span className="tc-showcase-note-line" />
            </div>
          </div>
          <div className="tc-showcase-pill-row">
            <span className="tc-showcase-pill tc-showcase-pill-soft">30+ Layouts</span>
            <span className="tc-showcase-pill tc-showcase-pill-dark">Build Trust</span>
          </div>
          <div className="tc-showcase-stack">
            <span className="tc-showcase-shadow tc-showcase-shadow-1" />
            <span className="tc-showcase-shadow tc-showcase-shadow-2" />
            <span className="tc-showcase-shadow tc-showcase-shadow-3" />
            <div className="tc-showcase-main-card">
              <span className="tc-channel-star" />
              <span className="tc-showcase-main-line tc-showcase-main-line-long" />
              <span className="tc-showcase-main-line" />
            </div>
          </div>
          <div className="tc-showcase-note tc-showcase-note-bottom-left">
            <span className="tc-showcase-stars">* * *</span>
            <span className="tc-showcase-note-line" />
            <span className="tc-showcase-note-name">James Parker</span>
          </div>
          <div className="tc-showcase-note tc-showcase-note-bottom-right">
            <span className="tc-showcase-stars">* * * * *</span>
            <div className="tc-showcase-note-copy">
              <span className="tc-showcase-note-name">Jordan Malik</span>
              <span className="tc-showcase-note-line" />
            </div>
          </div>
        </div>
      );
  }
}

function ToolCard({ tool, art }) {
  const router = useRouter();
  const Icon = tool.icon;

  return (
    <button
      type="button"
      className={cn("tc-card", `is-${art}`)}
      onClick={() => router.push(`/editor?tool=${tool.grid}`)}
      aria-label={`Open ${tool.name}`}
    >
      <div className="tc-card-top">
        <span className="tc-icon-bubble">
          <Icon aria-hidden="true" />
        </span>
        <span className="tc-card-title">{tool.name}</span>
        <span className="tc-open-bubble">
          <ArrowUpRight aria-hidden="true" />
        </span>
      </div>

      <div className={cn("tc-visual", `is-${art}`)}>
        <div className="tc-art-main">
          <div className="tc-grid-overlay" />
          <div className="tc-glow tc-glow-left" />
          <div className="tc-glow tc-glow-right" />
          <div className="tc-visual-frame">
            <ToolCardArtwork art={art} />
          </div>
        </div>

        <div className="tc-thumb-rail" aria-hidden="true">
          <span className="tc-thumb tc-thumb-one">
            <ToolCardArtwork art={art} />
          </span>
          <span className="tc-thumb tc-thumb-two">
            <ToolCardArtwork art={art} />
          </span>
          <span className="tc-more-count">+7</span>
        </div>

        <div className="tc-body">
          <span className="tc-body-icon">
            <Icon aria-hidden="true" />
          </span>
          <span className="tc-body-copy">
            <span className="tc-name">{tool.name}</span>
            <span className="tc-desc">{tool.desc}</span>
          </span>
        </div>
      </div>
    </button>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mt2-section-header">
      <div className="mt2-section-header-left">
        <h2 className="mt2-section-title">{title}</h2>
        <p className="mt2-section-subtitle">{subtitle}</p>
      </div>
      <button type="button" className="mt2-browse-btn">
        Browse all
        <ArrowRight />
      </button>
    </div>
  );
}

export default function MoreToolsScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const visibleSections = SECTIONS
    .map((section) => ({
      ...section,
      tools: section.tools.filter((tool) => {
        const matchCat = activeCategory === "All" || section.category === activeCategory;
        const matchQ =
          !query ||
          tool.name.toLowerCase().includes(query.toLowerCase()) ||
          tool.desc.toLowerCase().includes(query.toLowerCase());
        return matchCat && matchQ;
      }),
    }))
    .filter((s) => s.tools.length > 0);

  return (
    <div className="home-shell">
      <HomeSidebar activePath="/tools" />

      <main className="mt-main">
        <div className="mt2-page-header">
          <div className="mt2-page-header-copy">
            <h1 className="mt2-page-title">Tools &amp; Skills</h1>
            <p className="mt2-page-subtitle">Everything you need to create, edit, and ship</p>
          </div>
          <div className="mt2-search-wrap">
            <Search className="mt2-search-icon" />
            <input
              className="mt2-search-input"
              placeholder="Search tools…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt2-filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={cn("mt2-filter-pill", activeCategory === cat && "is-active")}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt2-content">
          {visibleSections.map((section) => (
            <section key={section.id} className="mt2-section">
              <SectionHeader title={section.title} subtitle={section.subtitle} />
              <div className="mt2-grid">
                {section.tools.map((tool, index) => (
                  <ToolCard key={tool.id} tool={tool} art={tool.art ?? ART_VARIANTS[index % ART_VARIANTS.length]} />
                ))}
              </div>
            </section>
          ))}
          {visibleSections.length === 0 && (
            <div className="mt2-empty">
              <Search />
              <p>No tools match &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
