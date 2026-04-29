"use client"

import type { Issue } from '@/lib/data/activity-types'
import { ActivitySparkline } from './activity-sparkline'
import { 
  VscIssues, 
  VscComment, 
  VscReferences,
  VscCircleFilled,
  VscPass,
  VscMilestone,
  VscSymbolEvent
} from 'react-icons/vsc'

interface IssueCardProps {
  issue: Issue
}

// Type badge colors (Nord Aurora palette)
const typeConfig: Record<string, { bg: string; text: string; label: string; icon?: typeof VscIssues }> = {
  bug: { bg: 'bg-[#bf616a]/20', text: 'text-[#bf616a]', label: 'BUG', icon: VscSymbolEvent },
  feat: { bg: 'bg-[#a3be8c]/20', text: 'text-[#a3be8c]', label: 'FEAT' },
  idea: { bg: 'bg-[#ebcb8b]/20', text: 'text-[#ebcb8b]', label: 'IDEA' },
  task: { bg: 'bg-[#81a1c1]/20', text: 'text-[#81a1c1]', label: 'TASK' },
  plan: { bg: 'bg-[#b48ead]/20', text: 'text-[#b48ead]', label: 'PLAN' },
  review: { bg: 'bg-[#d08770]/20', text: 'text-[#d08770]', label: 'REVIEW' },
}

function formatTimeAgo(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export function IssueCard({ issue }: IssueCardProps) {
  const typeStyle = typeConfig[issue.type] || typeConfig.task
  const isOpen = issue.status === 'open'
  const statusColor = isOpen ? '#a3be8c' : '#b48ead'
  
  return (
    <div className="group relative bg-[#252a33] hover:bg-[#2a303a] transition-all border-b border-[#3b4252]/50">
      {/* Left color accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
        style={{ backgroundColor: statusColor }}
      />
      
      <div className="pl-3 pr-2 py-3">
        {/* Top row: Status icon, type badge, number, milestone, time */}
        <div className="flex items-center gap-2 mb-2">
          {/* Status icon with glow effect */}
          <div 
            className="relative flex items-center justify-center w-6 h-6 rounded-full"
            style={{ backgroundColor: `${statusColor}20` }}
          >
            {isOpen ? (
              <VscIssues className="w-3.5 h-3.5" style={{ color: statusColor }} />
            ) : (
              <VscPass className="w-3.5 h-3.5" style={{ color: statusColor }} />
            )}
          </div>
          
          {/* Type badge */}
          <span className={`px-1.5 py-0.5 text-[8px] font-bold tracking-wide rounded ${typeStyle.bg} ${typeStyle.text}`}>
            {typeStyle.label}
          </span>
          
          {/* Issue number */}
          <span className="text-[11px] font-mono text-[#88c0d0]">#{issue.number}</span>
          
          {/* Milestone if exists */}
          {issue.milestone && (
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#5e81ac]/20 rounded">
              <VscMilestone className="w-3 h-3 text-[#5e81ac]" />
              <span className="text-[8px] text-[#5e81ac] font-medium">{issue.milestone}</span>
            </div>
          )}
          
          {/* Time ago - pushed right */}
          <span className="text-[9px] text-muted-foreground ml-auto">{formatTimeAgo(issue.lastActivity)}</span>
        </div>
        
        {/* Title row */}
        <p className="text-[12px] text-foreground font-medium leading-snug mb-2 line-clamp-2">
          {issue.title}
        </p>
        
        {/* Bottom row: Stats and sparkline */}
        <div className="flex items-center gap-3">
          {/* Comment count */}
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
            <VscComment className="w-3.5 h-3.5 text-[#88c0d0]" />
            <span className="font-mono">{issue.commentCount}</span>
          </div>
          
          {/* Reference count */}
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
            <VscReferences className="w-3.5 h-3.5 text-[#d08770]" />
            <span className="font-mono">{issue.referenceCount}</span>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center gap-1">
            <VscCircleFilled className="w-2 h-2" style={{ color: statusColor }} />
            <span className="text-[8px] font-medium" style={{ color: statusColor }}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          
          {/* Sparkline - pushed right */}
          <div className="ml-auto">
            <ActivitySparkline 
              events={issue.activityTimeline} 
              width={60} 
              height={16}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
