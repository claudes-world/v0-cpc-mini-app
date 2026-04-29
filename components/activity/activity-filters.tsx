"use client"

import { useActivity } from './activity-context'
import type { IssueType, PRType } from '@/lib/data/activity-types'

interface FilterPillProps {
  label: string
  isActive: boolean
  onClick: () => void
}

function FilterPill({ label, isActive, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-1.5 py-0.5 text-[8px] font-medium rounded transition-colors ${
        isActive 
          ? 'bg-primary/30 text-primary' 
          : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
      }`}
    >
      {label}
    </button>
  )
}

export function PRFilters() {
  const { state, setPRTypes } = useActivity()
  const { types } = state.prFilters
  
  const prTypes: { value: PRType | 'all'; label: string }[] = [
    { value: 'all', label: 'all' },
    { value: 'fix', label: 'fix' },
    { value: 'feat', label: 'feat' },
    { value: 'chore', label: 'chore' },
    { value: 'other', label: 'other' },
  ]
  
  const handleToggle = (value: PRType | 'all') => {
    if (value === 'all') {
      setPRTypes([])
      return
    }
    
    if (types.includes(value)) {
      setPRTypes(types.filter(t => t !== value))
    } else {
      setPRTypes([...types, value])
    }
  }
  
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      {prTypes.map(({ value, label }) => (
        <FilterPill
          key={value}
          label={label}
          isActive={value === 'all' ? types.length === 0 : types.includes(value as PRType)}
          onClick={() => handleToggle(value)}
        />
      ))}
    </div>
  )
}

export function IssueFilters() {
  const { state, setIssueTypes, toggleMilestoneView } = useActivity()
  const { types, milestoneView } = state.issueFilters
  
  const viewModes: { value: 'latest' | 'milestones'; label: string }[] = [
    { value: 'latest', label: 'latest' },
    { value: 'milestones', label: 'milestones' },
  ]
  
  const issueTypes: { value: IssueType | 'all'; label: string }[] = [
    { value: 'all', label: 'all' },
    { value: 'bug', label: 'bug' },
    { value: 'feat', label: 'feat' },
    { value: 'idea', label: 'idea' },
    { value: 'task', label: 'task' },
    { value: 'plan', label: 'plan' },
    { value: 'review', label: 'review' },
  ]
  
  const handleTypeToggle = (value: IssueType | 'all') => {
    if (value === 'all') {
      setIssueTypes([])
      return
    }
    
    if (types.includes(value)) {
      setIssueTypes(types.filter(t => t !== value))
    } else {
      setIssueTypes([...types, value])
    }
  }
  
  return (
    <div className="flex flex-col gap-1 px-2 py-1">
      {/* View mode toggle */}
      <div className="flex items-center gap-1">
        {viewModes.map(({ value, label }) => (
          <FilterPill
            key={value}
            label={label}
            isActive={value === 'latest' ? !milestoneView : milestoneView}
            onClick={toggleMilestoneView}
          />
        ))}
        <span className="text-muted-foreground text-[8px] mx-1">|</span>
        {/* Type filters */}
        {issueTypes.map(({ value, label }) => (
          <FilterPill
            key={value}
            label={label}
            isActive={value === 'all' ? types.length === 0 : types.includes(value as IssueType)}
            onClick={() => handleTypeToggle(value)}
          />
        ))}
      </div>
    </div>
  )
}
