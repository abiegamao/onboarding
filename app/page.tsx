import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Button } from "@/components/ui/button"
import { LandingNav } from "@/components/landing-nav"
import {
    Sparkles,
    UserCircle,
    HeartPulse,
    ShieldCheck,
    Zap,
    ArrowRight,
    Check,
} from "lucide-react"
import Link from "next/link"

const PHASES = [
    {
        phase: "01",
        title: "Connection",
        icon: UserCircle,
        desc: "Establish the foundation. Map your neurodiversity and leadership triage.",
        steps: [
            "Foundation Video",
            "Getting to Know You",
            "Your Triage",
            "Schedule Orientation",
        ],
    },
    {
        phase: "02",
        title: "Awareness",
        icon: HeartPulse,
        desc: "360 evaluations and growth inputs to identify historical blocks.",
        steps: ["360 Evaluation", "Growth Inputs", "Evening Pulse"],
    },
    {
        phase: "03",
        title: "Stabilization",
        icon: ShieldCheck,
        desc: "Create your Ideal Day Narrative and activate your family mission.",
        steps: [
            "Vision Activation",
            "Vision Statements",
            "Ideal Day Narrative",
        ],
    },
    {
        phase: "04",
        title: "Activation",
        icon: Zap,
        desc: "Full pro-team support and community activation for wealth and legacy.",
        steps: ["Kickstart Call", "Join Telegram", "Wealth Strategy"],
    },
]

const PROMISES = [
    "Personalized at every step",
    "Guided by experts",
    "Track your progress in real-time",
    "Unlock phases as you grow",
    "Built for leaders, not followers",
]

