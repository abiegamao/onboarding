import { Button } from "@/components/ui/button"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { HexagonPattern } from "@/components/ui/hexagon-pattern"
import { VideoPlayer } from "@/components/marketing/video-player"
import { Sparkles, Map, ShieldCheck, HeartPulse, Zap, ArrowRight, UserCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Page() {
    return (
        <div className="relative min-h-screen bg-background overflow-hidden font-sans text-foreground">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0">
                <HexagonPattern
                    radius={50}
                    gap={10}
                    className="opacity-20 fill-primary/10 stroke-primary/20"
                    strokeDasharray="4 4"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
            </div>

            {/* Navigation */}
            <nav className="relative z-20 flex items-center justify-between px-4 md:px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden">
                        <Image 
                            src="/assets/logo.png" 
                            alt="Minesha Logo" 
                            fill 
                            className="object-cover"
                        />
                    </div>
                    <span className="text-lg md:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500 whitespace-nowrap">
                        <span className="hidden sm:inline">The Peace-Driven Leader</span>
                        <span className="sm:hidden">Minesha</span>
                    </span>
                </div>
                <div className="flex items-center gap-3 md:gap-6">
                    <Link href="/login" className="text-xs md:text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                        Sign In
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" size="sm" className="rounded-lg md:rounded-xl border-border bg-secondary/20 backdrop-blur-sm hover:bg-secondary/30 text-xs md:text-base">
                            Join
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 px-4 md:px-6 pt-10 md:pt-20 pb-40 max-w-7xl mx-auto space-y-32">
                {/* Hero Section */}
                <section className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">
                        <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        The Path to Peace-Driven Leadership
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1] md:leading-[0.9]">
                        Activate Your <br />
                        <span className="text-primary">
                            Inner Mastery
                        </span>
                    </h1>

                    <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Transition from burnout to breakthrough. Our proprietary pathway maps your Mind, Body, and Divine Identity to establish peace across every domain.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-md mx-auto sm:max-w-none">
                        <Link href="/login" className="w-full sm:w-auto">
                            <InteractiveHoverButton className="h-12 md:h-14 px-8 md:px-10 text-base md:text-lg w-full">
                                Start Your Pathway
                            </InteractiveHoverButton>
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button variant="ghost" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg hover:bg-secondary/20 gap-2 text-muted-foreground w-full">
                                View Sneak Peek <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Sneak Peek Pathway Section */}
                <section className="space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold tracking-tight">Pathway Blueprints</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            A step-by-step evolution designed to deconstruct chaos and rebuild your baseline for sustainable excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { 
                                phase: "Phase 1", 
                                title: "Connection", 
                                icon: UserCircle, 
                                desc: "Establish the foundation. Map your neurodiversity and leadership triage.",
                                color: "border-blue-500/50 bg-blue-500/5"
                            },
                            { 
                                phase: "Phase 2", 
                                title: "Awareness", 
                                icon: HeartPulse, 
                                desc: "360° evaluations and growth inputs to identify historical blocks.",
                                color: "border-purple-500/50 bg-purple-500/5"
                            },
                            { 
                                phase: "Phase 3", 
                                title: "Stabilization", 
                                icon: ShieldCheck, 
                                desc: "Create your Ideal Day Narrative and activate your family mission.",
                                color: "border-emerald-500/50 bg-emerald-500/5"
                            },
                            { 
                                phase: "Phase 4", 
                                title: "Activation", 
                                icon: Zap, 
                                desc: "Full pro-team support and community activation for wealth and legacy.",
                                color: "border-orange-500/50 bg-orange-500/5"
                            }
                        ].map((item, i) => (
                            <div 
                                key={i}
                                className={`group p-6 md:p-8 rounded-3xl border ${item.color} backdrop-blur-xl relative overflow-hidden transition-all duration-500 md:hover:-translate-y-2`}
                            >
                                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <item.icon size={120} />
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div className="inline-block p-3 rounded-2xl bg-secondary/30 border border-border group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                                        <item.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-primary/80">
                                            {item.phase}
                                        </span>
                                        <h3 className="text-xl md:text-2xl font-bold">{item.title}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="relative p-8 md:p-24 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-primary/20 via-background to-background border border-border overflow-hidden text-center space-y-6 md:space-y-8">
                    <div className="absolute inset-0 opacity-10" />
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-3xl md:text-6xl font-bold tracking-tighter leading-tight">Your Legacy Begins with Peace.</h2>
                        <p className="text-base md:text-lg text-muted-foreground max-w-sm mx-auto">
                            The pathway is open. Are you ready to activate your potential?
                        </p>
                        <div className="pt-4 md:pt-6">
                            <Link href="/login" className="inline-block w-full sm:w-auto">
                                <InteractiveHoverButton className="h-14 md:h-16 px-10 md:px-12 text-lg md:text-xl shadow-2xl shadow-primary/40 w-full sm:w-auto">
                                    Apply to Join
                                </InteractiveHoverButton>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 px-8 py-12 border-t border-border/50 text-center text-muted-foreground text-sm">
                <p>© {new Date().getFullYear()} Minesha. All rights reserved.</p>
                <div className="flex items-center justify-center gap-6 mt-4">
                    <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Support</Link>
                </div>
            </footer>
        </div>
    )
}

