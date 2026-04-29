// Activity API - Stub functions for fetching Issues/PRs data
// These return mock data but are structured for easy swap to real API calls

import type {
  Organization,
  Repository,
  Issue,
  PullRequest,
  FetchOptions,
  OrgGroup,
  RepoGroup,
  IssueType,
  PRType,
} from './activity-types'

import {
  mockOrganizations,
  mockRepositories,
  mockIssues,
  mockPullRequests,
  generateMoreIssues,
  generateMorePRs,
} from './mock-data'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Fetch all organizations
 */
export async function fetchOrganizations(): Promise<Organization[]> {
  await delay(100)
  return mockOrganizations
}

/**
 * Fetch repositories for given organization IDs
 */
export async function fetchRepositories(orgIds: string[]): Promise<Repository[]> {
  await delay(50)
  if (orgIds.length === 0) return mockRepositories
  return mockRepositories.filter(repo => orgIds.includes(repo.orgId))
}

/**
 * Fetch issues with pagination and filtering
 */
export async function fetchIssues(
  orgIds: string[],
  options: FetchOptions
): Promise<{ issues: Issue[]; hasMore: boolean }> {
  await delay(150)
  
  const { page, pageSize, types } = options
  
  // Get repos for selected orgs
  const repos = orgIds.length === 0 
    ? mockRepositories 
    : mockRepositories.filter(r => orgIds.includes(r.orgId))
  const repoIds = new Set(repos.map(r => r.id))
  
  // Filter base issues
  let allIssues = mockIssues.filter(issue => repoIds.has(issue.repoId))
  
  // Apply type filter
  if (types && types.length > 0) {
    allIssues = allIssues.filter(issue => types.includes(issue.type))
  }
  
  // Sort by last activity
  allIssues.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
  
  // For page > 0, generate more mock data
  if (page > 0) {
    const generated = generateMoreIssues(page, pageSize)
    // Filter generated to match org/type filters
    const filtered = generated.filter(issue => {
      const matchesRepo = repoIds.has(issue.repoId)
      const matchesType = !types || types.length === 0 || types.includes(issue.type)
      return matchesRepo && matchesType
    })
    return { issues: filtered, hasMore: page < 4 } // Limit to 5 pages
  }
  
  // Page 0: return first pageSize items
  const paged = allIssues.slice(0, pageSize)
  return { issues: paged, hasMore: allIssues.length > pageSize || true }
}

/**
 * Fetch pull requests with pagination and filtering
 */
export async function fetchPRs(
  orgIds: string[],
  options: FetchOptions
): Promise<{ prs: PullRequest[]; hasMore: boolean }> {
  await delay(150)
  
  const { page, pageSize, types } = options
  
  // Get repos for selected orgs
  const repos = orgIds.length === 0 
    ? mockRepositories 
    : mockRepositories.filter(r => orgIds.includes(r.orgId))
  const repoIds = new Set(repos.map(r => r.id))
  
  // Filter base PRs
  let allPRs = mockPullRequests.filter(pr => repoIds.has(pr.repoId))
  
  // Apply type filter
  if (types && types.length > 0) {
    allPRs = allPRs.filter(pr => types.includes(pr.type))
  }
  
  // Sort by last activity
  allPRs.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
  
  // For page > 0, generate more mock data
  if (page > 0) {
    const generated = generateMorePRs(page, pageSize)
    const filtered = generated.filter(pr => {
      const matchesRepo = repoIds.has(pr.repoId)
      const matchesType = !types || types.length === 0 || types.includes(pr.type)
      return matchesRepo && matchesType
    })
    return { prs: filtered, hasMore: page < 4 }
  }
  
  // Page 0: return first pageSize items
  const paged = allPRs.slice(0, pageSize)
  return { prs: paged, hasMore: allPRs.length > pageSize || true }
}

/**
 * Fetch data grouped by organization and repository
 * This is the main function for the tree view
 */
export async function fetchGroupedActivity(
  selectedOrgIds: string[],
  issueTypes: IssueType[],
  prTypes: PRType[],
  issuePages: number,
  prPages: number
): Promise<OrgGroup[]> {
  await delay(200)
  
  // Determine which orgs to include
  const orgs = selectedOrgIds.length === 0 
    ? mockOrganizations 
    : mockOrganizations.filter(o => selectedOrgIds.includes(o.id))
  
  const result: OrgGroup[] = []
  
  for (const org of orgs) {
    const repos = mockRepositories.filter(r => r.orgId === org.id)
    const repoGroups: RepoGroup[] = []
    
    for (const repo of repos) {
      // Get issues for this repo
      let repoIssues = mockIssues.filter(i => i.repoId === repo.id)
      if (issueTypes.length > 0) {
        repoIssues = repoIssues.filter(i => issueTypes.includes(i.type))
      }
      
      // Add generated issues for pagination
      for (let page = 1; page <= issuePages; page++) {
        const generated = generateMoreIssues(page, 5).filter(i => i.repoId === repo.id)
        if (issueTypes.length > 0) {
          repoIssues.push(...generated.filter(i => issueTypes.includes(i.type)))
        } else {
          repoIssues.push(...generated)
        }
      }
      
      // Get PRs for this repo
      let repoPRs = mockPullRequests.filter(p => p.repoId === repo.id)
      if (prTypes.length > 0) {
        repoPRs = repoPRs.filter(p => prTypes.includes(p.type))
      }
      
      // Add generated PRs for pagination
      for (let page = 1; page <= prPages; page++) {
        const generated = generateMorePRs(page, 5).filter(p => p.repoId === repo.id)
        if (prTypes.length > 0) {
          repoPRs.push(...generated.filter(p => prTypes.includes(p.type)))
        } else {
          repoPRs.push(...generated)
        }
      }
      
      // Sort by last activity
      repoIssues.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
      repoPRs.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
      
      // Only include repo if it has issues or PRs
      if (repoIssues.length > 0 || repoPRs.length > 0) {
        repoGroups.push({
          repo,
          issues: repoIssues.slice(0, 5 + issuePages * 25),
          prs: repoPRs.slice(0, 5 + prPages * 25),
        })
      }
    }
    
    if (repoGroups.length > 0) {
      result.push({ org, repos: repoGroups })
    }
  }
  
  return result
}

/**
 * Get unique milestones from issues
 */
export async function fetchMilestones(orgIds: string[]): Promise<string[]> {
  await delay(50)
  
  const repos = orgIds.length === 0 
    ? mockRepositories 
    : mockRepositories.filter(r => orgIds.includes(r.orgId))
  const repoIds = new Set(repos.map(r => r.id))
  
  const milestones = new Set<string>()
  mockIssues
    .filter(i => repoIds.has(i.repoId) && i.milestone)
    .forEach(i => milestones.add(i.milestone!))
  
  return Array.from(milestones).sort()
}
