"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEMES = [
  {
    id: "broadside",
    name: "Broadside",
    description: "Industrial newsprint poster — raw cream on ink, fire-orange register",
    bg: "#E8501A",
    text: "#0D0D0D",
    surface: "#0D0D0D",
    swatches: ["#E8501A", "#0D0D0D", "#F5F0E8", "#C73E10"],
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep indigo editorial — cool blue on near-black",
    bg: "#1B3A6B",
    text: "#E8F0FF",
    surface: "#080D1A",
    swatches: ["#1B3A6B", "#080D1A", "#E8F0FF", "#4A80D0"],
  },
  {
    id: "forest",
    name: "Forest",
    description: "Organic editorial — sage green on dark earth",
    bg: "#2D5A3D",
    text: "#F0F7F2",
    surface: "#0D1A11",
    swatches: ["#2D5A3D", "#0D1A11", "#F0F7F2", "#7BC67A"],
  },
  {
    id: "ember",
    name: "Ember",
    description: "Smouldering burgundy — deep red on near-black",
    bg: "#7C1D2A",
    text: "#FFF0F0",
    surface: "#140508",
    swatches: ["#7C1D2A", "#140508", "#FFF0F0", "#C0394A"],
  },
  {
    id: "arctic",
    name: "Arctic",
    description: "Icy minimalism — pale steel on deep slate",
    bg: "#B8D4E8",
    text: "#0A1520",
    surface: "#0A1520",
    swatches: ["#B8D4E8", "#0A1520", "#E8F4FF", "#5A9EC8"],
  },
  {
    id: "noir",
    name: "Noir",
    description: "Pure contrast — stark white on absolute black",
    bg: "#F5F5F5",
    text: "#080808",
    surface: "#080808",
    swatches: ["#F5F5F5", "#080808", "#CCCCCC", "#444444"],
  },
  {
    id: "dusk",
    name: "Dusk",
    description: "Warm violet — lavender dusk on deep indigo",
    bg: "#6B3FA0",
    text: "#F5EEFF",
    surface: "#120820",
    swatches: ["#6B3FA0", "#120820", "#F5EEFF", "#A87DD4"],
  },
  {
    id: "copper",
    name: "Copper",
    description: "Warm metallic — amber gold on deep brown",
    bg: "#B5651D",
    text: "#FFF8EE",
    surface: "#1A0E05",
    swatches: ["#B5651D", "#1A0E05", "#FFF8EE", "#D4882A"],
  },
  {
    id: "neon",
    name: "Neon",
    description: "Electric contrast — lime green on terminal black",
    bg: "#0D0D0D",
    text: "#A8FF3E",
    surface: "#000000",
    swatches: ["#0D0D0D", "#000000", "#A8FF3E", "#2ECC40"],
  },
];

const FONTS = [
  {
    id: "barlow",
    name: "Barlow",
    label: "Barlow 900 · IBM Plex Mono",
    headlineFont: "'Barlow', 'Arial Black', sans-serif",
    headlineWeight: 900,
    monoFont: "'IBM Plex Mono', 'Courier New', monospace",
    specimen: "ink on fire.",
  },
  {
    id: "playfair",
    name: "Editorial",
    label: "Playfair Display · Inter",
    headlineFont: "'Playfair Display', Georgia, serif",
    headlineWeight: 800,
    monoFont: "Inter, system-ui, sans-serif",
    specimen: "form follows fire.",
  },
  {
    id: "space",
    name: "Space",
    label: "Space Grotesk · Space Mono",
    headlineFont: "'Space Grotesk', 'Trebuchet MS', sans-serif",
    headlineWeight: 800,
    monoFont: "'Space Mono', 'Courier New', monospace",
    specimen: "grid in motion.",
  },
  {
    id: "oswald",
    name: "Oswald",
    label: "Oswald 700 · Roboto Mono",
    headlineFont: "'Oswald', 'Impact', sans-serif",
    headlineWeight: 700,
    monoFont: "'Roboto Mono', 'Courier New', monospace",
    specimen: "type is power.",
  },
  {
    id: "bebas",
    name: "Bebas",
    label: "Bebas Neue · Source Code Pro",
    headlineFont: "'Bebas Neue', 'Impact', sans-serif",
    headlineWeight: 400,
    monoFont: "'Source Code Pro', 'Courier New', monospace",
    specimen: "raw signal.",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    label: "Montserrat 900 · Fira Code",
    headlineFont: "'Montserrat', 'Arial Black', sans-serif",
    headlineWeight: 900,
    monoFont: "'Fira Code', 'Courier New', monospace",
    specimen: "weight of words.",
  },
  {
    id: "dm",
    name: "DM Serif",
    label: "DM Serif Display · DM Mono",
    headlineFont: "'DM Serif Display', Georgia, serif",
    headlineWeight: 400,
    monoFont: "'DM Mono', 'Courier New', monospace",
    specimen: "quiet authority.",
  },
  {
    id: "clash",
    name: "Clash",
    label: "Clash Display · JetBrains Mono",
    headlineFont: "'Clash Display', 'Trebuchet MS', sans-serif",
    headlineWeight: 700,
    monoFont: "'JetBrains Mono', 'Courier New', monospace",
    specimen: "frames of reference.",
  },
];

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Barlow:wght@900&family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@800&family=Inter:wght@400;500&family=Space+Grotesk:wght@700;800&family=Space+Mono&family=Oswald:wght@700&family=Roboto+Mono:wght@400&family=Bebas+Neue&family=Source+Code+Pro:wght@400&family=Montserrat:wght@800;900&family=Fira+Code:wght@400&family=DM+Serif+Display&family=DM+Mono:wght@400&display=swap";

