"use client"

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
  return (
    <Select defaultValue="claude_do_bot">
      <SelectTrigger 
        className="h-auto min-h-0 w-auto min-w-0 gap-1 px-1.5 py-0.5 text-[9px] font-mono bg-border text-background border-0 border-t border-l border-border rounded-none rounded-tl shadow-none focus:ring-0 focus-visible:ring-0"
        style={{
          boxShadow: '-6px -4px 12px -2px rgba(0,0,0,0.5), -2px 0 6px -1px rgba(0,0,0,0.3)'
        }}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent 
        side="top" 
        align="end"
        sideOffset={0}
        className="min-w-[120px] max-h-[140px] rounded-tl rounded-tr-none rounded-br-none rounded-bl bg-popover border-border"
      >
        {bots.map((bot) => (
          <SelectItem 
            key={bot.id} 
            value={bot.id}
            className="text-[10px] font-mono py-1.5 px-2 cursor-pointer"
          >
            {bot.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
