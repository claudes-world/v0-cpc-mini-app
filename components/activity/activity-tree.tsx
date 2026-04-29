"use client"

import { useMemo } from 'react'
import { useActivity } from './activity-context'
import { PRFilters, IssueFilters } from './activity-filters'
import { IssueCard } from './issue-card'
import { PRCard } from './pr-card'
import type { OrgGroup } from '@/lib/data/activity-types'
import { 
  VscChevronDown, 
  VscChevronRight, 
  VscRepo, 
  VscOrganization, 
  VscGitPullRequest, 
  VscIssues,
  VscGitMerge
} from 'react-icons/vsc'

interface ActivityTreeProps {
  data: OrgGroup[]
  isLoading?: boolean
}

// Org header - darkest with light text, compact, sticky
function OrgHeader({ 
  nodeId, 
  name, 
  count, 
  children 
}: { 
  nodeId: string
  name: string
  count: number
  children?: React.ReactNode 
}) {
  const { isNodeExpanded, toggleNode } = useActivity()
  const expanded = isNodeExpanded(nodeId)
  
  return (
    <div>
      <button
        onClick={() => toggleNode(nodeId)}
        className="sticky top-0 z-20 w-full flex items-center gap-2 px-2 py-1.5 text-left bg-[#1a1e24] hover:bg-[#1e2228] transition-colors border-b border-[#2a2f38]"
      >
        {expanded ? (
          <VscChevronDown className="w-3 h-3 text-[#88c0d0] flex-shrink-0" />
        ) : (
          <VscChevronRight className="w-3 h-3 text-[#88c0d0] flex-shrink-0" />
        )}
        <VscOrganization className="w-3.5 h-3.5 text-[#88c0d0] flex-shrink-0" />
        <span className="text-[11px] font-semibold text-[#eceff4] truncate">{name}</span>
        <span className="text-[9px] text-[#81a1c1] ml-auto tabular-nums">{count}</span>
      </button>
      {expanded && children}
    </div>
  )
}

// Repo header - dark nord frost with light text, no rounded corners, sticky below org
function RepoHeader({ 
  nodeId, 
  name, 
  count, 
  children 
}: { 
  nodeId: string
  name: string
  count: number
  children?: React.ReactNode 
}) {
  const { isNodeExpanded, toggleNode } = useActivity()
  const expanded = isNodeExpanded(nodeId)
  
  // Sticky with top offset to stack below org header (org header is ~28px)
  return (
    <div className="ml-1">
      <button
        onClick={() => toggleNode(nodeId)}
        className="sticky top-[28px] z-10 w-full flex items-center gap-2 px-2 py-1.5 text-left bg-[#2e3440] hover:bg-[#3b4252] transition-colors border-b border-[#434c5e]"
      >
        {expanded ? (
          <VscChevronDown className="w-3 h-3 text-[#81a1c1] flex-shrink-0" />
        ) : (
          <VscChevronRight className="w-3 h-3 text-[#81a1c1] flex-shrink-0" />
        )}
        <VscRepo className="w-3.5 h-3.5 text-[#81a1c1] flex-shrink-0" />
        <span className="text-[10px] font-medium text-[#d8dee9] truncate">{name}</span>
        <div className="flex items-center gap-1 ml-auto">
          <VscGitMerge className="w-3 h-3 text-[#5e81ac]" />
          <span className="text-[9px] text-[#88c0d0] tabular-nums">{count}</span>
        </div>
      </button>
      {expanded && <div>{children}</div>}
    </div>
  )
}

// PR/Issue section header - 50% taller than org headers
function SectionHeader({ 
  nodeId, 
  type,
  count, 
  children 
}: { 
  nodeId: string
  type: 'prs' | 'issues'
  count: number
  children?: React.ReactNode 
}) {
  const { isNodeExpanded, toggleNode } = useActivity()
  const expanded = isNodeExpanded(nodeId)
  
  const isPR = type === 'prs'
  const Icon = isPR ? VscGitPullRequest : VscIssues
  const color = isPR ? '#b48ead' : '#a3be8c'
  const label = isPR ? 'Pull Requests' : 'Issues'
  
  return (
    <div className="ml-2">
      <button
        onClick={() => toggleNode(nodeId)}
        className="w-full flex items-center gap-2 px-2 py-2 text-left bg-[#252a33] hover:bg-[#2a303a] transition-colors border-l-2"
        style={{ borderLeftColor: color }}
      >
        {expanded ? (
          <VscChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        ) : (
          <VscChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        )}
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
        <span className="text-[11px] font-medium text-foreground">{label}</span>
        <span 
          className="text-[10px] font-semibold ml-auto px-1.5 py-0.5 rounded"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {count}
        </span>
      </button>
      {expanded && <div className="mt-0.5">{children}</div>}
    </div>
  )
}

