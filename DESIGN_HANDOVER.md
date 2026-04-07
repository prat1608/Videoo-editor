# Videoo Editor Design Handover

## Overview

This prototype is a desktop-first video editor shell with three coordinated areas:

- A collapsible left tool rail and contextual side panel
- A central editing workspace with top bar, canvas, and timeline
- A resizable right AI chat panel

The current implementation is a high-fidelity UI prototype rather than a fully functional editor. The main goal of this handover is to preserve the intended layout, visual language, and interaction behavior while the next developer turns the screen into a working product.

## Source Of Truth

- Main screen structure: `components/editor-screen.jsx`
- Visual tokens and layout styling: `app/globals.css`
- App entry: `app/page.js`
- Fonts: `app/fonts/Geist[wght].woff2`, `app/fonts/GeistMono[wght].woff2`

## Product Intent

The design direction is a focused, dark editing environment that feels premium and uncluttered. It mixes conventional editor affordances with an AI-assist surface on the right. The experience should feel calm and deliberate rather than flashy:

- Dense, but not cramped
- Dark surfaces with subtle contrast steps instead of heavy borders
- Compact controls with soft radii
- Minimal color use, with the indigo accent reserved for key actions
- Smooth panel transitions that make the shell feel adaptive

## Default State

The current default screen state is:

- Active left panel tab: `Files`
- Left panel: closed
- Right chat panel: open
- Timeline: open
- Interaction mode: `hand`
- Canvas zoom: `80%`
- Chat panel width: `400px`
- Timeline height: `196px`
- Sync state: `saved`
- Project name: `Untitled Project`

## Layout Breakdown

### 1. Left Rail And Context Panel

The left side is split into a narrow vertical rail plus a contextual panel.

- Expanded shell width: `372px`
- Expanded width when all three major sections are visible: `356px`
- Collapsed shell width: `54px`
- Rail buttons: `30x30`
- Rail tabs: Files, Media, Audio, Text, Elements, Settings

Behavior:

- Clicking the current tab toggles the panel open and closed
- Clicking a different tab switches content and opens the panel
- The panel header includes `Upload` and `Delete` actions
- The panel body swaps between content templates depending on the selected tab

### 2. Main Workspace

The editor area is organized as:

- Top bar: `52px` row height in layout, visually `58px` when the chat panel is present
- Canvas stage: flexible fill area
- Timeline: `196px` by default, resizable to `140px` to `360px`

The workspace gets rounded outer corners when adjacent panels are open:

- Right corners round when the chat panel is visible
- Left corners round when the left panel is visible

This rounded shell behavior is part of the visual identity and should be preserved.

### 3. Right Chat Panel

The chat panel is a full-height assist surface that shares the same dark gradient treatment as the rest of the shell.

- Default width: `400px`
- Resize range: minimum `360px`, maximum `workspace width - 320px`
- Can fully collapse
- When collapsed, credits, share, and publish move into the top bar

The right panel contains:

- Credits trigger
- Share and Publish actions
- Chat thread pills
- New chat and history actions
- A single prompt composer card

## Left Panel Content Inventory

### Files

- Search field
- Project size selector: `Original (16:9)`
- Auto Resize card
- Version History card
- Background tabs: `Color` and `Image`
- FPS selector: `30`

### Media

- Large dashed upload dropzone
- Two preset cards: `Brand Intro`, `Social Reel`

### Audio

- Two stack cards: `Ambient Pulse`, `Voice Over`

### Text

- Two stack cards: `Hero Title`, `Caption`

### Elements

- Two-column preset grid with Arrow, Glow, Card, Callout

### Settings

- Two stack cards: `Autosave`, `Canvas Dots`

## Canvas Design

The canvas is intentionally sparse in the current prototype. It is a framing device for editor interactions more than a populated composition surface.

- Artboard uses a `16:9` ratio
- Width is `min(50vw, 700px)`
- Background is solid black `#0a0a0a`
- The surrounding world is prepared for pan and zoom
- Pointer mode and hand mode are both exposed as floating tools

Current behavior:

- Hand mode allows panning
- Ctrl or Cmd plus wheel zooms the canvas
- Floating zoom trigger opens menu actions for zoom in, zoom out, 100%, 200%, and zoom to fit
- Zoom is clamped between `25%` and `200%`

Important note:

- The artboard is visually empty today
- The infinite grid layer is also visually transparent today

If the next phase adds actual scene content, the developer should treat the current canvas shell as the interaction frame, not the final composition design.

## Timeline Design

The timeline is a compact lower panel with three layers:

