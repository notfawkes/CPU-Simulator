"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function MemoryTable({
  memory,
  pc,
  mar,
  highlight,
  onEdit,
}: {
  memory: string[]
  pc: number
  mar: number | null
  highlight: number | null
  onEdit: (address: number, value: string) => void
}) {
  const [editing, setEditing] = useState<number | null>(null)
  const [draft, setDraft] = useState<string>("")

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-primary">Memory (0–15)</h2>
      <div className="grid grid-cols-1">
        <div className="overflow-hidden rounded-lg border border-primary/15">
          <table className="w-full text-sm font-mono">
            <thead className="bg-muted/40">
              <tr className="text-left">
                <th className="px-3 py-2 w-20">Addr</th>
                <th className="px-3 py-2">Data / Instruction</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 16 }).map((_, addr) => {
                const active = addr === highlight
                const isPC = addr === pc
                const isMAR = mar === addr
                const value = memory[addr] ?? "NOP"
                return (
                  <motion.tr
                    key={addr}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "border-t border-primary/10",
                      active && "bg-primary/10 shadow-[0_0_12px_var(--glow-primary)]",
                      isPC && !active && "bg-accent/10",
                      isMAR && "outline outline-1 outline-primary/40",
                    )}
                  >
                    <td className="px-3 py-2 text-muted-foreground">
                      {addr.toString(16).toUpperCase().padStart(2, "0")}
                    </td>
                    <td className="px-3 py-2">
                      {editing === addr ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            onEdit(addr, draft.trim() || "NOP")
                            setEditing(null)
                          }}
                        >
                          <input
                            autoFocus
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onBlur={() => setEditing(null)}
                            className="w-full rounded-md bg-background/70 border border-primary/30 px-2 py-1"
                            aria-label={`Edit memory at address ${addr}`}
                          />
                        </form>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-left hover:text-primary"
                          onClick={() => {
                            setEditing(addr)
                            setDraft(value)
                          }}
                          aria-label={`Memory at ${addr}, value ${value}`}
                          title="Click to edit"
                        >
                          {value}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Tip: Click a cell to edit the instruction (e.g., {('"MOV 2"', '"ADD 1"', '"JMP 0"', '"HLT"')}).
      </div>
    </div>
  )
}
