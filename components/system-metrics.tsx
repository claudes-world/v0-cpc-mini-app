"use client"

import { useState, useEffect } from "react"

interface MiniGaugeProps {
  label: string
  value: number
  maxValue: number
  unit?: string
  color: string
  glowColor: string
}

function MiniGauge({ label, value, maxValue, unit = "%", color, glowColor }: MiniGaugeProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  
  return (
    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
      <div className="flex items-center justify-between gap-1">
        <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-wide truncate">{label}</span>
        <span className="text-[9px] font-mono font-semibold tabular-nums" style={{ color }}>
          {value}{unit}
        </span>
      </div>
      <div className="relative h-1.5 w-full bg-background/50 rounded-full overflow-hidden border border-border/30">
        {/* Animated glow background */}
        <div 
          className="absolute inset-0 opacity-30 animate-pulse"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
            animationDuration: '2s'
          }}
        />
        {/* Progress bar */}
        <div 
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}, ${glowColor})`,
            boxShadow: `0 0 8px ${glowColor}40`
          }}
        />
      </div>
    </div>
  )
}

interface CircularGaugeProps {
  label: string
  value: number
  maxValue: number
  color: string
  glowColor: string
}

function CircularGauge({ label, value, maxValue, color, glowColor }: CircularGaugeProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  const circumference = 2 * Math.PI * 12 // radius = 12
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative w-8 h-8">
        {/* Background ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-background/50"
          />
          {/* Animated progress ring */}
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
            style={{
              filter: `drop-shadow(0 0 3px ${glowColor})`
            }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8px] font-mono font-bold" style={{ color }}>{value}</span>
        </div>
      </div>
      <span className="text-[7px] font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
    </div>
  )
}

export function SystemMetrics() {
  // Simulated metrics - in production these would come from a real API
  const [metrics, setMetrics] = useState({
    cpu: 42,
    memory: 67,
    claudeProcesses: 3
  })

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 5)),
        claudeProcesses: Math.max(1, Math.min(8, prev.claudeProcesses + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)))
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3 p-2 border-b border-border/50">
      {/* CPU Gauge */}
      <MiniGauge 
        label="CPU" 
        value={Math.round(metrics.cpu)} 
        maxValue={100}
        color="#88c0d0"
        glowColor="#5e81ac"
      />
      
      {/* Memory Gauge */}
      <MiniGauge 
        label="MEM" 
        value={Math.round(metrics.memory)} 
        maxValue={100}
        color="#a3be8c"
        glowColor="#8fbcbb"
      />
      
      {/* Claude Processes - Circular */}
      <CircularGauge 
        label="Claude" 
        value={metrics.claudeProcesses} 
        maxValue={8}
        color="#b48ead"
        glowColor="#d08770"
      />
    </div>
  )
}
