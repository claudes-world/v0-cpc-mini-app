// Mock data generators for Activity view

import type {
  Organization,
  Repository,
  Issue,
  PullRequest,
  ActivityEvent,
  IssueType,
  PRType,
} from './activity-types'

// Helper to generate random activity timeline
function generateActivityTimeline(count: number, daysBack: number = 14): ActivityEvent[] {
  const events: ActivityEvent[] = []
  const now = Date.now()
  const types: ActivityEvent['type'][] = ['comment', 'commit', 'reference']
  
  for (let i = 0; i < count; i++) {
    events.push({
      timestamp: new Date(now - Math.random() * daysBack * 24 * 60 * 60 * 1000),
      type: types[Math.floor(Math.random() * types.length)],
    })
  }
  
  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

// Mock Organizations
export const mockOrganizations: Organization[] = [
  { id: 'org-1', name: 'vercel', avatarUrl: undefined },
  { id: 'org-2', name: 'shadcn-ui', avatarUrl: undefined },
  { id: 'org-3', name: 'tailwindlabs', avatarUrl: undefined },
  { id: 'org-4', name: 'facebook', avatarUrl: undefined },
]

// Mock Repositories
export const mockRepositories: Repository[] = [
  { id: 'repo-1', orgId: 'org-1', name: 'next.js', fullName: 'vercel/next.js' },
  { id: 'repo-2', orgId: 'org-1', name: 'v0', fullName: 'vercel/v0' },
  { id: 'repo-3', orgId: 'org-1', name: 'ai', fullName: 'vercel/ai' },
  { id: 'repo-4', orgId: 'org-2', name: 'ui', fullName: 'shadcn-ui/ui' },
  { id: 'repo-5', orgId: 'org-2', name: 'taxonomy', fullName: 'shadcn-ui/taxonomy' },
  { id: 'repo-6', orgId: 'org-3', name: 'tailwindcss', fullName: 'tailwindlabs/tailwindcss' },
  { id: 'repo-7', orgId: 'org-4', name: 'react', fullName: 'facebook/react' },
]

// Issue type labels for mock generation
const issueTypes: IssueType[] = ['bug', 'feat', 'idea', 'task', 'plan', 'review']
const milestones = ['v1.0', 'v1.1', 'v2.0', 'Backlog', undefined]

// PR type labels
const prTypes: PRType[] = ['fix', 'feat', 'chore', 'other']

// Mock Issues
export const mockIssues: Issue[] = [
  {
    id: 'issue-1',
    number: 4521,
    repoId: 'repo-1',
    title: 'App Router: Parallel routes not working with intercepting routes',
    type: 'bug',
    status: 'open',
    milestone: 'v15.1',
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    commentCount: 12,
    referenceCount: 3,
    activityTimeline: generateActivityTimeline(15),
  },
  {
    id: 'issue-2',
    number: 4520,
    repoId: 'repo-1',
    title: 'Feature request: Built-in i18n routing improvements',
    type: 'feat',
    status: 'open',
    milestone: 'v16.0',
    lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000),
    commentCount: 8,
    referenceCount: 1,
    activityTimeline: generateActivityTimeline(9),
  },
  {
    id: 'issue-3',
    number: 234,
    repoId: 'repo-2',
    title: 'Claude API integration timeout on large prompts',
    type: 'bug',
    status: 'open',
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
    commentCount: 5,
    referenceCount: 2,
    activityTimeline: generateActivityTimeline(7),
  },
  {
    id: 'issue-4',
    number: 892,
    repoId: 'repo-3',
    title: 'Add streaming support for tool calls',
    type: 'feat',
    status: 'open',
    milestone: 'v4.0',
    lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000),
    commentCount: 23,
    referenceCount: 8,
    activityTimeline: generateActivityTimeline(31),
  },
  {
    id: 'issue-5',
    number: 1456,
    repoId: 'repo-4',
    title: 'Dialog component accessibility improvements',
    type: 'task',
    status: 'open',
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
    commentCount: 4,
    referenceCount: 0,
    activityTimeline: generateActivityTimeline(4),
  },
  {
    id: 'issue-6',
    number: 1455,
    repoId: 'repo-4',
    title: 'Plan: New date picker component design',
    type: 'plan',
    status: 'open',
    milestone: 'v3.0',
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
    commentCount: 15,
    referenceCount: 4,
    activityTimeline: generateActivityTimeline(19),
  },
  {
    id: 'issue-7',
    number: 8923,
    repoId: 'repo-6',
    title: 'Review: Container query syntax proposal',
    type: 'review',
    status: 'open',
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000),
    commentCount: 42,
    referenceCount: 12,
    activityTimeline: generateActivityTimeline(54),
  },
  {
    id: 'issue-8',
    number: 29012,
    repoId: 'repo-7',
    title: 'Idea: Simplified concurrent mode API',
    type: 'idea',
    status: 'open',
    lastActivity: new Date(Date.now() - 48 * 60 * 60 * 1000),
    commentCount: 67,
    referenceCount: 23,
    activityTimeline: generateActivityTimeline(90),
  },
]

