"use client"

import { useEffect, useState } from 'react'
import { ActivityProvider, useActivity } from './activity-context'
import { OrgSelector } from './org-selector'
import { ActivityTree } from './activity-tree'
import type { Organization, OrgGroup } from '@/lib/data/activity-types'
import { fetchOrganizations, fetchGroupedActivity } from '@/lib/data/activity-api'
import { VscIssues, VscGitPullRequest, VscListFlat } from 'react-icons/vsc'

function ViewModeToggle() {
  const { state, setViewMode } = useActivity()
  const { viewMode } = state
  
  return (
    <div className="flex items-center gap-0.5 p-1 bg-secondary/30 border-b border-border/50">
      <button
        onClick={() => setViewMode('issues')}
        className={`flex items-center gap-1 px-2 py-0.5 text-[9px] rounded transition-colors ${
          viewMode === 'issues' 
            ? 'bg-primary/20 text-primary' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <VscIssues className="w-3 h-3" />
        Issues
      </button>
      <button
        onClick={() => setViewMode('prs')}
        className={`flex items-center gap-1 px-2 py-0.5 text-[9px] rounded transition-colors ${
          viewMode === 'prs' 
            ? 'bg-primary/20 text-primary' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <VscGitPullRequest className="w-3 h-3" />
        PRs
      </button>
      <button
        onClick={() => setViewMode('both')}
        className={`flex items-center gap-1 px-2 py-0.5 text-[9px] rounded transition-colors ${
          viewMode === 'both' 
            ? 'bg-primary/20 text-primary' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <VscListFlat className="w-3 h-3" />
        Both
      </button>
    </div>
  )
}

function ActivityPageContent() {
  const { state } = useActivity()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [activityData, setActivityData] = useState<OrgGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch organizations on mount
  useEffect(() => {
    fetchOrganizations().then(setOrganizations)
  }, [])
  
  // Fetch grouped activity when filters change
  useEffect(() => {
    setIsLoading(true)
    
    const selectedOrgIds = Array.from(state.selectedOrgs)
    const issueTypes = state.issueFilters.types
    const prTypes = state.prFilters.types
    
    fetchGroupedActivity(
      selectedOrgIds,
      issueTypes,
      prTypes,
      state.issuePages,
      state.prPages
    ).then((data) => {
      setActivityData(data)
      setIsLoading(false)
    })
  }, [
    state.selectedOrgs,
    state.issueFilters.types,
    state.prFilters.types,
    state.issuePages,
    state.prPages,
  ])
  
  return (
    <div className="h-full flex flex-col">
      {/* View mode toggle header */}
      <ViewModeToggle />
      
      {/* Main content: 2/3 tree + 1/3 org selector */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Activity tree */}
        <div className="w-2/3 flex flex-col min-h-0">
          <ActivityTree data={activityData} isLoading={isLoading} />
        </div>
        
        {/* Right: Org selector */}
        <div className="w-1/3">
          <OrgSelector organizations={organizations} />
        </div>
      </div>
    </div>
  )
}

export function ActivityPage() {
  return (
    <ActivityProvider>
      <ActivityPageContent />
    </ActivityProvider>
  )
}
