"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Sparkles, MessageSquare, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

type PlanId = "basic" | "intermediate" | "custom"

interface PlanData {
    planId: PlanId
    name: string
    price: string
    period: string
    description: string
    features: string[]
    stripeUrl: string | null
    ctaLabel: string
    isActive: boolean
}

const PLAN_ICONS: Record<PlanId, React.ElementType> = {
    basic: Zap,
    intermediate: Sparkles,
    custom: MessageSquare,
}

const HIGHLIGHTED_PLAN: PlanId = "intermediate"

const FALLBACK_PLANS: PlanData[] = [
    {
        planId: "basic",
        name: "Basic",
        price: "$XX",
        period: "/mo",
        description: "Everything you need to start your peace-driven journey.",
        features: ["Full onboarding pathway", "4-phase guided program", "Progress tracking", "Community access"],
        stripeUrl: null,
        ctaLabel: "Get Started",
        isActive: true,
    },
    {
        planId: "intermediate",
        name: "Intermediate",
        price: "$XX",
        period: "/mo",
        description: "Deeper support for leaders ready to accelerate.",
        features: ["Everything in Basic", "Priority ProTeam access", "Monthly strategy session", "Personalized action plan"],
        stripeUrl: null,
        ctaLabel: "Get Started",
        isActive: true,
    },
    {
        planId: "custom",
        name: "Custom",
        price: "Let's talk",
        period: "",
        description: "Tailored solutions for organizations and teams.",
        features: ["Everything in Intermediate", "Team onboarding", "Custom integrations", "Dedicated success manager"],
        stripeUrl: null,
        ctaLabel: "Contact Us",
        isActive: true,
    },
]

export default function PlansPage() {
    const router = useRouter()
    const [plans, setPlans] = useState<PlanData[]>(FALLBACK_PLANS)
    const [loading, setLoading] = useState<string | null>(null)

    useEffect(() => {
        fetch("/api/plan-config")
            .then((r) => r.json())
            .then((d) => {
                const active = (d.plans as PlanData[]).filter((p) => p.isActive)
                if (active.length) setPlans(active)
            })
            .catch(() => {
                // Keep fallback plans
            })
    }, [])

    async function selectPlan(planId: PlanId, stripeUrl: string | null) {
        setLoading(planId)
        try {
            const res = await fetch("/api/user/select-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planId }),
            })
            if (!res.ok) throw new Error()

            if (stripeUrl) {
                window.open(stripeUrl, "_blank", "noopener,noreferrer")
            }
            router.push("/pending")
        } catch {
            setLoading(null)
        }
    }

    return (
        <div className="relative min-h-svh w-full bg-background">
            <div className="fixed top-4 right-4 z-20">
                <ModeToggle />
            </div>

            {/* Grid background */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(182, 149, 74, 0.15) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(182, 149, 74, 0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                    maskImage: `
                        repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
                        repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
                        radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
                    `,
                    WebkitMaskImage: `
                        repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
                        repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
                        radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
                    `,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                }}
            />

            <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
                {/* Header */}
                <div className="mb-12 text-center">
                    <img
                        src="/assets/pdl-logo.png"
                        alt="Peace-Driven Leadership"
                        className="mx-auto mb-6 h-16 w-auto object-contain"
                    />
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span className="font-mono text-[9px] tracking-[4px] text-primary uppercase">
                            Choose Your Plan
                        </span>
                    </div>
                    <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">
                        Begin Your Journey
                    </h1>
                    <p className="mx-auto max-w-md text-base text-muted-foreground">
                        Select the plan that fits your leadership goals. After checkout, your account will be reviewed and activated within 24 hours.
                    </p>
                </div>

                {/* Plans grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    {plans.map((plan) => {
                        const Icon = PLAN_ICONS[plan.planId] ?? Zap
                        const isHighlighted = plan.planId === HIGHLIGHTED_PLAN
                        const isLoading = loading === plan.planId

                        return (
                            <div
                                key={plan.planId}
                                className={`relative flex flex-col overflow-hidden rounded-2xl border bg-card p-8 shadow-lg transition-all duration-300 hover:shadow-xl ${
                                    isHighlighted
                                        ? "border-primary/40 shadow-primary/10 ring-1 ring-primary/20"
                                        : "border-border/60"
                                }`}
                            >
                                {isHighlighted && (
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                                )}

                                {isHighlighted && (
                                    <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5">
                                        <Sparkles className="h-2.5 w-2.5 text-primary" />
                                        <span className="font-mono text-[8px] tracking-widest text-primary uppercase">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>

                                <h2 className="mb-1 text-xl font-bold text-foreground">
                                    {plan.name}
                                </h2>
                                <div className="mb-3 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-foreground">
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className="text-sm text-muted-foreground">
                                            {plan.period}
                                        </span>
                                    )}
                                </div>
                                <p className="mb-6 text-sm text-muted-foreground">
                                    {plan.description}
                                </p>

                                <ul className="mb-8 flex-1 space-y-3">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-sm">
                                            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15">
                                                <Check className="h-2.5 w-2.5 text-primary" />
                                            </div>
                                            <span className="text-foreground/80">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={() => selectPlan(plan.planId, plan.stripeUrl)}
                                    disabled={!!loading}
                                    variant={isHighlighted ? "default" : "outline"}
                                    className="h-11 w-full rounded-xl"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        plan.ctaLabel
                                    )}
                                </Button>
                            </div>
                        )
                    })}
                </div>

                <p className="mt-8 text-center text-xs text-muted-foreground">
                    Questions? Reach out to our team and we'll help you choose the right plan.
                </p>
            </div>
        </div>
    )
}
