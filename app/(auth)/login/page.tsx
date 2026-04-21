import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"
import { ModeToggle } from "@/components/mode-toggle"
import { Heart, Brain, Compass, Rocket } from "lucide-react"

const JOURNEY = [
    {
        icon: Heart,
        phase: "01",
        title: "Connection",
        desc: "Build your foundation ~ get to know us and let us get to know you.",
        highlight: true,
    },
    {
        icon: Brain,
        phase: "02",
        title: "Awareness",
        desc: "360 evaluation, growth inputs, and evening pulse check-ins.",
        highlight: true,
    },
    {
        icon: Compass,
        phase: "03",
        title: "Stabilization",
        desc: "Vision activation, ideal day narrative, and family mission.",
        highlight: false,
    },
    {
        icon: Rocket,
        phase: "04",
        title: "Activation",
        desc: "Kickstart call, join the community, and set your wealth strategy.",
        highlight: false,
    },
]

export default function LoginPage() {
    return (
        <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background">
            {/* Theme toggle */}
            <div className="absolute top-4 right-4 z-20">
                <ModeToggle />
            </div>

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

            <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 items-center gap-16 px-6 py-12 lg:grid-cols-2 lg:gap-20">
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
                    <div className="relative overflow-hidden rounded-3xl border border-[#e0d5c0] bg-gradient-to-br from-[#f6f0e4] via-[#f9f5ed] to-[#f2eadb] p-8 xl:p-10 dark:border-white/5 dark:from-[#10241f] dark:via-[#1a2e28] dark:to-[#0d1f1a]">
                        {/* Glow orbs */}
                        <div
                            className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full opacity-100 blur-3xl dark:opacity-100"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(182,149,74,0.2) 0%, transparent 70%)",
                                animation: "jGlow 6s ease-in-out infinite",
                            }}
                        />
                        <div
                            className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full blur-3xl"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(182,149,74,0.12) 0%, transparent 70%)",
                                animation: "jGlow 8s ease-in-out infinite 2s",
                            }}
                        />

                        <div className="relative z-10">
                            {/* Badge */}
                            <div
                                className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(90deg, rgba(182,149,74,0.15), rgba(212,180,131,0.15), rgba(182,149,74,0.15))",
                                    backgroundSize: "200% 100%",
                                    animation: "jShimmer 4s linear infinite",
                                    border: "1px solid rgba(182,149,74,0.2)",
                                }}
                            >
                                <Compass size={10} className="text-primary" />
                                <span className="font-mono text-[9px] tracking-[4px] text-primary uppercase">
                                    Your Journey
                                </span>
                            </div>

                            <h2 className="mb-3 text-3xl leading-[0.95] font-bold text-foreground xl:text-4xl">
                                Offloading{" "}
                                <span
                                    className="font-normal italic"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(135deg, #b6954a, #d4b483)",
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                        color: "transparent",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    Cares.
                                </span>
                            </h2>
                            <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground italic">
                                A guided pathway to connection, awareness,
                                stabilization, and activation. One step at a
                                time.
                            </p>

                            {/* Steps */}
                            <div className="space-y-1">
                                {JOURNEY.map((step, i) => (
                                    <div
                                        key={step.phase}
                                        className="j-step group flex items-start gap-4"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                                                style={{
                                                    background: step.highlight
                                                        ? "linear-gradient(135deg, rgba(182,149,74,0.25), rgba(212,180,131,0.2))"
                                                        : "rgba(255,255,255,0.04)",
                                                    border: step.highlight
                                                        ? "1px solid rgba(182,149,74,0.3)"
                                                        : "1px solid rgba(255,255,255,0.08)",
                                                    boxShadow: step.highlight
                                                        ? "0 0 20px rgba(182,149,74,0.1)"
                                                        : "none",
                                                }}
                                            >
                                                <step.icon
                                                    size={16}
                                                    className={`transition-colors duration-300 ${step.highlight ? "text-primary" : "text-muted-foreground/70 group-hover:text-primary"}`}
                                                />
                                            </div>
                                            {i < JOURNEY.length - 1 && (
                                                <div
                                                    className="mt-1 h-6 w-px"
                                                    style={{
                                                        background:
                                                            "linear-gradient(to bottom, rgba(182,149,74,0.25), transparent)",
                                                        animation:
                                                            "jPulseLine 3s ease-in-out infinite",
                                                        animationDelay: `${i * 0.5}s`,
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="pt-1.5 pb-2">
                                            <div className="mb-1 flex items-center gap-2">
                                                <span
                                                    className="font-mono text-[8px] tracking-widest uppercase"
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
                                                    {step.phase}
                                                </span>
                                                <span className="text-sm font-bold text-foreground">
                                                    {step.title}
                                                </span>
                                            </div>
                                            <p className="text-xs leading-relaxed text-muted-foreground/70 italic">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div
                                className="mt-8 flex items-center gap-6 pt-6"
                                style={{ borderTop: "1px solid var(--border)" }}
                            >
                                {[
                                    { val: "4", label: "Phases" },
                                    { val: "17", label: "Steps" },
                                    { val: "Guided", label: "Pathway" },
                                ].map((stat, i) => (
                                    <div
                                        key={stat.label}
                                        className="flex items-center gap-6"
                                    >
                                        {i > 0 && (
                                            <div
                                                className="h-8 w-px"
                                                style={{
                                                    background: "var(--border)",
                                                }}
                                            />
                                        )}
                                        <div>
                                            <p
                                                className="text-2xl font-bold tracking-tight"
                                                style={{
                                                    backgroundImage:
                                                        "linear-gradient(135deg, var(--primary), var(--accent-foreground, #d4b483))",
                                                    backgroundClip: "text",
                                                    WebkitBackgroundClip:
                                                        "text",
                                                    color: "transparent",
                                                    WebkitTextFillColor:
                                                        "transparent",
                                                }}
                                            >
                                                {stat.val}
                                            </p>
                                            <p className="font-mono text-[8px] tracking-widest text-muted-foreground/60 uppercase">
                                                {stat.label}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right ~ Login form */}
                <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-8 lg:mx-0">
                    <div className="flex justify-center">
                        <a
                            href="#"
                            className="flex items-center gap-2 font-medium"
                        >
                            <img
                                src="/assets/logo.png"
                                alt="Logo"
                                className="size-20 object-contain"
                            />
                        </a>
                    </div>
                    <div className="w-full">
                        <Suspense
                            fallback={
                                <div className="flex min-h-[200px] items-center justify-center">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                </div>
                            }
                        >
                            <LoginForm />
                        </Suspense>
                    </div>

                    {/* Mobile journey */}
                    <div className="w-full border-t border-border/40 pt-6 lg:hidden">
                        <p className="mb-4 font-mono text-[9px] tracking-[4px] text-muted-foreground uppercase">
                            Your Journey
                        </p>
                        <div className="space-y-3">
                            {JOURNEY.map((step) => (
                                <div
                                    key={step.phase}
                                    className="flex items-center gap-3"
                                >
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${step.highlight ? "bg-primary/15" : "bg-muted"}`}
                                    >
                                        <step.icon
                                            size={13}
                                            className={
                                                step.highlight
                                                    ? "text-primary"
                                                    : "text-muted-foreground"
                                            }
                                        />
                                    </div>
                                    <span className="text-xs font-semibold">
                                        {step.title}
                                    </span>
                                    <span className="ml-auto font-mono text-[8px] text-muted-foreground">
                                        {step.phase}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
