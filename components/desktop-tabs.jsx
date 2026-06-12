"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, FilePlus2, Film, Home, Plus, X } from "lucide-react";
import logoMark from "@/assets/Logo.svg";
import { DEFAULT_PROJECT_ID, getProjectHref, getProjectTitle } from "@/lib/projects";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "videoo.desktopTabs.v1";
const HOME_TAB = { id: "home", kind: "home", title: "Home", href: "/", closable: false };
const NEW_PROJECT_TAB = { id: "new-project", kind: "new", title: "New project", href: "/new", closable: false };

function createProjectTab(projectId, title = getProjectTitle(projectId)) {
  return {
    id: `project:${projectId}`,
    kind: "project",
    projectId,
    title,
    href: getProjectHref(projectId),
    closable: true,
    isDirty: false,
    lastActiveAt: Date.now(),
  };
}

function normalizeProjectTabs(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((tab) => tab?.kind === "project" && typeof tab.projectId === "string")
    .map((tab) => ({
      ...createProjectTab(tab.projectId, tab.title || getProjectTitle(tab.projectId)),
      isDirty: Boolean(tab.isDirty),
      lastActiveAt: typeof tab.lastActiveAt === "number" ? tab.lastActiveAt : Date.now(),
    }));
}

export function DesktopTabShell({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const router = useRouter();
  const [isDesktopApp, setIsDesktopApp] = useState(false);
  const [desktopPlatform, setDesktopPlatform] = useState(null);
  const [environmentChecked, setEnvironmentChecked] = useState(false);
  const [projectTabs, setProjectTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(HOME_TAB.id);
  const [loaded, setLoaded] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const overflowRef = useRef(null);

  const allTabs = useMemo(
    () => [HOME_TAB, ...(pathname === "/new" ? [NEW_PROJECT_TAB] : []), ...projectTabs],
    [pathname, projectTabs]
  );
  const visibleProjectTabs = useMemo(() => {
    const visibleLimit = 6;
    const activeProjectIndex = projectTabs.findIndex((tab) => tab.id === activeTabId);

    if (activeProjectIndex < visibleLimit) {
      return projectTabs.slice(0, visibleLimit);
    }

    return [...projectTabs.slice(0, visibleLimit - 1), projectTabs[activeProjectIndex]];
  }, [activeTabId, projectTabs]);
  const hasOverflow = projectTabs.length > visibleProjectTabs.length;

  useEffect(() => {
    const desktopBridge = window.videooDesktop;
    setIsDesktopApp(Boolean(desktopBridge));
    setDesktopPlatform(desktopBridge?.platform || null);
    setEnvironmentChecked(true);

    if (desktopBridge?.onNavigate) {
      desktopBridge.onNavigate((path) => router.push(path));
    }
  }, []);

  useEffect(() => {
    if (!isDesktopApp) return;

    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      setProjectTabs(normalizeProjectTabs(parsed.tabs));
      if (typeof parsed.activeTabId === "string") {
        setActiveTabId(parsed.activeTabId);
      }
    } catch {
      setProjectTabs([]);
    } finally {
      setLoaded(true);
    }
  }, [isDesktopApp]);

  useEffect(() => {
    if (!isDesktopApp || !loaded) return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        tabs: projectTabs,
        activeTabId,
      })
    );
  }, [activeTabId, isDesktopApp, loaded, projectTabs]);

  useEffect(() => {
    if (!isDesktopApp || !loaded) return;

    if (pathname === "/editor") {
      const nextParams = new URLSearchParams(searchString);
      const projectId = nextParams.get("projectId") || DEFAULT_PROJECT_ID;

      if (!nextParams.get("projectId")) {
        nextParams.set("projectId", projectId);
        router.replace(`/editor?${nextParams.toString()}`);
      }

      const nextTab = createProjectTab(projectId);
      setProjectTabs((current) => {
        const existingIndex = current.findIndex((tab) => tab.projectId === projectId);

        if (existingIndex === -1) {
          return [...current, nextTab];
        }

        return current.map((tab, index) =>
          index === existingIndex
            ? { ...tab, title: getProjectTitle(projectId), href: getProjectHref(projectId), lastActiveAt: Date.now() }
            : tab
        );
      });
      setActiveTabId(nextTab.id);
      return;
    }

    if (pathname === "/new") {
      setActiveTabId(NEW_PROJECT_TAB.id);
      return;
    }

    setActiveTabId(HOME_TAB.id);
  }, [isDesktopApp, loaded, pathname, router, searchString]);

  useEffect(() => {
    if (!isDesktopApp || !overflowOpen) return;

    function handleClickOutside(event) {
      if (!overflowRef.current?.contains(event.target)) {
        setOverflowOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesktopApp, overflowOpen]);

  if (!environmentChecked || !isDesktopApp) {
    return (
      <div className="desktop-shell desktop-shell--browser">
        <div className="desktop-shell-content">{children}</div>
      </div>
    );
  }

  function activateTab(tab) {
    setOverflowOpen(false);
    setActiveTabId(tab.id);
    router.push(tab.href);
  }

  function openNewProject() {
    setOverflowOpen(false);
    router.push("/new");
  }

  function closeProjectTab(tabId) {
    const closingIndex = projectTabs.findIndex((tab) => tab.id === tabId);
    if (closingIndex === -1) return;

    const nextTabs = projectTabs.filter((tab) => tab.id !== tabId);
    setProjectTabs(nextTabs);
    setOverflowOpen(false);

    if (activeTabId !== tabId) return;

    const nextActive = nextTabs[Math.max(0, closingIndex - 1)] ?? nextTabs[0] ?? HOME_TAB;
    setActiveTabId(nextActive.id);
    router.push(nextActive.href);
  }

  function handleTabKeyDown(event, tab) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const currentIndex = allTabs.findIndex((item) => item.id === tab.id);
    const lastIndex = allTabs.length - 1;
    const nextIndex =
      event.key === "Home" ? 0 :
      event.key === "End" ? lastIndex :
      event.key === "ArrowLeft" ? Math.max(0, currentIndex - 1) :
      Math.min(lastIndex, currentIndex + 1);

    activateTab(allTabs[nextIndex]);
  }

  function renderTab(tab, { inOverflow = false } = {}) {
    const isActive = activeTabId === tab.id;
    const Icon = tab.kind === "home" ? Home : tab.kind === "new" ? FilePlus2 : Film;

    return (
      <div
        key={tab.id}
        className={cn(
          inOverflow ? "desktop-overflow-row" : "desktop-tab",
          isActive && "is-active",
          tab.kind === "home" && "is-home"
        )}
      >
        <button
          type="button"
          role="tab"
          aria-selected={isActive}
          tabIndex={isActive ? 0 : -1}
          className={inOverflow ? "desktop-overflow-trigger" : "desktop-tab-trigger"}
          onClick={() => activateTab(tab)}
          onKeyDown={(event) => handleTabKeyDown(event, tab)}
        >
          {tab.kind === "home" ? (
            <Image src={logoMark} alt="" className="desktop-tab-logo" />
          ) : (
            <Icon className="desktop-tab-icon" />
          )}
          <span className="desktop-tab-title">{tab.title}</span>
          {tab.isDirty && <span className="desktop-tab-dirty" aria-label="Unsaved changes" />}
        </button>
        {tab.closable && (
          <button
            type="button"
            className={inOverflow ? "desktop-overflow-close" : "desktop-tab-close"}
            aria-label={`Close ${tab.title}`}
            onClick={(event) => {
              event.stopPropagation();
              closeProjectTab(tab.id);
            }}
          >
            <X />
          </button>
        )}
      </div>
    );
  }

  const isFocusedWorkspaceRoute = pathname?.startsWith("/editor");

  return (
    <div className={cn("desktop-shell", desktopPlatform && `desktop-shell--${desktopPlatform}`, isFocusedWorkspaceRoute && "desktop-shell--editor")}>
      {!isFocusedWorkspaceRoute && (
        <header className="desktop-tabs-chrome">
          <div className="desktop-tabs-list" role="tablist" aria-label="Open Videoo tabs">
            {renderTab(HOME_TAB)}
            {pathname === "/new" && renderTab(NEW_PROJECT_TAB)}
            {visibleProjectTabs.map((tab) => renderTab(tab))}
          </div>
          <div className="desktop-tabs-actions">
            {hasOverflow && (
              <div className="desktop-overflow" ref={overflowRef}>
                <button
                  type="button"
                  className={cn("desktop-chrome-button", overflowOpen && "is-active")}
                  aria-label="Show all open tabs"
                  aria-expanded={overflowOpen}
                  onClick={() => setOverflowOpen((current) => !current)}
                >
                  <ChevronDown />
                </button>
                {overflowOpen && (
                  <div className="desktop-overflow-menu" role="menu">
                    <div className="desktop-overflow-label">Open projects</div>
                    {projectTabs.map((tab) => renderTab(tab, { inOverflow: true }))}
                  </div>
                )}
              </div>
            )}
            <button
              type="button"
              className="desktop-chrome-button"
              aria-label="Open a new tab"
              onClick={openNewProject}
            >
              <Plus />
            </button>
          </div>
        </header>
      )}
      <div className="desktop-shell-content">{children}</div>
    </div>
  );
}
