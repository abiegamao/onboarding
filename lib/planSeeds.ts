export interface PlanSeed {
    planId: "basic" | "intermediate" | "custom"
    name: string
    price: string
    period: string
    description: string
    features: string[]
    stripeUrl: string | null
    ctaLabel: string
    isActive: boolean
}

export const PLAN_SEEDS: PlanSeed[] = [
    {
        planId: "basic",
        name: "Basic",
        price: "$XX",
        period: "/mo",
        description: "Everything you need to start your peace-driven journey.",
        features: [
            "Full onboarding pathway",
            "4-phase guided program",
            "Progress tracking",
            "Community access",
        ],
        stripeUrl: process.env.NEXT_PUBLIC_STRIPE_BASIC_URL ?? null,
        ctaLabel: "Get Started",
        isActive: true,
    },
    {
        planId: "intermediate",
        name: "Intermediate",
        price: "$XX",
        period: "/mo",
        description: "Deeper support for leaders ready to accelerate.",
        features: [
            "Everything in Basic",
            "Priority ProTeam access",
            "Monthly strategy session",
            "Personalized action plan",
        ],
        stripeUrl: process.env.NEXT_PUBLIC_STRIPE_INTERMEDIATE_URL ?? null,
        ctaLabel: "Get Started",
        isActive: true,
    },
    {
        planId: "custom",
        name: "Custom",
        price: "Let's talk",
        period: "",
        description: "Tailored solutions for organizations and teams.",
        features: [
            "Everything in Intermediate",
            "Team onboarding",
            "Custom integrations",
            "Dedicated success manager",
        ],
        stripeUrl: null,
        ctaLabel: "Contact Us",
        isActive: true,
    },
]

export const PLAN_SEED_MAP: Record<string, PlanSeed> = Object.fromEntries(
    PLAN_SEEDS.map((p) => [p.planId, p])
)
