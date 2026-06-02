"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, ImageUp, Mic, Monitor, MonitorPlay, Plus, Settings, SlidersHorizontal, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const plusRef = useRef(null);
  const plusPopoverRef = useRef(null);

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
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [plusOpen]);

  function togglePlus(e) {
    if (plusOpen) {
      setPlusOpen(false);
      setPlusAnchorRect(null);
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

  // Chips + refs + text input are scrollable in the editor; flat in home.
  const scrollableContent = (
    <>
      {/* Mode chip row + extra tool chips */}
      {(hasModeChip || hasExtraChips) && (
        <div className={c.chipRow}>
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
                      <chip.icon size={13} />
                      <span>{chip.activeValue}</span>
                      <ChevronDown size={11} />
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
          <div className="assets-popup-label">Record source</div>
          {[
            { Icon: Mic,         label: "Audio" },
            { Icon: Video,       label: "Camera" },
            { Icon: Monitor,     label: "Screen" },
            { Icon: MonitorPlay, label: "Screen + Camera" },
          ].map(({ Icon, label }) => (
            <button
              key={label}
              type="button"
              className="assets-popup-item"
              onClick={() => { setPlusOpen(false); setPlusAnchorRect(null); }}
            >
              <Icon className="assets-popup-item-icon" />
              <span>{label}</span>
            </button>
          ))}
          <div className="assets-popup-sep" />
          <button
            type="button"
            className="assets-popup-item"
            onClick={() => { setPlusOpen(false); setPlusAnchorRect(null); }}
          >
            <Settings className="assets-popup-item-icon" />
            <span>Settings</span>
          </button>
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
    </>
  );
}
