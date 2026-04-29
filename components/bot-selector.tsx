"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { VscChevronDown, VscGripper } from "react-icons/vsc"
import { useState, useRef, useCallback, useEffect } from "react"
import { WebHaptics } from "web-haptics"

const bots = [
  { id: "claude_do_bot", label: "claude_do_bot" },
  { id: "pm_dobot", label: "pm_dobot" },
  { id: "gstack_dobot", label: "gstack_dobot" },
  { id: "elder-1", label: "elder-1" },
  { id: "elder-2", label: "elder-2" },
  { id: "elder-3", label: "elder-3" },
  { id: "elder-4", label: "elder-4" },
]

export function BotSelector() {
  const [value, setValue] = useState("claude_do_bot")
  const selectedBot = bots.find(b => b.id === value)

  return (
    <SelectPrimitive.Root value={value} onValueChange={setValue}>
      <SelectPrimitive.Trigger
        className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono rounded-tl border-t border-l border-border text-[#1a1e24] hover:opacity-90 transition-opacity outline-none"
        style={{
          backgroundColor: '#4c566a',
          boxShadow: '-6px -4px 12px -2px rgba(0,0,0,0.5), -2px 0 6px -1px rgba(0,0,0,0.3)'
        }}
      >
        <SelectPrimitive.Value>
          {selectedBot?.label}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon>
          <VscChevronDown className="w-2.5 h-2.5" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          side="top"
          align="end"
          sideOffset={0}
          className="z-50 min-w-[120px] max-h-[140px] overflow-y-auto bg-popover border border-border rounded-tl shadow-lg"
        >
          <SelectPrimitive.Viewport className="p-0.5">
            {bots.map((bot) => (
              <SelectPrimitive.Item
                key={bot.id}
                value={bot.id}
                className="relative flex items-center px-2 py-1.5 text-[10px] font-mono text-foreground rounded-sm outline-none cursor-pointer select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
              >
                <SelectPrimitive.ItemText>{bot.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

// Snap points as percentages of viewport height (excluding action bar)
export const SNAP_POINTS = [33, 60, 85] // small, medium, large

interface TerminalResizeHandleProps {
  terminalHeight: number // percentage
  onHeightChange: (height: number) => void
}

export function TerminalResizeHandle({ terminalHeight, onHeightChange }: TerminalResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  const startHeightRef = useRef(0)
  const containerHeightRef = useRef(0)
  const lastSnapRef = useRef<number | null>(null)

  // Get the closest snap point to the current height
  const getClosestSnapPoint = useCallback((height: number) => {
    let closest = SNAP_POINTS[0]
    let minDistance = Math.abs(height - SNAP_POINTS[0])
    
    for (const snap of SNAP_POINTS) {
      const distance = Math.abs(height - snap)
      if (distance < minDistance) {
        minDistance = distance
        closest = snap
      }
    }
    return closest
  }, [])

  // Handle touch/mouse start
  const handleStart = useCallback((clientY: number) => {
    startYRef.current = clientY
    startHeightRef.current = terminalHeight
    lastSnapRef.current = null
    
    // Get container height (viewport minus action bar ~56px and notification line ~24px)
    containerHeightRef.current = window.innerHeight - 80
    
    setIsDragging(true)
    WebHaptics.vibrate({ duration: 10, intensity: 0.5 })
  }, [terminalHeight])

  // Handle touch/mouse move
  const handleMove = useCallback((clientY: number) => {
    if (!isDragging) return

    const deltaY = clientY - startYRef.current
    const deltaPercent = (deltaY / containerHeightRef.current) * 100
    const newHeight = Math.max(20, Math.min(90, startHeightRef.current + deltaPercent))
    
    // Check if we've crossed a snap point for haptic feedback
    const currentSnap = getClosestSnapPoint(newHeight)
    if (lastSnapRef.current !== null && currentSnap !== lastSnapRef.current) {
      WebHaptics.vibrate({ duration: 15, intensity: 0.6 })
    }
    lastSnapRef.current = currentSnap
    
    onHeightChange(newHeight)
  }, [isDragging, onHeightChange, getClosestSnapPoint])

  // Handle touch/mouse end - snap to closest point
  const handleEnd = useCallback(() => {
    if (!isDragging) return
    
    const snapTo = getClosestSnapPoint(terminalHeight)
    onHeightChange(snapTo)
    setIsDragging(false)
    WebHaptics.vibrate({ duration: 20, intensity: 0.8 })
  }, [isDragging, terminalHeight, onHeightChange, getClosestSnapPoint])

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    handleStart(e.touches[0].clientY)
  }, [handleStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    handleMove(e.touches[0].clientY)
  }, [handleMove])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    handleEnd()
  }, [handleEnd])

  // Mouse handlers for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientY)
  }, [handleStart])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientY)
    }

    const handleMouseUp = () => {
      handleEnd()
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMove, handleEnd])

  // Find current snap index for visual indicator
  const currentSnapIndex = SNAP_POINTS.indexOf(getClosestSnapPoint(terminalHeight))

  return (
    <div
      className={`touch-none select-none cursor-ns-resize inline-flex items-center gap-1 px-2 py-1.5 text-[9px] font-mono rounded-tl border-t border-l border-border transition-all ${
        isDragging ? 'scale-105 opacity-100' : 'opacity-90 hover:opacity-100'
      }`}
      style={{
        backgroundColor: '#4c566a',
        boxShadow: isDragging 
          ? '-6px -4px 16px -2px rgba(0,0,0,0.7), -2px 0 8px -1px rgba(0,0,0,0.4)'
          : '-6px -4px 12px -2px rgba(0,0,0,0.5), -2px 0 6px -1px rgba(0,0,0,0.3)'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {/* Snap point indicators */}
      <div className="flex gap-0.5">
        {SNAP_POINTS.map((_, i) => (
          <div
            key={i}
            className={`w-1 h-1 rounded-full transition-colors ${
              i <= currentSnapIndex ? 'bg-[#88c0d0]' : 'bg-[#3b4252]'
            }`}
          />
        ))}
      </div>
      
      {/* Grip icon */}
      <VscGripper className="w-3 h-3 text-[#d8dee9]" />
    </div>
  )
}
