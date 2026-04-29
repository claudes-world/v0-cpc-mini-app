"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { VscChevronDown } from "react-icons/vsc"
import { useState } from "react"

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
  const [value, setValue] = useState("claude_do_bot")
  const selectedBot = bots.find(b => b.id === value)

  return (
    <SelectPrimitive.Root value={value} onValueChange={setValue}>
      <SelectPrimitive.Trigger
        className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono rounded-tl border-t border-l border-border text-[#1a1e24] hover:opacity-90 transition-opacity outline-none"
        style={{
          backgroundColor: '#4c566a',
          boxShadow: '-6px -4px 12px -2px rgba(0,0,0,0.5), -2px 0 6px -1px rgba(0,0,0,0.3)'
        }}
      >
        <SelectPrimitive.Value>
          {selectedBot?.label}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon>
          <VscChevronDown className="w-2.5 h-2.5" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          side="top"
          align="end"
          sideOffset={0}
          className="z-50 min-w-[120px] max-h-[140px] overflow-y-auto bg-popover border border-border rounded-tl shadow-lg"
        >
          <SelectPrimitive.Viewport className="p-0.5">
            {bots.map((bot) => (
              <SelectPrimitive.Item
                key={bot.id}
                value={bot.id}
                className="relative flex items-center px-2 py-1.5 text-[10px] font-mono text-foreground rounded-sm outline-none cursor-pointer select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
              >
                <SelectPrimitive.ItemText>{bot.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
