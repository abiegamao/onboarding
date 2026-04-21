"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, Heart, Shield } from "lucide-react"
import Lottie from "lottie-react"
import welcomeLottie from "@/public/assets/welcome-lottie.json"
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
                <div className="animate-in space-y-10 duration-1000 fade-in">
                    <style>{`
            @keyframes welcomeGlow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
            @keyframes welcomeFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
            @keyframes welcomeRing { 0% { transform: scale(0.8); opacity: 0; } 50% { opacity: 0.3; } 100% { transform: scale(1.6); opacity: 0; } }
          `}</style>
                    <div className="relative mx-auto flex h-48 w-48 items-center justify-center md:h-80 md:w-80">
                        <div
                            className="pointer-events-none absolute inset-0 rounded-full blur-3xl"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(182,149,74,0.3) 0%, transparent 70%)",
                                animation:
                                    "welcomeGlow 4s ease-in-out infinite",
                            }}
                        />
                        <div
                            className="absolute inset-0 rounded-full border border-primary/20"
                            style={{
                                animation: "welcomeRing 3s ease-out infinite",
                            }}
                        />
                        <div
                            className="absolute inset-0 rounded-full border border-primary/15"
                            style={{
                                animation:
                                    "welcomeRing 3s ease-out infinite 1s",
                            }}
                        />
                        <div
                            className="relative flex h-48 w-48 items-center justify-center md:h-80 md:w-80"
                            style={{
                                animation:
                                    "welcomeFloat 4s ease-in-out infinite",
                            }}
                        >
                            <Lottie
                                animationData={welcomeLottie}
                                loop
                                autoplay
                                className="h-full w-full"
                            />
                        </div>
                        <Shield
                            size={20}
                            className="absolute -top-2 -right-2 text-primary/40"
                            style={{
                                animation:
                                    "welcomeFloat 3s ease-in-out infinite 0.5s",
                            }}
                        />
                        <Heart
                            size={16}
                            className="absolute -bottom-1 -left-3 text-primary/30"
                            style={{
                                animation:
                                    "welcomeFloat 3.5s ease-in-out infinite 1s",
                            }}
                        />
                        <Sparkles
                            size={14}
                            className="absolute top-4 -left-6 text-primary/25"
                            style={{
                                animation:
                                    "welcomeFloat 4s ease-in-out infinite 1.5s",
                            }}
                        />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
                            Welcome{" "}
                            <span
                                className="font-normal italic"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(135deg, var(--primary), var(--accent-foreground, #d4b483))",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    color: "transparent",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Home.
                            </span>
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic sm:text-2xl">
                            &ldquo;I&rsquo;m truly so glad you&rsquo;re
                            here.&rdquo;
                        </p>
                        <div className="mx-auto max-w-md leading-relaxed text-muted-foreground">
                            You&rsquo;ve made a beautiful decision. From this
                            moment forward, you do not have to carry everything
                            alone. You&rsquo;ve partnered with a team ready to
                            help you thrive.
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
                <div className="animate-in space-y-6 duration-700 fade-in slide-in-from-right-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">
                            The Invitation
                        </h2>
                        <p className="mx-auto max-w-lg text-lg text-muted-foreground">
                            Hear directly from our founders about why this
                            activation pathway is the gold standard for
                            high-performance impact.
                        </p>
                    </div>
                    <div className="group relative">
                        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/20 to-primary/10 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
                        <VideoPlayer
                            title="Welcome to Minesha"
                            videoId="bNdeTAV9UJg"
                            className="relative aspect-video w-full overflow-hidden rounded-2xl border border-primary/20 shadow-2xl"
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
                <div className="animate-in space-y-6 duration-700 fade-in slide-in-from-right-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">
                            The Philosophy
                        </h2>
                        <p className="mx-auto max-w-lg text-lg text-muted-foreground">
                            A deep dive into how we calibrate your internal
                            wiring to achieve supernatural results in your life
                            and legacy.
                        </p>
                    </div>
                    <div className="group relative">
                        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/20 to-primary/10 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
                        <VideoPlayer
                            title="The Core Methodology"
                            videoId="gpJXBcNWmTg"
                            className="relative aspect-video w-full overflow-hidden rounded-2xl border border-primary/20 shadow-2xl"
                        />
                    </div>
                </div>
            ),
            cta: "Activate My Pathway",
        },
    ]

    const currentStep = steps[step]

    function handleNext() {
        if (step < steps.length - 1) {
            setStep(step + 1)
            window.scrollTo({ top: 0, behavior: "smooth" })
        } else {
            handleComplete()
        }
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 md:p-8">
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
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute top-1/3 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-3xl"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(182,149,74,0.08) 0%, transparent 70%)",
                    }}
                />
            </div>
            {/* Floating gold particles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="gold-particle"
                        style={{
                            left: `${8 + i * 7.5}%`,
                            width: i % 3 === 0 ? 4 : i % 3 === 1 ? 3 : 2,
                            height: i % 3 === 0 ? 4 : i % 3 === 1 ? 3 : 2,
                            background: `rgba(182,149,74,${0.15 + (i % 4) * 0.08})`,
                            animationDuration: `${8 + i * 1.5}s`,
                            animationDelay: `${i * 0.8}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-4xl space-y-12 text-center">
                {/* Progress Bar */}
                <div className="mx-auto mb-8 flex max-w-xs items-center gap-2">
                    {steps.map((s, i) => (
                        <div
                            key={s.id}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                i <= step
                                    ? "bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                                    : "bg-primary/10"
                            }`}
                        />
                    ))}
                </div>

                {currentStep.content}

                <div className="flex flex-col items-center gap-6 pt-4">
                    <button
                        onClick={handleNext}
                        disabled={isStarting}
                        className="group relative h-14 overflow-hidden rounded-xl px-10 text-base font-bold tracking-wider uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 md:h-16 md:px-14 md:text-lg"
                        style={{
                            backgroundImage:
                                "linear-gradient(135deg, var(--primary), var(--accent-foreground, #d4b483))",
                            color: "var(--primary-foreground)",
                            boxShadow:
                                "0 4px 24px rgba(182,149,74,0.25), 0 0 0 1px rgba(182,149,74,0.1)",
                        }}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {isStarting ? (
                                <>
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
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
                            <span
                                className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(135deg, var(--accent-foreground, #d4b483), var(--primary))",
                                }}
                            />
                        )}
                    </button>

                    {step > 0 && !isStarting && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="h-10 rounded-xl border border-border/40 px-6 text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                        >
                            Go Back
                        </button>
                    )}

                    <div className="space-y-1">
                        <p className="flex items-center justify-center gap-1 text-sm font-light tracking-[0.3em] text-muted-foreground uppercase">
                            The Peace-Driven Leader
                            <span className="font-bold text-primary">™</span>
                        </p>
                        <p className="text-[10px] tracking-[0.1em] text-muted-foreground/50 uppercase">
                            Step {step + 1} of {steps.length} • Activation
                            Sequence
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
