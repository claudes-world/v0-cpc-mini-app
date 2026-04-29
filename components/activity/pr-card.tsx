"use client"

import type { PullRequest } from '@/lib/data/activity-types'
import { ActivitySparkline } from './activity-sparkline'
import { VscGitPullRequest, VscComment, VscGitCommit } from 'react-icons/vsc'

interface PRCardProps {
  pr: PullRequest
}

// Type badge colors (Nord Aurora palette)
const typeColors: Record<string, string> = {
  fix: 'bg-[#bf616a]/20 text-[#bf616a]',      // nord11 red
  feat: 'bg-[#a3be8c]/20 text-[#a3be8c]',     // nord14 green
  chore: 'bg-[#81a1c1]/20 text-[#81a1c1]',    // nord9 blue
  other: 'bg-[#4c566a]/30 text-[#d8dee9]',    // nord3 gray
}

// Status colors
const statusColors: Record<string, string> = {
  open: 'text-[#a3be8c]',     // green
  merged: 'text-[#b48ead]',   // purple
  closed: 'text-[#bf616a]',   // red
}

function formatTimeAgo(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  return `${days}d`
}

export function PRCard({ pr }: PRCardProps) {
  return (
    <div className="flex items-start gap-2 px-2 py-1.5 bg-card/30 hover:bg-card/50 transition-colors border-b border-border/20">
      {/* PR icon */}
      <VscGitPullRequest className={`w-3 h-3 mt-0.5 flex-shrink-0 ${statusColors[pr.status]}`} />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {/* Type badge */}
          <span className={`px-1 py-0.5 text-[7px] font-medium rounded ${typeColors[pr.type] || 'bg-secondary text-muted-foreground'}`}>
            {pr.type}
          </span>
          
          {/* PR number */}
          <span className="text-[9px] text-muted-foreground">#{pr.number}</span>
          
          {/* Time ago */}
          <span className="text-[8px] text-muted-foreground/70">{formatTimeAgo(pr.lastActivity)}</span>
          
          {/* Status badge for merged/closed */}
          {pr.status !== 'open' && (
            <span className={`text-[7px] ${statusColors[pr.status]}`}>
              {pr.status}
            </span>
          )}
        </div>
        
        {/* Title */}
        <p className="text-[10px] text-foreground truncate mt-0.5">
          {pr.title}
        </p>
      </div>
      
      {/* Stats and sparkline */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Comment count */}
        <div className="flex items-center gap-0.5 text-[8px] text-muted-foreground">
          <VscComment className="w-2.5 h-2.5" />
          <span>{pr.commentCount}</span>
        </div>
        
        {/* Commit count */}
        <div className="flex items-center gap-0.5 text-[8px] text-muted-foreground">
          <VscGitCommit className="w-2.5 h-2.5" />
          <span>{pr.commitCount}</span>
        </div>
        
        {/* Sparkline */}
        <ActivitySparkline 
          events={pr.activityTimeline} 
          width={40} 
          height={12}
          className="text-muted-foreground"
        />
      </div>
    </div>
  )
}
