"use client"

import type { PullRequest } from '@/lib/data/activity-types'
import { ActivitySparkline } from './activity-sparkline'
import { FileIcon } from '../file-icon'
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

// Get just the filename from a path
function getFilename(path: string): string {
  return path.split('/').pop() || path
}

export function PRCard({ pr }: PRCardProps) {
  const typeStyle = typeConfig[pr.type] || typeConfig.other
  const statusStyle = statusConfig[pr.status]
  const StatusIcon = statusStyle.icon
  
  // Show up to 4 file icons
  const filesToShow = pr.changedFiles?.slice(0, 4) || []
  const moreFilesCount = (pr.changedFiles?.length || 0) - 4
  
  return (
    <div className="group relative bg-[#252a33] hover:bg-[#2a303a] transition-all border-b border-[#3b4252]/50">
      {/* Left color accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: statusStyle.color }}
      />
      
      <div className="pl-2.5 pr-2 py-1.5">
        {/* Top row: Number first, type badge, branch, time */}
        <div className="flex items-center gap-1.5 mb-1">
          {/* PR number - FIRST and larger */}
          <span className="text-[13px] font-mono font-semibold text-[#88c0d0]">#{pr.number}</span>
          
          {/* Type badge */}
          <span className={`px-1 py-0.5 text-[7px] font-bold tracking-wide ${typeStyle.bg} ${typeStyle.text}`}>
            {typeStyle.label}
          </span>
          
          {/* Branch indicator */}
          <div className="flex items-center gap-0.5 text-[8px] text-muted-foreground">
            <GoGitBranch className="w-3 h-3" />
          </div>
          
          {/* Time ago - pushed right */}
          <span className="text-[9px] text-muted-foreground ml-auto">{formatTimeAgo(pr.lastActivity)}</span>
        </div>
        
        {/* Second row: Status icon first, then title */}
        <div className="flex items-start gap-1.5 mb-1">
          {/* Status icon */}
          <div 
            className="relative flex items-center justify-center w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ backgroundColor: `${statusStyle.color}20` }}
          >
            <StatusIcon className="w-3 h-3" style={{ color: statusStyle.color }} />
          </div>
          
          {/* Title */}
          <p className="text-[11px] text-foreground font-medium leading-snug line-clamp-2">
            {pr.title}
          </p>
        </div>
        
        {/* File icons row - if there are changed files */}
        {filesToShow.length > 0 && (
          <div className="flex items-center gap-1 mb-1 ml-6">
            {filesToShow.map((file, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-0.5 group/file"
                title={`${file.filename} (+${file.additions} -${file.deletions})`}
              >
                <FileIcon filename={getFilename(file.filename)} size={12} />
              </div>
            ))}
            {moreFilesCount > 0 && (
              <span className="text-[8px] text-muted-foreground">+{moreFilesCount}</span>
            )}
          </div>
        )}
        
        {/* Bottom row: Stats and sparkline */}
        <div className="flex items-center gap-2">
          {/* Comment count */}
          <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
            <VscComment className="w-3 h-3 text-[#88c0d0]" />
            <span className="font-mono">{pr.commentCount}</span>
          </div>
          
          {/* Commit count */}
          <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
            <VscGitCommit className="w-3 h-3 text-[#ebcb8b]" />
            <span className="font-mono">{pr.commitCount}</span>
          </div>
          
          {/* Status label for merged/closed */}
          {pr.status !== 'open' && (
            <div className="flex items-center gap-0.5">
              <VscCircleFilled className="w-1.5 h-1.5" style={{ color: statusStyle.color }} />
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
              width={50} 
              height={14}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
