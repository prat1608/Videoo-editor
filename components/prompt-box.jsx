"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AudioLines, AudioWaveform, Bot, Check, CircleAlert, CircleDot, Clapperboard, Film, Headphones, Image, ImageUp, Layers, Link as LinkIcon, ListChecks, Mic, Mic2, Music2, Palette, Paperclip, Plus, SlidersHorizontal, Type, Volume2, Wand2, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const MODEL_LOGO_MAP = {
  "Imagen 4":             Image,
  "Veo 3.1 Lite":         Clapperboard,
  "Veo 3.0":              Clapperboard,
  "DALL·E 3":             Palette,
  "OpenAI TTS":           AudioLines,
  "Flux 1.1 Pro":         Zap,
  "Stable Diffusion 3.5": Layers,
  "Stability Audio":      AudioWaveform,
  "Kling 1.6 Pro":        Film,
  "Wan 2.1":              Wand2,
  "Hailuo":               Bot,
  "Suno v4":              Music2,
  "Udio 2.0":             Headphones,
  "MusicGen 2":           AudioWaveform,
  "Audiocraft":           AudioWaveform,
  "ElevenLabs":           Mic,
  "ElevenLabs SFX":       Volume2,
  "Cartesia":             Mic2,
};

const MODEL_CHIP_KEYS = new Set(["model", "img-model", "aud-model", "sfx-model", "vo-model"]);

function ModelLogo({ model }) {
  const Icon = MODEL_LOGO_MAP[model];
  if (!Icon) return null;
  return <Icon size={13} />;
}
import { DesignSystemModal } from "./design-system-modal";

const SUPPORTED_IMPORT_PLATFORMS = [
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

function getImportUrlStatus(value) {
  const trimmed = value.trim();
  if (!trimmed) return { state: "idle", message: "Paste a supported video link to start importing." };

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { state: "invalid", message: "Enter a valid URL with http:// or https://." };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { state: "invalid", message: "Only http:// and https:// links are supported." };
  }

  const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();
  const platform = SUPPORTED_IMPORT_PLATFORMS.find((item) =>
    item.domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))
  );

  if (!platform) {
    return {
      state: "unsupported",
      message: "Supported links: YouTube, TikTok, Instagram, Vimeo, Twitch, Loom, Streamable, X, and Facebook.",
    };
  }

  return { state: "ready", message: `${platform.label} link ready to import.`, platform: platform.label };
}

/**
 * Shared prompt box used on both the home screen and inside the editor chat panel.
 *
 * The outer card wrapper (home-prompt-card / chat-card) stays in the parent.
 * This component renders: mode chips → attachment rows → text input → action bar.
 *
 * Props
 * ─────
 * variant         "home" | "editor"   — controls CSS class prefix and input element type
 * value           string              — controlled text value
 * onChange        (string) => void
 * onKeyDown       KeyboardEventHandler
 * placeholder     string
 * inputRef        ref                 — contentEditable ref (editor only)
 *
 * activeGrid      null | "image" | "video"
 * onActiveGridChange  (grid) => void
 *
 * selectedAttachment          { name, url } | null
 * onSelectedAttachmentChange  (att | null) => void
 * imageStyleAttachment        { name, url } | null  — selected style card (editor image mode)
 * onImageStyleAttachmentChange (att | null) => void
 * videoStartAttachment        { name, url } | null
 * onVideoStartAttachmentChange (att | null) => void
 * videoEndAttachment          { name, url } | null
 * onVideoEndAttachmentChange  (att | null) => void
 *
 * imageChips   [{ key, icon, activeValue, options: string[], onSelect }]
 * videoChips   [{ key, icon, activeValue, options: string[], onSelect }]
 * extraChips   ReactNode — additional tool chips shown after the mode chip (editor)
 *
 * renderModelSelector  () => ReactNode
 * renderSendButton     () => ReactNode
 * onImportFromUrl      (url: string) => void
 *
 * supportNarrow        boolean — enable narrow-mode settings trigger (editor)
 * renderSettingsContent () => ReactNode — settings dialog content for narrow mode
 */
