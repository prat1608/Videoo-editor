export const DEFAULT_PROJECT_ID = "untitled-project";

export const recentProjects = [
  { id: DEFAULT_PROJECT_ID, title: "Canvas editor setup", time: "Last edited 1 hr ago", color: "#3a352f" },
  { id: "autodemo-camera-screen", title: "Autodemo creation from camera and screen recordings", time: "Last edited 12 hrs ago", color: "#1f1716" },
  { id: "make-roughcuts", title: "Make roughcuts", time: "Last edited yesterday", color: "#3a2a2a" },
  { id: "lion-snowy-mountain", title: "Lion in Snowy Mount...", time: "Last edited 2 days ago", color: "#1a1a1a" },
  { id: "generate-image-imagination", title: "/generate-image ima...", time: "Last edited 3 days ago", color: "#1a1a1a" },
  { id: "untitled-project-2", title: "Untitled Project", time: "Last edited 4 days ago", color: "#252525" },
  { id: "untitled-project-3", title: "Untitled Project", time: "Last edited 5 days ago", color: "#30263a" },
  { id: "untitled-project-4", title: "Untitled Project", time: "Last edited 6 days ago", color: "#3a2a1a" },
  { id: "untitled-project-5", title: "Untitled Project", time: "Last edited last week", color: "#1a2a3a" },
  { id: "untitled-project-6", title: "Untitled Project", time: "Last edited last week", color: "#232323" },
  { id: "social-media-clip", title: "Social Media Clip Cr...", time: "Last edited last week", color: "#1a1a2a" },
];

export function getProjectById(projectId) {
  return recentProjects.find((project) => project.id === projectId) ?? null;
}

export function getProjectTitle(projectId) {
  return getProjectById(projectId)?.title ?? "Untitled Project";
}

export function getProjectHref(projectId, params = {}) {
  const searchParams = new URLSearchParams({ projectId, ...params });
  return `/editor?${searchParams.toString()}`;
}
