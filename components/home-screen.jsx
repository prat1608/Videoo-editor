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
  X,
} from "lucide-react";
import { PromptBox } from "@/components/prompt-box";
import { HomeSidebar } from "@/components/home-sidebar";
import { IMAGE_STYLES, getImageStyleUrl } from "@/lib/image-styles";
import { ShowcaseCard, ShowcaseListRow, MUSIC_SHOWCASE, SFX_SHOWCASE, VO_SHOWCASE } from "@/components/audio-showcase-cards";
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
  { id: 1,  name: "Logo Reveal",     category: "Branding",    gradient: "135deg,#7c3aed 0%,#c026d3 100%",  src: "/motion-graphics/logo-reveal.mp4",     model: "After Effects + AI",    style: "Particles",   curation: "Featured",  created: "May 8, 2026",
    prompt: "Animated logo reveal, wordmark builds from scattered luminous particles converging to form letterforms, radial god-ray burst in purple and gold on reveal, smooth ease-in-out scale from 0.6 to 1.0, dust motes linger in air post-reveal, 3-second hold, pure black background, 1920×1080, 24fps, loop-ready pre-roll" },
  { id: 2,  name: "Kinetic Title",   category: "Typography",  gradient: "135deg,#0ea5e9 0%,#6366f1 100%",  src: "/motion-graphics/kinetic-title.mp4",   model: "Motion Bro + AI",       style: "Kinetic Type", curation: "Trending",  created: "May 12, 2026",
    prompt: "Kinetic typography title card, bold condensed sans-serif words rocket in from six directions with elastic overshoot, individual letters stagger at 3-frame offsets, velocity lines trail each character, dynamic blue-indigo duotone color grade, rhythmic snap to beats at 120 BPM, 5-second sequence, 1080×1080 square" },
  { id: 3,  name: "Story Countdown", category: "Social",      gradient: "135deg,#ef4444 0%,#f97316 100%",  src: "/motion-graphics/story-countdown.mp4", model: "Rive + AI",             style: "Bouncy",      curation: "Trending",  created: "May 15, 2026",
    prompt: "Social media story countdown timer, large numerals 5–1 with bouncy spring physics (overshoot 1.4), radial red-orange gradient burst on each number change, circular progress ring animating around numeral, final frame confetti particle burst, 9:16 vertical 1080×1920, 60fps, vibrant saturation +30" },
  { id: 4,  name: "Data Viz",        category: "Infographic", gradient: "135deg,#10b981 0%,#0ea5e9 100%",  src: "/motion-graphics/data-viz.mp4",        model: "D3.js + Lottie",        style: "Clean",       curation: "Curated",   created: "Apr 30, 2026",
    prompt: "Smooth animated data visualization, 5 bar chart columns grow from baseline with staggered 200ms offsets and ease-out cubic, 3 pie chart sectors sweep in sequentially, value labels count up in real time, teal-to-sky-blue gradient fills, thin grid lines fade in, minimal sans-serif labels, white background, 16:9, 30fps" },
  { id: 5,  name: "Particle Burst",  category: "VFX",         gradient: "135deg,#1e1b4b 0%,#7c3aed 100%",  src: "/motion-graphics/particle-burst.mp4",  model: "TouchDesigner + AI",    style: "Explosion",   curation: "Featured",  created: "May 5, 2026",
    prompt: "Explosive particle system, 8,000 individual sparks eject from a single center point with randomized velocity and drag, multi-color gradient from violet core to cyan tips, motion blur per particle, Z-depth fog fade at 400px, sparks fade out over 1.2 seconds, dark navy vignette background, 4K 60fps, no audio" },
  { id: 6,  name: "Lower Third",     category: "Broadcast",   gradient: "135deg,#0f172a 0%,#1d4ed8 100%",  src: "/motion-graphics/lower-third.mp4",     model: "Motion Array + AI",     style: "Broadcast",   curation: "Curated",   created: "May 2, 2026",
    prompt: "Professional news lower third, thin accent line wipes in from left over 18 frames, name text fades up with 6-frame stagger from title text, subtle background fill slides in behind text block, clean navy and electric-blue palette, Inter Bold / Inter Regular font pairing, 1920×1080, 25fps, broadcast safe colors" },
  { id: 7,  name: "Social Intro",    category: "Social",      gradient: "135deg,#ec4899 0%,#8b5cf6 100%",  src: "/motion-graphics/social-intro.mp4",    model: "Jitter + AI",           style: "Gradient",    curation: "Trending",  created: "May 18, 2026",
    prompt: "Trendy social media intro, three stacked bold text lines pop in with scale-from-center spring animation, animated liquid mesh gradient transitions between pink, purple, and coral, circular avatar placeholder pulses with glow, 3-second hold on full composition, 9:16 1080×1920, 60fps, Instagram Reels optimized" },
  { id: 8,  name: "Glitch Effect",   category: "VFX",         gradient: "135deg,#042f2e 0%,#0d0d0d 100%",  src: "/motion-graphics/glitch-effect.mp4",   model: "Notch + AI",            style: "Glitch",      curation: "Featured",  created: "May 9, 2026",
    prompt: "Cyberpunk digital glitch treatment, RGB channel splitting with ±12px horizontal offset, CRT scanline overlay at 50% opacity, random block displacement artifacts trigger every 8–14 frames, horizontal voltage-spike bar tears, brief static noise frames, vignette flicker, pitch-black base, 4K 24fps, seamless loop" },
  { id: 9,  name: "Minimal Text",    category: "Typography",  gradient: "135deg,#1e293b 0%,#475569 100%",  src: "/motion-graphics/logo-reveal.mp4",     model: "Cavalry + AI",          style: "Minimal",     curation: "Curated",   created: "May 3, 2026",
    prompt: "Elegant minimal text animation, single serif headline fades in at 40% opacity then resolves to 100% over 60 frames, secondary caption slides up 8px beneath hairline divider, refined slate and off-white palette, generous negative space, 2-second breathing hold, subtle vignette, 16:9 1920×1080, 24fps, editorial quality" },
  { id: 10, name: "Neon Glow",       category: "VFX",         gradient: "135deg,#0a0a0a 0%,#00c47a 100%",  src: "/motion-graphics/particle-burst.mp4",  model: "TouchDesigner + AI",    style: "Neon",        curation: "Trending",  created: "May 14, 2026",
    prompt: "Neon sign animation on pure black, bright emerald green phosphor glow with animated flicker sequence (3 flicker pulses then stable), light bloom radius 24px, subtle reflection puddle on floor plane below sign, electrical buzz implied by slight hue oscillation, futuristic aesthetic, 16:9 4K, 60fps, loopable" },
  { id: 11, name: "Cinematic Title", category: "Film",        gradient: "135deg,#0a0a0a 0%,#92400e 100%",  src: "/motion-graphics/lower-third.mp4",     model: "Blackmagic Fusion + AI", style: "Epic",        curation: "Featured",  created: "May 1, 2026",
    prompt: "Epic feature film title sequence, golden volumetric light rays sweep across screen from top-left, large serif title fades in through the rays with anamorphic lens flare, letterbox 2.39:1 black bars, subtle dust particles in atmosphere, dramatic orchestral hit implied by motion timing, 4K ARRI look LUT, 24fps" },
  { id: 12, name: "Explainer Scene", category: "Business",    gradient: "135deg,#1e40af 0%,#7c3aed 100%",  src: "/motion-graphics/data-viz.mp4",        model: "Lottie + AI",           style: "Flat Design", curation: "Curated",   created: "Apr 25, 2026",
    prompt: "Flat-design product explainer animation, line-art icons draw on with stroke animation at 60fps, 4 sequential scene panels wipe left-to-right, icons enlarge on feature highlight with bounce ease, blue and purple duotone fills, clean geometric compositions, Nunito font labels, 16:9 1920×1080, 30fps, 60-second runtime" },
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
            <div className="home-video-style-grid">
              {homeVideoClips.map((vid, i) => (
                <button
                  key={vid.name}
                  type="button"
                  className={cn("video-style-card", activeVideoCard?.name === vid.name && "is-selected")}
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() => setActiveVideoCard(vid)}
                >
                  <div className="video-clip-wrap" style={{ aspectRatio: vid.ratio }}>
                    <video
                      src={vid.src}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="video-style-clip"
                    />
                    <span className="image-style-label">{vid.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeGrid === "audio" && (
          <div className="home-style-grid-wrap">
            <div className="home-gen-text-header">
              <span className="image-style-title">Vibe on them</span>
            </div>
            <div
              className="ga-scard-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "14px" }}
            >
              {MUSIC_SHOWCASE.map((item) => (
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
            <div className="home-gen-text-header">
              <span className="image-style-title">Vibe on them</span>
            </div>
            <div className="ga-list" style={{ display: "flex", flexDirection: "column" }}>
              {(activeGrid === "sfx" ? SFX_SHOWCASE : VO_SHOWCASE).map((item) => (
                <ShowcaseListRow
                  key={item.id}
                  item={item}
                  mode={activeGrid}
                  isPlaying={playingId === item.id}
                  onPlayToggle={(id) => setPlayingId((p) => (p === id ? null : id))}
                  onSelect={(p) => setPrompt((prev) => (prev.trim() ? prev.trim() + " " : "") + p)}
                  onCardClick={(it) => setActiveAudioCard({ ...it, mode: activeGrid })}
                />
              ))}
            </div>
          </div>
        )}

        {activeGrid === "aimg" && (
          <div className="home-style-grid-wrap">
            <div className="home-gen-text-header">
              <span className="image-style-title">Motion Graphics Templates</span>
              <span className="image-style-subtitle">Click a template to auto-fill a prompt</span>
            </div>
            <div className="home-aimg-grid">
              {homeAimgTemplates.map((tmpl, i) => (
                <button
                  key={tmpl.id}
                  type="button"
                  className={cn("aimg-template-card", activeAimgCard?.id === tmpl.id && "is-selected")}
                  style={{ animationDelay: `${i * 35}ms` }}
                  onClick={() => setActiveAimgCard(tmpl)}
                >
                  <div className="aimg-card-visual" style={{ background: `linear-gradient(${tmpl.gradient})` }}>
                    <video src={tmpl.src} muted loop playsInline autoPlay className="aimg-card-video" />
                    <span className="aimg-card-category">{tmpl.category}</span>
                    <span className="image-style-label">{tmpl.name}</span>
                  </div>
                </button>
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
              </div>
              <div className="trending-meta-footer">
                <div className="trending-meta-created">
                  <span className="trending-meta-label">CREATED</span>
                  <span className="trending-meta-date">{activeAimgCard.created}</span>
                </div>
                <button type="button" className="trending-meta-use" onClick={() => { setPrompt(activeAimgCard.prompt); setActiveAimgCard(null); }}>Use Prompt</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
