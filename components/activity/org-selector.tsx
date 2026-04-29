"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useActivity } from './activity-context'
import type { Organization } from '@/lib/data/activity-types'
import { VscOrganization, VscGrabber } from 'react-icons/vsc'
import {
  DndContext,
  closestCenter,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { WebHaptics } from 'web-haptics'

interface OrgSelectorProps {
  organizations: Organization[]
}

interface SortableOrgItemProps {
  org: Organization
  isActive: boolean
  isSelected: boolean
  onToggle: () => void
  isDragActive: boolean
}

function SortableOrgItem({ org, isActive, isSelected, onToggle, isDragActive }: SortableOrgItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: org.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-full flex items-center gap-1 px-1.5 py-1 text-[10px] font-mono text-left transition-colors border-b border-border/30 ${
        isDragging 
          ? 'bg-primary/30 shadow-lg' 
          : isActive 
            ? 'bg-accent/50 text-foreground' 
            : 'text-muted-foreground'
      } ${isDragActive && !isDragging ? 'opacity-60' : ''}`}
    >
      {/* Drag handle - touch target for dragging */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center w-5 h-5 cursor-grab active:cursor-grabbing touch-none"
      >
        <VscGrabber className="w-3 h-3 text-muted-foreground" />
      </div>
      
      {/* Clickable area for selection */}
      <button
        onClick={onToggle}
        className="flex-1 flex items-center gap-1.5 min-w-0"
      >
        <div className={`w-4 h-4 flex items-center justify-center ${
          isActive ? 'bg-primary/20' : 'bg-muted'
        }`}>
          <VscOrganization className={`w-2.5 h-2.5 ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`} />
        </div>
        <span className="truncate">{org.name}</span>
        {isActive && isSelected && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
        )}
      </button>
    </div>
  )
}

export function OrgSelector({ organizations }: OrgSelectorProps) {
  const { state, toggleOrg, setOrgOrder } = useActivity()
  const [isDragActive, setIsDragActive] = useState(false)
  
  // Initialize org order when organizations load
  useEffect(() => {
    if (organizations.length > 0 && state.orgOrder.length === 0) {
      setOrgOrder(organizations.map(o => o.id))
    }
  }, [organizations, state.orgOrder.length, setOrgOrder])
  
  // Get sorted organizations based on custom order
  const sortedOrganizations = useMemo(() => {
    if (state.orgOrder.length === 0) return organizations
    
    const orderMap = new Map(state.orgOrder.map((id, idx) => [id, idx]))
    return [...organizations].sort((a, b) => {
      const aIdx = orderMap.get(a.id) ?? Infinity
      const bIdx = orderMap.get(b.id) ?? Infinity
      return aIdx - bIdx
    })
  }, [organizations, state.orgOrder])
  
  // Configure sensors with delay for hold-to-drag
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  )
  
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setIsDragActive(true)
    WebHaptics.vibrate({ duration: 20, intensity: 0.7 })
  }, [])
  
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setIsDragActive(false)
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = sortedOrganizations.findIndex(o => o.id === active.id)
      const newIndex = sortedOrganizations.findIndex(o => o.id === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(
          sortedOrganizations.map(o => o.id),
          oldIndex,
          newIndex
        )
        setOrgOrder(newOrder)
        WebHaptics.vibrate({ duration: 15, intensity: 0.5 })
      }
    }
  }, [sortedOrganizations, setOrgOrder])
  
  return (
    <div className="h-full flex flex-col bg-secondary/20 border-l border-border">
      <div className="px-1.5 py-1 text-[9px] font-medium text-muted-foreground uppercase tracking-wider border-b border-border/50">
        Organizations
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedOrganizations.map(o => o.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedOrganizations.map((org) => {
              const isActive = state.selectedOrgs.size === 0 || state.selectedOrgs.has(org.id)
              const isSelected = state.selectedOrgs.size > 0
              
              return (
                <SortableOrgItem
                  key={org.id}
                  org={org}
                  isActive={isActive}
                  isSelected={isSelected}
                  onToggle={() => toggleOrg(org.id)}
                  isDragActive={isDragActive}
                />
              )
            })}
          </SortableContext>
        </DndContext>
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
