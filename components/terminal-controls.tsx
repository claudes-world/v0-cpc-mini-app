"use client"

import { useState } from "react"

// Keychron-style keyboard key colors
const keyStyles = {
  base: "flex items-center justify-center font-mono text-[10px] font-medium rounded-[4px] border border-[#3a3a3a] bg-gradient-to-b shadow-[0_2px_0_0_#1a1a1a,inset_0_1px_0_0_rgba(255,255,255,0.05)] active:translate-y-[1px] active:shadow-[0_1px_0_0_#1a1a1a,inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-all duration-75",
  dark: "from-[#2d2d2d] to-[#252525] text-[#9a9a9a]",
  accent: "from-[#3d3d3d] to-[#333333] text-[#e0e0e0]",
  orange: "from-[#ff6b35] to-[#e55a2b] text-white border-[#cc4a1f]",
}

interface KeyButtonProps {
  children: React.ReactNode
  variant?: "dark" | "accent" | "orange"
  className?: string
  onClick?: () => void
}

function KeyButton({ children, variant = "dark", className = "", onClick }: KeyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${keyStyles.base} ${keyStyles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

// Slash command colors
const sessionColors = [
  { id: "red", color: "bg-red-500" },
  { id: "blue", color: "bg-blue-500" },
  { id: "green", color: "bg-green-500" },
  { id: "yellow", color: "bg-yellow-500" },
  { id: "purple", color: "bg-purple-500" },
  { id: "orange", color: "bg-orange-500" },
  { id: "pink", color: "bg-pink-500" },
  { id: "cyan", color: "bg-cyan-500" },
]

interface SlashCommandProps {
  command: string
  alias?: string
  description: string
  rightContent?: React.ReactNode
  onClick?: () => void
}

function SlashCommand({ command, alias, description, rightContent, onClick }: SlashCommandProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-2 py-1.5 bg-secondary/50 border-b border-border/50 active:bg-accent transition-colors text-left"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-primary font-mono text-[11px] font-medium">{command}</span>
          {alias && <span className="text-muted-foreground text-[9px]">({alias})</span>}
        </div>
        <p className="text-muted-foreground text-[9px] leading-tight truncate">{description}</p>
      </div>
      {rightContent && <div className="flex-shrink-0 ml-2">{rightContent}</div>}
    </button>
  )
}

export function TerminalControls() {
  const [sessionName, setSessionName] = useState("")
  const [selectedColor, setSelectedColor] = useState("green")

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top: Keyboard keys */}
      <div className="flex items-center gap-1 p-1.5 border-b border-border">
        <KeyButton variant="accent" className="h-7 px-2">esc</KeyButton>
        <KeyButton className="h-7 w-7">1</KeyButton>
        <KeyButton className="h-7 w-7">2</KeyButton>
        <KeyButton className="h-7 w-7">3</KeyButton>
        <div className="flex-1" />
        <div className="flex items-center gap-0.5">
          <KeyButton variant="accent" className="h-7 px-1.5 text-[8px]">
            <span className="flex flex-col items-center leading-none">
              <span>Shift</span>
              <span>+Tab</span>
            </span>
          </KeyButton>
        </div>
        <div className="flex items-center gap-0.5">
          <KeyButton variant="orange" className="h-7 px-1 text-[8px]">^</KeyButton>
          <KeyButton variant="orange" className="h-7 px-1.5">C</KeyButton>
        </div>
      </div>

      {/* Bottom: Slash commands */}
      <div className="flex-1 overflow-auto scrollbar-hide">
        <SlashCommand
          command="/new"
          alias="clear"
          description="Start a fresh claude code session."
        />
        <SlashCommand
          command="/compact"
          description="Compact this session's context."
        />
        <SlashCommand
          command="/branch"
          alias="fork"
          description="Branch a new claude session from here."
        />
        
        {/* Rename with input */}
        <div className="flex items-center px-2 py-1.5 bg-secondary/50 border-b border-border/50">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-primary font-mono text-[11px] font-medium">/rename</span>
            </div>
            <p className="text-muted-foreground text-[9px] leading-tight">Name this session.</p>
          </div>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="Session name..."
            className="w-24 h-6 px-1.5 text-[16px] bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            style={{ fontSize: '16px' }} // Explicit 16px to prevent iOS zoom
          />
        </div>

        {/* Color with radio buttons */}
        <div className="flex items-center px-2 py-1.5 bg-secondary/50 border-b border-border/50">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-primary font-mono text-[11px] font-medium">/color</span>
            </div>
            <p className="text-muted-foreground text-[9px] leading-tight">Set a color for this session.</p>
          </div>
          <div className="flex items-center gap-1">
            {sessionColors.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedColor(c.id)}
                className={`w-4 h-4 rounded-sm ${c.color} ${
                  selectedColor === c.id 
                    ? "ring-1 ring-white ring-offset-1 ring-offset-background" 
                    : "opacity-60 hover:opacity-100"
                } transition-all`}
                aria-label={`Select ${c.id} color`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
