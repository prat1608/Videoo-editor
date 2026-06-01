"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Check,
  Video,
  Layers,
  Sparkles,
  FileText,
  RefreshCw,
  Scissors,
  Mic2,
  ArrowUp,
  ArrowUpRight,
  Headphones,
  Music,
  Music4,
  Clapperboard,
  ImageUp,
  LayoutGrid,
  RectangleHorizontal,
  ArrowUpDown,
  Clock,
  Gauge,
  Mic,
  Repeat,
  X,
} from "lucide-react";
import { PromptBox } from "@/components/prompt-box";
import { HomeSidebar } from "@/components/home-sidebar";
import { IMAGE_STYLES, getImageStyleUrl } from "@/lib/image-styles";
import { ShowcaseCard, MarketplaceView, MUSIC_SHOWCASE, SHOWCASE_DATA } from "@/components/audio-showcase-cards";
import { cn } from "@/lib/utils";

const recentProjectsMain = [
  { id: 1, title: "Untitled Project", time: "Last edited 9 hrs ago", color: "#5a3a4a" },
  { id: 2, title: "Rough Cuts Project", time: "Last edited 9 hrs ago", color: "#2a2a3a" },
];

const actionChips = [
  { key: "generate", label: "Generate", icon: Sparkles },
  { key: "script", label: "Script & Strategy", icon: FileText },
  { key: "repurpose", label: "Repurpose", icon: RefreshCw },
  { key: "edit", label: "Edit", icon: Scissors },
  { key: "captions", label: "Captions & Voice", icon: Mic2 },
];

const homeImageStyles = IMAGE_STYLES;

const imageStylePrompts = {
  "Illustration":   "Cozy autumn village street, hand-painted editorial illustration, warm amber and crimson falling maple leaves, soft gouache texture, golden-hour side lighting, Monocle Magazine cover quality, 4:3 landscape, Procreate finish, no text",
  "Anime":          "Determined teenage hero in black school uniform standing on rain-slicked Tokyo skyscraper edge, neon-lit cyberpunk megacity below, Makoto Shinkai lighting, volumetric god-rays through clouds, 16:9, Studio MAPPA animation quality, ultra-detailed cel shading",
  "3D Render":      "Sleek near-future workspace, floating semi-transparent holographic displays showing data streams, warm tungsten accents against cool blue environment, Octane render, global illumination, sub-surface scattering on frosted glass, 4K, no people, product-viz quality",
  "Comic Book":     "Dynamic superhero leaping between rooftops in torrential rain, extreme low-angle foreshortening, bold Jack Kirby line work, halftone dot overlay on shadows, Ben-Day color printing texture, 4-color palette, dramatic thunderstorm backdrop, speech bubble absent",
  "Pixel Art":      "Sprawling isometric 8-bit fantasy dungeon, glowing amber torch sconces, overflowing treasure chests, detailed pixel characters mid-battle, layered parallax depth, classic NES palette of 56 colors, no anti-aliasing, 512×512 pixel canvas upscaled 4×",
  "Watercolor":     "Misty Kyoto zen garden at dawn, ancient stone lanterns, weeping cherry blossoms reflected in perfectly still koi pond, wet-on-wet watercolor technique, visible paper grain, loose brushwork on foliage, controlled bleeds, Arches 300gsm cold-press texture",
  "Oil Painting":   "Storm-swept North Sea at dusk, lone Victorian lighthouse on rocky headland, heavy impasto brushwork on wave crests, Rembrandt chiaroscuro lighting, raw umber and burnt sienna palette, varnish texture, museum-quality Old Masters oil on linen",
  "Cinematic":      "Lone astronaut in worn NASA suit standing on rust-red alien plateau, twin crescent moons rising on purple horizon, anamorphic 2.39:1 letterbox, Roger Deakins cinematography, practical suit lighting only, shallow depth of field, 35mm film grain, ARRI ALEXA LUT",
  "Pencil Sketch":  "Wise great horned owl perched on gnarled oak branch, meticulous graphite pencil study, fine cross-hatching in shadow areas, stippling on feather texture, 6B pencil deepest blacks, putty eraser highlights, sketchbook paper tooth visible, botanical illustration quality",
  "Monochrome":     "Dramatic close-up portrait of 70-year-old fisherman in oilskin jacket mid-storm, Zone System exposure, Ansel Adams contrast, catch-light in weathered eyes, rain droplets on face, Leica M6 with 50mm Summilux, pushed Kodak Tri-X 400 at 1600 ISO, gelatin silver print",
  "Minecraft":      "Epic Minecraft castle citadel on a floating obsidian island, cascading waterfalls off the edges, surrounding cloud layer, fully detailed with battlements and towers, distant biome visible through cloud gaps, 4K screenshot with Complementary Shaders ray-tracing enabled",
  "Neon Noir":      "Trench-coated private detective silhouette in rain-drenched 2070s neo-noir alley, red and teal neon kanji signs bleeding onto wet cobblestones, cigarette smoke volumetric, Blade Runner 2049 color grade, anamorphic lens flares, 16:9, photorealistic CGI",
  "Cyberpunk":      "Sprawling Level-5 street market at 3 AM, market stalls selling illegal augmentations, holographic AR vendor displays, rain on pavement reflecting chrome neon, crowd of 60% cybernetically augmented people, extreme detail, Cyberpunk 2077 concept art quality",
  "Vintage Film":   "Romantic couple in 1960s Paris, woman in Brigitte Bardot polka-dot sundress, Champs-Élysées café terrace, Super 8mm film grain heavy, Kodachrome II color science, light leaks on right edge, slightly underexposed shadows, French New Wave cinematography",
  "Surreal":        "Photorealistic sperm whale swimming through cumulus clouds at 3000m above Sahara desert, golden late-afternoon light, casting whale shadow on sand dunes below, hyperdetailed mammal skin, René Magritte meets Gregory Crewdson, 8K, surrealist realism",
  "Studio Ghibli":  "Young girl with shoulder-length hair and a small luminous spirit fox companion exploring a moonlit enchanted forest, Studio Ghibli production-quality key frame, Kazuo Oga background painting style, soft cel animation, hand-inked outlines, warm lantern glow, no text",
  "Impressionist":  "Sun-flooded Provençal lavender fields stretching to limestone château, loose alla prima oil technique, visible energetic brushstrokes, broken color theory, Monet palette knife texture, afternoon backlight causing violet shadows, plein-air quality, 4:3",
  "Photorealistic": "Snow leopard (Panthera uncia) at rest on granite ridge at 4800m altitude, setting alpenglow turning fur rose-gold, Canon EOS R5 + 600mm f/4L, 1/1600s, ISO 800, tack-sharp eye focus, bokeh background of distant Himalayas, National Geographic photo quality",
  "Abstract":       "Swirling vortex of charged particles, electric cobalt blue and vivid magenta plasma arms forming a cosmic nebula core, procedural noise displacement, volumetric glow, deep space black void, generative art output from TouchDesigner, 8K, no recognizable objects",
};