export function PromptBox({
  variant = "editor",

  value = "",
  onChange,
  onKeyDown,
  placeholder,
  inputRef: externalInputRef,

  activeGrid,
  onActiveGridChange,

  selectedAttachment,
  onSelectedAttachmentChange,
  imageStyleAttachment,
  onImageStyleAttachmentChange,
  videoStartAttachment,
  onVideoStartAttachmentChange,
  videoEndAttachment,
  onVideoEndAttachmentChange,

  chipsMap = {},
  extraChips,

  renderModelSelector,
  renderSendButton,
  onImportFromUrl,

  supportNarrow = false,
  renderSettingsContent,
}) {
  const internalInputRef = useRef(null);
  const actualInputRef = externalInputRef ?? internalInputRef;

  const actionsRef = useRef(null);
  const imageFileRef = useRef(null);
  const videoStartFileRef = useRef(null);
  const videoEndFileRef = useRef(null);
  const chipContainerRef = useRef(null);
  const chipDropdownRef = useRef(null);
  const settingsRef = useRef(null);
  const settingsTriggerRef = useRef(null);

  const [openChip, setOpenChip] = useState(null);
  const [chipAnchorRect, setChipAnchorRect] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsAnchorRect, setSettingsAnchorRect] = useState(null);
  const [narrow, setNarrow] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const [plusAnchorRect, setPlusAnchorRect] = useState(null);
  const [planEnabled, setPlanEnabled] = useState(false);
  const [designSystemOpen, setDesignSystemOpen] = useState(false);
  const [importUrlOpen, setImportUrlOpen] = useState(false);
  const [importUrlValue, setImportUrlValue] = useState("");
  const [importUrlTouched, setImportUrlTouched] = useState(false);
  const [dsTheme, setDsTheme] = useState(null);
  const [dsFont, setDsFont] = useState(null);
  const plusRef = useRef(null);
  const plusPopoverRef = useRef(null);
  const importUrlInputRef = useRef(null);

  const isHome = variant === "home";
  const showImageGrid = activeGrid === "image";
  const showVideoGrid = activeGrid === "video";
  const activeChips = chipsMap[activeGrid] ?? [];
  const isNarrow = supportNarrow && narrow;

  useEffect(() => {
    if (!supportNarrow) return;
    const el = actionsRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < 400));
    ro.observe(el);
    return () => ro.disconnect();
  }, [supportNarrow]);

  useEffect(() => {
    if (!openChip) return;
    function handle(e) {
      if (!chipContainerRef.current?.contains(e.target) && !chipDropdownRef.current?.contains(e.target)) {
        setOpenChip(null);
        setChipAnchorRect(null);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [openChip]);

  useEffect(() => {
    if (!settingsOpen) return;
    function handle(e) {
      if (!settingsRef.current?.contains(e.target) && !settingsTriggerRef.current?.contains(e.target)) {
        setSettingsOpen(false);
        setSettingsAnchorRect(null);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [settingsOpen]);

  useEffect(() => {
    if (!plusOpen) return;
    function handle(e) {
      if (!plusRef.current?.contains(e.target) && !plusPopoverRef.current?.contains(e.target)) {
        setPlusOpen(false);
        setPlusAnchorRect(null);
        setImportUrlOpen(false);
        setImportUrlValue("");
        setImportUrlTouched(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [plusOpen]);

  useEffect(() => {
    if (!importUrlOpen) return;
    const id = requestAnimationFrame(() => importUrlInputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [importUrlOpen]);

  function togglePlus(e) {
    if (plusOpen) {
      setPlusOpen(false);
      setPlusAnchorRect(null);
      setImportUrlOpen(false);
      setImportUrlValue("");
      setImportUrlTouched(false);
    } else {
      setPlusAnchorRect(e.currentTarget.getBoundingClientRect());
      setPlusOpen(true);
    }
  }

  function toggleChip(key, e) {
    if (openChip === key) {
      setOpenChip(null);
      setChipAnchorRect(null);
    } else {
      setOpenChip(key);
      setChipAnchorRect(e.currentTarget.getBoundingClientRect());
    }
  }

  // CSS class names — home uses home-prompt-* prefix, editor uses chat-prompt-* prefix
  const c = {
    chipRow:     isHome ? "home-mode-chip-row"                    : "chat-prompt-refs-chips",
    refRow:      isHome ? "home-image-ref-row"                    : "chat-prompt-refs-items",
    videoRefRow: isHome ? "home-image-ref-row home-video-ref-row" : "chat-prompt-refs-items",
    editorWrap:  isHome ? "home-prompt-editor-wrap"               : "chat-prompt-editor-wrap",
    editor:      isHome ? "home-prompt-editor"                    : "chat-prompt-editor",
    actions:     isHome ? "home-prompt-actions"                   : "chat-prompt-actions",
    left:        "chat-prompt-left",
    right:       isHome ? "home-prompt-right"                     : "chat-prompt-right",
    plus:        isHome ? "home-prompt-plus"                      : "chat-plus",
    genSettings: isHome ? "video-gen-settings home-image-settings": "video-gen-settings",
  };

  const hasModeChip = Boolean(activeGrid);
  const hasExtraChips = Boolean(extraChips);
  const hasDsChips = Boolean(dsTheme || dsFont);
  const importUrlStatus = getImportUrlStatus(importUrlValue);
  const canImportUrl = importUrlStatus.state === "ready";
  const switchTrackStyle = {
    position: "relative",
    flexShrink: 0,
    width: 28,
    height: 18,
    borderRadius: 999,
    background: "rgba(255, 255, 255, 0.18)",
    transition: "background 120ms ease",
  };
  const switchOnTrackStyle = {
    ...switchTrackStyle,
    background: "rgba(104, 109, 182, 0.85)",
  };
  const switchThumbStyle = {
    position: "absolute",
    top: 3,
    left: 3,
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: "#f4f4f5",
    transition: "transform 120ms ease",
  };
  const importModalBackdropStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 10000,
    display: "grid",
    placeItems: "center",
    padding: 20,
    background: "rgba(0, 0, 0, 0.28)",
  };
  const importModalStyle = {
    width: "min(560px, calc(100vw - 40px))",
    borderRadius: 12,
    background: "var(--theme-background-z1)",
    border: "0.6px solid var(--border)",
    boxShadow: "0 18px 46px rgba(0, 0, 0, 0.48)",
    overflow: "hidden",
  };
  const importModalHeaderStyle = {
    padding: "18px 20px 14px",
    borderBottom: "0.6px solid var(--border)",
  };
  const importInputWrapStyle = {
    margin: "18px 20px 0",
    padding: "0 12px",
    borderRadius: 10,
    background: "rgba(0, 0, 0, 0.18)",
    border: "0.6px solid rgba(255, 255, 255, 0.08)",
    display: "block",
  };
  const importStatusStyle = {
    margin: "0 20px",
    color: importUrlStatus.state === "ready"
      ? "#b0b3e8"
      : ["invalid", "unsupported"].includes(importUrlStatus.state)
        ? "#ff9b9b"
        : "var(--text-dim)",
  };
  const importModalActionsStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    padding: "12px 20px 14px",
    borderTop: "0.6px solid var(--border)",
    background: "rgba(255, 255, 255, 0.018)",
  };
  const importCancelStyle = {
    height: 36,
    minWidth: 88,
    padding: "0 16px",
    borderRadius: 10,
    border: "0.6px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    fontSize: "0.86rem",
    fontWeight: 650,
    cursor: "pointer",
  };
  const importSubmitStyle = {
    height: 36,
    minWidth: 88,
    padding: "0 16px",
    border: canImportUrl ? 0 : "0.6px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 10,
    background: canImportUrl ? "var(--primary)" : "rgba(255, 255, 255, 0.12)",
    color: canImportUrl ? "#fafafa" : "rgba(250, 250, 250, 0.58)",
    fontSize: "0.86rem",
    fontWeight: 650,
    cursor: canImportUrl ? "pointer" : "not-allowed",
  };

  // Chips + refs + text input are scrollable in the editor; flat in home.
  const scrollableContent = (
    <>
      {/* Mode chip row + extra tool chips + design system chips */}
      {(hasModeChip || hasExtraChips || hasDsChips) && (
        <div className={c.chipRow}>
          {dsTheme && (
            <div className="chat-tool-chip">
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: dsTheme.bg, border: "1px solid rgba(255,255,255,0.18)", flexShrink: 0, marginRight: 3 }} />
              <span>{dsTheme.name}</span>
              <button type="button" className="chat-tool-chip-remove" aria-label="Remove theme" onClick={() => setDsTheme(null)}>
                <X size={10} />
              </button>
            </div>
          )}
          {dsFont && (
            <div className="chat-tool-chip">
              <Type size={11} style={{ marginRight: 3, flexShrink: 0 }} />
              <span>{dsFont.name}</span>
              <button type="button" className="chat-tool-chip-remove" aria-label="Remove font" onClick={() => setDsFont(null)}>
                <X size={10} />
              </button>
            </div>
          )}
          {hasModeChip && (
            <div className="chat-tool-chip">
              <span>{{
                image:     "Generate Image",
                video:     "Generate Video",
                audio:     "Generate Audio",
                music:     "Generate Music",
                sfx:       "Generate SFX",
                voiceover: "Generate Voiceover",
                autodemo:  "Auto Demo",
                roughcuts: "Rough Cuts",
                clipping:  "Clipping",
                ytimport:  "Import Video",
                aimg:      "AI Motion Graphics",
                trim:      "Trim",
                merge:     "Merge",
                speed:     "Speed",
                reverse:   "Reverse",
                rotate:    "Rotate",
                crop:      "Crop",
              }[activeGrid] ?? activeGrid}</span>
              <button
                type="button"
                className="chat-tool-chip-remove"
                aria-label="Remove generate mode"
                onClick={() => onActiveGridChange?.(null)}
              >
                <X size={10} />
              </button>
            </div>
          )}
          {extraChips}
        </div>
      )}

      {/* Image attachment / reference row */}
      {showImageGrid && (
        <div className={c.refRow}>
          <input
            ref={imageFileRef}
            type="file"
            accept="image/*"
            className={isHome ? undefined : "sr-only"}
            style={isHome ? { display: "none" } : undefined}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onSelectedAttachmentChange?.({ name: f.name, url: URL.createObjectURL(f) });
              e.target.value = "";
            }}
          />
          {/* Selected style card — editor only */}
          {imageStyleAttachment && (
            <div className="chat-attachment-card">
              <div className="chat-attachment-inner">
                <img src={imageStyleAttachment.url} alt={imageStyleAttachment.name} className="chat-attachment-thumb" />
                <span className="chat-attachment-label">{imageStyleAttachment.name}</span>
              </div>
              <button
                type="button"
                className="chat-attachment-remove"
                aria-label={`Remove ${imageStyleAttachment.name} style`}
                onClick={() => onImageStyleAttachmentChange?.(null)}
              >
                <X />
              </button>
            </div>
          )}
          {/* Image reference upload */}
          {selectedAttachment ? (
            <div className="chat-attachment-card">
              <div className="chat-attachment-inner">
                <img src={selectedAttachment.url} alt={selectedAttachment.name} className="chat-attachment-thumb" />
                <span className="chat-attachment-label">{selectedAttachment.name}</span>
              </div>
              <button
                type="button"
                className="chat-attachment-remove"
                onClick={() => onSelectedAttachmentChange?.(null)}
              >
                <X size={isHome ? 12 : undefined} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="chat-image-ref-placeholder"
              onClick={() => imageFileRef.current?.click()}
            >
              <ImageUp size={isHome ? 14 : undefined} className="chat-image-ref-icon" />
              <span className="chat-image-ref-label">Add image reference</span>
              <span className="chat-image-ref-optional">Optional</span>
            </button>
          )}
        </div>
      )}

      {/* Video start / end image row */}
      {showVideoGrid && (
        <div className={c.videoRefRow}>
          <input
            ref={videoStartFileRef}
            type="file"
            accept="image/*"
            className={isHome ? undefined : "sr-only"}
            style={isHome ? { display: "none" } : undefined}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onVideoStartAttachmentChange?.({ name: f.name, url: URL.createObjectURL(f) });
              e.target.value = "";
            }}
          />
          {videoStartAttachment ? (
            <div className="chat-attachment-card">
              <div className="chat-attachment-inner">
                <img src={videoStartAttachment.url} alt="Start" className="chat-attachment-thumb" />
                <span className="chat-attachment-label">{isHome ? videoStartAttachment.name : "Start"}</span>
              </div>
              <button
                type="button"
                className="chat-attachment-remove"
                aria-label="Remove start image"
                onClick={() => onVideoStartAttachmentChange?.(null)}
              >
                <X size={isHome ? 12 : undefined} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="chat-image-ref-placeholder"
              aria-label="Add start image"
              onClick={() => videoStartFileRef.current?.click()}
            >
              <ImageUp size={isHome ? 14 : undefined} className="chat-image-ref-icon" />
              <span className="chat-image-ref-label">Start image</span>
              <span className="chat-image-ref-optional">Optional</span>
            </button>
          )}

          <input
            ref={videoEndFileRef}
            type="file"
            accept="image/*"
            className={isHome ? undefined : "sr-only"}
            style={isHome ? { display: "none" } : undefined}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onVideoEndAttachmentChange?.({ name: f.name, url: URL.createObjectURL(f) });
              e.target.value = "";
            }}
          />
          {videoEndAttachment ? (
            <div className="chat-attachment-card">
              <div className="chat-attachment-inner">
                <img src={videoEndAttachment.url} alt="End" className="chat-attachment-thumb" />
                <span className="chat-attachment-label">{isHome ? videoEndAttachment.name : "End"}</span>
              </div>
              <button
                type="button"
                className="chat-attachment-remove"
                aria-label="Remove end image"
                onClick={() => onVideoEndAttachmentChange?.(null)}
              >
                <X size={isHome ? 12 : undefined} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="chat-image-ref-placeholder"
              aria-label="Add end image"
              onClick={() => videoEndFileRef.current?.click()}
            >
              <ImageUp size={isHome ? 14 : undefined} className="chat-image-ref-icon" />
              <span className="chat-image-ref-label">End image</span>
              <span className="chat-image-ref-optional">Optional</span>
            </button>
          )}
        </div>
      )}

      {/* Text input */}
      <div className={c.editorWrap}>
        {isHome ? (
          <textarea
            className={c.editor}
            placeholder={placeholder ?? "Describe your next shot..."}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
          />
        ) : (
          <>
            <div
              ref={actualInputRef}
              contentEditable
              suppressContentEditableWarning
              className={c.editor}
              role="textbox"
              aria-multiline="true"
              aria-label="Prompt input"
              onInput={(e) => onChange?.(e.currentTarget.textContent ?? "")}
              onKeyDown={onKeyDown}
            />
            <div className="chat-prompt-overlay" style={{ opacity: value ? 0 : 1 }}>
              {placeholder ?? "Write your idea or edit instructions..."}
            </div>
          </>
        )}
      </div>
    </>
  );

  return (
    <>
      {isHome ? scrollableContent : <div className="chat-card-scroll">{scrollableContent}</div>}

      {/* Action bar */}
      <div className={c.actions} ref={actionsRef}>
        <div className={c.left ?? undefined}>
          <button
            ref={plusRef}
            type="button"
            className={cn(c.plus, plusOpen && "is-active")}
            aria-label="Attach"
            onClick={togglePlus}
          >
            <Plus />
          </button>

          {activeChips.length > 0 && (
            isNarrow ? (
              <div className="video-settings-wrap">
                <button
                  ref={settingsTriggerRef}
                  type="button"
                  className={cn("video-settings-trigger", settingsOpen && "is-open")}
                  onClick={(e) => {
                    if (settingsOpen) {
                      setSettingsOpen(false);
                      setSettingsAnchorRect(null);
                    } else {
                      setSettingsAnchorRect(e.currentTarget.getBoundingClientRect());
                      setSettingsOpen(true);
                    }
                  }}
                  aria-label="Settings"
                >
                  <SlidersHorizontal />
                </button>
              </div>
            ) : (
              <div className={c.genSettings} ref={chipContainerRef}>
                {activeChips.map((chip) => (
                  <div key={chip.key} className={isHome ? "video-chip-wrap" : undefined}>
                    <button
                      type="button"
                      className={cn("video-gen-chip", openChip === chip.key && "is-active")}
                      onClick={(e) => toggleChip(chip.key, e)}
                    >
                      {MODEL_CHIP_KEYS.has(chip.key) && MODEL_LOGO_MAP[chip.activeValue]
                        ? <ModelLogo model={chip.activeValue} />
                        : <chip.icon size={13} />}
                      <span>{chip.activeValue}</span>
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        <div className={c.right}>
          {renderModelSelector?.()}
          {renderSendButton?.()}
        </div>
      </div>

      {/* Chip option dropdown */}
      {openChip && chipAnchorRect && createPortal(
        <div
          ref={chipDropdownRef}
          className="video-chip-dropdown"
          style={{
            position: "fixed",
            left: chipAnchorRect.left,
            bottom: window.innerHeight - chipAnchorRect.top + 8,
            zIndex: 9999,
          }}
        >
          {(() => {
            const chip = activeChips.find((ch) => ch.key === openChip);
            if (!chip) return null;
            return chip.options.map((opt) => {
              const isActive = chip.activeValue === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  className={cn("video-chip-option", isActive && "is-active")}
                  onClick={() => {
                    chip.onSelect(opt);
                    setOpenChip(null);
                    setChipAnchorRect(null);
                  }}
                >
                  {opt}
                  {isActive && <Check size={12} />}
                </button>
              );
            });
          })()}
        </div>,
        document.body
      )}

      {/* Plus / attach popover */}
      {plusOpen && plusAnchorRect && createPortal(
        <div
          ref={plusPopoverRef}
          className="assets-popup"
          style={{
            position: "fixed",
            left: plusAnchorRect.left,
            bottom: window.innerHeight - plusAnchorRect.top + 8,
            zIndex: 9999,
          }}
        >
          <button
            type="button"
            className="assets-popup-item"
            onClick={() => { setPlusOpen(false); setPlusAnchorRect(null); }}
          >
            <Paperclip className="assets-popup-item-icon" />
            <span>Attach media file</span>
          </button>
          <button
            type="button"
            className="assets-popup-item"
            onClick={() => { setPlusOpen(false); setPlusAnchorRect(null); }}
          >
            <CircleDot className="assets-popup-item-icon" />
            <span>Record</span>
          </button>
          <button
            type="button"
            className="assets-popup-item"
            onClick={() => {
              setPlusOpen(false);
              setPlusAnchorRect(null);
              setImportUrlOpen(true);
              setImportUrlTouched(false);
            }}
          >
            <LinkIcon className="assets-popup-item-icon" />
            <span>Import from URL</span>
          </button>
          <div className="assets-popup-sep" />
          <button
            type="button"
            className="assets-popup-item assets-popup-toggle-item"
            role="switch"
            aria-checked={planEnabled}
            onClick={() => setPlanEnabled((v) => !v)}
          >
            <ListChecks className="assets-popup-item-icon" />
            <span style={{ flex: 1 }}>Plan</span>
            <span
              className={cn("assets-popup-switch", planEnabled && "is-on")}
              style={planEnabled ? switchOnTrackStyle : switchTrackStyle}
            >
              <span
                className="assets-popup-switch-thumb"
                style={{
                  ...switchThumbStyle,
                  transform: planEnabled ? "translateX(10px)" : undefined,
                }}
              />
            </span>
          </button>
          {!isHome && (
            <button
              type="button"
              className="assets-popup-item"
              onClick={() => { setPlusOpen(false); setPlusAnchorRect(null); setDesignSystemOpen(true); }}
            >
              <Layers className="assets-popup-item-icon" />
              <span>Design system</span>
            </button>
          )}
        </div>,
        document.body
      )}

      {importUrlOpen && createPortal(
        <div className="import-url-modal-backdrop" style={importModalBackdropStyle}>
          <div className="import-url-modal" style={importModalStyle} role="dialog" aria-modal="true" aria-labelledby="import-url-title">
            <div className="import-url-card-header" style={importModalHeaderStyle}>
              <div className="import-url-card-title" id="import-url-title">
                <LinkIcon />
                <span>Import from URL</span>
              </div>
              <button
                type="button"
                className="import-url-close"
                aria-label="Close import from URL"
                onClick={() => {
                  setImportUrlOpen(false);
                  setImportUrlValue("");
                  setImportUrlTouched(false);
                }}
              >
                <X />
              </button>
            </div>
            <form
              className="import-url-form"
              onSubmit={(e) => {
                e.preventDefault();
                setImportUrlTouched(true);
                if (!canImportUrl) return;
                onImportFromUrl?.(importUrlValue.trim());
                setImportUrlOpen(false);
                setImportUrlValue("");
                setImportUrlTouched(false);
              }}
            >
              <div className={cn("import-url-input-wrap", importUrlTouched && importUrlStatus.state !== "ready" && importUrlStatus.state !== "idle" && "has-error")} style={importInputWrapStyle}>
                <input
                  ref={importUrlInputRef}
                  type="url"
                  className="import-url-input"
                  placeholder="Paste video URL"
                  value={importUrlValue}
                  onChange={(e) => {
                    setImportUrlValue(e.target.value);
                    setImportUrlTouched(true);
                  }}
                />
              </div>
              <div className={cn("import-url-status", importUrlStatus.state)} style={importStatusStyle}>
                {importUrlStatus.state === "ready" ? <Check /> : importUrlStatus.state !== "idle" ? <CircleAlert /> : null}
                <span>{importUrlTouched || importUrlStatus.state === "ready" ? importUrlStatus.message : "Paste a supported video link to start importing."}</span>
              </div>
              <div className="import-url-modal-actions" style={importModalActionsStyle}>
                <button
                  type="button"
                  className="import-url-cancel"
                  style={importCancelStyle}
                  onClick={() => {
                    setImportUrlOpen(false);
                    setImportUrlValue("");
                    setImportUrlTouched(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="import-url-submit" style={importSubmitStyle} disabled={!canImportUrl}>
                  Import
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Narrow-mode settings dialog */}
      {settingsOpen && settingsAnchorRect && isNarrow && renderSettingsContent && createPortal(
        <div
          ref={settingsRef}
          className="video-settings-dialog"
          style={{
            position: "fixed",
            bottom: window.innerHeight - settingsAnchorRect.top + 10,
            left: settingsAnchorRect.left,
            zIndex: 9999,
          }}
        >
          {renderSettingsContent()}
        </div>,
        document.body
      )}

      <DesignSystemModal
        open={designSystemOpen}
        onClose={() => setDesignSystemOpen(false)}
        onApply={(t, f) => { setDsTheme(t); setDsFont(f); }}
      />
    </>
  );
}
