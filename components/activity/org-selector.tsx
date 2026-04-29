"use client"

import { useActivity } from './activity-context'
import type { Organization } from '@/lib/data/activity-types'
import { VscOrganization } from 'react-icons/vsc'

interface OrgSelectorProps {
  organizations: Organization[]
}

interface OrgItemProps {
  org: Organization
  isActive: boolean
  isSelected: boolean
  onToggle: () => void
}

function OrgItem({ org, isActive, isSelected, onToggle }: OrgItemProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-1.5 px-1.5 py-1 text-[10px] font-mono text-left transition-colors border-b border-border/30 ${
        isActive 
          ? 'bg-accent/50 text-foreground' 
          : 'text-muted-foreground'
      }`}
    >
      <div className={`w-4 h-4 flex items-center justify-center ${
        isActive ? 'bg-primary/20' : 'bg-muted'
      }`}>
        <VscOrganization className={`w-2.5 h-2.5 ${
          isActive ? 'text-primary' : 'text-muted-foreground'
        }`} />
      </div>
      <span className="truncate flex-1">{org.name}</span>
      {isActive && isSelected && (
        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
      )}
    </button>
  )
}

export function OrgSelector({ organizations }: OrgSelectorProps) {
  const { state, toggleOrg } = useActivity()
  
  return (
    <div className="h-full flex flex-col bg-secondary/20 border-l border-border">
      <div className="px-1.5 py-1 text-[9px] font-medium text-muted-foreground uppercase tracking-wider border-b border-border/50">
        Organizations
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {organizations.map((org) => {
          const isActive = state.selectedOrgs.size === 0 || state.selectedOrgs.has(org.id)
          const isSelected = state.selectedOrgs.size > 0
          
          return (
            <OrgItem
              key={org.id}
              org={org}
              isActive={isActive}
              isSelected={isSelected}
              onToggle={() => toggleOrg(org.id)}
            />
          )
        })}
      </div>
      
      {state.selectedOrgs.size > 0 && (
        <button
          onClick={() => {
            state.selectedOrgs.forEach(id => toggleOrg(id))
          }}
          className="px-1.5 py-1 text-[9px] text-muted-foreground hover:text-foreground border-t border-border/50 transition-colors"
        >
          Clear filters ({state.selectedOrgs.size})
        </button>
      )}
    </div>
  )
}
