"use client"

import { useEffect, useState } from "react"

// Different terminal content for each bot
const terminalContentByBot: Record<string, Array<{ type: string; content: string; command?: string; isModified?: boolean; isCursor?: boolean }>> = {
  claude_do_bot: [
    { type: "prompt", content: "claude@dev:~$", command: " tmux attach -t dev" },
    { type: "output", content: "[0] 0:bash* 1:vim 2:logs" },
    { type: "prompt", content: "claude@dev:~$", command: " git status" },
    { type: "output", content: "On branch main" },
    { type: "output", content: "Changes not staged for commit:" },
    { type: "output", content: "  modified:   src/app.tsx", isModified: true },
    { type: "output", content: "  modified:   lib/utils.ts", isModified: true },
    { type: "prompt", content: "claude@dev:~$", command: " _", isCursor: true },
  ],
  pm_dobot: [
    { type: "prompt", content: "pm@server:~$", command: " jira sprint list" },
    { type: "output", content: "Sprint 23 - In Progress" },
    { type: "output", content: "  [PROJ-142] Fix auth flow", isModified: true },
    { type: "output", content: "  [PROJ-156] Update dashboard" },
    { type: "prompt", content: "pm@server:~$", command: " slack status" },
    { type: "output", content: "3 unread messages in #engineering" },
    { type: "prompt", content: "pm@server:~$", command: " _", isCursor: true },
  ],
  gstack_dobot: [
    { type: "prompt", content: "gstack@cloud:~$", command: " kubectl get pods" },
    { type: "output", content: "NAME                    READY   STATUS" },
    { type: "output", content: "api-7d4f8b6c9-x2k9m     1/1     Running" },
    { type: "output", content: "web-5c6d7e8f9-p3q4r     1/1     Running" },
    { type: "output", content: "db-2a3b4c5d6-m7n8o      0/1     Pending", isModified: true },
    { type: "prompt", content: "gstack@cloud:~$", command: " _", isCursor: true },
  ],
  "elder-1": [
    { type: "prompt", content: "elder1@archive:~$", command: " ls -la /vault" },
    { type: "output", content: "drwxr-xr-x  knowledge_base/" },
    { type: "output", content: "-rw-r--r--  ancient_logs.txt" },
    { type: "output", content: "-rw-r--r--  wisdom.db", isModified: true },
    { type: "prompt", content: "elder1@archive:~$", command: " _", isCursor: true },
  ],
  "elder-2": [
    { type: "prompt", content: "elder2@oracle:~$", command: " python predict.py" },
    { type: "output", content: "Loading model... done" },
    { type: "output", content: "Accuracy: 94.7%", isModified: true },
    { type: "output", content: "Predictions exported to /out" },
    { type: "prompt", content: "elder2@oracle:~$", command: " _", isCursor: true },
  ],
  "elder-3": [
    { type: "prompt", content: "elder3@nexus:~$", command: " netstat -an" },
    { type: "output", content: "Active connections:" },
    { type: "output", content: "tcp  0.0.0.0:8080  LISTEN" },
    { type: "output", content: "tcp  0.0.0.0:443   LISTEN" },
    { type: "output", content: "tcp  10.0.0.5:22   ESTABLISHED", isModified: true },
    { type: "prompt", content: "elder3@nexus:~$", command: " _", isCursor: true },
  ],
  "elder-4": [
    { type: "prompt", content: "elder4@sentinel:~$", command: " tail -f /var/log/sys" },
    { type: "output", content: "[INFO] System healthy" },
    { type: "output", content: "[INFO] Memory: 67% used" },
    { type: "output", content: "[WARN] CPU spike detected", isModified: true },
    { type: "output", content: "[INFO] Auto-scaling triggered" },
    { type: "prompt", content: "elder4@sentinel:~$", command: " _", isCursor: true },
  ],
}

const statusBarByBot: Record<string, { session: string; windows: string[] }> = {
  claude_do_bot: { session: "dev", windows: ["0:bash*", "1:vim", "2:logs"] },
  pm_dobot: { session: "pm", windows: ["0:jira*", "1:slack", "2:docs"] },
  gstack_dobot: { session: "k8s", windows: ["0:kubectl*", "1:helm", "2:logs"] },
  "elder-1": { session: "arch", windows: ["0:vault*", "1:search"] },
  "elder-2": { session: "ml", windows: ["0:train*", "1:eval", "2:viz"] },
  "elder-3": { session: "net", windows: ["0:mon*", "1:ssh", "2:fw"] },
  "elder-4": { session: "ops", windows: ["0:logs*", "1:alerts"] },
}

interface TmuxPanelProps {
  botId?: string
}

export function TmuxPanel({ botId = "claude_do_bot" }: TmuxPanelProps) {
  const [cursorVisible, setCursorVisible] = useState(true)
  
  const terminalLines = terminalContentByBot[botId] ?? terminalContentByBot.claude_do_bot
  const statusBar = statusBarByBot[botId] ?? statusBarByBot.claude_do_bot

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
          boxShadow: 'inset 0 4px 8px -2px rgba(0,0,0,0.5), inset 0 -4px 8px -2px rgba(0,0,0,0.5), inset 4px 0 8px -2px rgba(0,0,0,0.4), inset -4px 0 8px -2px rgba(0,0,0,0.4)'
        }}
      />

      {/* Gradient fade mask at top - fades to 25% opacity */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-terminal/25 to-transparent z-10 pointer-events-none" />

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
        <span className="text-primary">[{statusBar.session}]</span>
        <div className="flex items-center gap-2 text-muted-foreground">
          {statusBar.windows.map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>
        <span className="text-muted-foreground">14:32</span>
      </div>
    </div>
  )
}
