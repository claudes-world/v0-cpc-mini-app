"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { VscChevronDown } from "react-icons/vsc"
import { GripVertical } from "lucide-react"
import { useState, useRef, useCallback, useEffect } from "react"
import { WebHaptics } from "web-haptics"

// Create haptics instance
let haptics: WebHaptics | null = null
try {
  haptics = new WebHaptics()
} catch {
  // Haptics not available
}

// Safe haptics wrapper using trigger with presets
const triggerHaptic = (preset: "success" | "warning" | "error" | "light" | "medium" | "heavy" | "selection" | "impact") => {
  try {
    haptics?.trigger(preset)
  } catch {
    // Haptics not available
  }
}

export const bots = [
  { id: "claude_do_bot", label: "claude_do_bot" },
  { id: "pm_dobot", label: "pm_dobot" },
  { id: "gstack_dobot", label: "gstack_dobot" },
  { id: "elder-1", label: "elder-1" },
  { id: "elder-2", label: "elder-2" },
  { id: "elder-3", label: "elder-3" },
  { id: "elder-4", label: "elder-4" },
]

// Fixed width for the selector to prevent layout shifts (wide enough for longest label)
const SELECTOR_WIDTH = 90 // pixels

// Snap points as percentages of viewport height (excluding action bar)
export const SNAP_POINTS = [33, 60, 85] // small, medium, large

// Threshold in pixels to distinguish tap from drag
const DRAG_THRESHOLD = 8

interface DraggableBotSelectorProps {
  terminalHeight: number
  onHeightChange: (height: number) => void
  selectedBotIndex: number
  onBotIndexChange: (index: number) => void
}

export function DraggableBotSelector({ terminalHeight, onHeightChange, selectedBotIndex, onBotIndexChange }: DraggableBotSelectorProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)

  // Derive value from index
  const value = bots[selectedBotIndex]?.id ?? bots[0].id
  const selectedBot = bots[selectedBotIndex] ?? bots[0]

  // Handle value change from select
  const handleValueChange = useCallback((newValue: string) => {
    const newIndex = bots.findIndex(b => b.id === newValue)
    if (newIndex !== -1) {
      onBotIndexChange(newIndex)
    }
  }, [onBotIndexChange])

  const startYRef = useRef(0)
  const startHeightRef = useRef(0)
  const containerHeightRef = useRef(0)
  const lastSnapRef = useRef<number | null>(null)
  const currentHeightRef = useRef(terminalHeight)
  const hasDraggedRef = useRef(false)

  // Keep ref in sync with prop
  useEffect(() => {
    currentHeightRef.current = terminalHeight
  }, [terminalHeight])

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
    startHeightRef.current = currentHeightRef.current
    lastSnapRef.current = null
    hasDraggedRef.current = false

    // Get container height (viewport minus action bar ~56px and notification line ~24px)
    containerHeightRef.current = window.innerHeight - 80
  }, [])

  // Handle touch/mouse move
  const handleMove = useCallback((clientY: number) => {
    const totalDelta = Math.abs(clientY - startYRef.current)

    // Check if we've passed the drag threshold
    if (!hasDraggedRef.current && totalDelta > DRAG_THRESHOLD) {
      hasDraggedRef.current = true
      setIsDragging(true)
      triggerHaptic("light")
    }

    if (!hasDraggedRef.current) return

    const deltaY = clientY - startYRef.current
    const deltaPercent = (deltaY / containerHeightRef.current) * 100
    const newHeight = Math.max(20, Math.min(90, startHeightRef.current + deltaPercent))

    // Check if we've crossed a snap point for haptic feedback
    const currentSnap = getClosestSnapPoint(newHeight)
    if (lastSnapRef.current !== null && currentSnap !== lastSnapRef.current) {
      triggerHaptic("selection")
    }
    lastSnapRef.current = currentSnap
    currentHeightRef.current = newHeight

    onHeightChange(newHeight)
  }, [onHeightChange, getClosestSnapPoint])

  // Handle touch/mouse end - snap to closest point
  const handleEnd = useCallback(() => {
    if (hasDraggedRef.current) {
      const snapTo = getClosestSnapPoint(currentHeightRef.current)
      onHeightChange(snapTo)
      setIsDragging(false)
      triggerHaptic("medium")
    }
    hasDraggedRef.current = false
  }, [onHeightChange, getClosestSnapPoint])

  // Touch handlers on the select trigger
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
    handleStart(e.touches[0].clientY)
  }, [handleStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
    if (hasDraggedRef.current) {
      e.preventDefault()
    }
    handleMove(e.touches[0].clientY)
  }, [handleMove])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
    // If we dragged, just end the drag. If we didn't drag, open the select.
    if (hasDraggedRef.current) {
      handleEnd()
    } else {
      setSelectOpen(true)
    }
  }, [handleEnd])

  // Mouse handlers for desktop - track if we should open select on mouseup
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    handleStart(e.clientY)

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientY)
    }

    const handleMouseUp = () => {
      // If we dragged, just end the drag. If we didn't drag, open the select.
      if (hasDraggedRef.current) {
        handleEnd()
      } else {
        setSelectOpen(true)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [handleStart, handleMove, handleEnd])

  return (
    <SelectPrimitive.Root value={value} onValueChange={handleValueChange} open={selectOpen} onOpenChange={setSelectOpen}>
      {/* Combined draggable select trigger - the Trigger wraps everything so portal positions correctly */}
      <SelectPrimitive.Trigger asChild>
        <div
          className={`inline-flex items-stretch rounded-tl border-t border-l border-border transition-all touch-none select-none cursor-ns-resize ${isDragging ? 'scale-105 opacity-100' : 'opacity-90 hover:opacity-100'
            }`}
          style={{
            backgroundColor: '#4c566a',
            // External shadow casting onto terminal from top and left edges
            boxShadow: '-4px 0 8px -2px rgba(0,0,0,0.5), 0 -4px 8px -2px rgba(0,0,0,0.5)',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          {/* Drag handle grip */}
          <div className="flex items-center px-1 py-0 border-r border-[#3b4252]">
            <GripVertical className="w-3 h-3 text-[#d8dee9]" />
          </div>

          {/* Bot selector display - fixed width */}
          <div
            className="inline-flex items-center justify-between gap-0 pl-1 pr-3 py-1 text-[9px] font-mono text-[#d8dee9] hover:text-white transition-colors"
            style={{ width: SELECTOR_WIDTH }}
          >
            <span>{selectedBot?.label}</span>
            <VscChevronDown className="w-2.5 h-2.5 shrink-0" />
          </div>
        </div>
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
