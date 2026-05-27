"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SystemMetrics } from "@/components/system-metrics"

// Nord-themed keyboard key colors
const keyStyles = {
  base: "flex items-center justify-center font-mono text-[10px] font-medium rounded-[4px] border shadow-[0_2px_0_0_#1a1e24,inset_0_1px_0_0_rgba(255,255,255,0.08)] active:translate-y-[1px] active:shadow-[0_1px_0_0_#1a1e24,inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-all duration-75",
  // Nord Polar Night keys (nord3 -> nord2)
  slate: "bg-gradient-to-b from-[#4c566a] to-[#434c5e] text-[#d8dee9] border-[#3b4252]",
  // Nord Aurora red for ESC (nord11)
  coral: "bg-gradient-to-b from-[#bf616a] to-[#a54e56] text-[#eceff4] border-[#8b4049] font-semibold",
  // Darker blue for function/modifier keys (like Keychron F-row)
  darkBlue: "bg-gradient-to-b from-[#3b4252] to-[#2e3440] text-[#81a1c1] border-[#2e3440]",
}

interface KeyButtonProps {
  children: React.ReactNode
  variant?: "slate" | "coral" | "darkBlue"
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
      className="w-full flex items-center justify-between px-2 py-1 bg-secondary/30 border-b border-border/80 active:bg-accent transition-colors text-left"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[#81a1c1] font-mono text-[11px] font-medium">{command}</span>
        {alias && <span className="text-muted-foreground text-[9px]">({alias})</span>}
      </div>
      {rightContent && <div className="flex-shrink-0 ml-2">{rightContent}</div>}
    </button>
  )
}

export function TerminalControls() {
  const [sessionName, setSessionName] = useState("")
  const [selectedColor, setSelectedColor] = useState("green")
  const [newModalOpen, setNewModalOpen] = useState(false)
  const [compactModalOpen, setCompactModalOpen] = useState(false)
  const [branchModalOpen, setBranchModalOpen] = useState(false)
  const [compactGuidance, setCompactGuidance] = useState("")

  const handleClear = () => {
    // Clear action
    setNewModalOpen(false)
  }

  const handleCompact = () => {
    // Compact action
    setCompactModalOpen(false)
    setCompactGuidance("")
  }

  const handlePromptContinuity = () => {
    // Prompt for continuity action
    setCompactModalOpen(false)
    setCompactGuidance("")
  }

  const handleBranch = () => {
    // Branch action
    setBranchModalOpen(false)
  }

  return (
    <div className="h-full flex flex-col bg-secondary/20">
      {/* System metrics gauges */}
      <SystemMetrics />

      {/* Keyboard keys - row 1 */}
      <div className="flex items-center gap-1 px-1.5 pt-1.5 pb-0.5">
        <KeyButton variant="coral" className="h-7 px-2">esc</KeyButton>
        <KeyButton className="h-7 w-7">1</KeyButton>
        <KeyButton className="h-7 w-7">2</KeyButton>
        <KeyButton className="h-7 w-7">3</KeyButton>
      </div>
      {/* Keyboard keys - row 2 */}
      <div className="flex items-center gap-1 px-1.5 pt-0.5 pb-1.5 border-b border-border/50">
        <KeyButton variant="darkBlue" className="h-7 px-1.5 text-[8px]">
          <span className="flex items-center gap-0.5">
            <span>⇧</span>
            <span>Tab</span>
          </span>
        </KeyButton>
        <KeyButton className="h-7 px-1.5">^C</KeyButton>
        <KeyButton className="h-7 px-1.5">^B</KeyButton>
      </div>

      {/* Slash commands */}
      <div className="flex-1 overflow-hidden relative">
        {/* Inset shadow overlay - all four sides */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            boxShadow: 'inset 0 4px 8px -2px rgba(0,0,0,0.5), inset 0 -4px 8px -2px rgba(0,0,0,0.5), inset 4px 0 8px -2px rgba(0,0,0,0.4), inset -4px 0 8px -2px rgba(0,0,0,0.4)'
          }}
        />
        <div className="h-full overflow-auto scrollbar-hide">
        <SlashCommand command="/new" alias="clear" onClick={() => setNewModalOpen(true)} />
        <SlashCommand command="/compact" onClick={() => setCompactModalOpen(true)} />
        <SlashCommand command="/branch" alias="fork" onClick={() => setBranchModalOpen(true)} />
        <SlashCommand command="/reload-plugins" />
        
        {/* Rename with input */}
        <div className="flex items-center gap-1 px-2 py-1 bg-secondary/30 border-b border-border/80">
          <span className="text-[#81a1c1] font-mono text-[11px] font-medium flex-shrink-0">/rename</span>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="name..."
            className="flex-1 min-w-0 h-5 px-1 text-[16px] bg-input border border-border rounded text-foreground placeholder:text-muted-foreground placeholder:text-[9px] focus:outline-none focus:ring-1 focus:ring-ring"
            style={{ fontSize: '16px' }}
          />
        </div>

        {/* Color with radio buttons */}
        <div className="flex items-center gap-3 px-2 py-1 bg-secondary/30 border-b border-border/80">
          <span className="text-[#81a1c1] font-mono text-[11px] font-medium flex-shrink-0">/color</span>
          <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1">
              {sessionColors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c.id)}
                  className={`w-4 h-4 flex-shrink-0 rounded-sm ${c.color} ${
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
      </div>

      {/* /new Modal */}
      <Dialog open={newModalOpen} onOpenChange={setNewModalOpen}>
        <DialogContent showCloseButton={false} className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-sm">Clear Session</DialogTitle>
            <DialogDescription className="text-xs">
              This will clear all current session data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2">
            <button
              onClick={() => setNewModalOpen(false)}
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-[#2e3440] text-[#d8dee9] hover:bg-[#3b4252] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleClear}
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-[#bf616a] text-white hover:bg-[#a54e56] transition-colors"
            >
              Clear
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* /compact Modal */}
      <Dialog open={compactModalOpen} onOpenChange={setCompactModalOpen}>
        <DialogContent showCloseButton={false} className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-sm">Compact Session</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <input
              type="text"
              value={compactGuidance}
              onChange={(e) => setCompactGuidance(e.target.value)}
              placeholder="compact / continuity guidance"
              className="w-full h-8 px-2 text-xs bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <DialogFooter className="flex-row gap-2">
            <button
              onClick={() => {
                setCompactModalOpen(false)
                setCompactGuidance("")
              }}
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-[#2e3440] text-[#d8dee9] hover:bg-[#3b4252] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePromptContinuity}
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-[#ebcb8b] text-[#2e3440] hover:bg-[#d9ba7a] transition-colors"
            >
              Prompt for Continuity
            </button>
            <button
              onClick={handleCompact}
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-[#d08770] text-white hover:bg-[#bf7663] transition-colors"
            >
              Compact
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* /branch Modal */}
      <Dialog open={branchModalOpen} onOpenChange={setBranchModalOpen}>
        <DialogContent showCloseButton={false} className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-sm">Branch Session</DialogTitle>
            <DialogDescription className="text-xs">
              Create a new branch from the current session state?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2">
            <button
              onClick={() => setBranchModalOpen(false)}
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-[#2e3440] text-[#d8dee9] hover:bg-[#3b4252] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBranch}
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-[#81a1c1] text-[#2e3440] hover:bg-[#6d8faf] transition-colors"
            >
              Confirm
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
