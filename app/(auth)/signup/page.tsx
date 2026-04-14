"use client"

import { SignupForm } from "@/components/signup-form"
import { Heart, Brain, Compass, Rocket, Check } from "lucide-react"

const JOURNEY = [
  { icon: Heart, phase: "01", title: "Connection", desc: "Build your foundation ~ get to know us and let us get to know you.", highlight: true },
  { icon: Brain, phase: "02", title: "Awareness", desc: "360 evaluation, growth inputs, and evening pulse check-ins.", highlight: true },
  { icon: Compass, phase: "03", title: "Stabilization", desc: "Vision activation, ideal day narrative, and family mission.", highlight: false },
  { icon: Rocket, phase: "04", title: "Activation", desc: "Kickstart call, join the community, and set your wealth strategy.", highlight: false },
]

const PERKS = [
  "Guided onboarding pathway",
  "Personalized at every step",
  "Track your progress",
  "Unlock phases as you grow",
]

export default function SignupPage() {
  return (
    <div className="relative min-h-svh w-full flex items-center justify-center bg-background overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center px-6 py-12">

        {/* Left ~ Journey card */}
        <div className="hidden lg:block">
          <style>{`
            @keyframes jGlow { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
            @keyframes jShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            @keyframes jFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes jPulseLine { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.4; } }
            .j-step { animation: jFadeUp 0.6s ease-out both; }
            .j-step:nth-child(1) { animation-delay: 0.1s; }
            .j-step:nth-child(2) { animation-delay: 0.25s; }
            .j-step:nth-child(3) { animation-delay: 0.4s; }
            .j-step:nth-child(4) { animation-delay: 0.55s; }
          `}</style>
          <div className="relative rounded-3xl overflow-hidden p-8 xl:p-10" style={{
            background: "linear-gradient(135deg, #10241f 0%, #1a2e28 25%, #10241f 50%, #0d1f1a 75%, #10241f 100%)",
          }}>
            {/* Glow orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{
              background: "radial-gradient(circle, rgba(182,149,74,0.25) 0%, transparent 70%)",
              animation: "jGlow 6s ease-in-out infinite",
            }} />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{
              background: "radial-gradient(circle, rgba(182,149,74,0.12) 0%, transparent 70%)",
              animation: "jGlow 8s ease-in-out infinite 2s",
            }} />

            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }} />

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-6" style={{
                backgroundImage: "linear-gradient(90deg, rgba(182,149,74,0.15), rgba(212,180,131,0.15), rgba(182,149,74,0.15))",
                backgroundSize: "200% 100%",
                animation: "jShimmer 4s linear infinite",
                border: "1px solid rgba(182,149,74,0.2)",
              }}>
                <Rocket size={10} className="text-primary" />
                <span className="font-mono text-[9px] uppercase tracking-[4px] text-primary">Start Here</span>
              </div>

              <h2 className="text-3xl xl:text-4xl font-bold text-white leading-[0.95] mb-3">
                Begin{" "}
                <span className="italic font-normal" style={{
                  backgroundImage: "linear-gradient(135deg, #b6954a, #d4b483)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                }}>
                  your journey.
                </span>
              </h2>
              <p className="italic text-white/35 text-sm mb-8 max-w-sm leading-relaxed">
                Create your account and step into a guided pathway designed to help you offload what weighs you down.
              </p>

              {/* Steps */}
              <div className="space-y-1">
                {JOURNEY.map((step, i) => (
                  <div key={step.phase} className="j-step group flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: step.highlight ? "linear-gradient(135deg, rgba(182,149,74,0.25), rgba(212,180,131,0.2))" : "rgba(255,255,255,0.04)",
                          border: step.highlight ? "1px solid rgba(182,149,74,0.3)" : "1px solid rgba(255,255,255,0.08)",
                          boxShadow: step.highlight ? "0 0 20px rgba(182,149,74,0.1)" : "none",
                        }}
                      >
                        <step.icon size={16} className={`transition-colors duration-300 ${step.highlight ? "text-primary" : "text-white/30 group-hover:text-primary"}`} />
                      </div>
                      {i < JOURNEY.length - 1 && (
                        <div className="w-px h-6 mt-1" style={{
                          background: "linear-gradient(to bottom, rgba(182,149,74,0.25), transparent)",
                          animation: "jPulseLine 3s ease-in-out infinite",
                          animationDelay: `${i * 0.5}s`,
                        }} />
                      )}
                    </div>
                    <div className="pt-1.5 pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[8px] uppercase tracking-widest" style={{
                          backgroundImage: "linear-gradient(90deg, #b6954a, #d4b483)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          color: "transparent",
                          WebkitTextFillColor: "transparent",
                        }}>{step.phase}</span>
                        <span className="text-sm font-bold text-white">{step.title}</span>
                      </div>
                      <p className="italic text-white/30 text-xs leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Perks */}
              <div className="mt-8 pt-6 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {PERKS.map((perk) => (
                  <div key={perk} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{
                      background: "linear-gradient(135deg, rgba(182,149,74,0.2), rgba(212,180,131,0.15))",
                    }}>
                      <Check size={10} className="text-primary" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right ~ Signup form */}
        <div className="w-full max-w-sm mx-auto lg:mx-0 flex flex-col items-center gap-8">
          <div className="flex justify-center">
            <a href="#" className="flex items-center gap-2 font-medium">
              <img src="/assets/logo.png" alt="Logo" className="size-20 object-contain" />
            </a>
          </div>
          <div className="w-full">
            <SignupForm />
          </div>

          {/* Mobile journey */}
          <div className="lg:hidden w-full pt-6 border-t border-border/40">
            <p className="font-mono text-[9px] uppercase tracking-[4px] text-muted-foreground mb-4">Your Journey</p>
            <div className="space-y-3">
              {JOURNEY.map((step) => (
                <div key={step.phase} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${step.highlight ? "bg-primary/15" : "bg-muted"}`}>
                    <step.icon size={13} className={step.highlight ? "text-primary" : "text-muted-foreground"} />
                  </div>
                  <span className="text-xs font-semibold">{step.title}</span>
                  <span className="font-mono text-[8px] text-muted-foreground ml-auto">{step.phase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
