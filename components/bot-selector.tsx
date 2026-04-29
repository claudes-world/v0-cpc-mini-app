"use client"

import { useState, useRef, useEffect } from "react"
import { VscChevronDown } from "react-icons/vsc"

const bots = [
  { id: "claude_do_bot", label: "claude_do_bot" },
  { id: "pm_dobot", label: "pm_dobot" },
  { id: "gstack_dobot", label: "gstack_dobot" },
  { id: "elder-1", label: "elder-1" },
  { id: "elder-2", label: "elder-2" },
  { id: "elder-3", label: "elder-3" },
  { id: "elder-4", label: "elder-4" },
]

export function BotSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(bots[0])
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono bg-secondary border-t border-l border-border rounded-tl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        style={{
          boxShadow: '-4px -4px 8px -2px rgba(0,0,0,0.4)'
        }}
      >
        <span className="truncate max-w-[90px]">{selected.label}</span>
        <VscChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-0 min-w-[120px] max-h-[120px] overflow-y-auto scrollbar-hide bg-popover border border-border rounded-tl shadow-lg z-50">
          {bots.map((bot) => (
            <button
              key={bot.id}
              onClick={() => {
                setSelected(bot)
                setIsOpen(false)
              }}
              className={`w-full px-2 py-1 text-[10px] font-mono text-left hover:bg-accent transition-colors ${
                selected.id === bot.id ? "bg-accent text-accent-foreground" : "text-foreground"
              }`}
            >
              {bot.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
