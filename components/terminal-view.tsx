"use client"

import { useEffect, useRef, useState } from "react"

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

export function TerminalView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-full bg-terminal rounded-md overflow-hidden flex flex-col"
    >
      {/* Terminal header */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-secondary/50 border-b border-border">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-green-500/80" />
        </div>
        <span className="text-[10px] text-muted-foreground font-mono ml-2">
          tmux:dev — bash
        </span>
      </div>

      {/* Terminal content */}
      <div className="flex-1 overflow-auto p-2 font-mono text-xs leading-relaxed scrollbar-hide">
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
                        className={`inline-block w-1.5 h-3.5 bg-primary align-middle transition-opacity duration-100 ${
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
                    ? "text-yellow-400"
                    : "text-terminal-muted"
                }
              >
                {line.content}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* tmux status bar */}
      <div className="flex items-center justify-between px-2 py-0.5 bg-primary/20 text-[9px] font-mono">
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