export function ActivityTree({ data, isLoading }: ActivityTreeProps) {
  const { state, loadMoreIssues, loadMorePRs } = useActivity()
  const { viewMode, orgOrder } = state
  
  // Sort data based on org order from right column
  const sortedData = useMemo(() => {
    if (orgOrder.length === 0) return data
    
    const orderMap = new Map(orgOrder.map((id, idx) => [id, idx]))
    return [...data].sort((a, b) => {
      const aIdx = orderMap.get(a.org.id) ?? Infinity
      const bIdx = orderMap.get(b.org.id) ?? Infinity
      return aIdx - bIdx
    })
  }, [data, orgOrder])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-[10px] text-muted-foreground">
        Loading...
      </div>
    )
  }
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[10px] text-muted-foreground">
        No activity found
      </div>
    )
  }
  
  const showIssues = viewMode === 'issues' || viewMode === 'both'
  const showPRs = viewMode === 'prs' || viewMode === 'both'
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {sortedData.map((orgGroup) => (
          <OrgHeader
            key={orgGroup.org.id}
            nodeId={`org-${orgGroup.org.id}`}
            name={orgGroup.org.name}
            count={orgGroup.repos.reduce((sum, r) => sum + r.issues.length + r.prs.length, 0)}
          >
            {orgGroup.repos.map((repoGroup) => (
              <RepoHeader
                key={repoGroup.repo.id}
                nodeId={`repo-${repoGroup.repo.id}`}
                name={repoGroup.repo.name}
                count={repoGroup.issues.length + repoGroup.prs.length}
              >
                {/* PRs Section */}
                {showPRs && repoGroup.prs.length > 0 && (
                  <SectionHeader
                    nodeId={`prs-${repoGroup.repo.id}`}
                    type="prs"
                    count={repoGroup.prs.length}
                  >
                    <div className="ml-3 border-l border-[#b48ead]/30">
                      <PRFilters />
                      <div>
                        {repoGroup.prs.map((pr) => (
                          <PRCard key={pr.id} pr={pr} />
                        ))}
                      </div>
                    </div>
                  </SectionHeader>
                )}
                
                {/* Issues Section */}
                {showIssues && repoGroup.issues.length > 0 && (
                  <SectionHeader
                    nodeId={`issues-${repoGroup.repo.id}`}
                    type="issues"
                    count={repoGroup.issues.length}
                  >
                    <div className="ml-3 border-l border-[#a3be8c]/30">
                      <IssueFilters />
                      <div>
                        {repoGroup.issues.map((issue) => (
                          <IssueCard key={issue.id} issue={issue} />
                        ))}
                      </div>
                    </div>
                  </SectionHeader>
                )}
              </RepoHeader>
            ))}
          </OrgHeader>
        ))}
      </div>
      
      {/* Load more buttons */}
      <div className="flex gap-1 p-1.5 border-t border-border/50 bg-[#1a1e24]">
        {showIssues && (
          <button
            onClick={loadMoreIssues}
            className="flex-1 py-1.5 text-[9px] font-medium text-[#a3be8c] bg-[#a3be8c]/10 hover:bg-[#a3be8c]/20 rounded transition-colors"
          >
            Load more issues (+25)
          </button>
        )}
        {showPRs && (
          <button
            onClick={loadMorePRs}
            className="flex-1 py-1.5 text-[9px] font-medium text-[#b48ead] bg-[#b48ead]/10 hover:bg-[#b48ead]/20 rounded transition-colors"
          >
            Load more PRs (+25)
          </button>
        )}
      </div>
    </div>
  )
}
