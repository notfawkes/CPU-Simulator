"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Stage = "idle" | "fetch" | "decode" | "execute"

export default function RegisterPanel({
  regs,
  stage,
}: {
  regs: Record<"PC" | "IR" | "ACC" | "MAR" | "MBR", string | number>
  stage: Stage
}) {
  const items: Array<{ key: keyof typeof regs; label: string; active: boolean }> = [
    { key: "PC", label: "Program Counter (PC)", active: stage === "execute" },
    { key: "IR", label: "Instruction Register (IR)", active: stage === "decode" },
    { key: "ACC", label: "Accumulator (ACC)", active: stage === "execute" },
    { key: "MAR", label: "Memory Address Register (MAR)", active: stage === "fetch" },
    { key: "MBR", label: "Memory Buffer Register (MBR)", active: stage === "fetch" || stage === "decode" },
  ]

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-primary">Registers</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((it) => (
          <motion.li
            key={it.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "rounded-lg border p-3 bg-card/60 backdrop-blur",
              "border-primary/15",
              it.active ? "shadow-[0_0_16px_var(--glow-primary)] ring-1 ring-primary/40" : "shadow-none",
            )}
            aria-live="polite"
          >
            <div className="text-xs text-muted-foreground">{it.label}</div>
            <div className="mt-1 font-mono text-xl">
              {String(regs[it.key])}
              {it.active && (
                <span
                  className="ml-2 inline-block h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--glow-primary)] align-middle"
                  aria-hidden
                />
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