export default function Page() {
    return (
        <div className="relative min-h-screen overflow-x-hidden bg-background font-sans text-foreground">
            {/* Global animations */}
            <style>{`
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulseLine { 0%, 100% { opacity: 0.12; } 50% { opacity: 0.35; } }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                .fade-up { animation: fadeUp 0.8s ease-out both; }
                .fade-up-1 { animation-delay: 0.1s; }
                .fade-up-2 { animation-delay: 0.2s; }
                .fade-up-3 { animation-delay: 0.35s; }
                .fade-up-4 { animation-delay: 0.5s; }
                .phase-card { animation: fadeUp 0.7s ease-out both; }
                .phase-card:nth-child(1) { animation-delay: 0.1s; }
                .phase-card:nth-child(2) { animation-delay: 0.25s; }
                .phase-card:nth-child(3) { animation-delay: 0.4s; }
                .phase-card:nth-child(4) { animation-delay: 0.55s; }
            `}</style>
            {/* Full-Screen Ambient Gold Glare Animation */}
            {/* <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div 
                    className="absolute inset-[-100%] opacity-40 mix-blend-screen dark:opacity-20"
                    style={{
                        background: "conic-gradient(from 90deg at 50% 50%, transparent 0%, rgba(182, 149, 74, 0) 30%, rgba(182, 149, 74, 0.35) 50%, rgba(182, 149, 74, 0) 70%, transparent 100%)",
                        filter: "blur(100px)",
                        animation: "spin 20s linear infinite",
                    }} 
                />
            </div> */}

            {/* Dashed Bottom Fade Grid */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    backgroundImage: `
                    linear-gradient(to right, rgba(182, 149, 74, 0.15) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(182, 149, 74, 0.15) 1px, transparent 1px)
                `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 0",
                    maskImage: `
                    repeating-linear-gradient(
                        to right,
                        black 0px,
                        black 3px,
                        transparent 3px,
                        transparent 8px
                        ),
                        repeating-linear-gradient(
                        to bottom,
                        black 0px,
                        black 3px,
                        transparent 3px,
                        transparent 8px
                        ),
                        radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
                `,
                    WebkitMaskImage: `
                    repeating-linear-gradient(
                        to right,
                        black 0px,
                        black 3px,
                        transparent 3px,
                        transparent 8px
                        ),
                        repeating-linear-gradient(
                        to bottom,
                        black 0px,
                        black 3px,
                        transparent 3px,
                        transparent 8px
                        ),
                        radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
                `,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                }}
            />

            {/* Navigation */}
            <LandingNav />

            <main className="relative z-10 mx-auto max-w-7xl space-y-32 px-4 pt-10 pb-40 md:space-y-40 md:px-6 md:pt-24">
                {/* ── Hero ── */}
                <section className="mx-auto max-w-4xl space-y-8 text-center">
                    <div className="fade-up fade-up-1 relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-[10px] font-bold tracking-widest text-primary uppercase md:text-xs">
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                backgroundImage:
                                    "linear-gradient(90deg, transparent, var(--primary), transparent)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 4s linear infinite",
                                opacity: 0.1,
                            }}
                        />
                        <Sparkles className="relative z-10 h-3.5 w-3.5 md:h-4 md:w-4" />
                        <span className="relative z-10">
                            The Path to Peace-Driven Leadership
                        </span>
                    </div>

                    <h1 className="fade-up fade-up-2 text-5xl leading-[0.95] font-bold tracking-tighter sm:text-7xl md:text-8xl">
                        Activate Your{" "}
                        <span
                            style={{
                                backgroundImage:
                                    "linear-gradient(135deg, var(--primary), var(--gold-soft, #f1ddb0))",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                color: "transparent",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Inner Mastery
                        </span>
                    </h1>

                    <p className="fade-up fade-up-3 mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-xl">
                        Transition from burnout to breakthrough. Our proprietary
                        pathway maps your Mind, Body, and Divine Identity to
                        establish peace across every domain.
                    </p>

                    <div className="fade-up fade-up-4 mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4 pt-4 sm:max-w-none sm:flex-row">
                        <Link href="/signup" className="w-full sm:w-auto">
                            <InteractiveHoverButton className="h-12 w-full px-8 text-base md:h-14 md:px-10 md:text-lg">
                                Start Your Pathway
                            </InteractiveHoverButton>
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button
                                variant="ghost"
                                className="h-12 w-full gap-2 px-6 text-base text-muted-foreground hover:bg-primary/5 md:h-14 md:px-8 md:text-lg"
                            >
                                Sign In <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* ── Pathway Section ~ Premium Cards ── */}
                <section className="space-y-16">
                    <div className="fade-up space-y-4 text-center">
                        <p className="font-mono text-[10px] tracking-[4px] text-primary uppercase md:text-xs">
                            The Pathway
                        </p>
                        <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">
                            Four Phases to{" "}
                            <span
                                className="pr-1 font-normal italic"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(135deg, var(--primary), var(--gold-soft, #f1ddb0))",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    color: "transparent",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Breakthrough
                            </span>
                        </h2>
                        <p className="mx-auto max-w-xl text-muted-foreground">
                            A step-by-step evolution designed to deconstruct
                            chaos and rebuild your baseline for sustainable
                            excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        {PHASES.map((item, i) => (
                            <div
                                key={i}
                                className="phase-card group relative overflow-hidden rounded-3xl border border-border/50 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 md:p-8"
                                style={{ background: "var(--card)" }}
                            >
                                {/* Hover glow */}
                                <div
                                    className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                                    style={{
                                        background:
                                            "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                                        opacity: 0,
                                        filter: "blur(60px)",
                                    }}
                                />
                                <div
                                    className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full transition-opacity duration-700 group-hover:opacity-[0.08]"
                                    style={{
                                        background:
                                            "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                                        opacity: 0,
                                        filter: "blur(60px)",
                                    }}
                                />

                                <div className="relative z-10 space-y-5">
                                    {/* Icon + phase */}
                                    <div className="flex items-start justify-between">
                                        <div
                                            className="rounded-2xl border border-border/50 bg-secondary/30 p-3 transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/10"
                                            style={{
                                                boxShadow: "none",
                                            }}
                                        >
                                            <item.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <span
                                            className="font-mono text-[10px] tracking-widest uppercase"
                                            style={{
                                                backgroundImage:
                                                    "linear-gradient(90deg, var(--primary), var(--gold-soft, #f1ddb0))",
                                                backgroundClip: "text",
                                                WebkitBackgroundClip: "text",
                                                color: "transparent",
                                                WebkitTextFillColor:
                                                    "transparent",
                                            }}
                                        >
                                            Phase {item.phase}
                                        </span>
                                    </div>

                                    {/* Title + desc */}
                                    <div>
                                        <h3 className="mb-2 text-xl font-bold md:text-2xl">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Steps */}
                                    <div className="flex flex-wrap gap-2">
                                        {item.steps.map((step) => (
                                            <span
                                                key={step}
                                                className="rounded-lg border border-border/30 bg-secondary/50 px-2.5 py-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase dark:bg-secondary/80"
                                            >
                                                {step}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Journey Timeline (vertical) ── */}
                <section className="mx-auto max-w-3xl space-y-12">
                    <div className="fade-up space-y-4 text-center">
                        <p className="font-mono text-[10px] tracking-[4px] text-primary uppercase md:text-xs">
                            How It Works
                        </p>
                        <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">
                            Your{" "}
                            <span
                                className="pr-1 font-normal italic"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(135deg, var(--primary), var(--gold-soft, #f1ddb0))",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    color: "transparent",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Journey
                            </span>
                        </h2>
                    </div>

                    {/* Premium journey card ~ light: warm cream/gold, dark: deep green */}
                    <div className="relative overflow-clip rounded-3xl border border-[#e0d5c0] bg-gradient-to-br from-[#f6f0e4] via-[#f9f5ed] to-[#f2eadb] p-8 md:p-10 dark:border-white/5 dark:from-[#10241f] dark:via-[#1a2e28] dark:to-[#0d1f1a]">
                        {/* Glow orbs */}
                        <div
                            className="pointer-events-none absolute top-0 right-0 h-56 w-56 rounded-full blur-3xl"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(182,149,74,0.15) 0%, transparent 70%)",
                                animation: "glow 6s ease-in-out infinite",
                            }}
                        />
                        <div
                            className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full blur-3xl"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(182,149,74,0.08) 0%, transparent 70%)",
                                animation: "glow 8s ease-in-out infinite 2s",
                            }}
                        />

                        <div className="relative z-10 space-y-2">
                            {PHASES.map((phase, i) => (
                                <div
                                    key={phase.phase}
                                    className="phase-card group flex items-start gap-5"
                                >
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                                            style={{
                                                background:
                                                    i < 2
                                                        ? "linear-gradient(135deg, rgba(182,149,74,0.2), rgba(212,180,131,0.15))"
                                                        : "rgba(128,128,128,0.06)",
                                                border:
                                                    i < 2
                                                        ? "1px solid rgba(182,149,74,0.3)"
                                                        : "1px solid rgba(128,128,128,0.12)",
                                                boxShadow:
                                                    i < 2
                                                        ? "0 0 24px rgba(182,149,74,0.08)"
                                                        : "none",
                                            }}
                                        >
                                            <phase.icon
                                                size={20}
                                                className={`transition-colors duration-300 ${i < 2 ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary"}`}
                                            />
                                        </div>
                                        {i < PHASES.length - 1 && (
                                            <div
                                                className="mt-2 h-8 w-px"
                                                style={{
                                                    background:
                                                        "linear-gradient(to bottom, rgba(182,149,74,0.25), transparent)",
                                                    animation:
                                                        "pulseLine 3s ease-in-out infinite",
                                                    animationDelay: `${i * 0.5}s`,
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="pt-2 pb-4">
                                        <div className="mb-1.5 flex items-center gap-3">
                                            <span
                                                className="font-mono text-[10px] tracking-widest uppercase"
                                                style={{
                                                    backgroundImage:
                                                        "linear-gradient(90deg, #b6954a, #d4b483)",
                                                    backgroundClip: "text",
                                                    WebkitBackgroundClip:
                                                        "text",
                                                    color: "transparent",
                                                    WebkitTextFillColor:
                                                        "transparent",
                                                }}
                                            >
                                                {phase.phase}
                                            </span>
                                            <span className="text-base font-bold text-foreground">
                                                {phase.title}
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-muted-foreground/60 italic">
                                            {phase.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Promises ── */}
                <section className="mx-auto max-w-3xl">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {PROMISES.map((perk, i) => (
                            <div
                                key={perk}
                                className="fade-up flex items-center gap-3 rounded-2xl border border-border/30 bg-card/50 p-4 backdrop-blur-sm"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                                    <Check size={12} className="text-primary" />
                                </div>
                                <span className="text-sm font-medium">
                                    {perk}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Final CTA ── */}
                <section className="relative overflow-hidden rounded-[2rem] text-center md:rounded-[3rem]">
                    {/* Dark gradient bg */}
                    <div
                        className="relative p-10 md:p-24"
                        style={{
                            background:
                                "linear-gradient(135deg, #10241f 0%, #1a2e28 30%, #10241f 60%, #0d1f1a 100%)",
                        }}
                    >
                        {/* Glow */}
                        <div
                            className="pointer-events-none absolute top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(182,149,74,0.2) 0%, transparent 70%)",
                                filter: "blur(80px)",
                                animation: "glow 6s ease-in-out infinite",
                            }}
                        />

                        <div className="relative z-10 space-y-6">
                            <h2 className="text-3xl leading-tight font-bold tracking-tighter text-white md:text-6xl">
                                Your Legacy Begins{" "}
                                <span
                                    className="pr-1 font-normal italic"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(135deg, #b6954a, #f1ddb0)",
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                        color: "transparent",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    with Peace.
                                </span>
                            </h2>
                            <p className="mx-auto max-w-md text-base text-white/40 md:text-lg">
                                The pathway is open. Are you ready to activate
                                your potential?
                            </p>
                            <div className="pt-4 md:pt-6">
                                <Link
                                    href="/signup"
                                    className="inline-block w-full sm:w-auto"
                                >
                                    <InteractiveHoverButton className="h-14 w-full px-10 text-lg sm:w-auto md:h-16 md:px-12 md:text-xl">
                                        Apply to Join
                                    </InteractiveHoverButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 px-8 py-12 text-center text-sm text-muted-foreground">
                <p>
                    &copy; {new Date().getFullYear()} Minesha. All rights
                    reserved.
                </p>
                <div className="mt-4 flex items-center justify-center gap-6">
                    <Link
                        href="#"
                        className="transition-colors hover:text-primary"
                    >
                        Terms
                    </Link>
                    <Link
                        href="#"
                        className="transition-colors hover:text-primary"
                    >
                        Privacy
                    </Link>
                    <Link
                        href="#"
                        className="transition-colors hover:text-primary"
                    >
                        Support
                    </Link>
                </div>
            </footer>
        </div>
    )
}
