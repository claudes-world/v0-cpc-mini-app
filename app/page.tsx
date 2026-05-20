"use client"

import { useState, useRef, useEffect } from "react"
import { TmuxPanel } from "@/components/tmux-panel"
import { TerminalControls } from "@/components/terminal-controls"
import { AppPages, defaultTabs } from "@/components/app-pages"
import { ActionBar } from "@/components/action-bar"
import { NotificationStatusLine } from "@/components/notification-status-line"
import { DraggableBotSelector, SNAP_POINTS, bots } from "@/components/bot-selector"
import { TerminalCarousel } from "@/components/terminal-carousel"

export default function Home() {
  const [terminalHeight, setTerminalHeight] = useState(33)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedBotIndex, setSelectedBotIndex] = useState(0)
  const lastHeightRef = useRef(33)

  // Detect when we've snapped to a new position (height changed to a snap point and stopped changing)
  useEffect(() => {
    const isSnapPoint = SNAP_POINTS.includes(terminalHeight)
    const heightChanged = terminalHeight !== lastHeightRef.current
    
    if (isSnapPoint && heightChanged) {
      // Small delay to allow the snap animation to complete
      const timer = setTimeout(() => {
        setIsDragging(false)
      }, 50)
      return () => clearTimeout(timer)
    }
    
    lastHeightRef.current = terminalHeight
  }, [terminalHeight])

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Terminal section - dynamic height, split into two columns */}
      <div 
        className="flex"
        style={{ 
          height: `${terminalHeight}%`,
          transition: isDragging ? 'none' : 'height 0.2s ease-out'
        }}
      >
        {/* Left: Terminal Carousel */}
        <div className="w-3/5 border-r border-border relative">
          <TerminalCarousel 
            currentIndex={selectedBotIndex} 
            onIndexChange={setSelectedBotIndex}
          >
            {bots.map((bot) => (
              <TmuxPanel key={bot.id} botId={bot.id} />
            ))}
          </TerminalCarousel>
          
          {/* Resize handle overlay - positioned over carousel */}
          <div className="absolute bottom-0 right-0 z-30" data-carousel-ignore>
            <DraggableBotSelector
              terminalHeight={terminalHeight}
              onHeightChange={(h) => {
                setIsDragging(true)
                setTerminalHeight(h)
              }}
              selectedBotIndex={selectedBotIndex}
              onBotIndexChange={setSelectedBotIndex}
            />
          </div>
        </div>
        {/* Right: Controls */}
        <div className="w-2/5">
          <TerminalControls />
        </div>
      </div>

      {/* Tabs section - middle area (fills remaining space minus action bar) */}
      <div 
        className="flex-1 min-h-0 border-t border-border relative z-40"
        style={{ 
          transition: isDragging ? 'none' : 'flex 0.2s ease-out'
        }}
      >
        <AppPages tabs={defaultTabs} />
      </div>

      {/* Action bar */}
      <ActionBar />

      {/* Notification status line */}
      <NotificationStatusLine />
    </div>
  )
}