const homeImageMeta = {
  "Illustration":   { model: "Imagen 4",             created: "May 10, 2026" },
  "Anime":          { model: "Flux 1.1 Pro",          created: "May 7, 2026"  },
  "3D Render":      { model: "DALL·E 3",              created: "Apr 28, 2026" },
  "Comic Book":     { model: "Stable Diffusion 3.5",  created: "May 14, 2026" },
  "Pixel Art":      { model: "Imagen 4",              created: "May 2, 2026"  },
  "Watercolor":     { model: "Flux 1.1 Pro",          created: "May 19, 2026" },
  "Oil Painting":   { model: "DALL·E 3",              created: "Apr 21, 2026" },
  "Cinematic":      { model: "Imagen 4",              created: "May 11, 2026" },
  "Pencil Sketch":  { model: "Stable Diffusion 3.5",  created: "May 6, 2026"  },
  "Monochrome":     { model: "Flux 1.1 Pro",          created: "Apr 30, 2026" },
  "Minecraft":      { model: "Imagen 4",              created: "May 16, 2026" },
  "Neon Noir":      { model: "DALL·E 3",              created: "May 9, 2026"  },
  "Cyberpunk":      { model: "Flux 1.1 Pro",          created: "May 4, 2026"  },
  "Vintage Film":   { model: "Stable Diffusion 3.5",  created: "May 22, 2026" },
  "Surreal":        { model: "DALL·E 3",              created: "Apr 25, 2026" },
  "Studio Ghibli":  { model: "Imagen 4",              created: "May 17, 2026" },
  "Impressionist":  { model: "Flux 1.1 Pro",          created: "May 3, 2026"  },
  "Photorealistic": { model: "Imagen 4",              created: "May 20, 2026" },
  "Abstract":       { model: "Stable Diffusion 3.5",  created: "May 8, 2026"  },
};

const homeVideoClips = [
  { name: "Urban Timelapse", src: "/video-styles/Urban Timelapse.mp4", ratio: "16 / 9", aspectRatio: "16:9", model: "Kling 1.6",            style: "Cinematic",   curation: "Trending",  created: "May 12, 2026",
    prompt: "Cinematic timelapse, busy downtown intersection at 2 AM, neon-lit storefronts reflecting on wet asphalt, streaking amber and white car light trails, handheld stabilized wide shot, f/2.8 anamorphic lens, slight lens flare, film grain overlay, 24fps motion blur, hyper-realistic, photographic quality" },
  { name: "Street Style",    src: "/video-styles/Street Style.mp4",    ratio: "9 / 16", aspectRatio: "9:16",  model: "Runway Gen-3",         style: "Documentary", curation: "Featured",  created: "May 8, 2026",
    prompt: "Vertical documentary-style video, confident model in oversized leather jacket walking through a vibrant Soho street market, golden hour sidelight, shallow depth of field 85mm portrait lens, slow tracking shot, bokeh background of blurred market stalls, desaturated moody grade, skin tones preserved, cinematic 4K" },
  { name: "Forest Trail",    src: "/video-styles/Forest Trails.mp4",   ratio: "16 / 9", aspectRatio: "16:9", model: "Sora",                 style: "Handheld",    curation: "Curated",   created: "Apr 30, 2026",
    prompt: "First-person handheld walk through a dense Pacific Northwest old-growth forest, shafts of god-rays filtering through towering Douglas firs, soft morning mist at ankle level, footsteps on mossy earth, shallow focus on foreground ferns, Sony FX3 color science, warm tungsten grade, birdsong ambience implied, 4K 60fps" },
  { name: "Ocean Waves",     src: "/video-styles/Ocean waves.mp4",     ratio: "16 / 9", aspectRatio: "16:9", model: "Luma Dream Machine",   style: "Slow Motion", curation: "Trending",  created: "May 5, 2026",
    prompt: "Ultra slow-motion 1000fps phantom camera, translucent turquoise wave breaking on white coral sand, backlit by a golden sunset at 6 PM, water droplets suspended mid-air, fine sea foam lattice detail, horizon perfectly level, wide anamorphic 2.39:1, teal and orange complementary grade, zero noise, IMAX quality" },
  { name: "Abstract",        src: "/video-styles/Abstract.mp4",        ratio: "16 / 9", aspectRatio: "16:9", model: "Kling 1.6",            style: "Abstract",    curation: "Featured",  created: "May 15, 2026",
    prompt: "Fluid simulation abstract motion, liquid chrome and rose-gold metallic shapes continuously morphing and folding into each other, pitch-black void background, volumetric specular highlights, sub-surface scattering, 3D procedural noise displacement, seamless loop-ready, Octane render quality, 8K resolution, no text" },
  { name: "Portrait",        src: "/video-styles/Portrait.mp4",        ratio: "9 / 16", aspectRatio: "9:16",  model: "Runway Gen-3",         style: "Portrait",    curation: "Curated",   created: "May 3, 2026",
    prompt: "Vertical cinematic portrait, jazz musician playing a 1960s Gibson hollow-body guitar in a warmly lit vinyl-record shop, practitioner lighting with one soft tungsten key, f/1.4 85mm, extreme shallow depth of field, background records softly bokeh'd, amber and shadow tones, slow push-in dolly move, grain at 800 ISO" },
  { name: "Lifestyle",       src: "/video-styles/Lifestyle.mp4",       ratio: "16 / 9", aspectRatio: "16:9", model: "Sora",                 style: "Lifestyle",   curation: "Trending",  created: "May 18, 2026",
    prompt: "Warm lifestyle brand film, diverse group of friends at a sun-drenched Parisian terrace café, laughing and passing dishes of food, handheld verité style, natural diffused light through linen awning, Canon C70 color science, lifestyle grade with lifted blacks, shallow focus racks between faces, golden editorial feel" },
  { name: "Vertical",        src: "/video-styles/Vertical.mp4",        ratio: "9 / 16", aspectRatio: "9:16",  model: "Kling 1.6",            style: "Aerial",      curation: "Featured",  created: "May 1, 2026",
    prompt: "Vertical aerial drone descent through billowing clouds at dawn over the Swiss Alps, layered ridgelines fading into atmospheric haze, DJI Inspire 3 footage, f/2.8 wide, first light on snow caps turning coral pink, slow constant descent 0.5 m/s, vertigo-inducing depth, no color fringing, cinematic LOG-C graded" },
  { name: "Close Up",        src: "/video-styles/Close up.mp4",        ratio: "16 / 9", aspectRatio: "16:9", model: "Luma Dream Machine",   style: "Macro",       curation: "Curated",   created: "Apr 25, 2026",
    prompt: "Ultra-macro 8:1 magnification, single water droplet falling in 4000fps slow motion onto a fully bloomed pink peony, impact crown splash frozen mid-air, backlit with a soft LED ring, translucent petals visible through water, clinical sharpness across the splash radius, white studio background, photorealistic CGI quality" },
];

