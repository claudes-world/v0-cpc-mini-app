export const AGENTS_MD_CONTENT = `# AGENTS.md

This file provides guidance to AI coding agents working on this repository.

## Overview

This repository contains a mobile-first application built with Next.js 16, React 19, and TailwindCSS 4. The app simulates a code editor interface optimized for touch devices with swipe navigation and haptic feedback.

## Architecture

### Directory Structure

- \`/app\` - Next.js App Router pages and layouts
- \`/components\` - React components organized by feature
- \`/components/ui\` - Reusable UI primitives (shadcn/ui)
- \`/lib\` - Utilities, hooks, and data
- \`/public\` - Static assets

### Key Technologies

- **Next.js 16** - App Router with Turbopack
- **React 19** - Latest React features including Activity components
- **TailwindCSS 4** - CSS-in-JS with \`@theme\` directive
- **Radix UI** - Accessible component primitives
- **web-haptics** - Touch feedback for mobile interactions

## Coding Standards

### TypeScript

Always use strict TypeScript. Prefer explicit types over inference for function parameters and return values.

\`\`\`typescript
// Good
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// Avoid
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}
\`\`\`

### Component Patterns

Use functional components with hooks. Prefer composition over inheritance.

\`\`\`tsx
// Component structure
export function MyComponent({ title, children }: MyComponentProps) {
  const [state, setState] = useState<string>('')
  
  return (
    <div className="flex flex-col gap-4">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
\`\`\`

### Styling

Use Tailwind utility classes exclusively. Reference design tokens from \`globals.css\`.

## Testing Guidelines

### Unit Tests

Write unit tests for utility functions and hooks using Vitest.

### Integration Tests

Test user flows with Playwright for critical paths like authentication and checkout.

## Git Workflow

### Branch Naming

- \`feat/\` - New features
- \`fix/\` - Bug fixes
- \`chore/\` - Maintenance tasks
- \`docs/\` - Documentation updates

### Commit Messages

Follow conventional commits format:

\`\`\`
feat(auth): add OAuth provider support
fix(ui): resolve button hover state
chore(deps): update dependencies
\`\`\`

## Performance Considerations

### Bundle Size

- Use dynamic imports for heavy components
- Prefer server components where possible
- Lazy load below-the-fold content

### Runtime Performance

- Memoize expensive calculations with \`useMemo\`
- Use \`useCallback\` for event handlers passed to children
- Implement virtual scrolling for long lists

## Security

### Input Validation

Always validate user input on both client and server. Use Zod for schema validation.

### Authentication

- Never store sensitive tokens in localStorage
- Use HTTP-only cookies for session management
- Implement CSRF protection for mutations

## Accessibility

### Requirements

- All interactive elements must be keyboard accessible
- Provide ARIA labels for screen readers
- Maintain color contrast ratios (WCAG AA)
- Support reduced motion preferences

## Deployment

### Environment Variables

Required variables:
- \`DATABASE_URL\` - Database connection string
- \`NEXTAUTH_SECRET\` - Auth encryption key
- \`NEXTAUTH_URL\` - Canonical URL for auth

### Build Commands

\`\`\`bash
pnpm install
pnpm build
pnpm start
\`\`\`
`

export const AGENTS_MD_PATH = '/project/AGENTS.md'

export const CLAUDE_MD_CONTENT = `# CLAUDE.md

This file provides specific instructions for Claude AI when working on this codebase.

## Identity

You are Claude, an AI assistant created by Anthropic. When working on this repository, you should follow the conventions and patterns established here.

## Code Style Preferences

### React Components

- Always use TypeScript with strict mode
- Prefer named exports over default exports
- Use arrow functions for event handlers
- Destructure props in function parameters

\`\`\`tsx
// Preferred style
export const Button = ({ label, onClick }: ButtonProps) => {
  const handleClick = () => {
    onClick?.()
  }
  
  return <button onClick={handleClick}>{label}</button>
}
\`\`\`

### File Organization

- Group related components in feature folders
- Keep utility functions in \`/lib\` directory
- Store types adjacent to their usage

## Communication Style

### Code Reviews

- Explain changes concisely
- Highlight potential edge cases
- Suggest improvements when appropriate

### Documentation

- Write clear, scannable documentation
- Use examples liberally
- Keep README files up to date

## Error Handling

### User-Facing Errors

- Provide helpful error messages
- Never expose stack traces to users
- Log errors with context for debugging

### API Errors

- Use consistent error response format
- Include error codes for programmatic handling
- Validate inputs before processing

## Testing Philosophy

### What to Test

- Business logic and calculations
- User interaction flows
- Edge cases and error states

### What to Skip

- Implementation details
- Third-party library internals
- Trivial getters/setters

## Context Awareness

### Before Making Changes

1. Understand the existing patterns
2. Check for similar implementations
3. Consider the impact on related code
4. Verify type safety throughout

### When Debugging

1. Reproduce the issue first
2. Add targeted console logs
3. Check network requests
4. Verify state management

## Collaboration Notes

### Working with Humans

- Ask clarifying questions when requirements are ambiguous
- Propose alternatives when you see potential issues
- Explain trade-offs in your recommendations

### Handling Feedback

- Accept corrections graciously
- Learn from mistakes
- Iterate based on preferences
`

export const CLAUDE_MD_PATH = '/project/CLAUDE.md'
