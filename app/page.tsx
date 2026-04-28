"use client"

import { TmuxPanel } from "@/components/tmux-panel"
import { AppPages, defaultTabs } from "@/components/app-pages"
import { ActionBar } from "@/components/action-bar"
import { NotificationStatusLine } from "@/components/notification-status-line"

export default function Home() {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Terminal section - top 1/3 */}
      <div className="h-[33%]">
        <TmuxPanel />
      </div>

      {/* Tabs section - middle area (fills remaining space minus action bar) */}
      <div className="flex-1 min-h-0 border-t border-border">
        <AppPages tabs={defaultTabs} />
      </div>

      {/* Action bar */}
      <ActionBar />

      {/* Notification status line */}
      <NotificationStatusLine />
    </div>
  )
}