const homeAimgTemplates = [
  { id: "notion-showcase",      name: "Notion Showcase",     category: "Product",    gradient: "135deg,#1a1a1a 0%,#2d2d2d 100%",  src: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/showcase/tpl-notion.mp4",     zipUrl: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/zips/notion-showcase.zip",     model: "HyperFrames", style: "Product Walkthrough", curation: "Official", created: "2026", duration: "15s",
    prompt: "Minimalist SaaS product walkthrough, pure white canvas, Inter typeface at 18px with 160% line-height, UI panels slide in from bottom with cubic-bezier(0.16,1,0.3,1) ease, database rows populate sequentially with 40ms stagger, soft drop shadows at 0 8px 32px rgba(0,0,0,0.08), accent color #000 on white, 1920×1080, 24fps, 15-second sequence, Notion brand identity." },
  { id: "dribbble-showcase",    name: "Dribbble Showcase",   category: "Design",     gradient: "135deg,#ea4c89 0%,#c32361 100%",  src: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/showcase/tpl-dribbble.mp4",   zipUrl: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/zips/dribbble-showcase.zip",   model: "HyperFrames", style: "Design Showcase",    curation: "Official", created: "2026", duration: "20s",
    prompt: "Playful design portfolio reel, shot cards scale from 0.92 to 1.0 with spring stiffness 280 damping 22, hot-pink #EA4C89 accent on midnight background, 3×3 masonry grid assembles with 60ms column-stagger, hover states reveal like-count with +1 float animation, confetti burst on final frame, Inter Display 700 titles, 1920×1080, 60fps, 20-second loop." },
  { id: "stripe-showcase",      name: "Stripe Showcase",     category: "Fintech",    gradient: "135deg,#635bff 0%,#00d4ff 100%",  src: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/showcase/tpl-stripe.mp4",     zipUrl: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/zips/stripe-showcase.zip",     model: "HyperFrames", style: "Product Walkthrough", curation: "Official", created: "2026", duration: "25s",
    prompt: "Premium fintech product film, indigo #635BFF to cyan #00D4FF gradient hero, payment card materialises with 800ms ease-out scale from 0 with soft ambient occlusion, transaction rows stream in at 90ms intervals with green success pulses, code editor panel slides in from right showing Stripe API response JSON, glassmorphism panels at 12px blur 0.08 opacity, SF Mono code type, 1920×1080, 24fps, 25 seconds." },
  { id: "raycast-showcase",     name: "Raycast Showcase",    category: "Developer",  gradient: "135deg,#ff6b35 0%,#f7c59f 100%",  src: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/showcase/tpl-raycast.mp4",    zipUrl: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/zips/raycast-showcase.zip",    model: "HyperFrames", style: "App Demo",           curation: "Official", created: "2026", duration: "15s",
    prompt: "Developer tool spotlight, command-palette spawns with 180ms backdrop-blur transition from 0 to 20px, result rows highlight sequentially at 55ms each with orange-amber #FF6B35 selection glow, keyboard shortcut badges pop with scale(1.12) bounce, dark charcoal #1C1C1E shell with hairline borders at rgba(255,255,255,0.08), monospace JetBrains Mono labels, ambient particle dust at 4% opacity, 1920×1080, 60fps, 15-second demo." },
  { id: "fitness-app-showcase", name: "Fitness App",         category: "Mobile App", gradient: "135deg,#00b09b 0%,#96c93d 100%",  src: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/primitives/fitness-app-showcase/renders/fitness-app-showcase.mp4", zipUrl: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/zips/fitness-app-showcase.zip", model: "HyperFrames", style: "App Demo",           curation: "Official", created: "2026", duration: "5.5s",
    prompt: "High-energy fitness app reveal, activity ring animates from 0° to 312° with stroke-dashoffset over 900ms ease-in-out, teal #00B09B to lime #96C93D gradient fills, step counter increments with rolling digit animation at 30fps, heart-rate graph draws live with cubic spline interpolation, mobile UI floats on subtle 3D Y-axis tilt 6°, frosted glass metric cards blur 16px, SF Pro Rounded numerals, 1920×1080, 5.5-second loop." },
  { id: "spotify-bento",        name: "Spotify Bento",       category: "Music",      gradient: "135deg,#1db954 0%,#191414 100%",  src: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/compositions/spotify-bento/renders/spotify-bento.mp4",       zipUrl: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/zips/spotify-bento.zip",       model: "HyperFrames", style: "Bento Grid",         curation: "Official", created: "2026", duration: "26.5s",
    prompt: "Infinite-scroll bento album grid, 12 album art tiles arranged in asymmetric 4-column layout pan continuously rightward at 48px/s with seamless wrap-around, Spotify green #1DB954 progress bars pulse beneath each tile, waveform visualiser oscillates at 60fps, pure black #191414 background, circular album art with 8px radius and 1px rgba(255,255,255,0.12) border, Circular Std Bold titles, slow zoom on hero tile, 1920×1080, 26.5-second seamless loop." },
  { id: "x-post-overlay",       name: "X Post Overlay",      category: "Social",     gradient: "135deg,#000000 0%,#1a1a1a 100%",  src: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/overlays/x-post-overlay/renders/x-post-overlay.mp4",      zipUrl: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/zips/x-post-overlay.zip",      model: "HyperFrames", style: "Overlay",            curation: "Official", created: "2026", duration: "4s",
    prompt: "Broadcast-ready X post overlay, card slides up from -120px to 0 over 420ms with cubic-bezier(0.34,1.56,0.64,1) spring overshoot, avatar renders with crisp 40px circle clip and 1.5px white border, reply/repost/like counters tick up individually with 80ms stagger, pure black #000 background with subtle noise texture at 2% opacity, X logo mark in white at 14px, system-ui font stack at 15px/140%, 4-second hold then fade-out, 1920×1080, 60fps." },
  { id: "ui-3d-reveal",         name: "UI 3D Reveal",        category: "UI/UX",      gradient: "135deg,#1e3a5f 0%,#7c3aed 100%",  src: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/primitives/ui-3d-reveal/renders/ui-3d-reveal.mp4",        zipUrl: "https://gen-os-static.s3.us-east-2.amazonaws.com/hyperframes/templates/zips/ui-3d-reveal.zip",        model: "HyperFrames", style: "3D Perspective",     curation: "Official", created: "2026", duration: "13s",
    prompt: "Cinematic UI perspective reveal, interface begins at rotateX(38deg) rotateY(-12deg) scale(0.78) with deep-blue #1E3A5F to violet #7C3AED gradient background, transitions to flat orthographic over 1.4s with perspective(1200px) ease-out, sequential layer pop-ins at 120ms offsets each with subtle depth-shadow, ambient iridescent light sweep across the surface at frame 60, 8px corner radius on panels, Inter 500 labels, 1920×1080, 24fps, 13-second sequence." },
];

