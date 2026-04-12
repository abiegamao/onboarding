"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Lock } from "lucide-react"

interface SidebarItemProps {
  phase: string
  title: string
  status: "complete" | "active" | "locked"
  onClick?: () => void
}

function SidebarItem({ phase, title, status, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={status !== "locked" ? onClick : undefined}
      className={cn(
        "group flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden",
        status === "active" 
          ? "bg-primary/5 border border-primary/20 shadow-sm" 
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
  )
}

export function OnboardingSidebar() {
  const phases = [
    { phase: "Phase 1", title: "Connection", status: "active" as const },
    { phase: "Phase 2", title: "Awareness", status: "locked" as const },
    { phase: "Phase 3", title: "Stabilization", status: "locked" as const },
    { phase: "Phase 4", title: "Activation", status: "locked" as const },
  ]

  return (
    <aside className="w-80 hidden lg:flex flex-col gap-6 sticky top-20 self-start">
      <div className="space-y-2">
        <h2 className="px-4 text-lg font-bold">Onboarding Journey</h2>
        <p className="px-4 text-xs text-muted-foreground uppercase tracking-widest">Offloading Cares Pathway</p>
      </div>

      <nav className="space-y-2">
        {phases.map((item) => (
          <SidebarItem key={item.phase} {...item} />
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