function useFonts() {
  useEffect(() => {
    if (document.getElementById("ds-gfonts")) return;
    const link = document.createElement("link");
    link.id = "ds-gfonts";
    link.rel = "stylesheet";
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
  }, []);
}

function SelectDropdown({ label, children }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "11px 14px",
            background: "#1A1A1A",
            border: "1px solid #252525",
            borderRadius: 10,
            cursor: "pointer",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            outline: "none",
          }}
        >
          {label}
          <ChevronDown style={{ width: 15, height: 15, color: "#666" }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        style={{ width: 236, maxHeight: 260, overflowY: "auto" }}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Preview({ theme, font }) {
  return (
    <div
      style={{
        flex: 1,
        borderRadius: 12,
        background: theme.bg,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "28px 36px",
        transition: "background 0.25s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: font.monoFont, fontSize: 11, color: theme.text, opacity: 0.55, letterSpacing: "0.05em" }}>
          No. 01 / 06
        </span>
        <span style={{ fontFamily: font.monoFont, fontSize: 11, color: theme.text, opacity: 0.55, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {theme.name.toUpperCase()} — FRAME SYSTEM
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
        <div style={{ width: 32, height: 2, background: theme.text, opacity: 0.5 }} />
        <span style={{ fontFamily: font.monoFont, fontSize: 11, color: theme.text, opacity: 0.65, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Protest-Poster Editorial
        </span>
        <div
          style={{
            fontFamily: font.headlineFont,
            fontWeight: font.headlineWeight,
            fontSize: 60,
            lineHeight: 1.0,
            color: theme.text,
            letterSpacing: "-0.02em",
            transition: "font-family 0.2s",
          }}
        >
          {font.specimen}
        </div>
        <p
          style={{
            fontFamily: font.monoFont,
            fontSize: 13,
            color: theme.text,
            opacity: 0.72,
            lineHeight: 1.65,
            maxWidth: 360,
            margin: 0,
          }}
        >
          Massive {font.name.toLowerCase()} type as graphic primitive, one {theme.name.toLowerCase()} environment,
          and a flat plane built from negative space — dark to document, colour to declare.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <span style={{ fontFamily: font.monoFont, fontSize: 10, color: theme.text, opacity: 0.45, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {font.label}
        </span>
        <span style={{ fontFamily: font.monoFont, fontSize: 10, color: theme.text, opacity: 0.45, letterSpacing: "0.05em" }}>
          1920 × 1080
        </span>
      </div>
    </div>
  );
}

export function DesignSystemModal({ open, onClose, onApply }) {
  useFonts();
  const [theme, setTheme] = useState(THEMES[0]);
  const [font, setFont] = useState(FONTS[0]);

  if (!open) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          display: "flex",
          width: 980,
          height: 600,
          borderRadius: 18,
          overflow: "hidden",
          background: "#0D0D0D",
          boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
        }}
      >
        {/* Left panel */}
        <div
          style={{
            width: 272,
            flexShrink: 0,
            background: "#111",
            display: "flex",
            flexDirection: "column",
            padding: "24px 18px 20px",
            gap: 10,
            borderRight: "1px solid #1E1E1E",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#2A2A2A transparent",
          }}
        >
          {/* Project heading */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 15, letterSpacing: "-0.01em" }}>
              {theme.name}
            </div>
            <div style={{ color: "#555", fontSize: 11.5, marginTop: 5, lineHeight: 1.55 }}>
              {theme.description}
            </div>
          </div>

          <SelectDropdown label="Themes">
            <DropdownMenuRadioGroup value={theme.id} onValueChange={(id) => setTheme(THEMES.find((t) => t.id === id))}>
              {THEMES.map((t) => (
                <DropdownMenuRadioItem key={t.id} value={t.id}>
                  <div style={{ display: "flex", gap: 3 }}>
                    {t.swatches.map((c, i) => (
                      <div
                        key={i}
                        style={{ width: 13, height: 13, borderRadius: 3, background: c, border: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{t.name}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </SelectDropdown>

          <SelectDropdown label="Fonts">
            <DropdownMenuRadioGroup value={font.id} onValueChange={(id) => setFont(FONTS.find((f) => f.id === id))}>
              {FONTS.map((f) => (
                <DropdownMenuRadioItem key={f.id} value={f.id}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{f.name}</span>
                    <span style={{ fontSize: 11, opacity: 0.5, marginTop: 1 }}>{f.label}</span>
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </SelectDropdown>
        </div>

        {/* Right preview panel */}
        <div
          style={{
            flex: 1,
            background: "#0D0D0D",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Toolbar row — close button lives here, never overlaps preview */}
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 14px 0" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "none",
                borderRadius: 8,
                padding: 7,
                cursor: "pointer",
                color: "#666",
                display: "flex",
                alignItems: "center",
                lineHeight: 0,
              }}
            >
              <X style={{ width: 15, height: 15 }} />
            </button>
          </div>

          <div style={{ flex: 1, padding: "8px 20px 0", display: "flex", flexDirection: "column" }}>
            <Preview theme={theme} font={font} />
          </div>

          <div style={{ display: "flex", gap: 10, padding: "14px 20px 20px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "1px solid #2E2E2E",
                background: "transparent",
                color: "#888",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Discard
            </button>
            <button
              type="button"
              onClick={() => { onApply?.(theme, font); onClose(); }}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                background: "#d6d6d6ff",
                color: "#5e5e5eff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
