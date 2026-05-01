"use client"

import { useState, useMemo, useRef, useCallback } from "react"
import { VscListTree, VscChevronDown, VscChevronRight } from "react-icons/vsc"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AGENTS_MD_CONTENT, AGENTS_MD_PATH } from "@/lib/data/agents-md-content"

type ViewMode = "preview" | "markdown"

interface TocItem {
  level: number
  text: string
  id: string
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
  let codeLanguage = ''
  
  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeLanguage = line.slice(3)
        codeLines = []
      } else {
        elements.push(
          <pre key={`code-${index}`} className="bg-terminal text-terminal-foreground p-3 rounded-md text-xs font-mono overflow-x-auto my-2">
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
      elements.push(<div key={index} className="h-2" />)
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
      <p key={index} className="text-xs text-foreground/90 leading-relaxed">
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
      <CollapsibleTrigger className="flex items-center gap-1.5 w-full py-1.5 hover:bg-accent/50 rounded px-1.5 transition-colors">
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
        <div className="py-1 space-y-1">
          {renderMarkdownContent(section.content)}
        </div>
        {section.children.map((child, index) => (
          <CollapsibleSection key={index} section={child} defaultOpen={section.level < 2} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

// Table of Contents component
function TableOfContents({ 
  headers, 
  onSelect 
}: { 
  headers: TocItem[]
  onSelect: (id: string) => void 
}) {
  return (
    <div className="space-y-1">
      {headers.map((header, index) => (
        <button
          key={index}
          onClick={() => onSelect(header.id)}
          className={`block w-full text-left text-xs py-1.5 px-2 rounded hover:bg-accent transition-colors ${
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
  )
}

export function AgentsMdPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("preview")
  const [tocOpen, setTocOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const headers = useMemo(() => parseHeaders(AGENTS_MD_CONTENT), [])
  const sections = useMemo(() => parseMarkdownSections(AGENTS_MD_CONTENT), [])
  const highlightedLines = useMemo(() => highlightMarkdown(AGENTS_MD_CONTENT), [])
  
  const handleTocSelect = useCallback((id: string) => {
    setTocOpen(false)
    // Scroll to element
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }, [])
  
  return (
    <div className="flex flex-col h-full">
      {/* Header row */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/50">
        {/* File info - left side */}
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-medium text-foreground truncate">AGENTS.md</span>
          <span className="text-[10px] text-muted-foreground truncate">{AGENTS_MD_PATH}</span>
        </div>
        
        {/* Toggle + ToC - right side */}
        <div className="flex items-center gap-2">
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && setViewMode(value as ViewMode)}
            size="sm"
            variant="outline"
            className="h-7"
          >
            <ToggleGroupItem value="preview" className="text-[10px] px-2 h-6">
              Preview
            </ToggleGroupItem>
            <ToggleGroupItem value="markdown" className="text-[10px] px-2 h-6">
              Markdown
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      {/* Content area */}
      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="p-3">
            {viewMode === "preview" ? (
              // Preview mode with collapsible headers
              <div className="space-y-1">
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
        
        {/* ToC FAB - only show in preview mode */}
        {viewMode === "preview" && (
          <Sheet open={tocOpen} onOpenChange={setTocOpen}>
            <SheetTrigger asChild>
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                <VscListTree className="w-4 h-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <SheetHeader className="p-4 pb-2 border-b border-border">
                <SheetTitle className="text-sm">Table of Contents</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100%-60px)]">
                <div className="p-3">
                  <TableOfContents headers={headers} onSelect={handleTocSelect} />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  )
}
