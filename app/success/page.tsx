"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, Heart, Play } from "lucide-react"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { toast } from "sonner"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"
import { VideoPlayer } from "@/components/marketing/video-player"

import Lottie from "lottie-react"
import welcomeAnimation from "@/public/assets/welcome.json"

export default function SuccessPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isStarting, setIsStarting] = useState(false)
  const confettiRef = useRef<ConfettiRef>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      confettiRef.current?.fire({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#d6b56c", "#f1ddb0", "#173029"], // Forest & Gold theme
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

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
        <div className="space-y-8 animate-in fade-in zoom-in duration-1000">
          <div className="relative mx-auto w-64 h-64 flex items-center justify-center transition-all duration-700 hover:scale-110">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <Lottie 
              animationData={welcomeAnimation} 
              loop={true} 
              className="w-full h-full relative z-10"
            />
            <Sparkles className="h-12 w-12 text-primary absolute -top-4 -right-4 animate-bounce z-20" />
            <Heart className="h-10 w-10 text-primary/40 absolute -bottom-4 -left-4 animate-pulse z-20" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 drop-shadow-sm">
              Welcome Home!
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic">
              "I’m truly so glad you’re here."
            </p>
            <div className="max-w-md mx-auto text-muted-foreground leading-relaxed">
              You’ve made a beautiful decision. From this moment forward, you do not have to carry everything alone. You’ve partnered with a team ready to help you thrive.
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_70%)] focus-visible:outline-none pointer-events-none" />
      
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 h-full w-full"
        options={{
          get particleCount() {
            return Math.floor(Math.random() * 50) + 50
          },
        }}
      />
      
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
          <InteractiveHoverButton
            onClick={handleNext}
            disabled={isStarting}
            className="h-16 px-12 text-xl border-primary/30 bg-card/50 backdrop-blur-xl shadow-2xl hover:border-primary transition-all group"
          >
            <span className="flex items-center gap-2">
              {isStarting ? "Activating..." : currentStep.cta}
              {!isStarting && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
            </span>
          </InteractiveHoverButton>

          {step > 0 && !isStarting && (
            <button 
              onClick={() => setStep(step - 1)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] font-medium"
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
