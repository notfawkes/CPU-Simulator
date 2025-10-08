"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import RegisterPanel from "@/components/register-panel"
import MemoryTable from "@/components/memory-table"
import InstructionView from "@/components/instruction-view"
import ControlPanel from "@/components/control-panel"

type Op = "MOV" | "ADD" | "SUB" | "JMP" | "HLT" | "NOP"
type Instruction = { op: Op; operand?: number }

const DEFAULT_PROGRAM: string[] = ["MOV 5", "ADD 3", "SUB 1", "JMP 0", "HLT"]

function parseInstruction(text: string | undefined): Instruction {
  if (!text) return { op: "NOP" }
  const [opRaw, argRaw] = text.trim().split(/\s+/)
  const op = (opRaw?.toUpperCase() as Op) || "NOP"
  const operand = argRaw !== undefined ? Number(argRaw) : undefined
  return { op, operand }
}

export default function HomePage() {
  // Memory holds 16 addresses
  const [memory, setMemory] = useState<string[]>(Array.from({ length: 16 }, (_, i) => DEFAULT_PROGRAM[i] ?? "NOP"))

  // Registers
  const [pc, setPC] = useState(0)
  const [ir, setIR] = useState<string>("")
  const [acc, setACC] = useState(0)
  const [mar, setMAR] = useState<number | null>(null)
  const [mbr, setMBR] = useState<string>("")

  // UI state
  const [stage, setStage] = useState<"idle" | "fetch" | "decode" | "execute">("idle")
  const [running, setRunning] = useState(false)
  const [halted, setHalted] = useState(false)

  // Highlighted address (for fetch glow)
  const [highlightAddr, setHighlightAddr] = useState<number | null>(null)
  const runAbortRef = useRef({ aborted: false })

  const currentInstruction = useMemo(() => parseInstruction(ir), [ir])

  const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms))

  const doFetch = useCallback(async () => {
    if (halted || running) return
    setStage("fetch")
    setMAR(pc)
    setHighlightAddr(pc)
    const word = memory[pc] ?? "NOP"
    setMBR(word)
    await delay(450)
  }, [halted, running, pc, memory])

  const doDecode = useCallback(async () => {
    if (halted || running) return
    setStage("decode")
    setIR(mbr)
    await delay(350)
  }, [halted, running, mbr])

  const doExecute = useCallback(async () => {
    if (halted || running) return
    setStage("execute")

    const inst = parseInstruction(mbr)
    let nextPC = pc + 1
    let nextACC = acc

    switch (inst.op) {
      case "MOV":
        if (typeof inst.operand === "number") nextACC = inst.operand
        break
      case "ADD":
        if (typeof inst.operand === "number") nextACC = acc + inst.operand
        break
      case "SUB":
        if (typeof inst.operand === "number") nextACC = acc - inst.operand
        break
      case "JMP":
        if (typeof inst.operand === "number") nextPC = Math.max(0, Math.min(15, inst.operand))
        break
      case "HLT":
        nextPC = pc // stay
        break
      default:
        break
    }

    // animate ACC and PC updates slightly delayed
    await delay(200)
    setACC(nextACC)

    await delay(200)
    setPC(nextPC)

    // Handle halt
    if (inst.op === "HLT") {
      setHalted(true)
      setStage("idle")
      setHighlightAddr(null)
      return
    }

    // cleanup highlights
    setHighlightAddr(null)
    setStage("idle")
  }, [acc, mbr, pc, halted, running])

  const onRunAll = useCallback(async () => {
    if (running || halted) return
    setRunning(true)
    setStage("idle")
    runAbortRef.current.aborted = false

    while (!runAbortRef.current.aborted) {
      await doFetch()
      if (halted) break
      await doDecode()
      if (halted) break
      await doExecute()
      if (halted) break
      // prevent infinite loop runaway; safety stop if PC leaves bounds
      if (pc < 0 || pc > 15) break
      await delay(200)
    }

    setRunning(false)
  }, [doFetch, doDecode, doExecute, halted, running, pc])

  const onReset = useCallback(() => {
    runAbortRef.current.aborted = true
    setRunning(false)
    setStage("idle")
    setPC(0)
    setIR("")
    setACC(0)
    setMAR(null)
    setMBR("")
    setHalted(false)
    setHighlightAddr(null)
  }, [])

  return (
    <main className="min-h-svh w-full bg-background text-foreground flex flex-col">
      {/* Title bar */}
      <header className="sticky top-0 z-10 border-b border-primary/20 bg-secondary/50 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-balance font-mono text-2xl md:text-3xl text-primary drop-shadow-[0_0_10px_var(--color-primary)]"
          >
            Von Neumann CPU Simulator
          </motion.h1>
          <div
            className={cn(
              "rounded-full px-3 py-1 text-xs font-mono",
              halted
                ? "bg-destructive/20 text-destructive-foreground border border-destructive/40"
                : running
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-muted/40 text-muted-foreground border border-muted/30",
            )}
          >
            {halted ? "Program Halted" : running ? "Running" : "Idle"}
          </div>
        </div>
      </header>

      {/* Main grid */}
      <div className="mx-auto max-w-6xl w-full grow px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registers Panel */}
        <section className="rounded-xl border border-primary/15 bg-secondary/40 backdrop-blur-lg p-4 shadow-[0_0_20px_var(--glow-primary)]">
          <RegisterPanel regs={{ PC: pc, IR: ir || "—", ACC: acc, MAR: mar ?? "—", MBR: mbr || "—" }} stage={stage} />
        </section>

        {/* Memory Table */}
        <section className="rounded-xl border border-primary/15 bg-secondary/40 backdrop-blur-lg p-4 shadow-[0_0_20px_var(--glow-primary)]">
          <MemoryTable
            memory={memory}
            pc={pc}
            mar={mar}
            highlight={highlightAddr}
            onEdit={(addr, value) => {
              setMemory((prev) => {
                const next = [...prev]
                next[addr] = value
                return next
              })
            }}
          />
        </section>

        {/* Instruction Viewer */}
        <section className="md:col-span-2 rounded-xl border border-primary/15 bg-secondary/40 backdrop-blur-lg p-4 shadow-[0_0_18px_var(--glow-primary)]">
          <InstructionView stage={stage} instructionText={ir} acc={acc} pc={pc} halted={halted} />
        </section>
      </div>

      {/* Controls */}
      <footer className="sticky bottom-0 z-10 border-t border-primary/20 bg-secondary/60 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <ControlPanel
            disabled={running || halted}
            stage={stage}
            onFetch={doFetch}
            onDecode={doDecode}
            onExecute={doExecute}
            onRunAll={onRunAll}
            onReset={onReset}
          />
        </div>
      </footer>
    </main>
  )
}
