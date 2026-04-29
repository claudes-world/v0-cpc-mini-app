"use client"

import { useEffect, useState, type ReactNode } from "react"

const terminalLines = [
  { type: "prompt", content: "user@server:~$", command: " tmux attach -t dev" },
  { type: "output", content: "[0] 0:bash* 1:vim 2:logs" },
  { type: "prompt", content: "user@server:~$", command: " git status" },
  { type: "output", content: "On branch main" },
  { type: "output", content: "Changes not staged for commit:" },
  { type: "output", content: "  modified:   src/app.tsx", isModified: true },
  { type: "output", content: "  modified:   lib/utils.ts", isModified: true },
  { type: "prompt", content: "user@server:~$", command: " _", isCursor: true },
]

interface TmuxPanelProps {
  resizeHandle?: ReactNode
}

export function TmuxPanel({ resizeHandle }: TmuxPanelProps) {
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-full bg-terminal overflow-hidden flex flex-col relative">
      {/* Inset shadow overlay - creates recessed appearance */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          boxShadow: 'inset 0 4px 8px -2px rgba(0,0,0,0.4), inset 4px 0 8px -4px rgba(0,0,0,0.3), inset -4px 0 8px -4px rgba(0,0,0,0.3), inset 0 -4px 8px -4px rgba(0,0,0,0.2)'
        }}
      />

      {/* Gradient fade mask at top - fades to 25% opacity */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-terminal/25 to-transparent z-10 pointer-events-none" />

      {/* Resize handle overlay - bottom right, flush with edges */}
      {resizeHandle && (
        <div className="absolute bottom-0 right-0 z-30">
          {resizeHandle}
        </div>
      )}

      {/* Terminal content */}
      <div className="flex-1 overflow-auto px-0.5 font-mono text-[9px] leading-tight scrollbar-hide">
        {terminalLines.map((line, i) => (
          <div key={i} className="flex">
            {line.type === "prompt" ? (
              <>
                <span className="text-primary">{line.content}</span>
                <span className="text-foreground">
                  {line.isCursor ? (
                    <>
                      {" "}
                      <span
                        className={`inline-block w-1 h-2.5 bg-primary align-middle transition-opacity duration-100 ${
                          cursorVisible ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </>
                  ) : (
                    line.command
                  )}
                </span>
              </>
            ) : (
              <span
                className={
                  line.isModified
                    ? "text-[#ebcb8b]"
                    : "text-[#d8dee9]"
                }
              >
                {line.content}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* tmux status bar */}
      <div className="flex items-center justify-between px-0.5 py-px bg-primary/20 text-[8px] font-mono">
        <span className="text-primary">[dev]</span>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>0:bash*</span>
          <span>1:vim</span>
          <span>2:logs</span>
        </div>
        <span className="text-muted-foreground">14:32</span>
      </div>
    </div>
  )
}
