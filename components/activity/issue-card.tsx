"use client"

import type { Issue } from '@/lib/data/activity-types'
import { ActivitySparkline } from './activity-sparkline'
import { VscIssues, VscComment, VscReferences } from 'react-icons/vsc'

interface IssueCardProps {
  issue: Issue
}

// Type badge colors (Nord Aurora palette)
const typeColors: Record<string, string> = {
  bug: 'bg-[#bf616a]/20 text-[#bf616a]',      // nord11 red
  feat: 'bg-[#a3be8c]/20 text-[#a3be8c]',     // nord14 green
  idea: 'bg-[#ebcb8b]/20 text-[#ebcb8b]',     // nord13 yellow
  task: 'bg-[#81a1c1]/20 text-[#81a1c1]',     // nord9 blue
  plan: 'bg-[#b48ead]/20 text-[#b48ead]',     // nord15 purple
  review: 'bg-[#d08770]/20 text-[#d08770]',   // nord12 orange
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

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="flex items-start gap-2 px-2 py-1.5 bg-card/30 hover:bg-card/50 transition-colors border-b border-border/20">
      {/* Issue icon */}
      <VscIssues className={`w-3 h-3 mt-0.5 flex-shrink-0 ${
        issue.status === 'open' ? 'text-[#a3be8c]' : 'text-[#b48ead]'
      }`} />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {/* Type badge */}
          <span className={`px-1 py-0.5 text-[7px] font-medium rounded ${typeColors[issue.type] || 'bg-secondary text-muted-foreground'}`}>
            {issue.type}
          </span>
          
          {/* Issue number */}
          <span className="text-[9px] text-muted-foreground">#{issue.number}</span>
          
          {/* Time ago */}
          <span className="text-[8px] text-muted-foreground/70">{formatTimeAgo(issue.lastActivity)}</span>
          
          {/* Milestone if exists */}
          {issue.milestone && (
            <span className="text-[7px] text-muted-foreground bg-secondary/50 px-1 rounded">
              {issue.milestone}
            </span>
          )}
        </div>
        
        {/* Title */}
        <p className="text-[10px] text-foreground truncate mt-0.5">
          {issue.title}
        </p>
      </div>
      
      {/* Stats and sparkline */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Comment count */}
        <div className="flex items-center gap-0.5 text-[8px] text-muted-foreground">
          <VscComment className="w-2.5 h-2.5" />
          <span>{issue.commentCount}</span>
        </div>
        
        {/* Reference count */}
        <div className="flex items-center gap-0.5 text-[8px] text-muted-foreground">
          <VscReferences className="w-2.5 h-2.5" />
          <span>{issue.referenceCount}</span>
        </div>
        
        {/* Sparkline */}
        <ActivitySparkline 
          events={issue.activityTimeline} 
          width={40} 
          height={12}
          className="text-muted-foreground"
        />
      </div>
    </div>
  )
}
