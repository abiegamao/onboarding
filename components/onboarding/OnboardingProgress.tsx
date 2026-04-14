"use client"

import { Heart, Brain, Compass, Rocket } from "lucide-react"

const PHASE_META = [
  { num: 1, label: "Connection", icon: Heart, steps: 6 },
  { num: 2, label: "Awareness", icon: Brain, steps: 3 },
  { num: 3, label: "Stabilization", icon: Compass, steps: 5 },
  { num: 4, label: "Activation", icon: Rocket, steps: 3 },
]

const STEP_LABELS: Record<string, string> = {
  "1A": "Foundation Video", "1B": "Getting to Know You", "1C": "Your Triage",
  "1D": "Open Share", "1E": "Getting to Know Us", "1F": "Schedule Orientation",
  "2A": "360 Evaluation", "2B": "Growth Inputs", "2C": "Evening Pulse",
  "3A": "Vision Activation", "3B": "Vision Statements", "3C": "Ideal Day Narrative",
  "3D": "Word of the Year", "3E": "Family Mission",
  "4A": "Kickstart Call", "4B": "Join Telegram", "4C": "Wealth Strategy",
}

interface Props {
  currentPhase: number
  currentStep: string
  progressValue: number
}

export function OnboardingProgress({ currentPhase, currentStep, progressValue }: Props) {
  const pct = Math.round(progressValue)

  return (
    <div className="relative rounded-2xl overflow-clip border border-border/50 bg-card">
      {/* Top section */}
      <div className="relative px-5 pt-5 pb-4">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{
          background: "radial-gradient(circle, rgba(182,149,74,0.08) 0%, transparent 70%)",
        }} />

        <div className="relative z-10 flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[3px] text-muted-foreground mb-0.5">Pathway Progress</p>
            <p className="text-xs text-muted-foreground/60">
              {STEP_LABELS[currentStep] || currentStep}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tracking-tight" style={{
              backgroundImage: "linear-gradient(135deg, var(--primary), #f1ddb0)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}>{pct}%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2.5 rounded-full bg-primary/10 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${pct}%`,
              backgroundImage: "linear-gradient(90deg, var(--primary), #f1ddb0)",
              boxShadow: "0 0 12px rgba(182,149,74,0.3)",
            }}
          />
          {/* Shimmer */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s linear infinite",
            }}
          />
        </div>
      </div>

      {/* Phase indicators */}
      <div className="grid grid-cols-4 border-t border-border/30">
        {PHASE_META.map((phase) => {
          const isComplete = currentPhase > phase.num
          const isActive = currentPhase === phase.num
          const Icon = phase.icon

          return (
            <div
              key={phase.num}
              className={`flex items-center gap-2 px-3 py-2.5 transition-colors ${
                isActive
                  ? "bg-primary/8"
                  : isComplete
                    ? "bg-primary/3"
                    : ""
              } ${phase.num < 4 ? "border-r border-border/20" : ""}`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  isComplete
                    ? "bg-primary/20 text-primary"
                    : isActive
                      ? "text-primary"
                      : "text-muted-foreground/30"
                }`}
                style={isActive ? {
                  background: "linear-gradient(135deg, rgba(182,149,74,0.2), rgba(212,180,131,0.15))",
                  border: "1px solid rgba(182,149,74,0.25)",
                  boxShadow: "0 0 12px rgba(182,149,74,0.08)",
                } : isComplete ? {} : {}}
              >
                <Icon size={12} />
              </div>
              <div className="hidden sm:block min-w-0">
                <p className={`font-mono text-[8px] uppercase tracking-widest truncate ${
                  isActive ? "text-primary" : isComplete ? "text-primary/60" : "text-muted-foreground/30"
                }`}>
                  {phase.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