// Mock Pull Requests
export const mockPullRequests: PullRequest[] = [
  {
    id: 'pr-1',
    number: 4530,
    repoId: 'repo-1',
    title: 'fix: resolve hydration mismatch in app router',
    type: 'fix',
    status: 'open',
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    commentCount: 3,
    commitCount: 5,
    activityTimeline: generateActivityTimeline(8),
  },
  {
    id: 'pr-2',
    number: 4529,
    repoId: 'repo-1',
    title: 'feat: add experimental PPR support for dynamic routes',
    type: 'feat',
    status: 'open',
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    commentCount: 15,
    commitCount: 12,
    activityTimeline: generateActivityTimeline(27),
  },
  {
    id: 'pr-3',
    number: 4528,
    repoId: 'repo-1',
    title: 'chore: update dependencies and fix lint warnings',
    type: 'chore',
    status: 'merged',
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
    commentCount: 1,
    commitCount: 2,
    activityTimeline: generateActivityTimeline(3),
  },
  {
    id: 'pr-4',
    number: 241,
    repoId: 'repo-2',
    title: 'feat: implement context-aware code suggestions',
    type: 'feat',
    status: 'open',
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
    commentCount: 8,
    commitCount: 18,
    activityTimeline: generateActivityTimeline(26),
  },
  {
    id: 'pr-5',
    number: 899,
    repoId: 'repo-3',
    title: 'fix: memory leak in streaming response handler',
    type: 'fix',
    status: 'open',
    lastActivity: new Date(Date.now() - 8 * 60 * 60 * 1000),
    commentCount: 6,
    commitCount: 4,
    activityTimeline: generateActivityTimeline(10),
  },
  {
    id: 'pr-6',
    number: 1462,
    repoId: 'repo-4',
    title: 'feat: add new Sidebar component',
    type: 'feat',
    status: 'open',
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
    commentCount: 21,
    commitCount: 15,
    activityTimeline: generateActivityTimeline(36),
  },
  {
    id: 'pr-7',
    number: 8930,
    repoId: 'repo-6',
    title: 'feat: implement @starting-style support',
    type: 'feat',
    status: 'open',
    lastActivity: new Date(Date.now() - 10 * 60 * 60 * 1000),
    commentCount: 34,
    commitCount: 28,
    activityTimeline: generateActivityTimeline(62),
  },
  {
    id: 'pr-8',
    number: 29045,
    repoId: 'repo-7',
    title: 'refactor: simplify scheduler internals',
    type: 'other',
    status: 'open',
    lastActivity: new Date(Date.now() - 16 * 60 * 60 * 1000),
    commentCount: 45,
    commitCount: 32,
    activityTimeline: generateActivityTimeline(77),
  },
]

// Generator functions for pagination
export function generateMoreIssues(page: number, pageSize: number = 25): Issue[] {
  const issues: Issue[] = []
  const startIndex = page * pageSize
  
  for (let i = 0; i < pageSize; i++) {
    const repoIndex = Math.floor(Math.random() * mockRepositories.length)
    const typeIndex = Math.floor(Math.random() * issueTypes.length)
    const milestoneIndex = Math.floor(Math.random() * milestones.length)
    
    issues.push({
      id: `issue-gen-${startIndex + i}`,
      number: 1000 + startIndex + i,
      repoId: mockRepositories[repoIndex].id,
      title: `Generated issue ${startIndex + i}: ${issueTypes[typeIndex]} task`,
      type: issueTypes[typeIndex],
      status: Math.random() > 0.2 ? 'open' : 'closed',
      milestone: milestones[milestoneIndex],
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      commentCount: Math.floor(Math.random() * 20),
      referenceCount: Math.floor(Math.random() * 10),
      activityTimeline: generateActivityTimeline(Math.floor(Math.random() * 30) + 5),
    })
  }
  
  return issues
}

export function generateMorePRs(page: number, pageSize: number = 25): PullRequest[] {
  const prs: PullRequest[] = []
  const startIndex = page * pageSize
  
  for (let i = 0; i < pageSize; i++) {
    const repoIndex = Math.floor(Math.random() * mockRepositories.length)
    const typeIndex = Math.floor(Math.random() * prTypes.length)
    const statusRoll = Math.random()
    
    prs.push({
      id: `pr-gen-${startIndex + i}`,
      number: 5000 + startIndex + i,
      repoId: mockRepositories[repoIndex].id,
      title: `${prTypes[typeIndex]}: generated PR ${startIndex + i}`,
      type: prTypes[typeIndex],
      status: statusRoll > 0.7 ? 'merged' : statusRoll > 0.1 ? 'open' : 'closed',
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      commentCount: Math.floor(Math.random() * 15),
      commitCount: Math.floor(Math.random() * 25) + 1,
      activityTimeline: generateActivityTimeline(Math.floor(Math.random() * 40) + 5),
    })
  }
  
  return prs
}