const TOOL_SUGGESTION_CONFIG = {
  video:      { icon: Video,        label: "Generate Video",     slug: "generate-video" },
  image:      { icon: ImageUp,      label: "Generate Image",     slug: "generate-image" },
  audio:      { icon: Music,        label: "Generate Audio",     slug: "generate-audio" },
  sfx:        { icon: Headphones,   label: "Generate SFX",       slug: "generate-sfx" },
  voiceover:  { icon: Mic2,         label: "Generate Voiceover", slug: "generate-voiceover" },
  autodemo:   { icon: Clapperboard, label: "Auto Demo",          slug: "autodemo" },
  roughcuts:  { icon: RefreshCw,    label: "Rough Cuts",         slug: "roughcuts" },
  clipping:   { icon: Scissors,     label: "Clipping",           slug: "clipping" },
};

const imageModels = ["Imagen 4", "Flux 1.1 Pro", "DALL·E 3", "Stable Diffusion 3.5"];
const imageRatioOptions = ["1:1", "4:3", "3:4", "16:9", "9:16"];
const imageResolutionOptions = ["512px", "768px", "1024px", "2048px"];
const imageQualityOptions = ["Standard", "HD"];

const videoModels = ["Sora", "Runway Gen-3", "Kling 1.6", "Luma Dream Machine"];
const videoRatioOptions = ["16:9", "9:16", "1:1", "4:3"];
const videoDurationOptions = ["5s", "10s", "15s", "30s"];
const videoQualityOptions = ["360p", "720p", "1080p", "4K"];

const audioModels = ["Suno v4", "Udio 2.0", "MusicGen 2"];
const audioMoodOptions = ["Cinematic", "Ambient", "Electronic", "Jazz", "Hip-Hop", "Acoustic", "Lo-Fi", "Corporate"];
const audioDurationOptions = ["15s", "30s", "60s", "2min"];
const audioQualityOptions = ["Standard", "HD"];

const sfxModels = ["ElevenLabs SFX", "Audiocraft", "Stability Audio"];
const sfxDurationOptions = ["1s", "3s", "5s", "10s"];

const voiceoverModels = ["ElevenLabs", "OpenAI TTS", "Cartesia"];
const voiceOptions = ["Nova", "Onyx", "Alloy", "Echo", "Fable", "Shimmer"];
const speedOptions = ["0.75x", "1x", "1.25x", "1.5x"];
const languageOptions = ["English", "Spanish", "French", "German"];


const modelProviders = [
  {
    id: "claude",
    label: "Claude",
    subBrand: "Anthropic",
    iconBg: "#f0ece7",
    iconColor: "#cc5533",
    submodels: [
      { id: "claude-haiku-4-5", label: "Haiku 4.5" },
      { id: "claude-sonnet-4-5", label: "Sonnet 4.5" },
    ],
  },
  {
    id: "deepseek-v4-pro",
    label: "DeepSeek V4 Pro",
    subBrand: "DeepSeek",
    iconBg: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)",
    submodels: [],
  },
  {
    id: "kimi-k2-6",
    label: "Kimi K2.6",
    subBrand: null,
    iconBg: "#18181f",
    iconColor: "#fff",
    iconLetter: "K",
    submodels: [],
  },
  {
    id: "qwen",
    label: "Qwen",
    subBrand: "Qwen",
    iconBg: "linear-gradient(135deg, #6d28d9 0%, #4338ca 100%)",
    submodels: [],
  },
];

