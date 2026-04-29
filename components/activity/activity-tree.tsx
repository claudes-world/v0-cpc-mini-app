"use client"

import { useActivity } from './activity-context'
import { PRFilters, IssueFilters } from './activity-filters'
import { IssueCard } from './issue-card'
import { PRCard } from './pr-card'
import type { OrgGroup } from '@/lib/data/activity-types'
import { VscChevronDown, VscChevronRight, VscRepo, VscOrganization, VscGitPullRequest, VscIssues } from 'react-icons/vsc'

interface ActivityTreeProps {
  data: OrgGroup[]
  isLoading?: boolean
}

interface CollapsibleHeaderProps {
  nodeId: string
  icon: React.ReactNode
  label: string
  count?: number
  depth: number
  children?: React.ReactNode
}

function CollapsibleHeader({ nodeId, icon, label, count, depth, children }: CollapsibleHeaderProps) {
  const { isNodeExpanded, toggleNode } = useActivity()
  const expanded = isNodeExpanded(nodeId)
  
  const paddingLeft = depth * 8
  
  return (
    <div>
      <button
        onClick={() => toggleNode(nodeId)}
        className="w-full flex items-center gap-1 px-1 py-0.5 text-left hover:bg-accent/30 transition-colors"
        style={{ paddingLeft: `${paddingLeft + 4}px` }}
      >
        {expanded ? (
          <VscChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        ) : (
          <VscChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        )}
        {icon}
        <span className="text-[10px] font-medium text-foreground truncate">{label}</span>
        {count !== undefined && (
          <span className="text-[8px] text-muted-foreground ml-auto pr-1">({count})</span>
        )}
      </button>
      {expanded && children}
    </div>
  )
}

export function ActivityTree({ data, isLoading }: ActivityTreeProps) {
  const { state, loadMoreIssues, loadMorePRs } = useActivity()
  const { viewMode } = state
  
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
        {data.map((orgGroup) => (
          <CollapsibleHeader
            key={orgGroup.org.id}
            nodeId={`org-${orgGroup.org.id}`}
            icon={<VscOrganization className="w-3 h-3 text-primary flex-shrink-0" />}
            label={orgGroup.org.name}
            count={orgGroup.repos.reduce((sum, r) => sum + r.issues.length + r.prs.length, 0)}
            depth={0}
          >
            {orgGroup.repos.map((repoGroup) => (
              <CollapsibleHeader
                key={repoGroup.repo.id}
                nodeId={`repo-${repoGroup.repo.id}`}
                icon={<VscRepo className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                label={repoGroup.repo.name}
                count={repoGroup.issues.length + repoGroup.prs.length}
                depth={1}
              >
                {/* PRs Section */}
                {showPRs && repoGroup.prs.length > 0 && (
                  <CollapsibleHeader
                    nodeId={`prs-${repoGroup.repo.id}`}
                    icon={<VscGitPullRequest className="w-3 h-3 text-[#b48ead] flex-shrink-0" />}
                    label="Pull Requests"
                    count={repoGroup.prs.length}
                    depth={2}
                  >
                    <div style={{ paddingLeft: '32px' }}>
                      <PRFilters />
                      {repoGroup.prs.map((pr) => (
                        <PRCard key={pr.id} pr={pr} />
                      ))}
                    </div>
                  </CollapsibleHeader>
                )}
                
                {/* Issues Section */}
                {showIssues && repoGroup.issues.length > 0 && (
                  <CollapsibleHeader
                    nodeId={`issues-${repoGroup.repo.id}`}
                    icon={<VscIssues className="w-3 h-3 text-[#a3be8c] flex-shrink-0" />}
                    label="Issues"
                    count={repoGroup.issues.length}
                    depth={2}
                  >
                    <div style={{ paddingLeft: '32px' }}>
                      <IssueFilters />
                      {repoGroup.issues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} />
                      ))}
                    </div>
                  </CollapsibleHeader>
                )}
              </CollapsibleHeader>
            ))}
          </CollapsibleHeader>
        ))}
      </div>
      
      {/* Load more buttons */}
      <div className="flex gap-1 p-1 border-t border-border/50 bg-secondary/20">
        {showIssues && (
          <button
            onClick={loadMoreIssues}
            className="flex-1 py-1 text-[8px] text-muted-foreground hover:text-foreground hover:bg-accent/30 rounded transition-colors"
          >
            Load more issues (+25)
          </button>
        )}
        {showPRs && (
          <button
            onClick={loadMorePRs}
            className="flex-1 py-1 text-[8px] text-muted-foreground hover:text-foreground hover:bg-accent/30 rounded transition-colors"
          >
            Load more PRs (+25)
          </button>
        )}
      </div>
    </div>
  )
}
