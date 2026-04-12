"use client"

import { useState } from "react"
import { Play, ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest">
          <Sparkles className="h-3 w-3" />
          Orientation
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          The First Step: Connection
        </h1>
        <p className="text-xl text-muted-foreground italic font-medium">
          "Establishing the foundation of your journey."
        </p>
      </div>

      {/* Video Landing Placeholder */}
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl group border border-primary/10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Button variant="outline" size="icon" className="h-20 w-20 rounded-full border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-110 transition-all text-white border-2">
            <Play className="h-8 w-8 fill-current ml-1" />
          </Button>
        </div>
        <div className="absolute bottom-6 left-6 space-y-1">
          <p className="text-white font-bold text-lg">Welcome from your ProTeam</p>
          <p className="text-white/70 text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> 
            3:45 • High Fidelity Connection
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Human-First Leadership
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            In this phase, we move beyond metrics. We want to understand the heartbeat of your leadership. Who you are when the pressure is off.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Extreme Privacy
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Everything shared here is encrypted and accessible only to your dedicated Activation Team. This is your safe harbor.
          </p>
        </div>
      </div>

      {/* CTA Area */}
      <div className="pt-8 border-t border-border/50 flex flex-col items-center sm:flex-row sm:justify-between gap-6">
        <div className="text-center sm:text-left">
          <p className="text-sm text-muted-foreground">Ready to offload your first layer?</p>
          <p className="font-semibold">Next: SNAP Snapshot Assessment</p>
        </div>
        
        <InteractiveHoverButton className="h-14 px-10 text-lg">
          Continue to SNAP Assessment
        </InteractiveHoverButton>
      </div>
    </div>
  )
}