- Toolbar row
- Time ruler row
- Track content row

Current controls:

- Hide timeline
- Cut
- Delete track
- Page selector
- Centered transport controls
- Zoom controls plus `Fit`

Current behavior:

- Timeline can collapse into a thin bar
- Collapsed state still shows page selector and transport
- Height is vertically resizable
- Playhead can be repositioned by clicking or dragging
- Tick density changes with timeline zoom

Current content:

- One empty upload track with a dashed `Upload Media` card

## Top Bar Design

The top bar is intentionally restrained and becomes denser when neighboring panels are visible.

Left:

- Undo
- Redo

Center:

- Sync status
- Project name

Right:

- Collaborator avatars
- When chat is collapsed: credits, share, publish
- When chat is open: only the panel toggle remains in the main top bar

This adaptive behavior is important. The design tries to avoid duplicate actions while keeping the shell balanced.

## Chat Panel Design

The chat panel is styled to feel like an integrated assistant, not a separate app window.

Key parts:

- Top header with credits, share, publish
- Subbar with thread pills and utility actions
- Prompt card with placeholder copy: `Describe your next shot...`
- Attachment button
- Model selector
- Send button

Behavior:

- Starting a new chat creates titled threads such as `New Chat`, `New Chat 2`, etc.
- Selecting a thread restores its draft
- Creating a thread focuses the prompt editor

## Visual System

### Color

Primary tokens currently used:

- Accent: `#2e3260`
- Accent hover: `#686db6`
- App background base: `#0a0a0a`
- Main shell surfaces: `#202020`, `#1d1d1e`, `#171717`
- Hover background: `#404040`
- Primary text: `#d9d9d9`
- Secondary text: `#808080`
- Icon unselected: `#a1a1a1`
- Icon selected / bright neutral: `#ededed`
- Canvas artboard fill: `#0a0a0a`

The UI relies on subtle value shifts more than obvious borders. Most borders are `0.6px` and intentionally low contrast.

### Typography

- Primary font: Geist Sans
- Monospace font: Geist Mono
- Base font size: `14px`
- Mono is used for timecode and zoom-style numeric displays

### Radius

- Large radius: `24px`
- Panel radius: `20px`
- Control radius: `14px`
- Small radius: `10px`

### Motion

The shell uses one shared easing token:

- `320ms cubic-bezier(0.22, 1, 0.36, 1)`

Use that same motion family for panel open, collapse, and resize-adjacent transitions so the interface keeps the same feel.

## Responsive Behavior

Two breakpoints are defined in the current CSS:

- `1260px`
- `1040px`

At narrower widths:

- The left panel becomes an overlay panel
- The right chat panel is hidden under `1040px`
- Top bar spacing tightens

Important caveat:

- The responsive rules are partial and should be treated as a first pass
- This prototype is strongest on desktop; mobile and tablet behavior will need product decisions if this is meant to become production-ready

## Implementation Notes For The Next Developer

- The entire screen currently lives in one main client component
- Most interactions are local UI state, not app data
- Shared primitives already exist for button, card, input, tabs, tooltip, dropdown, slider, avatar, and collapsible
- The prototype includes interaction scaffolding for panning, zooming, panel resizing, timeline resizing, thread creation, and playhead dragging
- The prototype does not yet include real editor data models, media tracks, uploaded assets, or rendered canvas content

## Recommended Development Priorities

1. Split the monolithic screen into feature areas: left panel, top bar, canvas, timeline, chat panel.
2. Introduce a data model for project state, tracks, assets, and chat threads.
3. Replace placeholder cards with real content sources and loading or empty states.
4. Confirm whether the right panel should remain a first-class desktop affordance or become optional for narrower screens.
5. Add keyboard and focus treatment for the main editor interactions if this is moving beyond prototype stage.

## Open Questions To Resolve Before Production

- Should the left panel default to open or closed?
- Is the empty black canvas intentional, or should the design include starter composition content?
- Should credits, share, and publish always live in one place instead of moving between top bar and chat header?
- Is the AI chat a required part of the editor shell or a dismissible productivity layer?
- What should happen to the right panel on tablet widths between desktop and mobile?
- Should the timeline support multiple stacked tracks immediately, or can that ship later?

## Handover Summary

If the next developer preserves these four things, the design intent will survive the implementation phase:

- The three-part shell with adaptive rounded edges
- The restrained dark theme with subtle borders and a single indigo accent
- The feeling of direct manipulation in canvas and timeline
- The AI chat feeling integrated into the editor, not bolted onto it
