"use client"

import type { ActivityEvent } from '@/lib/data/activity-types'

interface SparklineProps {
  events: ActivityEvent[]
  width?: number
  height?: number
  className?: string
}

// Nord-inspired colors for event types
const eventColors = {
  comment: '#88c0d0',   // Frost cyan (nord8)
  commit: '#a3be8c',    // Aurora green (nord14)
  reference: '#b48ead', // Aurora purple (nord15)
}

export function ActivitySparkline({ 
  events, 
  width = 60, 
  height = 16,
  className = ''
}: SparklineProps) {
  if (events.length === 0) {
    return (
      <svg 
        width={width} 
        height={height} 
        className={className}
        viewBox={`0 0 ${width} ${height}`}
      >
        <rect 
          x={0} 
          y={height / 2 - 0.5} 
          width={width} 
          height={1} 
          fill="currentColor" 
          opacity={0.2} 
        />
      </svg>
    )
  }
  
  // Sort events by timestamp
  const sorted = [...events].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  )
  
  // Calculate time range
  const minTime = sorted[0].timestamp.getTime()
  const maxTime = sorted[sorted.length - 1].timestamp.getTime()
  const timeRange = maxTime - minTime || 1 // Avoid division by zero
  
  // Padding on sides
  const padding = 2
  const usableWidth = width - padding * 2
  
  return (
    <svg 
      width={width} 
      height={height} 
      className={className}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Baseline */}
      <rect 
        x={padding} 
        y={height - 2} 
        width={usableWidth} 
        height={1} 
        fill="currentColor" 
        opacity={0.15} 
      />
      
      {/* Event ticks */}
      {sorted.map((event, i) => {
        const x = padding + ((event.timestamp.getTime() - minTime) / timeRange) * usableWidth
        const color = eventColors[event.type]
        const tickHeight = event.type === 'commit' ? height - 4 : height - 6
        
        return (
          <rect
            key={i}
            x={x - 0.5}
            y={height - 2 - tickHeight}
            width={1}
            height={tickHeight}
            fill={color}
            opacity={0.9}
          />
        )
      })}
    </svg>
  )
}
