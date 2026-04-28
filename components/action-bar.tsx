"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  VscChecklist,
  VscSourceControl,
  VscTerminal,
  VscChevronUp,
  VscGitCommit,
  VscGitPullRequest,
  VscSync,
  VscDiff,
} from "react-icons/vsc"

interface GitMenuProps {
  isOpen: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLDivElement | null>
}

function GitFlyoutMenu({ isOpen, onClose, anchorRef }: GitMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [isOpen, onClose, anchorRef])

  if (!isOpen) return null

  const menuItems = [
    { icon: <VscGitCommit />, label: "Commit", shortcut: "⌘K" },
    { icon: <VscSync />, label: "Push", shortcut: "⌘P" },
    { icon: <VscSync className="rotate-180" />, label: "Pull", shortcut: "⌘L" },
    { icon: <VscDiff />, label: "Diff", shortcut: "⌘D" },
    { icon: <VscGitPullRequest />, label: "Create PR", shortcut: "⌘R" },
  ]

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 bg-popover border border-border rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      {menuItems.map((item, i) => (
        <button
          key={i}
          onClick={() => {
            onClose()
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-accent active:bg-accent/80 transition-colors"
        >
          <span className="text-muted-foreground">{item.icon}</span>
          <span className="flex-1 text-left">{item.label}</span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {item.shortcut}
          </span>
        </button>
      ))}
    </div>
  )
}

export function ActionBar() {
  const [gitMenuOpen, setGitMenuOpen] = useState(false)
  const gitButtonRef = useRef<HTMLDivElement>(null)

  const handleGitClick = useCallback(() => {
    // Main git button action
    console.log("Git action")
  }, [])

  const handleGitArrowClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    setGitMenuOpen((prev) => !prev)
  }, [])

  const closeGitMenu = useCallback(() => {
    setGitMenuOpen(false)
  }, [])

  return (
    <div className="bg-card border-t border-border px-3 py-2 safe-area-pb">
      <div className="flex items-center justify-between gap-2">
        {/* Todo button */}
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-secondary hover:bg-secondary/80 active:bg-secondary/60 rounded-lg transition-colors">
          <VscChecklist className="w-4 h-4" />
          <span className="text-xs font-medium">Todo</span>
        </button>

        {/* Git button with arrow */}
        <div ref={gitButtonRef} className="flex-1 relative">
          <GitFlyoutMenu
            isOpen={gitMenuOpen}
            onClose={closeGitMenu}
            anchorRef={gitButtonRef}
          />
          <div className="flex items-stretch bg-secondary rounded-lg overflow-hidden">
            <button
              onClick={handleGitClick}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 hover:bg-secondary/80 active:bg-secondary/60 transition-colors"
            >
              <VscSourceControl className="w-4 h-4" />
              <span className="text-xs font-medium">Git</span>
            </button>
            <button
              onClick={handleGitArrowClick}
              className="px-2 border-l border-border/50 hover:bg-accent active:bg-accent/80 transition-colors"
            >
              <VscChevronUp
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  gitMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Commands button */}
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-secondary hover:bg-secondary/80 active:bg-secondary/60 rounded-lg transition-colors">
          <VscTerminal className="w-4 h-4" />
          <span className="text-xs font-medium">Commands</span>
        </button>
      </div>
    </div>
  )
}
