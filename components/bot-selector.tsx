"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const bots = [
  { id: "claude_do_bot", label: "claude_do_bot" },
  { id: "pm_dobot", label: "pm_dobot" },
  { id: "gstack_dobot", label: "gstack_dobot" },
  { id: "elder-1", label: "elder-1" },
  { id: "elder-2", label: "elder-2" },
  { id: "elder-3", label: "elder-3" },
  { id: "elder-4", label: "elder-4" },
]

export function BotSelector() {
  const [selected, setSelected] = useState(bots[0].id)

  return (
    <Select value={selected} onValueChange={setSelected}>
      <SelectTrigger
        className="h-auto px-1.5 py-0.5 text-[9px] font-mono bg-secondary border-t border-l border-r-0 border-b-0 border-border rounded-none rounded-tl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors gap-1 min-w-0 w-auto shadow-none"
        style={{
          boxShadow: '-6px -4px 12px -2px rgba(0,0,0,0.5), -2px 0 6px -1px rgba(0,0,0,0.3)'
        }}
      >
        <SelectValue>
          <span className="truncate max-w-[90px]">
            {bots.find(b => b.id === selected)?.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        side="top"
        align="end"
        className="min-w-[140px] rounded-md font-mono"
      >
        {bots.map((bot) => (
          <SelectItem
            key={bot.id}
            value={bot.id}
            className="text-[11px] py-1.5 cursor-pointer"
          >
            {bot.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
