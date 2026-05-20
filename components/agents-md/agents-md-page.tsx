"use client"

import { useState, useMemo, useRef, useCallback, useEffect } from "react"
import { VscListTree, VscChevronDown, VscChevronRight, VscClose } from "react-icons/vsc"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  AGENTS_MD_CONTENT, 
  AGENTS_MD_PATH,
  CLAUDE_MD_CONTENT,
  CLAUDE_MD_PATH
} from "@/lib/data/agents-md-content"

type ViewMode = "preview" | "markdown"
type FileMode = "claude" | "agents"

interface TocItem {
  level: number
  text: string
  id: string
}

// Custom toggle button group with floating pill style
function PillToggle<T extends string>({ 
  value, 
  onChange, 
  options 
}: { 
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
}) {
  const activeIndex = options.findIndex(opt => opt.value === value)
  
  return (
    <div className="relative flex h-6 rounded-md bg-muted/60 p-0.5">
      {/* Sliding background pill */}
      <div 
        className="absolute top-0.5 bottom-0.5 rounded-[5px] bg-background shadow-sm transition-all duration-200 ease-out border border-border/50"
        style={{ 
          width: `calc(${100 / options.length}% - 2px)`,
          left: `calc(${activeIndex * (100 / options.length)}% + 1px)`
        }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`relative z-10 px-2.5 text-[10px] font-medium transition-colors duration-150 ${
            value === option.value 
              ? "text-foreground" 
              : "text-muted-foreground hover:text-foreground/70"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

// Parse markdown to extract headers for ToC
function parseHeaders(markdown: string): TocItem[] {
  const lines = markdown.split('\n')
  const headers: TocItem[] = []
  
  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2]
      const id = `header-${index}`
      headers.push({ level, text, id })
    }
  })
  
  return headers
}

// Syntax highlighting for markdown code view
function highlightMarkdown(content: string): { html: string; lineCount: number }[] {
  const lines = content.split('\n')
  
  return lines.map((line, _index) => {
    let html = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    
    // Headers
    if (/^#{1,6}\s/.test(line)) {
      html = html.replace(/^(#{1,6}\s)(.*)$/, '<span class="text-chart-1 font-semibold">$1$2</span>')
    }
    // Code blocks
    else if (/^```/.test(line)) {
      html = `<span class="text-chart-3">${html}</span>`
    }
    // Bold
    else if (/\*\*[^*]+\*\*/.test(line)) {
      html = html.replace(/\*\*([^*]+)\*\*/g, '<span class="text-chart-4 font-semibold">**$1**</span>')
    }
    // Inline code
    else if (/`[^`]+`/.test(line)) {
      html = html.replace(/`([^`]+)`/g, '<span class="text-chart-2 bg-secondary/50 px-1 rounded">`$1`</span>')
    }
    // Lists
    else if (/^[-*]\s/.test(line)) {
      html = html.replace(/^([-*]\s)/, '<span class="text-chart-1">$1</span>')
    }
    // Links
    else if (/\[.+\]\(.+\)/.test(line)) {
      html = html.replace(/(\[.+\]\(.+\))/g, '<span class="text-primary underline">$1</span>')
    }
    
    return { html, lineCount: 1 }
  })
}

// Parse markdown into sections for collapsible preview
interface Section {
  level: number
  title: string
  id: string
  content: string[]
  children: Section[]
}

function parseMarkdownSections(markdown: string): Section[] {
  const lines = markdown.split('\n')
  const sections: Section[] = []
  const stack: Section[] = []
  let currentContent: string[] = []
  
  lines.forEach((line, index) => {
    const headerMatch = line.match(/^(#{1,3})\s+(.+)$/)
    
    if (headerMatch) {
      const level = headerMatch[1].length
      const title = headerMatch[2]
      const id = `header-${index}`
      
      const newSection: Section = {
        level,
        title,
        id,
        content: [],
        children: []
      }
      
      // Add accumulated content to previous section
      if (stack.length > 0) {
        stack[stack.length - 1].content = currentContent
      } else if (sections.length > 0) {
        sections[sections.length - 1].content = currentContent
      }
      currentContent = []
      
      // Find appropriate parent
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop()
      }
      
      if (stack.length === 0) {
        sections.push(newSection)
      } else {
        stack[stack.length - 1].children.push(newSection)
      }
      
      stack.push(newSection)
    } else {
      currentContent.push(line)
    }
  })
  
  // Add remaining content to last section
  if (stack.length > 0) {
    stack[stack.length - 1].content = currentContent
  }
  
  return sections
}

// Render markdown content (simplified renderer)
function renderMarkdownContent(lines: string[]): React.ReactNode {
  const elements: React.ReactNode[] = []
  let inCodeBlock = false
  let codeLines: string[] = []
  
  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeLines = []
      } else {
        elements.push(
          <pre key={`code-${index}`} className="bg-terminal text-terminal-foreground p-2 rounded-md text-xs font-mono overflow-x-auto my-1">
            <code>{codeLines.join('\n')}</code>
          </pre>
        )
        inCodeBlock = false
      }
      return
    }
    
    if (inCodeBlock) {
      codeLines.push(line)
      return
    }
    
    if (line.trim() === '') {
      elements.push(<div key={index} className="h-1" />)
      return
    }
    
    // Lists
    if (/^[-*]\s/.test(line)) {
      elements.push(
        <div key={index} className="flex gap-2 text-xs text-foreground/90 pl-2">
          <span className="text-primary">•</span>
          <span>{renderInlineMarkdown(line.slice(2))}</span>
        </div>
      )
      return
    }
    
    // Regular paragraph
    elements.push(
      <p key={index} className="text-xs text-foreground/90 leading-snug">
        {renderInlineMarkdown(line)}
      </p>
    )
  })
  
  return elements
}

