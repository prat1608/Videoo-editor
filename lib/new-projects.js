export const newProjectOptions = [
  {
    id: "empty",
    label: "Empty Project",
    description: "Start with a blank timeline and canvas.",
    accent: "#4d8dff",
    tool: null,
  },
  {
    id: "record",
    label: "Record",
    description: "Capture screen, camera, audio, or all together.",
    accent: "#ff5f72",
    tool: "record",
  },
  {
    id: "video",
    label: "Generate Video",
    description: "Create a clip from text, image, or a prompt.",
    accent: "#7c3cff",
    tool: "video",
  },
  {
    id: "image",
    label: "Generate Image",
    description: "Make visuals, references, and story frames.",
    accent: "#f97316",
    tool: "image",
  },
  {
    id: "audio",
    label: "Generate Audio",
    description: "Compose music beds and background tracks.",
    accent: "#20c997",
    tool: "audio",
  },
  {
    id: "voiceover",
    label: "Voiceover",
    description: "Create narration with AI voices.",
    accent: "#d946ef",
    tool: "voiceover",
  },
  {
    id: "import",
    label: "Import from URL",
    description: "Bring in media from YouTube, TikTok, Vimeo, and more.",
    accent: "#38bdf8",
    tool: "ytimport",
  },
  {
    id: "aimg",
    label: "AI Motion Graphics",
    description: "Start from animated titles, lower thirds, and social templates.",
    accent: "#facc15",
    tool: "aimg",
  },
];

export function getNewProjectOption(optionId) {
  return newProjectOptions.find((option) => option.id === optionId) ?? newProjectOptions[0];
}

export function createNewProjectHref(optionId, timestamp = Date.now()) {
  const option = getNewProjectOption(optionId);
  const searchParams = new URLSearchParams({
    projectId: `untitled-${timestamp}`,
  });

  if (option.tool) {
    searchParams.set("tool", option.tool);
  }

  return `/editor?${searchParams.toString()}`;
}
