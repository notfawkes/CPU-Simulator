"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function InstructionView({
  stage,
  instructionText,
  acc,
  pc,
  halted,
}: {
  stage: "idle" | "fetch" | "decode" | "execute"
  instructionText: string
  acc: number
  pc: number
  halted: boolean
}) {
  const stageLabel = halted ? "Halted" : stage === "idle" ? "Idle" : stage.charAt(0).toUpperCase() + stage.slice(1)

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary">Instruction Viewer</h2>
        <div className="flex items-center gap-2">
          {(["fetch", "decode", "execute"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1">
              <span
                className={cn(
                  "inline-block h-2.5 w-2.5 rounded-full bg-muted",
                  stage === s && "bg-primary shadow-[0_0_8px_var(--glow-primary)]",
                )}
                aria-hidden
              />
              <span className="text-xs text-muted-foreground">{s.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        key={instructionText + stage}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-lg border border-primary/20 bg-card/60 p-4 backdrop-blur shadow-[0_0_14px_var(--glow-primary)]"
      >
        <div className="text-sm text-muted-foreground">Stage</div>
        <div className="font-mono text-xl">{stageLabel}</div>

        <div className="mt-3 text-sm text-muted-foreground">Current Instruction</div>
        <div className="font-mono text-2xl text-primary">{instructionText || "—"}</div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md border border-primary/10 bg-background/60 p-2">
            <div className="text-muted-foreground">ACC</div>
            <div className="font-mono text-lg">{acc}</div>
          </div>
          <div className="rounded-md border border-primary/10 bg-background/60 p-2">
            <div className="text-muted-foreground">PC</div>
            <div className="font-mono text-lg">{pc}</div>
          </div>
        </div>

        {halted && (
          <div className="mt-4 rounded-md border border-primary/20 bg-primary/10 p-3 text-primary">
            Program Halted — execution has stopped.
          </div>
        )}
      </motion.div>
    </div>
  )
}
