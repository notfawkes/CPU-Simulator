"use client"

import { motion } from "framer-motion"

export default function ControlPanel({
  onFetch,
  onDecode,
  onExecute,
  onRunAll,
  onReset,
  disabled,
  stage,
}: {
  onFetch: () => void
  onDecode: () => void
  onExecute: () => void
  onRunAll: () => void
  onReset: () => void
  disabled: boolean
  stage: "idle" | "fetch" | "decode" | "execute"
}) {
  const btn =
    "rounded-lg px-4 py-2 font-medium border border-primary/30 bg-secondary/60 backdrop-blur text-primary shadow-[0_0_12px_var(--glow-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"

  return (
    <div className="flex flex-wrap items-center gap-3 justify-center">
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className={btn}
        onClick={onFetch}
        disabled={disabled}
        aria-pressed={stage === "fetch"}
        aria-label="Fetch"
      >
        Fetch
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className={btn}
        onClick={onDecode}
        disabled={disabled}
        aria-pressed={stage === "decode"}
        aria-label="Decode"
      >
        Decode
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className={btn}
        onClick={onExecute}
        disabled={disabled}
        aria-pressed={stage === "execute"}
        aria-label="Execute"
      >
        Execute
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className={btn}
        onClick={onRunAll}
        disabled={disabled}
        aria-label="Run All"
      >
        Run All
      </motion.button>

      <div className="mx-2 h-6 w-px bg-primary/20" aria-hidden />

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-lg px-4 py-2 font-medium border border-destructive/30 text-destructive-foreground bg-destructive/15 shadow-[0_0_12px_color-mix(in_oklab,var(--color-destructive)_60%,transparent)]"
        onClick={onReset}
        aria-label="Reset"
      >
        Reset
      </motion.button>
    </div>
  )
}
