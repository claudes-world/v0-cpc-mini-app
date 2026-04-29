"use client"

import type { PullRequest } from '@/lib/data/activity-types'
import { ActivitySparkline } from './activity-sparkline'
import { 
  VscGitPullRequest, 
  VscComment, 
  VscGitCommit,
  VscGitMerge,
  VscCircleFilled,
  VscCheck,
  VscChromeClose
} from 'react-icons/vsc'
import { GoGitBranch } from 'react-icons/go'

interface PRCardProps {
  pr: PullRequest
}

// Type badge colors (Nord Aurora palette)
const typeConfig: Record<string, { bg: string; text: string; label: string }> = {
  fix: { bg: 'bg-[#bf616a]/20', text: 'text-[#bf616a]', label: 'FIX' },
  feat: { bg: 'bg-[#a3be8c]/20', text: 'text-[#a3be8c]', label: 'FEAT' },
  chore: { bg: 'bg-[#81a1c1]/20', text: 'text-[#81a1c1]', label: 'CHORE' },
  other: { bg: 'bg-[#4c566a]/40', text: 'text-[#d8dee9]', label: 'OTHER' },
}

// Status config
const statusConfig: Record<string, { icon: typeof VscGitPullRequest; color: string; label: string }> = {
  open: { icon: VscGitPullRequest, color: '#a3be8c', label: 'Open' },
  merged: { icon: VscGitMerge, color: '#b48ead', label: 'Merged' },
  closed: { icon: VscChromeClose, color: '#bf616a', label: 'Closed' },
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

export function PRCard({ pr }: PRCardProps) {
  const typeStyle = typeConfig[pr.type] || typeConfig.other
  const statusStyle = statusConfig[pr.status]
  const StatusIcon = statusStyle.icon
  
  return (
    <div className="group relative bg-[#252a33] hover:bg-[#2a303a] transition-all border-b border-[#3b4252]/50">
      {/* Left color accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
        style={{ backgroundColor: statusStyle.color }}
      />
      
      <div className="pl-3 pr-2 py-3">
        {/* Top row: Status icon, type badge, number, time */}
        <div className="flex items-center gap-2 mb-2">
          {/* Status icon with glow effect */}
          <div 
            className="relative flex items-center justify-center w-6 h-6 rounded-full"
            style={{ backgroundColor: `${statusStyle.color}20` }}
          >
            <StatusIcon className="w-3.5 h-3.5" style={{ color: statusStyle.color }} />
          </div>
          
          {/* Type badge */}
          <span className={`px-1.5 py-0.5 text-[8px] font-bold tracking-wide rounded ${typeStyle.bg} ${typeStyle.text}`}>
            {typeStyle.label}
          </span>
          
          {/* PR number */}
          <span className="text-[11px] font-mono text-[#88c0d0]">#{pr.number}</span>
          
          {/* Branch indicator */}
          <div className="flex items-center gap-0.5 text-[8px] text-muted-foreground">
            <GoGitBranch className="w-3 h-3" />
          </div>
          
          {/* Time ago - pushed right */}
          <span className="text-[9px] text-muted-foreground ml-auto">{formatTimeAgo(pr.lastActivity)}</span>
        </div>
        
        {/* Title row */}
        <p className="text-[12px] text-foreground font-medium leading-snug mb-2 line-clamp-2">
          {pr.title}
        </p>
        
        {/* Bottom row: Stats and sparkline */}
        <div className="flex items-center gap-3">
          {/* Comment count */}
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
            <VscComment className="w-3.5 h-3.5 text-[#88c0d0]" />
            <span className="font-mono">{pr.commentCount}</span>
          </div>
          
          {/* Commit count */}
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
            <VscGitCommit className="w-3.5 h-3.5 text-[#ebcb8b]" />
            <span className="font-mono">{pr.commitCount}</span>
          </div>
          
          {/* Status label for merged/closed */}
          {pr.status !== 'open' && (
            <div className="flex items-center gap-1">
              <VscCircleFilled className="w-2 h-2" style={{ color: statusStyle.color }} />
              <span className="text-[8px] font-medium" style={{ color: statusStyle.color }}>
                {statusStyle.label}
              </span>
            </div>
          )}
          
          {/* Checks indicator */}
          {pr.status === 'open' && (
            <div className="flex items-center gap-0.5">
              <VscCheck className="w-3 h-3 text-[#a3be8c]" />
              <span className="text-[8px] text-[#a3be8c]">Checks</span>
            </div>
          )}
          
          {/* Sparkline - pushed right */}
          <div className="ml-auto">
            <ActivitySparkline 
              events={pr.activityTimeline} 
              width={60} 
              height={16}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
