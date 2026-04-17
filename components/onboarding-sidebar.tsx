"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Lock } from "lucide-react"

interface SidebarItemProps {
    phase: string
    title: string
    status: "complete" | "active" | "locked"
    steps: { id: string; label: string }[]
    currentStep: string
    onClick?: () => void
    onStepClick?: (stepId: string) => void
}

function SidebarItem({
    phase,
    title,
    status,
    steps,
    currentStep,
    onClick,
    onStepClick,
}: SidebarItemProps) {
    const isExpanded = status === "active" || status === "complete"

    return (
        <div className="flex flex-col">
            <div
                onClick={status !== "locked" ? onClick : undefined}
                className={cn(
                    "group relative flex items-start gap-4 overflow-hidden rounded-2xl p-4 transition-all duration-300",
                    status === "active"
                        ? "rounded-sm border border-primary/20 bg-primary/5 shadow-sm"
                        : status === "complete"
                          ? "cursor-pointer hover:bg-green-500/5"
                          : "cursor-pointer hover:bg-primary/5",
                    status === "locked" && "cursor-not-allowed opacity-50"
                )}
            >
                <div
                    className={cn(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
                        status === "complete" &&
                            "bg-green-500/10 text-green-600",
                        status === "active" &&
                            "bg-primary text-primary-foreground",
                        status === "locked" &&
                            "bg-neutral-200 text-neutral-400 dark:bg-neutral-800"
                    )}
                >
                    {status === "complete" && (
                        <CheckCircle2 className="h-4 w-4" />
                    )}
                    {status === "active" && (
                        <Circle className="h-3 w-3 fill-current" />
                    )}
                    {status === "locked" && <Lock className="h-3 w-3" />}
                </div>

                <div className="flex flex-col">
                    <span
                        className={cn(
                            "text-xs font-bold tracking-wider uppercase",
                            status === "active"
                                ? "text-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        {phase}
                    </span>
                    <span
                        className={cn(
                            "text-sm font-semibold",
                            status === "active"
                                ? "text-neutral-900 dark:text-neutral-50"
                                : "text-muted-foreground"
                        )}
                    >
                        {title}
                    </span>
                </div>

                {status === "active" && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 rounded-r-full bg-primary" />
                )}
            </div>

            {/* Sub-steps */}
            {isExpanded && steps.length > 0 && (
                <div className="mt-1 mb-4 ml-10 flex flex-col gap-1 border-l-2 border-primary/10 py-1 pl-4">
                    {steps.map((step) => {
                        const isStepActive = currentStep === step.id
                        const isStepComplete =
                            status === "complete" ||
                            (status === "active" && currentStep > step.id)

                        return (
                            <button
                                key={step.id}
                                onClick={() => onStepClick?.(step.id)}
                                className={cn(
                                    "py-1.5 text-left text-xs transition-all duration-200 hover:text-primary",
                                    isStepActive
                                        ? "translate-x-1 font-bold text-primary"
                                        : isStepComplete
                                          ? "text-muted-foreground/80"
                                          : "text-muted-foreground/50"
                                )}
                            >
                                {step.label}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export function OnboardingSidebar({
    currentPhase = 1,
    currentStep = "1A",
}: {
    currentPhase?: number
    currentStep?: string
}) {
    const handlePhaseClick = async (phaseNum: number, status: string) => {
        if (status === "locked") return

        try {
            const res = await fetch("/api/onboarding/progress", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPhase: phaseNum,
                    currentStep: `${phaseNum}A`,
                }),
            })

            if (res.ok) {
                window.location.reload()
            }
        } catch (error) {
            console.error("Failed to jump to phase:", error)
        }
    }

    const handleStepClick = async (stepId: string) => {
        const phaseNum = parseInt(stepId[0])

        // Allow jumping to steps in current + complete phases only
        if (phaseNum > currentPhase) return

        try {
            const res = await fetch("/api/onboarding/progress", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPhase: phaseNum,
                    currentStep: stepId,
                }),
            })

            if (res.ok) {
                window.location.reload()
            }
        } catch (error) {
            console.error("Failed to jump to step:", error)
        }
    }

    const phaseData = [
        {
            phase: "Phase 1",
            title: "Connection",
            steps: [
                { id: "1A", label: "Foundation Video" },
                { id: "1B", label: "Getting to Know You" },
                { id: "1C-1", label: "Triage: Self-Care" },
                { id: "1C-2", label: "Triage: Wealth Creation" },
                { id: "1C-3", label: "Triage: Literacy" },
                { id: "1C-4", label: "Triage: Actualization" },
                { id: "1C-5", label: "Triage: Succession" },
                { id: "1C-6", label: "Triage: Outreach" },
                { id: "1C-7", label: "Triage: Relationships" },
                { id: "1C-8", label: "Triage: Health" },
                { id: "1C-9", label: "Triage: Open Reflection" },
                { id: "1D", label: "Open Share" },
                { id: "1E", label: "Getting to Know Us" },
                { id: "1F", label: "Schedule Orientation" },
            ],
        },
        {
            phase: "Phase 2",
            title: "Awareness",
            steps: [
                { id: "2A", label: "360° Evaluation" },
                { id: "2B", label: "Growth Inputs" },
                { id: "2C", label: "Evening Pulse" },
            ],
        },
        {
            phase: "Phase 3",
            title: "Stabilization",
            steps: [
                { id: "3A", label: "Vision Activation" },
                { id: "3B", label: "Vision Statements" },
                { id: "3C", label: "Ideal Day Narrative" },
                { id: "3D", label: "Word of the Year" },
                { id: "3E", label: "Family Mission" },
            ],
        },
        {
            phase: "Phase 4",
            title: "Activation",
            steps: [
                { id: "4A", label: "Book Kickstart Call" },
                { id: "4B", label: "Join Telegram" },
                { id: "4C", label: "Wealth Strategy" },
            ],
        },
    ]

    const phases = phaseData.map((p, i) => {
        const phaseNum = i + 1
        return {
            ...p,
            status:
                currentPhase > phaseNum
                    ? "complete"
                    : ((currentPhase === phaseNum
                          ? "active"
                          : "locked") as any),
        }
    })

    return (
        <aside className="sticky top-20 hidden w-80 flex-col gap-6 self-start lg:flex">
            <div className="space-y-2">
                <h2 className="px-4 text-lg font-bold">Onboarding Journey</h2>
                <p className="px-4 text-xs tracking-widest text-muted-foreground uppercase">
                    Offloading Cares Pathway
                </p>
            </div>

            <nav className="space-y-1">
                {phases.map((item, i) => (
                    <SidebarItem
                        key={item.phase}
                        {...item}
                        currentStep={currentStep}
                        onClick={() => handlePhaseClick(i + 1, item.status)}
                        onStepClick={handleStepClick}
                    />
                ))}
            </nav>

            <div className="mt-auto rounded-2xl border border-border/50 bg-secondary/30 p-4">
                <p className="text-xs leading-relaxed text-muted-foreground">
                    Need help? Your ProTeam is standing by.
                </p>
            </div>
        </aside>
    )
}
