"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Lock } from "lucide-react"

interface SidebarItemProps {
  phase: string
  title: string
  status: "complete" | "active" | "locked"
  steps: { id: string, label: string }[]
  currentStep: string
  onClick?: () => void
  onStepClick?: (stepId: string) => void
}

function SidebarItem({ phase, title, status, steps, currentStep, onClick, onStepClick }: SidebarItemProps) {
  const isExpanded = status === "active" || status === "complete"

  return (
    <div className="flex flex-col">
      <div
        onClick={status !== "locked" ? onClick : undefined}
        className={cn(
          "group flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden",
          status === "active" 
            ? "bg-primary/5 rounded-sm border border-primary/20 shadow-sm" 
            : "hover:bg-primary/5 cursor-pointer",
          status === "locked" && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className={cn(
          "h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors",
          status === "complete" && "bg-green-500/10 text-green-600",
          status === "active" && "bg-primary text-primary-foreground",
          status === "locked" && "bg-neutral-200 dark:bg-neutral-800 text-neutral-400"
        )}>
          {status === "complete" && <CheckCircle2 className="h-4 w-4" />}
          {status === "active" && <Circle className="h-3 w-3 fill-current" />}
          {status === "locked" && <Lock className="h-3 w-3" />}
        </div>
        
        <div className="flex flex-col">
          <span className={cn(
            "text-xs font-bold uppercase tracking-wider",
            status === "active" ? "text-primary" : "text-muted-foreground"
          )}>
            {phase}
          </span>
          <span className={cn(
            "text-sm font-semibold",
            status === "active" ? "text-neutral-900 dark:text-neutral-50" : "text-muted-foreground"
          )}>
            {title}
          </span>
        </div>

        {status === "active" && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
        )}
      </div>

      {/* Sub-steps */}
      {isExpanded && steps.length > 0 && (
        <div className="ml-10 mt-1 mb-4 flex flex-col gap-1 border-l-2 border-primary/10 pl-4 py-1">
          {steps.map((step) => {
            const isStepActive = currentStep === step.id
            const isStepComplete = status === "complete" || (status === "active" && currentStep > step.id)
            
            return (
              <button
                key={step.id}
                onClick={() => onStepClick?.(step.id)}
                className={cn(
                  "text-left py-1.5 text-xs transition-all duration-200 hover:text-primary",
                  isStepActive 
                    ? "text-primary font-bold translate-x-1" 
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
  currentStep = "1A" 
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
          currentStep: `${phaseNum}A` 
        })
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
    
    try {
      const res = await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currentPhase: phaseNum,
          currentStep: stepId 
        })
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
        { id: "1C", label: "Your Triage" },
        { id: "1D", label: "Open Share" },
        { id: "1E", label: "Schedule Orientation" },
      ]
    },
    { 
      phase: "Phase 2", 
      title: "Awareness", 
      steps: [
        { id: "2A", label: "360° Evaluation" },
        { id: "2B", label: "Growth Inputs" },
        { id: "2C", label: "Evening Pulse" },
      ]
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
      ]
    },
    { 
      phase: "Phase 4", 
      title: "Activation", 
      steps: [
        { id: "4A", label: "Book Kickstart Call" },
        { id: "4B", label: "Join Telegram" },
        { id: "4C", label: "Wealth Strategy" },
      ]
    },
  ]

  const phases = phaseData.map((p, i) => {
    const phaseNum = i + 1
    return {
      ...p,
      status: currentPhase > phaseNum 
        ? "complete" 
        : (currentPhase === phaseNum ? "active" : "locked") as any
    }
  })

  return (
    <aside className="w-80 hidden lg:flex flex-col gap-6 sticky top-20 self-start">
      <div className="space-y-2">
        <h2 className="px-4 text-lg font-bold">Onboarding Journey</h2>
        <p className="px-4 text-xs text-muted-foreground uppercase tracking-widest">Offloading Cares Pathway</p>
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

      <div className="mt-auto p-4 rounded-2xl bg-secondary/30 border border-border/50">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Need help? Your ProTeam is standing by.
        </p>
      </div>
    </aside>
  )
}
