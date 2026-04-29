// Activity Types - TypeScript interfaces for Issues/PRs unified view

export interface Organization {
  id: string
  name: string
  avatarUrl?: string
}

export interface Repository {
  id: string
  orgId: string
  name: string
  fullName: string // "org/repo"
}

export type IssueType = 'bug' | 'feat' | 'idea' | 'task' | 'plan' | 'review'
export type IssueStatus = 'open' | 'closed'

export interface Issue {
  id: string
  number: number
  repoId: string
  title: string
  type: IssueType
  status: IssueStatus
  milestone?: string
  lastActivity: Date
  commentCount: number
  referenceCount: number
  activityTimeline: ActivityEvent[]
}

export type PRType = 'fix' | 'feat' | 'chore' | 'other'
export type PRStatus = 'open' | 'merged' | 'closed'

export interface PullRequest {
  id: string
  number: number
  repoId: string
  title: string
  type: PRType
  status: PRStatus
  lastActivity: Date
  commentCount: number
  commitCount: number
  activityTimeline: ActivityEvent[]
}

export type ActivityEventType = 'comment' | 'commit' | 'reference'

export interface ActivityEvent {
  timestamp: Date
  type: ActivityEventType
}

export interface FetchOptions {
  page: number
  pageSize: number
  types?: string[]
  milestoneView?: boolean
}

// Grouped data structures for tree view
export interface RepoGroup {
  repo: Repository
  issues: Issue[]
  prs: PullRequest[]
}

export interface OrgGroup {
  org: Organization
  repos: RepoGroup[]
}

// Filter state types
export interface IssueFilters {
  types: IssueType[]
  milestoneView: boolean
}

export interface PRFilters {
  types: PRType[]
}

export type ViewMode = 'issues' | 'prs' | 'both'
