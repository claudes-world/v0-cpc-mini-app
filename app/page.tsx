"use client"

import { TerminalView } from "@/components/terminal-view"
import { SwipeableTabs, defaultTabs } from "@/components/swipeable-tabs"
import { ActionBar } from "@/components/action-bar"

export default function Home() {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Terminal section - top 1/3 */}
      <div className="h-[33%] p-2 pb-1">
        <TerminalView />
      </div>

      {/* Tabs section - middle area (fills remaining space minus action bar) */}
      <div className="flex-1 min-h-0 border-t border-border">
        <SwipeableTabs tabs={defaultTabs} />
      </div>

      {/* Action bar - bottom 15% */}
      <ActionBar />
    </div>
  )
}
