"use client"

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react"
import { VscFiles, VscIssues, VscGitPullRequest } from "react-icons/vsc"

interface Tab {
  id: string
  label: string
  icon: ReactNode
  content: ReactNode
}

interface SwipeableTabsProps {
  tabs: Tab[]
}

export function SwipeableTabs({ tabs }: SwipeableTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const currentXRef = useRef(0)
  const containerWidth = useRef(0)

  useEffect(() => {
    if (containerRef.current) {
      containerWidth.current = containerRef.current.offsetWidth
    }
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current) {
      containerWidth.current = containerRef.current.offsetWidth
    }
    startXRef.current = e.touches[0].clientX
    currentXRef.current = 0
    setIsDragging(true)
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return
      const diff = e.touches[0].clientX - startXRef.current
      currentXRef.current = diff

      // Add resistance at edges
      const baseOffset = -activeIndex * containerWidth.current
      let newTranslate = baseOffset + diff

      // Resistance at edges
      if (activeIndex === 0 && diff > 0) {
        newTranslate = baseOffset + diff * 0.3
      } else if (activeIndex === tabs.length - 1 && diff < 0) {
        newTranslate = baseOffset + diff * 0.3
      }

      setTranslateX(newTranslate)
    },
    [isDragging, activeIndex, tabs.length]
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    const threshold = containerWidth.current * 0.2
    const diff = currentXRef.current

    let newIndex = activeIndex
    if (diff < -threshold && activeIndex < tabs.length - 1) {
      newIndex = activeIndex + 1
    } else if (diff > threshold && activeIndex > 0) {
      newIndex = activeIndex - 1
    }

    setActiveIndex(newIndex)
    setTranslateX(-newIndex * containerWidth.current)
  }, [activeIndex, tabs.length])

  const handleTabClick = useCallback((index: number) => {
    setActiveIndex(index)
    setTranslateX(-index * containerWidth.current)
  }, [])

  // Update translateX when container resizes
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        containerWidth.current = containerRef.current.offsetWidth
        setTranslateX(-activeIndex * containerWidth.current)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [activeIndex])

  return (
    <div className="flex flex-col h-full">
      {/* Tab headers */}
      <div className="flex border-b border-border bg-card">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(index)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors relative ${
              index === activeIndex
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
            {index === activeIndex && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Swipeable content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden touch-pan-x"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="w-full h-full flex-shrink-0 overflow-auto scrollbar-hide"
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>

      {/* Page indicator dots */}
      <div className="flex justify-center gap-1.5 py-1.5 bg-card border-t border-border">
        {tabs.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              index === activeIndex ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// Tab content components
export function FilesTab() {
  const files = [
    { name: "src/", type: "folder", modified: false },
    { name: "app.tsx", type: "file", modified: true },
    { name: "utils.ts", type: "file", modified: true },
    { name: "config.json", type: "file", modified: false },
    { name: "package.json", type: "file", modified: false },
    { name: "README.md", type: "file", modified: false },
    { name: "tsconfig.json", type: "file", modified: false },
    { name: ".gitignore", type: "file", modified: false },
  ]

  return (
    <div className="p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1">
        Explorer
      </div>
      <div className="space-y-0.5">
        {files.map((file, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent active:bg-accent/80 transition-colors"
          >
            <VscFiles className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs flex-1">{file.name}</span>
            {file.modified && (
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function IssuesTab() {
  const issues = [
    { id: "#142", title: "Fix auth redirect", status: "open", priority: "high" },
    { id: "#138", title: "Update deps", status: "open", priority: "medium" },
    { id: "#135", title: "Add dark mode", status: "closed", priority: "low" },
    { id: "#130", title: "Refactor hooks", status: "open", priority: "medium" },
  ]

  return (
    <div className="p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1">
        Issues
      </div>
      <div className="space-y-1">
        {issues.map((issue, i) => (
          <div
            key={i}
            className="flex items-start gap-2 px-2 py-2 rounded bg-secondary/50 hover:bg-secondary active:bg-secondary/80 transition-colors"
          >
            <VscIssues
              className={`w-3.5 h-3.5 mt-0.5 ${
                issue.status === "open" ? "text-green-400" : "text-muted-foreground"
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">
                  {issue.id}
                </span>
                <span
                  className={`text-[9px] px-1 py-0.5 rounded ${
                    issue.priority === "high"
                      ? "bg-red-500/20 text-red-400"
                      : issue.priority === "medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {issue.priority}
                </span>
              </div>
              <div className="text-xs truncate">{issue.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PRsTab() {
  const prs = [
    { id: "#45", title: "Feature: User profiles", status: "review", branch: "feat/profiles" },
    { id: "#44", title: "Fix: Memory leak", status: "approved", branch: "fix/memory" },
    { id: "#42", title: "Chore: Update CI", status: "merged", branch: "chore/ci" },
  ]

  return (
    <div className="p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1">
        Pull Requests
      </div>
      <div className="space-y-1">
        {prs.map((pr, i) => (
          <div
            key={i}
            className="flex items-start gap-2 px-2 py-2 rounded bg-secondary/50 hover:bg-secondary active:bg-secondary/80 transition-colors"
          >
            <VscGitPullRequest
              className={`w-3.5 h-3.5 mt-0.5 ${
                pr.status === "merged"
                  ? "text-purple-400"
                  : pr.status === "approved"
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">
                  {pr.id}
                </span>
                <span
                  className={`text-[9px] px-1 py-0.5 rounded ${
                    pr.status === "merged"
                      ? "bg-purple-500/20 text-purple-400"
                      : pr.status === "approved"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {pr.status}
                </span>
              </div>
              <div className="text-xs truncate">{pr.title}</div>
              <div className="text-[10px] text-muted-foreground font-mono truncate">
                {pr.branch}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Default tabs export
export const defaultTabs: Tab[] = [
  {
    id: "files",
    label: "Files",
    icon: <VscFiles />,
    content: <FilesTab />,
  },
  {
    id: "issues",
    label: "Issues",
    icon: <VscIssues />,
    content: <IssuesTab />,
  },
  {
    id: "prs",
    label: "PRs",
    icon: <VscGitPullRequest />,
    content: <PRsTab />,
  },
]
