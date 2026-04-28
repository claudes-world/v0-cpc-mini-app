"use client"

import { VscGitBranch } from "react-icons/vsc"

export function NotificationStatusLine() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary/50 border-t border-border text-[10px] font-mono text-muted-foreground safe-area-pb">
      <VscGitBranch className="w-3 h-3" />
      <span>main</span>
    </div>
  )
}