export default function HomeScreen() {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [modelOpen, setModelOpen] = useState(false);
  const [hoveredProvider, setHoveredProvider] = useState(null);
  const [selectedModel, setSelectedModel] = useState({
    providerId: "deepseek-v4-pro",
    submodelId: null,
    label: "DeepSeek V4 Pro",
    iconBg: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)",
  });
  const [isFocused, setIsFocused] = useState(false);
  const [activeGrid, setActiveGrid] = useState(null);

  const [imageSettings, setImageSettings] = useState({ model: "Imagen 4", ratio: "1:1", resolution: "1024px", quality: "Standard" });
  const [videoSettings, setVideoSettings] = useState({ model: "Sora", ratio: "16:9", duration: "5s", quality: "1080p" });
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const modelRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState(null);
  const promptCardRef = useRef(null);
  const [videoStartAttachment, setVideoStartAttachment] = useState(null);
  const [videoEndAttachment, setVideoEndAttachment] = useState(null);
  const [promptSuggestion, setPromptSuggestion] = useState(null);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const [audioSettings, setAudioSettings] = useState({ model: "Suno v4", mood: "Cinematic", duration: "30s", quality: "HD" });
  const [sfxSettings, setSfxSettings] = useState({ model: "ElevenLabs SFX", duration: "3s" });
  const [voiceoverSettings, setVoiceoverSettings] = useState({ model: "ElevenLabs", voice: "Nova", speed: "1x", language: "English" });
  const [playingId, setPlayingId] = useState(null);
  const [activeVideoCard, setActiveVideoCard] = useState(null);
  const [activeImageCard, setActiveImageCard] = useState(null);
  const [activeAudioCard, setActiveAudioCard] = useState(null);
  const [activeAimgCard, setActiveAimgCard] = useState(null);
  const [aimgCategoryFilter, setAimgCategoryFilter] = useState("All");
  const [videoCurationFilter, setVideoCurationFilter] = useState("All");
  const [musicTagFilter, setMusicTagFilter] = useState("All");

  const aimgCategories = ["All", ...Array.from(new Set(homeAimgTemplates.map((t) => t.category)))];
  const videoCurations = ["All", ...Array.from(new Set(homeVideoClips.map((v) => v.curation)))];
  const musicTags = ["All", ...Array.from(new Set(MUSIC_SHOWCASE.map((m) => m.tag)))];

  const [imageErrorVisible, setImageErrorVisible] = useState(false);
  const hasPromptText = prompt.trim().length > 0;
  const showPromptSuggestion = Boolean(promptSuggestion && !suggestionDismissed && !activeGrid && hasPromptText);

  useEffect(() => {
    if (activeGrid !== "video" || !["Luma Dream Machine"].includes(videoSettings.model)) {
      setImageErrorVisible(false);
      return;
    }
    const card = promptCardRef.current;
    if (card) {
      card.classList.remove("is-shaking");
      void card.offsetWidth;
      card.classList.add("is-shaking");
      setTimeout(() => card.classList.remove("is-shaking"), 400);
    }
    setImageErrorVisible(true);
  }, [videoSettings.model]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeGrid !== "video") setImageErrorVisible(false);
  }, [activeGrid]);

  function setAudioSetting(key, value) { setAudioSettings((s) => ({ ...s, [key]: value })); }
  function setSfxSetting(key, value) { setSfxSettings((s) => ({ ...s, [key]: value })); }
  function setVoiceoverSetting(key, value) { setVoiceoverSettings((s) => ({ ...s, [key]: value })); }

  useLayoutEffect(() => {
    if (!prompt) {
      setPromptSuggestion(null);
      setSuggestionDismissed(false);
      return;
    }
    const videoMatch     = /\bvideo\b|\b(generate|create|make)\s+(?:a\s+)?video\b|\banimate\b|\bcreate\s+(?:a\s+)?clip\b|\/generate-video\b/i.test(prompt);
    const imageMatch     = /\bimage\b|\b(generate|create|make)\s+(?:an?\s+)?image\b|\bdraw\b|\billustrate\b|\brender\b|\b(photo|picture)\s+of\b|\/generate-image\b/i.test(prompt);
    const voiceoverMatch = /\b(generate|create|make|add)\s+(?:a\s+)?(?:voiceover|voice\s+over|narration)\b|\bnarrate\b|\bnarration\b|\btext\s+to\s+speech\b|\bvoiceover\b|\bvoice\s+over\b|\/generate-voiceover\b/i.test(prompt);
    const audioMatch     = /\b(generate|create|make|add)\s+(?:an?\s+)?(?:background\s+)?(?:audio|music|soundtrack)\b|\bmusic\b|\bsoundtrack\b|\bbackground\s+music\b|\/generate-audio\b/i.test(prompt);
    const sfxMatch       = /\b(generate|create|make|add)\s+(?:sound\s+effects?|sfx)\b|\bsound\s+effects?\b|\bsfx\b|\/generate-sfx\b/i.test(prompt);
    const autodemoMatch  = /\bauto\s*demo\b|\b(create|generate|make)\s+(?:a\s+)?(?:product\s+)?demo\b|\bdemo\s+video\b|\/autodemo\b/i.test(prompt);
    const roughcutsMatch = /\brough\s*cuts?\b|\b(create|make|assemble)\s+(?:a\s+)?(?:rough|first)\s+cut\b|\/roughcuts\b/i.test(prompt);
    const clippingMatch  = /\b(create|make|generate|extract)\s+(?:short\s+|social\s+)?clips?\b|\bclipping\b|\bhighlight\s+(?:reel|clips?)\b|\/clipping\b/i.test(prompt);
    const detected = videoMatch ? "video" : imageMatch ? "image" : voiceoverMatch ? "voiceover" : audioMatch ? "audio" : sfxMatch ? "sfx" : autodemoMatch ? "autodemo" : roughcutsMatch ? "roughcuts" : clippingMatch ? "clipping" : null;
    if (detected !== promptSuggestion) {
      setPromptSuggestion(detected);
      setSuggestionDismissed(false);
    }
  }, [prompt]); // eslint-disable-line react-hooks/exhaustive-deps

  function acceptSuggestion() {
    setActiveGrid(promptSuggestion);
    setSuggestionDismissed(true);
    setPrompt("");
  }

  function openModelDropdown() {
    if (modelRef.current) {
      const rect = modelRef.current.getBoundingClientRect();
      setDropdownPos({
        bottom: window.innerHeight - rect.top + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setModelOpen(true);
    setHoveredProvider(null);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      const inSelector = modelRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);
      if (!inSelector && !inDropdown) {
        setModelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isFocused) return;
    function handleClickOutside(e) {
      if (promptCardRef.current && !promptCardRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFocused]);

  return (
    <div className={cn("home-shell", isFocused && "is-focused", activeGrid && "has-grid")}>
      <HomeSidebar
        activePath="/"
        onToolSelect={(key) => {
          setActiveGrid(key);
          setPromptSuggestion(null);
          setSuggestionDismissed(false);
        }}
      />

      <main className="home-main">
        <div className="home-focused-topbar">
          <button type="button" className="home-focused-credits">
            <Sparkles />
            <span>9,261 credits</span>
          </button>
          <button type="button" className="home-focused-space">
            <Layers />
            <span>Default Space</span>
          </button>
          <Link href="/editor" className="home-focused-open-editor">
            <span>Open Editor</span>
            <ArrowUpRight />
          </Link>
        </div>
        <div className="home-main-inner">
          <h1 className="home-greeting">Ready to direct, Pratiksha?</h1>

          {imageErrorVisible && (
            <div className="prompt-image-error">
              <div className="prompt-image-error-left">
                <AlertTriangle size={13} />
                <span className="prompt-image-error-text">Images you upload won't be used — Luma Dream Machine doesn't support image input for video generation</span>
              </div>
            </div>
          )}

          <div className="home-prompt-card" ref={promptCardRef}>
            <PromptBox
              variant="home"
              value={prompt}
              onChange={setPrompt}
              onKeyDown={(e) => {
                if (e.key === "Tab" && promptSuggestion && !suggestionDismissed && !activeGrid) {
                  e.preventDefault();
                  acceptSuggestion();
                }
              }}
              placeholder={isFocused ? "Type / for commands" : "Describe your next shot..."}
              activeGrid={activeGrid}
              onActiveGridChange={(grid) => { setActiveGrid(grid); setPromptSuggestion(null); setSuggestionDismissed(false); }}
              selectedAttachment={selectedAttachment}
              onSelectedAttachmentChange={setSelectedAttachment}
              videoStartAttachment={videoStartAttachment}
              onVideoStartAttachmentChange={setVideoStartAttachment}
              videoEndAttachment={videoEndAttachment}
              onVideoEndAttachmentChange={setVideoEndAttachment}
              chipsMap={{
                image: [
                  { key: "model",      icon: LayoutGrid,          activeValue: imageSettings.model,      options: imageModels,           onSelect: (v) => setImageSettings((s) => ({ ...s, model: v })) },
                  { key: "ratio",      icon: RectangleHorizontal, activeValue: imageSettings.ratio,      options: imageRatioOptions,     onSelect: (v) => setImageSettings((s) => ({ ...s, ratio: v })) },
                  { key: "resolution", icon: ArrowUpDown,         activeValue: imageSettings.resolution, options: imageResolutionOptions, onSelect: (v) => setImageSettings((s) => ({ ...s, resolution: v })) },
                  { key: "quality",    icon: Sparkles,            activeValue: imageSettings.quality,    options: imageQualityOptions,   onSelect: (v) => setImageSettings((s) => ({ ...s, quality: v })) },
                ],
                video: [
                  { key: "model",    icon: LayoutGrid,          activeValue: videoSettings.model,    options: videoModels,         onSelect: (v) => setVideoSettings((s) => ({ ...s, model: v })) },
                  { key: "ratio",    icon: RectangleHorizontal, activeValue: videoSettings.ratio,    options: videoRatioOptions,   onSelect: (v) => setVideoSettings((s) => ({ ...s, ratio: v })) },
                  { key: "duration", icon: Clock,               activeValue: videoSettings.duration, options: videoDurationOptions, onSelect: (v) => setVideoSettings((s) => ({ ...s, duration: v })) },
                  { key: "quality",  icon: Sparkles,            activeValue: videoSettings.quality,  options: videoQualityOptions, onSelect: (v) => setVideoSettings((s) => ({ ...s, quality: v })) },
                ],
                audio: [
                  { key: "aud-model",    icon: LayoutGrid, activeValue: audioSettings.model,    options: audioModels,          onSelect: (v) => setAudioSetting("model", v) },
                  { key: "aud-mood",     icon: Music4,     activeValue: audioSettings.mood,     options: audioMoodOptions,     onSelect: (v) => setAudioSetting("mood", v) },
                  { key: "aud-duration", icon: Clock,      activeValue: audioSettings.duration, options: audioDurationOptions, onSelect: (v) => setAudioSetting("duration", v) },
                  { key: "aud-quality",  icon: Sparkles,   activeValue: audioSettings.quality,  options: audioQualityOptions,  onSelect: (v) => setAudioSetting("quality", v) },
                ],
                sfx: [
                  { key: "sfx-model",    icon: LayoutGrid, activeValue: sfxSettings.model,    options: sfxModels,        onSelect: (v) => setSfxSetting("model", v) },
                  { key: "sfx-duration", icon: Clock,      activeValue: sfxSettings.duration, options: sfxDurationOptions, onSelect: (v) => setSfxSetting("duration", v) },
                ],
                voiceover: [
                  { key: "vo-model",    icon: LayoutGrid, activeValue: voiceoverSettings.model,    options: voiceoverModels, onSelect: (v) => setVoiceoverSetting("model", v) },
                  { key: "vo-voice",    icon: Mic,        activeValue: voiceoverSettings.voice,    options: voiceOptions,    onSelect: (v) => setVoiceoverSetting("voice", v) },
                  { key: "vo-speed",    icon: Gauge,      activeValue: voiceoverSettings.speed,    options: speedOptions,    onSelect: (v) => setVoiceoverSetting("speed", v) },
                  { key: "vo-language", icon: LayoutGrid, activeValue: voiceoverSettings.language, options: languageOptions, onSelect: (v) => setVoiceoverSetting("language", v) },
                ],
              }}
              renderModelSelector={() => (
                <div className="home-model-selector-wrap" ref={modelRef}>
                  <button
                    type="button"
                    className={cn("home-model-selector", modelOpen && "is-open")}
                    onClick={() => modelOpen ? (setModelOpen(false), setHoveredProvider(null)) : openModelDropdown()}
                  >
                    <span className="home-model-icon" style={{ background: selectedModel.iconBg }} />
                    <span>{selectedModel.label}</span>
                    <ChevronDown className={cn("home-model-chevron", modelOpen && "is-open")} />
                  </button>
                  {modelOpen && dropdownPos && createPortal(
                    <div
                      ref={dropdownRef}
                      className="home-model-dropdown"
                      style={{ position: "fixed", bottom: dropdownPos.bottom, right: dropdownPos.right }}
                    >
                      <div className="home-model-provider-list">
                        {modelProviders.map((provider) => (
                          <div
                            key={provider.id}
                            className={cn("home-model-provider-row", hoveredProvider === provider.id && "is-hovered")}
                            onMouseEnter={() => setHoveredProvider(provider.id)}
                            onMouseLeave={() => provider.submodels.length === 0 && setHoveredProvider(null)}
                            onClick={() => {
                              if (provider.submodels.length === 0) {
                                setSelectedModel({ providerId: provider.id, submodelId: null, label: provider.label, iconBg: provider.iconBg });
                                setModelOpen(false);
                                setHoveredProvider(null);
                              }
                            }}
                          >
                            <span className="home-model-provider-icon" style={{ background: provider.iconBg, color: provider.iconColor }}>
                              {provider.iconLetter ?? null}
                              {provider.id === "claude" && (
                                <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
                                  <path d="M12 2l1.09 3.36L16.5 4l-2.18 2.91L17 10l-3.5-.55L12 13l-1.5-3.55L7 10l2.68-3.09L7.5 4l3.41 1.36z" />
                                </svg>
                              )}
                            </span>
                            <span className="home-model-provider-name">{provider.label}</span>
                            {provider.subBrand && <span className="home-model-provider-brand">{provider.subBrand}</span>}
                            {provider.submodels.length > 0
                              ? <ChevronRight className="home-model-row-end" />
                              : selectedModel.providerId === provider.id && <Check className="home-model-row-end home-model-row-check" />
                            }
                          </div>
                        ))}
                      </div>
                      {hoveredProvider && modelProviders.find(p => p.id === hoveredProvider)?.submodels.length > 0 && (
                        <div className="home-model-submenu">
                          <div className="home-model-submenu-header">
                            {modelProviders.find(p => p.id === hoveredProvider).label}
                          </div>
                          {modelProviders.find(p => p.id === hoveredProvider).submodels.map((sub) => {
                            const provider = modelProviders.find(p => p.id === hoveredProvider);
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                className={cn("home-model-sub-option", selectedModel.submodelId === sub.id && "is-selected")}
                                onClick={() => {
                                  setSelectedModel({ providerId: provider.id, submodelId: sub.id, label: sub.label, iconBg: provider.iconBg });
                                  setModelOpen(false);
                                  setHoveredProvider(null);
                                }}
                              >
                                <span className="home-model-provider-icon" style={{ background: provider.iconBg, color: provider.iconColor }}>
                                  {provider.id === "claude" && (
                                    <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
                                      <path d="M12 2l1.09 3.36L16.5 4l-2.18 2.91L17 10l-3.5-.55L12 13l-1.5-3.55L7 10l2.68-3.09L7.5 4l3.41 1.36z" />
                                    </svg>
                                  )}
                                </span>
                                <span>{sub.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>,
                    document.body
                  )}
                </div>
              )}
              renderSendButton={() => (
                <button type="button" className="home-prompt-send" aria-label="Send">
                  <ArrowUp />
                </button>
              )}
            />
          </div>

          {showPromptSuggestion && (() => {
            const cfg = TOOL_SUGGESTION_CONFIG[promptSuggestion];
            if (!cfg) return null;
            return (
              <div className="prompt-suggestion-widget prompt-suggestion-widget--below">
                <div className="prompt-suggestion-left">
                  <cfg.icon size={13} />
                  <span className="prompt-suggestion-label">{cfg.label}</span>
                  <span className="prompt-suggestion-key">Tab</span>
                </div>
                <div className="prompt-suggestion-right">
                  <button type="button" className="prompt-suggestion-confirm" onClick={acceptSuggestion}>
                    Use {cfg.slug}
                  </button>
                  <button type="button" className="prompt-suggestion-dismiss" onClick={() => setSuggestionDismissed(true)}>
                    <X size={12} />
                  </button>
                </div>
              </div>
            );
          })()}

          {!hasPromptText && (
            <div className="home-action-chips">
              {actionChips.map((chip) => (
                <button key={chip.key} type="button" className="home-action-chip">
                  <chip.icon />
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {activeGrid === "image" && (
          <div className="home-style-grid-wrap">
            <div className="home-gen-text-header">
              <span className="image-style-title">Trending: 2026 picks</span>
            </div>
            <div className="home-image-style-grid">
              {homeImageStyles.map((style, i) => (
                <button
                  key={style.name}
                  type="button"
                  className={cn("image-style-card", activeImageCard?.name === style.name && "is-selected")}
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() => setActiveImageCard({
                    ...style,
                    src: getImageStyleUrl(style),
                    prompt: imageStylePrompts[style.name] ?? style.name,
                    ...(homeImageMeta[style.name] ?? {}),
                  })}
                >
                  <img
                    src={getImageStyleUrl(style)}
                    alt={style.name}
                    className="image-style-thumb"
                  />
                  <span className="image-style-label">{style.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeGrid === "video" && (
          <div className="home-style-grid-wrap">
            <div className="home-gen-text-header">
              <span className="image-style-title">For You</span>
            </div>
            <div className="aimg-tabs">
              {videoCurations.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={cn("aimg-tab", videoCurationFilter === c && "is-active")}
                  onClick={() => setVideoCurationFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="home-aimg-grid">
              {homeVideoClips
                .filter((v) => videoCurationFilter === "All" || v.curation === videoCurationFilter)
                .map((vid, i) => (
                  <div
                    key={vid.name}
                    role="button"
                    tabIndex={0}
                    className={cn("aimg-template-card", activeVideoCard?.name === vid.name && "is-selected")}
                    style={{ animationDelay: `${i * 40}ms` }}
                    onClick={() => setActiveVideoCard(vid)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveVideoCard(vid)}
                  >
                    <div className="aimg-card-visual">
                      <video src={vid.src} muted loop playsInline autoPlay className="aimg-card-video" />
                      <div className="aimg-card-hover-overlay">
                        <p className="aimg-card-hover-prompt">{vid.prompt}</p>
                        <button
                          type="button"
                          className="aimg-card-try-btn"
                          onClick={(e) => { e.stopPropagation(); setActiveVideoCard(vid); }}
                        >
                          <Repeat size={11} />
                          Try it
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeGrid === "audio" && (
          <div className="home-style-grid-wrap">
            <div className="home-gen-text-header">
              <span className="image-style-title">Vibe on them</span>
            </div>
            <div className="aimg-tabs">
              {musicTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={cn("aimg-tab", musicTagFilter === tag && "is-active")}
                  onClick={() => setMusicTagFilter(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div
              className="ga-scard-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "14px" }}
            >
              {MUSIC_SHOWCASE
                .filter((m) => musicTagFilter === "All" || m.tag === musicTagFilter)
                .map((item) => (
                  <ShowcaseCard
                    key={item.id}
                    item={item}
                    mode="audio"
                    isPlaying={playingId === item.id}
                    onPlayToggle={(id) => setPlayingId((p) => (p === id ? null : id))}
                    onSelect={(p) => setPrompt((prev) => (prev.trim() ? prev.trim() + " " : "") + p)}
                    onCardClick={(it) => setActiveAudioCard({ ...it, mode: "audio" })}
                  />
                ))}
            </div>
          </div>
        )}

        {(activeGrid === "sfx" || activeGrid === "voiceover") && (
          <div className="home-style-grid-wrap">
            <MarketplaceView
              mode={activeGrid}
              items={SHOWCASE_DATA[activeGrid]}
              playingId={playingId}
              onPlayToggle={(id) => setPlayingId((p) => (p === id ? null : id))}
              onSelect={(p) => setPrompt((prev) => (prev.trim() ? prev.trim() + " " : "") + p)}
            />
          </div>
        )}

        {activeGrid === "aimg" && (
          <div className="home-style-grid-wrap">
            <div className="home-gen-text-header">
              <span className="image-style-title">Start with an example</span>
            </div>
            <div className="aimg-tabs">
              {aimgCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={cn("aimg-tab", aimgCategoryFilter === cat && "is-active")}
                  onClick={() => setAimgCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="home-aimg-grid">
              {homeAimgTemplates
                .filter((t) => aimgCategoryFilter === "All" || t.category === aimgCategoryFilter)
                .map((tmpl, i) => (
                  <div
                    key={tmpl.id}
                    role="button"
                    tabIndex={0}
                    className={cn("aimg-template-card", activeAimgCard?.id === tmpl.id && "is-selected")}
                    style={{ animationDelay: `${i * 35}ms` }}
                    onClick={() => setActiveAimgCard(tmpl)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveAimgCard(tmpl)}
                  >
                    <div className="aimg-card-visual">
                      <video src={tmpl.src} muted loop playsInline autoPlay className="aimg-card-video" />
                      <div className="aimg-card-hover-overlay">
                        <p className="aimg-card-hover-prompt">{tmpl.prompt}</p>
                        <button
                          type="button"
                          className="aimg-card-try-btn"
                          onClick={(e) => { e.stopPropagation(); setActiveAimgCard(tmpl); }}
                        >
                          <Repeat size={11} />
                          Try it
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!hasPromptText && (
          <div className="home-main-inner home-main-inner--projects">
            <div className="home-projects-section">
              <div className="home-projects-header">
                <div className="home-projects-tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "recent"}
                    className={cn("home-tab-button", activeTab === "recent" && "is-active")}
                    onClick={() => setActiveTab("recent")}
                  >
                    Recent projects
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "examples"}
                    className={cn("home-tab-button", activeTab === "examples" && "is-active")}
                    onClick={() => setActiveTab("examples")}
                  >
                    Examples
                  </button>
                </div>
                <button type="button" className="home-view-all">
                  View all <span aria-hidden="true">→</span>
                </button>
              </div>

              <div className="home-projects-list">
                {activeTab === "recent"
                  ? recentProjectsMain.map((project) => (
                      <Link key={project.id} href="/editor" className="home-project-card">
                        <div
                          className="home-project-thumb"
                          style={{ background: project.color }}
                        />
                        <div className="home-project-info">
                          <strong>{project.title}</strong>
                          <span>{project.time}</span>
                        </div>
                      </Link>
                    ))
                  : (
                    <p className="home-empty-state">No examples available yet.</p>
                  )}
              </div>
            </div>
          </div>
        )}
      </main>

      {activeVideoCard && createPortal(
        <div
          className="trending-popover-backdrop"
          onClick={() => setActiveVideoCard(null)}
          onKeyDown={(e) => e.key === "Escape" && setActiveVideoCard(null)}
        >
          <div className="trending-popover" onClick={(e) => e.stopPropagation()}>
            <div className="trending-popover-video">
              <video
                key={activeVideoCard.src}
                src={activeVideoCard.src}
                controls
                autoPlay
                playsInline
                className="trending-popover-player"
                style={{ aspectRatio: activeVideoCard.ratio }}
              />
            </div>
            <div className="trending-popover-meta">
              <button
                type="button"
                className="trending-popover-close"
                onClick={() => setActiveVideoCard(null)}
                aria-label="Close"
              >
                <X size={14} />
              </button>

              <div className="trending-meta-section">
                <span className="trending-meta-label">PROMPT</span>
                <p className="trending-meta-prompt">{activeVideoCard.prompt}</p>
              </div>

              <div className="trending-meta-settings">
                <div className="trending-meta-row">
                  <span className="trending-meta-label">MODEL</span>
                  <span className="trending-meta-value">{activeVideoCard.model}</span>
                </div>
                <div className="trending-meta-row">
                  <span className="trending-meta-label">ASPECT RATIO</span>
                  <span className="trending-meta-value">{activeVideoCard.aspectRatio}</span>
                </div>
                <div className="trending-meta-row">
                  <span className="trending-meta-label">STYLE</span>
                  <span className="trending-meta-value">{activeVideoCard.style}</span>
                </div>
                <div className="trending-meta-row">
                  <span className="trending-meta-label">CURATION</span>
                  <span className="trending-meta-value">{activeVideoCard.curation}</span>
                </div>
              </div>

              <div className="trending-meta-footer">
                <div className="trending-meta-created">
                  <span className="trending-meta-label">CREATED</span>
                  <span className="trending-meta-date">{activeVideoCard.created}</span>
                </div>
                <button
                  type="button"
                  className="trending-meta-use"
                  onClick={() => {
                    setPrompt(activeVideoCard.prompt);
                    setActiveVideoCard(null);
                  }}
                >
                  Use Prompt
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Image style popover ── */}
      {activeImageCard && createPortal(
        <div className="trending-popover-backdrop" onClick={() => setActiveImageCard(null)} onKeyDown={(e) => e.key === "Escape" && setActiveImageCard(null)}>
          <div className="trending-popover" onClick={(e) => e.stopPropagation()}>
            <div className="trending-popover-image">
              <img src={activeImageCard.src} alt={activeImageCard.name} className="trending-popover-img" />
            </div>
            <div className="trending-popover-meta">
              <button type="button" className="trending-popover-close" onClick={() => setActiveImageCard(null)} aria-label="Close"><X size={14} /></button>
              <div className="trending-meta-section">
                <span className="trending-meta-label">PROMPT</span>
                <p className="trending-meta-prompt">{activeImageCard.prompt}</p>
              </div>
              <div className="trending-meta-settings">
                <div className="trending-meta-row">
                  <span className="trending-meta-label">MODEL</span>
                  <span className="trending-meta-value">{activeImageCard.model}</span>
                </div>
                <div className="trending-meta-row">
                  <span className="trending-meta-label">STYLE</span>
                  <span className="trending-meta-value">{activeImageCard.name}</span>
                </div>
                <div className="trending-meta-row">
                  <span className="trending-meta-label">ASPECT RATIO</span>
                  <span className="trending-meta-value">{activeImageCard.ratio?.replace(" / ", ":")}</span>
                </div>
              </div>
              <div className="trending-meta-footer">
                <div className="trending-meta-created">
                  <span className="trending-meta-label">CREATED</span>
                  <span className="trending-meta-date">{activeImageCard.created}</span>
                </div>
                <button type="button" className="trending-meta-use" onClick={() => { setPrompt(activeImageCard.prompt); setActiveImageCard(null); }}>Use Prompt</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Audio popover ── */}
      {activeAudioCard && createPortal(
        <div className="trending-popover-backdrop" onClick={() => setActiveAudioCard(null)} onKeyDown={(e) => e.key === "Escape" && setActiveAudioCard(null)}>
          <div className="trending-popover" onClick={(e) => e.stopPropagation()}>
            <div className="trending-popover-audio">
              <img src={activeAudioCard.img} alt={activeAudioCard.title} className="trending-popover-audio-art" />
            </div>
            <div className="trending-popover-meta">
              <button type="button" className="trending-popover-close" onClick={() => setActiveAudioCard(null)} aria-label="Close"><X size={14} /></button>
              <div className="trending-meta-section">
                <span className="trending-meta-label">PROMPT</span>
                <p className="trending-meta-prompt">{activeAudioCard.prompt}</p>
              </div>
              <div className="trending-meta-settings">
                <div className="trending-meta-row">
                  <span className="trending-meta-label">MODEL</span>
                  <span className="trending-meta-value">{activeAudioCard.model}</span>
                </div>
                <div className="trending-meta-row">
                  <span className="trending-meta-label">GENRE / TYPE</span>
                  <span className="trending-meta-value">{activeAudioCard.tag}</span>
                </div>
                <div className="trending-meta-row">
                  <span className="trending-meta-label">DURATION</span>
                  <span className="trending-meta-value">{activeAudioCard.duration}</span>
                </div>
                {activeAudioCard.bpm && (
                  <div className="trending-meta-row">
                    <span className="trending-meta-label">BPM</span>
                    <span className="trending-meta-value">{activeAudioCard.bpm}</span>
                  </div>
                )}
                {activeAudioCard.voice && (
                  <div className="trending-meta-row">
                    <span className="trending-meta-label">VOICE</span>
                    <span className="trending-meta-value">{activeAudioCard.voice}</span>
                  </div>
                )}
                {activeAudioCard.speed && (
                  <div className="trending-meta-row">
                    <span className="trending-meta-label">SPEED</span>
                    <span className="trending-meta-value">{activeAudioCard.speed}</span>
                  </div>
                )}
              </div>
              <div className="trending-meta-footer">
                <div className="trending-meta-created">
                  <span className="trending-meta-label">CREATED</span>
                  <span className="trending-meta-date">{activeAudioCard.created}</span>
                </div>
                <button type="button" className="trending-meta-use" onClick={() => { setPrompt(activeAudioCard.prompt); setActiveAudioCard(null); }}>Use Prompt</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Motion graphics popover ── */}
      {activeAimgCard && createPortal(
        <div className="trending-popover-backdrop" onClick={() => setActiveAimgCard(null)} onKeyDown={(e) => e.key === "Escape" && setActiveAimgCard(null)}>
          <div className="trending-popover" onClick={(e) => e.stopPropagation()}>
            <div className="trending-popover-video">
              <video key={activeAimgCard.src} src={activeAimgCard.src} controls autoPlay playsInline className="trending-popover-player" />
            </div>
            <div className="trending-popover-meta">
              <button type="button" className="trending-popover-close" onClick={() => setActiveAimgCard(null)} aria-label="Close"><X size={14} /></button>
              <div className="trending-meta-section">
                <span className="trending-meta-label">PROMPT</span>
                <p className="trending-meta-prompt">{activeAimgCard.prompt}</p>
              </div>
              <div className="trending-meta-settings">
                <div className="trending-meta-row">
                  <span className="trending-meta-label">MODEL</span>
                  <span className="trending-meta-value">{activeAimgCard.model}</span>
                </div>
                <div className="trending-meta-row">
                  <span className="trending-meta-label">CATEGORY</span>
                  <span className="trending-meta-value">{activeAimgCard.category}</span>
                </div>
                <div className="trending-meta-row">
                  <span className="trending-meta-label">STYLE</span>
                  <span className="trending-meta-value">{activeAimgCard.style}</span>
                </div>
                <div className="trending-meta-row">
                  <span className="trending-meta-label">CURATION</span>
                  <span className="trending-meta-value">{activeAimgCard.curation}</span>
                </div>
                {activeAimgCard.duration && (
                  <div className="trending-meta-row">
                    <span className="trending-meta-label">DURATION</span>
                    <span className="trending-meta-value">{activeAimgCard.duration}</span>
                  </div>
                )}
              </div>
              <div className="trending-meta-footer">
                <div className="trending-meta-created">
                  <span className="trending-meta-label">SOURCE</span>
                  <span className="trending-meta-date">hyperframes.dev</span>
                </div>
                <a
                  href={activeAimgCard.indexUrl ?? activeAimgCard.zipUrl ?? "https://www.hyperframes.dev"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="trending-meta-use"
                >
                  <Repeat size={13} />
                  Try it
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
