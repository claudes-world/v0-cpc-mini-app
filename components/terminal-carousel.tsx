"use client"

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react"
import { WebHaptics } from "web-haptics"

// Safe haptics wrapper
const vibrate = (options: { duration: number; intensity: number }) => {
  try {
    if (typeof WebHaptics?.vibrate === 'function') {
      WebHaptics.vibrate(options)
    }
  } catch {
    // Haptics not available
  }
}

// Threshold for swipe detection
const SWIPE_THRESHOLD = 50

interface TerminalCarouselProps {
  children: ReactNode[]
  currentIndex: number
  onIndexChange: (index: number) => void
}

export function TerminalCarousel({ children, currentIndex, onIndexChange }: TerminalCarouselProps) {
  const [offsetX, setOffsetX] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSwiping, setIsSwiping] = useState(false)
  
  const startXRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const containerWidthRef = useRef(0)
  const offsetXRef = useRef(0)
  
  // Keep offsetX ref in sync
  useEffect(() => {
    offsetXRef.current = offsetX
  }, [offsetX])
  
  // Track previous index for animation direction
  const prevIndexRef = useRef(currentIndex)
  
  // Animate when currentIndex changes from select
  useEffect(() => {
    if (currentIndex !== prevIndexRef.current && !isSwiping) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 300)
      prevIndexRef.current = currentIndex
      return () => clearTimeout(timer)
    }
    prevIndexRef.current = currentIndex
  }, [currentIndex, isSwiping])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Check if the touch originated from an interactive element we should ignore
    const target = e.target as HTMLElement
    if (target.closest('[data-carousel-ignore]')) {
      return
    }
    
    if (containerRef.current) {
      containerWidthRef.current = containerRef.current.offsetWidth
    }
    startXRef.current = e.touches[0].clientX
    setIsSwiping(true)
    setIsAnimating(false)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping) return
    
    const deltaX = e.touches[0].clientX - startXRef.current
    // Limit drag to reasonable range with resistance at edges
    const maxDrag = containerWidthRef.current * 0.8
    
    // Add resistance when at first/last item
    let resistedDelta = deltaX
    if ((currentIndex === 0 && deltaX > 0) || (currentIndex === children.length - 1 && deltaX < 0)) {
      resistedDelta = deltaX * 0.3 // Rubber band effect
    }
    
    setOffsetX(Math.max(-maxDrag, Math.min(maxDrag, resistedDelta)))
  }, [isSwiping, currentIndex, children.length])

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping) return
    
    setIsSwiping(false)
    
    if (Math.abs(offsetX) > SWIPE_THRESHOLD) {
      if (offsetX > 0 && currentIndex > 0) {
        // Swipe right - go to previous
        vibrate({ duration: 15, intensity: 0.6 })
        onIndexChange(currentIndex - 1)
      } else if (offsetX < 0 && currentIndex < children.length - 1) {
        // Swipe left - go to next
        vibrate({ duration: 15, intensity: 0.6 })
        onIndexChange(currentIndex + 1)
      }
    }
    
    setIsAnimating(true)
    setOffsetX(0)
    
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }, [isSwiping, offsetX, currentIndex, children.length, onIndexChange])

  // Mouse support for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only handle left mouse button and ignore if target is inside a nested interactive element
    if (e.button !== 0) return
    
    // Check if the click originated from an interactive element we should ignore
    const target = e.target as HTMLElement
    if (target.closest('[data-carousel-ignore]')) {
      return
    }
    
    if (containerRef.current) {
      containerWidthRef.current = containerRef.current.offsetWidth
    }
    startXRef.current = e.clientX
    setIsSwiping(true)
    setIsAnimating(false)
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startXRef.current
      const maxDrag = containerWidthRef.current * 0.8
      
      let resistedDelta = deltaX
      if ((currentIndex === 0 && deltaX > 0) || (currentIndex === children.length - 1 && deltaX < 0)) {
        resistedDelta = deltaX * 0.3
      }
      
      setOffsetX(Math.max(-maxDrag, Math.min(maxDrag, resistedDelta)))
    }
    
    const handleMouseUp = () => {
      setIsSwiping(false)
      
      const currentOffset = offsetXRef.current
      if (Math.abs(currentOffset) > SWIPE_THRESHOLD) {
        if (currentOffset > 0 && currentIndex > 0) {
          vibrate({ duration: 15, intensity: 0.6 })
          onIndexChange(currentIndex - 1)
        } else if (currentOffset < 0 && currentIndex < children.length - 1) {
          vibrate({ duration: 15, intensity: 0.6 })
          onIndexChange(currentIndex + 1)
        }
      }
      
      setIsAnimating(true)
      setOffsetX(0)
      
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
      
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [currentIndex, children.length, onIndexChange])

  // Calculate the slide width as percentage of the inner container
  const slideWidthPercent = 100 / children.length
  
  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-hidden relative touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="flex h-full"
        style={{
          transform: `translateX(calc(-${currentIndex * slideWidthPercent}% + ${offsetX}px))`,
          transition: isAnimating ? 'transform 0.3s ease-out' : 'none',
          width: `${children.length * 100}%`,
        }}
      >
        {children.map((child, index) => (
          <div 
            key={index}
            className="h-full"
            style={{ width: `${100 / children.length}%` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
