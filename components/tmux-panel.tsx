"use client"

import { useEffect, useState } from "react"

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

export function TmuxPanel() {
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-full bg-terminal overflow-hidden flex flex-col relative">
      {/* Gradient fade mask at top - fades to 25% opacity */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-terminal/25 to-transparent z-10 pointer-events-none" />

      {/* Terminal content */}
      <div className="flex-1 overflow-auto font-mono text-[9px] leading-tight scrollbar-hide">
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
      <div className="flex items-center justify-between py-px bg-primary/20 text-[8px] font-mono">
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
