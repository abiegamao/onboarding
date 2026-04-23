import Link from "next/link"
import { FileText, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import connectDB from "@/lib/mongodb"
import QuestionConfig from "@/models/QuestionConfig"
import { QUESTION_SEEDS } from "@/lib/questionSeeds"
import { requireAdmin } from "@/lib/adminAuth"
import { redirect } from "next/navigation"
import SeedButton from "./SeedButton"

const PHASE_LABELS: Record<number, string> = {
    1: "Phase 1 — Connection",
    2: "Phase 2 — Awareness",
    3: "Phase 3 — Stabilization",
    4: "Phase 4 — Activation",
}

export default async function QuestionsPage() {
    try {
        await requireAdmin()
    } catch {
        redirect("/login")
    }

    await connectDB()
    const dbConfigs = await QuestionConfig.find({}).lean()
    const dbMap: Record<string, any> = Object.fromEntries(
        dbConfigs.map((c) => [c.stepId as string, c])
    )

    const grouped: Record<number, typeof QUESTION_SEEDS> = {}
    for (const seed of QUESTION_SEEDS) {
        if (!grouped[seed.phase]) grouped[seed.phase] = []
        grouped[seed.phase].push(seed)
    }

    return (
        <div className="space-y-10">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Onboarding Questions
                    </h1>
                    <p className="mt-1.5 font-mono text-[10px] tracking-[0.25em] text-[#b6954a]/70 uppercase">
                        Edit the questions clients see during their onboarding journey
                    </p>
                </div>
                <SeedButton />
            </div>

            {Object.entries(grouped).map(([phase, steps]) => (
                <div key={phase} className="space-y-3">
                    <p className="border-b border-[#b6954a]/15 pb-2 font-mono text-[10px] tracking-[0.3em] text-[#b6954a]/70 uppercase">
                        {PHASE_LABELS[Number(phase)]}
                    </p>
                    <Card className="overflow-hidden rounded-2xl border border-[#b6954a]/20 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        {steps.map((step, i) => {
                            const isCustom = !!dbMap[step.stepId]
                            const config = dbMap[step.stepId] ?? step
                            return (
                                <Link
                                    key={step.stepId}
                                    href={`/admin/questions/${step.stepId}`}
                                    className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#b6954a]/[0.04] ${
                                        i < steps.length - 1
                                            ? "border-b border-[#b6954a]/10"
                                            : ""
                                    }`}
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#b6954a]/15 to-[#b6954a]/5 ring-1 ring-[#b6954a]/10">
                                        <FileText className="h-4 w-4 text-[#b6954a]" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-[#b6954a]">
                                                {step.stepId}
                                            </span>
                                            <span className="text-sm font-medium text-foreground">
                                                {step.stepLabel}
                                            </span>
                                            {isCustom && (
                                                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
                                                    Edited
                                                </span>
                                            )}
                                        </div>
                                        <p className="truncate text-xs text-muted-foreground/60">
                                            {config.questions.length} question
                                            {config.questions.length !== 1 ? "s" : ""}
                                            {step.description ? ` — ${step.description}` : ""}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/30" />
                                </Link>
                            )
                        })}
                    </Card>
                </div>
            ))}
        </div>
    )
}

