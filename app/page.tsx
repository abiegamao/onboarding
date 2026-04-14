import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Button } from "@/components/ui/button"
import { Sparkles, UserCircle, HeartPulse, ShieldCheck, Zap, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const PHASES = [
    {
        phase: "01",
        title: "Connection",
        icon: UserCircle,
        desc: "Establish the foundation. Map your neurodiversity and leadership triage.",
        steps: ["Foundation Video", "Getting to Know You", "Your Triage", "Schedule Orientation"],
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
        steps: ["Vision Activation", "Vision Statements", "Ideal Day Narrative"],
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
        <div className="relative min-h-screen bg-background overflow-hidden font-sans text-foreground">
            {/* Global animations */}
            <style>{`
                @keyframes glow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.08); } }
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

            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]" style={{
                backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
            }} />

            {/* Hero glow orbs */}
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none" style={{
                background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                opacity: 0.08,
                filter: "blur(120px)",
                animation: "glow 8s ease-in-out infinite",
            }} />
            <div className="absolute top-[400px] right-[-200px] w-[500px] h-[500px] rounded-full pointer-events-none" style={{
                background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                opacity: 0.05,
                filter: "blur(100px)",
                animation: "glow 10s ease-in-out infinite 3s",
            }} />

            {/* Navigation */}
            <nav className="relative z-20 flex items-center justify-between px-4 md:px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden">
                        <Image src="/assets/logo.png" alt="Logo" fill className="object-cover" />
                    </div>
                    <span className="text-lg md:text-xl font-bold tracking-tight">
                        <span className="hidden sm:inline">The Peace-Driven Leader</span>
                        <span className="sm:hidden">Minesha</span>
                    </span>
                </div>
                <div className="flex items-center gap-3 md:gap-6">
                    <Link href="/login" className="text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Sign In
                    </Link>
                    <Link href="/signup">
                        <Button variant="outline" size="sm" className="rounded-xl border-primary/30 bg-primary/5 hover:bg-primary/10 text-xs md:text-base">
                            Join
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 px-4 md:px-6 pt-10 md:pt-24 pb-40 max-w-7xl mx-auto space-y-32 md:space-y-40">

                {/* ── Hero ── */}
                <section className="text-center max-w-4xl mx-auto space-y-8">
                    {/* Shimmer badge */}
                    <div className="fade-up fade-up-1 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest" style={{
                        backgroundImage: "linear-gradient(90deg, var(--primary), transparent, var(--primary))",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 4s linear infinite",
                        opacity: 0.15,
                        position: "absolute",
                        inset: 0,
                        borderRadius: "inherit",
                        pointerEvents: "none",
                    }} />
                    <div className="fade-up fade-up-1 relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest overflow-hidden">
                        <div className="absolute inset-0 rounded-full" style={{
                            backgroundImage: "linear-gradient(90deg, transparent, var(--primary), transparent)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 4s linear infinite",
                            opacity: 0.1,
                        }} />
                        <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 relative z-10" />
                        <span className="relative z-10">The Path to Peace-Driven Leadership</span>
                    </div>

                    <h1 className="fade-up fade-up-2 text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-[0.95]">
                        Activate Your{" "}
                        <span style={{
                            backgroundImage: "linear-gradient(135deg, var(--primary), var(--gold-soft, #f1ddb0))",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            WebkitTextFillColor: "transparent",
                        }}>
                            Inner Mastery
                        </span>
                    </h1>

                    <p className="fade-up fade-up-3 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Transition from burnout to breakthrough. Our proprietary pathway maps your Mind, Body, and Divine Identity to establish peace across every domain.
                    </p>

                    <div className="fade-up fade-up-4 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-md mx-auto sm:max-w-none">
                        <Link href="/signup" className="w-full sm:w-auto">
                            <InteractiveHoverButton className="h-12 md:h-14 px-8 md:px-10 text-base md:text-lg w-full">
                                Start Your Pathway
                            </InteractiveHoverButton>
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button variant="ghost" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg hover:bg-primary/5 gap-2 text-muted-foreground w-full">
                                Sign In <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* ── Pathway Section ~ Premium Cards ── */}
                <section className="space-y-16">
                    <div className="text-center space-y-4 fade-up">
                        <p className="font-mono text-[10px] md:text-xs uppercase tracking-[4px] text-primary">The Pathway</p>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
                            Four Phases to{" "}
                            <span className="italic font-normal" style={{
                                backgroundImage: "linear-gradient(135deg, var(--primary), var(--gold-soft, #f1ddb0))",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                color: "transparent",
                                WebkitTextFillColor: "transparent",
                            }}>
                                Breakthrough
                            </span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            A step-by-step evolution designed to deconstruct chaos and rebuild your baseline for sustainable excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {PHASES.map((item, i) => (
                            <div
                                key={i}
                                className="phase-card group relative rounded-3xl border border-border/50 p-6 md:p-8 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-primary/30"
                                style={{ background: "var(--card)" }}
                            >
                                {/* Hover glow */}
                                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{
                                    background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                                    opacity: 0,
                                    filter: "blur(60px)",
                                }} />
                                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full transition-opacity duration-700 pointer-events-none group-hover:opacity-[0.08]" style={{
                                    background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                                    opacity: 0,
                                    filter: "blur(60px)",
                                }} />

                                <div className="relative z-10 space-y-5">
                                    {/* Icon + phase */}
                                    <div className="flex items-start justify-between">
                                        <div className="p-3 rounded-2xl border border-border/50 bg-secondary/30 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300" style={{
                                            boxShadow: "none",
                                        }}>
                                            <item.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <span className="font-mono text-[10px] uppercase tracking-widest" style={{
                                            backgroundImage: "linear-gradient(90deg, var(--primary), var(--gold-soft, #f1ddb0))",
                                            backgroundClip: "text",
                                            WebkitBackgroundClip: "text",
                                            color: "transparent",
                                            WebkitTextFillColor: "transparent",
                                        }}>Phase {item.phase}</span>
                                    </div>

                                    {/* Title + desc */}
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </div>

                                    {/* Steps */}
                                    <div className="flex flex-wrap gap-2">
                                        {item.steps.map((step) => (
                                            <span key={step} className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg bg-secondary/50 dark:bg-secondary/80 text-muted-foreground border border-border/30">
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
                <section className="max-w-2xl mx-auto space-y-12">
                    <div className="text-center space-y-4 fade-up">
                        <p className="font-mono text-[10px] md:text-xs uppercase tracking-[4px] text-primary">How It Works</p>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
                            Your{" "}
                            <span className="italic font-normal" style={{
                                backgroundImage: "linear-gradient(135deg, var(--primary), var(--gold-soft, #f1ddb0))",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                color: "transparent",
                                WebkitTextFillColor: "transparent",
                            }}>
                                Journey
                            </span>
                        </h2>
                    </div>

                    {/* Premium dark card */}
                    <div className="relative rounded-3xl overflow-hidden p-8 md:p-10" style={{
                        background: "linear-gradient(135deg, #10241f 0%, #1a2e28 25%, #10241f 50%, #0d1f1a 75%, #10241f 100%)",
                    }}>
                        {/* Glow orbs */}
                        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{
                            background: "radial-gradient(circle, rgba(182,149,74,0.2) 0%, transparent 70%)",
                            animation: "glow 6s ease-in-out infinite",
                        }} />
                        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{
                            background: "radial-gradient(circle, rgba(182,149,74,0.1) 0%, transparent 70%)",
                            animation: "glow 8s ease-in-out infinite 2s",
                        }} />

                        {/* Grid */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                            backgroundSize: "32px 32px",
                        }} />

                        <div className="relative z-10 space-y-2">
                            {PHASES.map((phase, i) => (
                                <div key={phase.phase} className="phase-card group flex gap-5 items-start">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                                            style={{
                                                background: i < 2 ? "linear-gradient(135deg, rgba(182,149,74,0.25), rgba(212,180,131,0.2))" : "rgba(255,255,255,0.04)",
                                                border: i < 2 ? "1px solid rgba(182,149,74,0.3)" : "1px solid rgba(255,255,255,0.08)",
                                                boxShadow: i < 2 ? "0 0 24px rgba(182,149,74,0.1)" : "none",
                                            }}
                                        >
                                            <phase.icon size={20} className={`transition-colors duration-300 ${i < 2 ? "text-[#b6954a]" : "text-white/30 group-hover:text-[#b6954a]"}`} />
                                        </div>
                                        {i < PHASES.length - 1 && (
                                            <div className="w-px h-8 mt-2" style={{
                                                background: "linear-gradient(to bottom, rgba(182,149,74,0.3), transparent)",
                                                animation: "pulseLine 3s ease-in-out infinite",
                                                animationDelay: `${i * 0.5}s`,
                                            }} />
                                        )}
                                    </div>
                                    <div className="pt-2 pb-4">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span className="font-mono text-[10px] uppercase tracking-widest" style={{
                                                backgroundImage: "linear-gradient(90deg, #b6954a, #d4b483)",
                                                backgroundClip: "text",
                                                WebkitBackgroundClip: "text",
                                                color: "transparent",
                                                WebkitTextFillColor: "transparent",
                                            }}>{phase.phase}</span>
                                            <span className="text-base font-bold text-white">{phase.title}</span>
                                        </div>
                                        <p className="italic text-white/30 text-sm leading-relaxed">{phase.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Promises ── */}
                <section className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PROMISES.map((perk, i) => (
                            <div key={perk} className="fade-up flex items-center gap-3 p-4 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-primary/10 border border-primary/20">
                                    <Check size={12} className="text-primary" />
                                </div>
                                <span className="text-sm font-medium">{perk}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Final CTA ── */}
                <section className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden text-center">
                    {/* Dark gradient bg */}
                    <div className="relative p-10 md:p-24" style={{
                        background: "linear-gradient(135deg, #10241f 0%, #1a2e28 30%, #10241f 60%, #0d1f1a 100%)",
                    }}>
                        {/* Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none" style={{
                            background: "radial-gradient(circle, rgba(182,149,74,0.2) 0%, transparent 70%)",
                            filter: "blur(80px)",
                            animation: "glow 6s ease-in-out infinite",
                        }} />

                        {/* Grid */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                        }} />

                        <div className="relative z-10 space-y-6">
                            <h2 className="text-3xl md:text-6xl font-bold tracking-tighter leading-tight text-white">
                                Your Legacy Begins{" "}
                                <span className="italic font-normal" style={{
                                    backgroundImage: "linear-gradient(135deg, #b6954a, #f1ddb0)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    color: "transparent",
                                    WebkitTextFillColor: "transparent",
                                }}>
                                    with Peace.
                                </span>
                            </h2>
                            <p className="text-base md:text-lg text-white/40 max-w-md mx-auto">
                                The pathway is open. Are you ready to activate your potential?
                            </p>
                            <div className="pt-4 md:pt-6">
                                <Link href="/signup" className="inline-block w-full sm:w-auto">
                                    <InteractiveHoverButton className="h-14 md:h-16 px-10 md:px-12 text-lg md:text-xl w-full sm:w-auto">
                                        Apply to Join
                                    </InteractiveHoverButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 px-8 py-12 border-t border-border/30 text-center text-muted-foreground text-sm">
                <p>&copy; {new Date().getFullYear()} Minesha. All rights reserved.</p>
                <div className="flex items-center justify-center gap-6 mt-4">
                    <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Support</Link>
                </div>
            </footer>
        </div>
    )
}
