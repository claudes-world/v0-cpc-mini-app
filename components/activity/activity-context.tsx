"use client"

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { ViewMode, IssueType, PRType, IssueFilters, PRFilters } from '@/lib/data/activity-types'

// State shape
interface ActivityState {
  selectedOrgs: Set<string>
  orgOrder: string[] // Manual sort order for orgs
  expandedNodes: Set<string>
  viewMode: ViewMode
  issueFilters: IssueFilters
  prFilters: PRFilters
  issuePages: number
  prPages: number
}

// Action types
type ActivityAction =
  | { type: 'TOGGLE_ORG'; orgId: string }
  | { type: 'SET_SELECTED_ORGS'; orgIds: string[] }
  | { type: 'SET_ORG_ORDER'; orgIds: string[] }
  | { type: 'TOGGLE_NODE'; nodeId: string }
  | { type: 'SET_VIEW_MODE'; mode: ViewMode }
  | { type: 'SET_ISSUE_TYPES'; types: IssueType[] }
  | { type: 'SET_PR_TYPES'; types: PRType[] }
  | { type: 'TOGGLE_MILESTONE_VIEW' }
  | { type: 'LOAD_MORE_ISSUES' }
  | { type: 'LOAD_MORE_PRS' }
  | { type: 'RESET_PAGINATION' }

// Initial state
const initialState: ActivityState = {
  selectedOrgs: new Set<string>(),
  orgOrder: [],
  expandedNodes: new Set<string>(),
  viewMode: 'both',
  issueFilters: {
    types: [],
    milestoneView: false,
  },
  prFilters: {
    types: [],
  },
  issuePages: 0,
  prPages: 0,
}

// Reducer
function activityReducer(state: ActivityState, action: ActivityAction): ActivityState {
  switch (action.type) {
    case 'TOGGLE_ORG': {
      const newSelected = new Set(state.selectedOrgs)
      if (newSelected.has(action.orgId)) {
        newSelected.delete(action.orgId)
      } else {
        newSelected.add(action.orgId)
      }
      return { ...state, selectedOrgs: newSelected, issuePages: 0, prPages: 0 }
    }
    
    case 'SET_SELECTED_ORGS': {
      return { ...state, selectedOrgs: new Set(action.orgIds), issuePages: 0, prPages: 0 }
    }
    
    case 'SET_ORG_ORDER': {
      return { ...state, orgOrder: action.orgIds }
    }
    
    case 'TOGGLE_NODE': {
      const newExpanded = new Set(state.expandedNodes)
      if (newExpanded.has(action.nodeId)) {
        newExpanded.delete(action.nodeId)
      } else {
        newExpanded.add(action.nodeId)
      }
      return { ...state, expandedNodes: newExpanded }
    }
    
    case 'SET_VIEW_MODE': {
      return { ...state, viewMode: action.mode }
    }
    
    case 'SET_ISSUE_TYPES': {
      return {
        ...state,
        issueFilters: { ...state.issueFilters, types: action.types },
        issuePages: 0,
      }
    }
    
    case 'SET_PR_TYPES': {
      return {
        ...state,
        prFilters: { ...state.prFilters, types: action.types },
        prPages: 0,
      }
    }
    
    case 'TOGGLE_MILESTONE_VIEW': {
      return {
        ...state,
        issueFilters: {
          ...state.issueFilters,
          milestoneView: !state.issueFilters.milestoneView,
        },
      }
    }
    
    case 'LOAD_MORE_ISSUES': {
      return { ...state, issuePages: state.issuePages + 1 }
    }
    
    case 'LOAD_MORE_PRS': {
      return { ...state, prPages: state.prPages + 1 }
    }
    
    case 'RESET_PAGINATION': {
      return { ...state, issuePages: 0, prPages: 0 }
    }
    
    default:
      return state
  }
}

// Context
interface ActivityContextValue {
  state: ActivityState
  dispatch: React.Dispatch<ActivityAction>
  // Helper functions
  isOrgSelected: (orgId: string) => boolean
  isNodeExpanded: (nodeId: string) => boolean
  toggleOrg: (orgId: string) => void
  toggleNode: (nodeId: string) => void
  setOrgOrder: (orgIds: string[]) => void
  setViewMode: (mode: ViewMode) => void
  setIssueTypes: (types: IssueType[]) => void
  setPRTypes: (types: PRType[]) => void
  toggleMilestoneView: () => void
  loadMoreIssues: () => void
  loadMorePRs: () => void
}

const ActivityContext = createContext<ActivityContextValue | null>(null)

// Provider
export function ActivityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(activityReducer, initialState)
  
  const value: ActivityContextValue = {
    state,
    dispatch,
    isOrgSelected: (orgId) => state.selectedOrgs.size === 0 || state.selectedOrgs.has(orgId),
    isNodeExpanded: (nodeId) => state.expandedNodes.has(nodeId),
    toggleOrg: (orgId) => dispatch({ type: 'TOGGLE_ORG', orgId }),
    toggleNode: (nodeId) => dispatch({ type: 'TOGGLE_NODE', nodeId }),
    setOrgOrder: (orgIds) => dispatch({ type: 'SET_ORG_ORDER', orgIds }),
    setViewMode: (mode) => dispatch({ type: 'SET_VIEW_MODE', mode }),
    setIssueTypes: (types) => dispatch({ type: 'SET_ISSUE_TYPES', types }),
    setPRTypes: (types) => dispatch({ type: 'SET_PR_TYPES', types }),
    toggleMilestoneView: () => dispatch({ type: 'TOGGLE_MILESTONE_VIEW' }),
    loadMoreIssues: () => dispatch({ type: 'LOAD_MORE_ISSUES' }),
    loadMorePRs: () => dispatch({ type: 'LOAD_MORE_PRS' }),
  }
  
  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  )
}

// Hook
export function useActivity() {
  const context = useContext(ActivityContext)
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider')
  }
  return context
}
