"use client"

import { useState } from "react"

// Keychron-style keyboard key colors - matching the blue-gray slate keys
const keyStyles = {
  base: "flex items-center justify-center font-mono text-[10px] font-medium rounded-[4px] border shadow-[0_2px_0_0_#1a2530,inset_0_1px_0_0_rgba(255,255,255,0.08)] active:translate-y-[1px] active:shadow-[0_1px_0_0_#1a2530,inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-all duration-75",
  // Blue-gray slate keys (standard keys)
  slate: "bg-gradient-to-b from-[#4a5568] to-[#3d4a5c] text-[#c8d1dc] border-[#2d3748]",
  // Coral/salmon red for ESC
  coral: "bg-gradient-to-b from-[#e85a5a] to-[#d14545] text-[#1a1a1a] border-[#c03030] font-semibold",
}

interface KeyButtonProps {
  children: React.ReactNode
  variant?: "slate" | "coral"
  className?: string
  onClick?: () => void
}

function KeyButton({ children, variant = "slate", className = "", onClick }: KeyButtonProps) {
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
  rightContent?: React.ReactNode
  onClick?: () => void
}

function SlashCommand({ command, alias, rightContent, onClick }: SlashCommandProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-2 py-1 bg-secondary/30 border-b border-border/30 active:bg-accent transition-colors text-left"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-foreground font-mono text-[11px] font-medium">{command}</span>
        {alias && <span className="text-muted-foreground text-[9px]">({alias})</span>}
      </div>
      {rightContent && <div className="flex-shrink-0 ml-2">{rightContent}</div>}
    </button>
  )
}

export function TerminalControls() {
  const [sessionName, setSessionName] = useState("")
  const [selectedColor, setSelectedColor] = useState("green")

  return (
    <div className="h-full flex flex-col bg-secondary/20">
      {/* Pill chips row */}
      <div className="flex items-center gap-1.5 p-1.5 border-b border-border/50">
        <span className="px-2 py-0.5 text-[9px] font-medium rounded-full bg-accent text-accent-foreground">Alpha</span>
        <span className="px-2 py-0.5 text-[9px] font-medium rounded-full bg-accent text-accent-foreground">Beta</span>
        <span className="px-2 py-0.5 text-[9px] font-medium rounded-full bg-accent text-accent-foreground">Gamma</span>
      </div>

      {/* Keyboard keys */}
      <div className="flex items-center gap-1 p-1.5 border-b border-border/50">
        <KeyButton variant="coral" className="h-7 px-2">esc</KeyButton>
        <KeyButton className="h-7 w-7">1</KeyButton>
        <KeyButton className="h-7 w-7">2</KeyButton>
        <KeyButton className="h-7 w-7">3</KeyButton>
        <div className="flex-1" />
        <KeyButton className="h-7 px-1.5 text-[8px]">
          <span className="flex items-center gap-0.5">
            <span>⇧</span>
            <span>Tab</span>
          </span>
        </KeyButton>
        <KeyButton className="h-7 px-1.5">^C</KeyButton>
      </div>

      {/* Slash commands */}
      <div className="flex-1 overflow-auto scrollbar-hide">
        <SlashCommand command="/new" alias="clear" />
        <SlashCommand command="/compact" />
        <SlashCommand command="/branch" alias="fork" />
        
        {/* Rename with input */}
        <div className="flex items-center px-2 py-1 bg-secondary/30 border-b border-border/30">
          <span className="text-foreground font-mono text-[11px] font-medium">/rename</span>
          <div className="flex-1" />
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="name..."
            className="w-20 h-5 px-1.5 text-[16px] bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            style={{ fontSize: '16px' }}
          />
        </div>

        {/* Color with radio buttons */}
        <div className="flex items-center px-2 py-1 bg-secondary/30 border-b border-border/30">
          <span className="text-foreground font-mono text-[11px] font-medium">/color</span>
          <div className="flex-1" />
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