// Render inline markdown (bold, code, links)
function renderInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0
  
  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
    // Inline code
    const codeMatch = remaining.match(/`([^`]+)`/)
    // Link
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)
    
    const matches = [
      boldMatch ? { type: 'bold', match: boldMatch, index: boldMatch.index! } : null,
      codeMatch ? { type: 'code', match: codeMatch, index: codeMatch.index! } : null,
      linkMatch ? { type: 'link', match: linkMatch, index: linkMatch.index! } : null,
    ].filter(Boolean).sort((a, b) => a!.index - b!.index)
    
    if (matches.length === 0) {
      parts.push(remaining)
      break
    }
    
    const first = matches[0]!
    if (first.index > 0) {
      parts.push(remaining.slice(0, first.index))
    }
    
    if (first.type === 'bold') {
      parts.push(<strong key={key++} className="font-semibold">{first.match[1]}</strong>)
      remaining = remaining.slice(first.index + first.match[0].length)
    } else if (first.type === 'code') {
      parts.push(<code key={key++} className="bg-secondary px-1 py-0.5 rounded text-[10px] font-mono">{first.match[1]}</code>)
      remaining = remaining.slice(first.index + first.match[0].length)
    } else if (first.type === 'link') {
      parts.push(<span key={key++} className="text-primary underline">{first.match[1]}</span>)
      remaining = remaining.slice(first.index + first.match[0].length)
    }
  }
  
  return parts
}

// Collapsible section component
function CollapsibleSection({ section, defaultOpen = true }: { section: Section; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  const headingClass = section.level === 1 
    ? "text-sm font-bold" 
    : section.level === 2 
    ? "text-xs font-semibold" 
    : "text-xs font-medium"
  
  const paddingClass = section.level === 1 
    ? "pl-0" 
    : section.level === 2 
    ? "pl-3" 
    : "pl-5"
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={paddingClass}>
      <CollapsibleTrigger className="flex items-center gap-1 w-full py-0.5 hover:bg-accent/50 rounded px-1 transition-colors">
        {isOpen ? (
          <VscChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
        ) : (
          <VscChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
        )}
        <span id={section.id} className={`${headingClass} text-foreground`}>
          {section.title}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 pr-1">
        <div className="py-0.5 space-y-0.5">
          {renderMarkdownContent(section.content)}
        </div>
        {section.children.map((child, index) => (
          <CollapsibleSection key={index} section={child} defaultOpen={section.level < 2} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

// Inline ToC Panel component (contained within tab) with swipe to close
function TocPanel({ 
  headers, 
  onSelect,
  onClose
}: { 
  headers: TocItem[]
  onSelect: (id: string) => void
  onClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const isDragging = useRef(false)
  const [translateX, setTranslateX] = useState(0)
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isDragging.current = false
  }, [])
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - touchStartX.current
    const deltaY = e.touches[0].clientY - touchStartY.current
    
    // Only start horizontal drag if horizontal movement is significantly more than vertical
    // This prevents accidental closes when scrolling
    if (!isDragging.current) {
      if (Math.abs(deltaX) > 15 && Math.abs(deltaX) > Math.abs(deltaY) * 2) {
        isDragging.current = true
      } else {
        return
      }
    }
    
    // Only allow dragging to the right (positive deltaX) to close
    if (deltaX > 0) {
      setTranslateX(deltaX)
    }
  }, [])
  
  const handleTouchEnd = useCallback(() => {
    // Close if swiped more than 80px to the right (good threshold to prevent accidental closes)
    if (translateX > 80) {
      onClose()
    }
    setTranslateX(0)
    isDragging.current = false
  }, [translateX, onClose])
  
  return (
    <div 
      ref={panelRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `translateX(${translateX}px)` }}
      className="absolute top-0 right-0 bottom-0 w-[220px] bg-card border-l border-border shadow-lg z-10 flex flex-col animate-in slide-in-from-right-2 duration-200 transition-transform overflow-hidden"
    >
      {/* Header - fixed height */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <span className="text-xs font-semibold text-foreground">Table of Contents</span>
        <button 
          onClick={onClose}
          className="p-1 rounded hover:bg-accent transition-colors"
        >
          <VscClose className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      {/* Content - scrollable, takes remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-0.5">
            {headers.map((header, index) => (
              <button
                key={index}
                onClick={() => onSelect(header.id)}
                className={`block w-full text-left text-xs py-1 px-2 rounded hover:bg-accent transition-colors ${
                  header.level === 1 
                    ? "font-semibold text-foreground" 
                    : header.level === 2 
                    ? "pl-4 text-foreground/90" 
                    : "pl-6 text-muted-foreground"
                }`}
              >
                {header.text}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export function AgentsMdPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("preview")
  const [fileMode, setFileMode] = useState<FileMode>("claude")
  const [tocOpen, setTocOpen] = useState(false)
  const [showFab, setShowFab] = useState(true)
  const lastScrollY = useRef(0)
  const contentScrollRef = useRef<HTMLDivElement>(null)
  
  // Get current content based on file mode
  const currentContent = fileMode === "claude" ? CLAUDE_MD_CONTENT : AGENTS_MD_CONTENT
  const currentPath = fileMode === "claude" ? CLAUDE_MD_PATH : AGENTS_MD_PATH
  
  const headers = useMemo(() => parseHeaders(currentContent), [currentContent])
  const sections = useMemo(() => parseMarkdownSections(currentContent), [currentContent])
  const highlightedLines = useMemo(() => highlightMarkdown(currentContent), [currentContent])
  
  // Handle scroll to show/hide FAB
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop
    
    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      // Scrolling down
      setShowFab(false)
    } else {
      // Scrolling up
      setShowFab(true)
    }
    
    lastScrollY.current = currentScrollY
  }, [])
  
  const handleTocSelect = useCallback((id: string) => {
    // Don't close ToC - just scroll to element
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 50)
  }, [])
  
  // Reset scroll position and FAB when switching files
  useEffect(() => {
    setShowFab(true)
    lastScrollY.current = 0
  }, [fileMode])
  
  return (
    <div className="flex flex-col h-full">
      {/* Header row */}
      <div className="flex items-center justify-between px-3 py-px border-b border-border bg-card/50">
        {/* View toggle - left side */}
        <PillToggle
          value={viewMode}
          onChange={setViewMode}
          options={[
            { value: "preview", label: "Preview" },
            { value: "markdown", label: "Markdown" },
          ]}
        />
        
        {/* File toggle and path - right side */}
        <div className="flex items-center gap-2">
          <PillToggle
            value={fileMode}
            onChange={setFileMode}
            options={[
              { value: "claude", label: "CLAUDE.md" },
              { value: "agents", label: "AGENTS.md" },
            ]}
          />
          <span className="text-[9px] text-muted-foreground truncate">{currentPath}</span>
        </div>
      </div>
      
      {/* Content area - relative positioning for contained ToC */}
      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full" onScrollCapture={handleScroll}>
          <div ref={contentScrollRef} className="p-3">
            {viewMode === "preview" ? (
              // Preview mode with collapsible headers
              <div className="space-y-0.5">
                {sections.map((section, index) => (
                  <CollapsibleSection key={index} section={section} defaultOpen={true} />
                ))}
              </div>
            ) : (
              // Markdown raw view with line numbers
              <div className="font-mono text-[11px] leading-relaxed">
                {highlightedLines.map((line, index) => (
                  <div key={index} className="flex">
                    <span className="w-8 shrink-0 text-right pr-3 text-muted-foreground/50 select-none">
                      {index + 1}
                    </span>
                    <span 
                      className="flex-1 whitespace-pre-wrap break-all"
                      dangerouslySetInnerHTML={{ __html: line.html || '&nbsp;' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* ToC FAB - only show in preview mode, hide on scroll down */}
        {viewMode === "preview" && !tocOpen && (
          <button 
            onClick={() => setTocOpen(true)}
            className={`absolute top-2 right-2 h-7 px-2.5 rounded-md bg-[#4a5568] text-white/90 flex items-center justify-center gap-1.5 shadow-md hover:bg-[#5a6578] transition-all duration-200 ${
              showFab ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <VscListTree className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">ToC</span>
          </button>
        )}
        
        {/* ToC Panel - contained within this tab */}
        {viewMode === "preview" && tocOpen && (
          <TocPanel 
            headers={headers} 
            onSelect={handleTocSelect}
            onClose={() => setTocOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
