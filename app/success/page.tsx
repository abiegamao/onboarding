"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, Heart, Play, Crown, Shield } from "lucide-react"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { toast } from "sonner"
import { VideoPlayer } from "@/components/marketing/video-player"

export default function SuccessPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isStarting, setIsStarting] = useState(false)

  async function handleComplete() {
    setIsStarting(true)
    try {
      const res = await fetch("/api/onboarding/complete-celebration", {
        method: "POST",
      })

      if (res.ok) {
        toast.success("Welcome aboard, Leader.")
        router.push("/dashboard")
        router.refresh()
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      toast.error("Process interrupted. Redirecting...")
      router.push("/dashboard")
    } finally {
      setIsStarting(false)
    }
  }

  const steps = [
    {
      id: 0,
      title: "Welcome Home!",
      subtitle: '"I’m truly so glad you’re here."',
      content: (
        <div className="space-y-10 animate-in fade-in duration-1000">
          <style>{`
            @keyframes welcomeGlow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
            @keyframes welcomeFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
            @keyframes welcomeRing { 0% { transform: scale(0.8); opacity: 0; } 50% { opacity: 0.3; } 100% { transform: scale(1.6); opacity: 0; } }
          `}</style>
          <div className="relative mx-auto w-48 h-48 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full blur-3xl pointer-events-none" style={{
              background: "radial-gradient(circle, rgba(182,149,74,0.3) 0%, transparent 70%)",
              animation: "welcomeGlow 4s ease-in-out infinite",
            }} />
            <div className="absolute inset-0 rounded-full border border-primary/20" style={{ animation: "welcomeRing 3s ease-out infinite" }} />
            <div className="absolute inset-0 rounded-full border border-primary/15" style={{ animation: "welcomeRing 3s ease-out infinite 1s" }} />
            <div className="relative w-32 h-32 rounded-full flex items-center justify-center" style={{
              backgroundImage: "linear-gradient(135deg, var(--primary), var(--accent-foreground, #d4b483))",
              boxShadow: "0 8px 40px rgba(182,149,74,0.3)",
              animation: "welcomeFloat 4s ease-in-out infinite",
            }}>
              <Crown size={48} className="text-primary-foreground" />
            </div>
            <Shield size={20} className="text-primary/40 absolute -top-2 -right-2" style={{ animation: "welcomeFloat 3s ease-in-out infinite 0.5s" }} />
            <Heart size={16} className="text-primary/30 absolute -bottom-1 -left-3" style={{ animation: "welcomeFloat 3.5s ease-in-out infinite 1s" }} />
            <Sparkles size={14} className="text-primary/25 absolute top-4 -left-6" style={{ animation: "welcomeFloat 4s ease-in-out infinite 1.5s" }} />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
              Welcome{" "}
              <span className="italic font-normal" style={{
                backgroundImage: "linear-gradient(135deg, var(--primary), var(--accent-foreground, #d4b483))",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}>Home.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic">
              &ldquo;I&rsquo;m truly so glad you&rsquo;re here.&rdquo;
            </p>
            <div className="max-w-md mx-auto text-muted-foreground leading-relaxed">
              You&rsquo;ve made a beautiful decision. From this moment forward, you do not have to carry everything alone. You&rsquo;ve partnered with a team ready to help you thrive.
            </div>
          </div>
        </div>
      ),
      cta: "Watch Orientation",
    },
    {
      id: 1,
      title: "The Invitation",
      subtitle: "A message from our founders",
      content: (
        <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-700">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">The Invitation</h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Hear directly from our founders about why this activation pathway is the gold standard for high-performance impact.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <VideoPlayer 
              title="Welcome to Minesha"
              videoId="bNdeTAV9UJg" 
              className="relative w-full aspect-video rounded-2xl shadow-2xl border border-primary/20 overflow-hidden"
            />
          </div>
        </div>
      ),
      cta: "Continue Methodology",
    },
    {
      id: 2,
      title: "The Philosophy",
      subtitle: "Our Core Methodology",
      content: (
        <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-700">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">The Philosophy</h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              A deep dive into how we calibrate your internal wiring to achieve supernatural results in your life and legacy.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <VideoPlayer 
              title="The Core Methodology"
              videoId="gpJXBcNWmTg" 
              className="relative w-full aspect-video rounded-2xl shadow-2xl border border-primary/20 overflow-hidden"
            />
          </div>
        </div>
      ),
      cta: "Activate My Pathway",
    }
  ]

  const currentStep = steps[step]

  function handleNext() {
    if (step < steps.length - 1) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleComplete()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
      <style>{`
        @keyframes particleRise {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-20vh) scale(1); opacity: 0; }
        }
        .gold-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: particleRise linear infinite;
        }
      `}</style>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl" style={{
          background: "radial-gradient(circle, rgba(182,149,74,0.08) 0%, transparent 70%)",
        }} />
      </div>
      {/* Floating gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="gold-particle"
            style={{
              left: `${8 + (i * 7.5)}%`,
              width: i % 3 === 0 ? 4 : i % 3 === 1 ? 3 : 2,
              height: i % 3 === 0 ? 4 : i % 3 === 1 ? 3 : 2,
              background: `rgba(182,149,74,${0.15 + (i % 4) * 0.08})`,
              animationDuration: `${8 + (i * 1.5)}s`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
        
        {/* Progress Bar */}
        <div className="max-w-xs mx-auto flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div 
              key={s.id} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" : "bg-primary/10"
              }`}
            />
          ))}
        </div>

        {currentStep.content}

        <div className="pt-4 flex flex-col items-center gap-6">
          <button
            onClick={handleNext}
            disabled={isStarting}
            className="group relative h-14 md:h-16 px-10 md:px-14 rounded-xl text-base md:text-lg font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--primary), var(--accent-foreground, #d4b483))",
              color: "var(--primary-foreground)",
              boxShadow: "0 4px 24px rgba(182,149,74,0.25), 0 0 0 1px rgba(182,149,74,0.1)",
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isStarting ? (
                <>
                  <span className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  Activating
                </>
              ) : (
                <>
                  {currentStep.cta}
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </span>
            {!isStarting && (
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                backgroundImage: "linear-gradient(135deg, var(--accent-foreground, #d4b483), var(--primary))",
              }} />
            )}
          </button>

          {step > 0 && !isStarting && (
            <button
              onClick={() => setStep(step - 1)}
              className="h-10 px-6 rounded-xl border border-border/40 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 uppercase tracking-[0.15em]"
            >
              Go Back
            </button>
          )}

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-[0.3em] font-light flex items-center justify-center gap-1">
              The Peace-Driven Leader<span className="text-primary font-bold">™</span>
            </p>
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.1em]">
              Step {step + 1} of {steps.length} • Activation Sequence
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
