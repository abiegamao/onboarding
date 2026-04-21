"use client"
import {
    Phone,
    Users,
    Wallet,
    CheckCircle2,
    ArrowRight,
    Sparkles,
} from "lucide-react"

interface Phase4Props {
    currentStep: string
    formData: any
    setFormData: (data: any) => void
}

export function Phase4Activation({
    currentStep,
    formData,
    setFormData,
}: Phase4Props) {
    return (
        <div className="flex min-h-[40vh] items-center justify-center">
            {currentStep === "4A" && (
                <div className="w-full max-w-2xl animate-in space-y-8 rounded-[3rem] border border-[var(--line)] bg-[var(--card)] p-10 text-[var(--card-foreground)] shadow-2xl duration-700 fade-in zoom-in">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/20">
                            <Phone className="h-7 w-7 text-[var(--primary)]" />
                        </div>
                        <div>
                            <h2 className="font-serif text-3xl font-bold">
                                The Kickstart Call
                            </h2>
                            <p className="text-sm font-bold tracking-widest text-[var(--primary)]/70 uppercase">
                                Ground Rules & Milestones
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-lg leading-relaxed text-[var(--muted-foreground)]">
                            This is where the transformation truly begins. In
                            this session, we will establish the "Rules of the
                            Game," unlock your first major rewards, and set the
                            milestones that will track your progress.
                        </p>

                        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--primary)]/5 p-4">
                                <CheckCircle2 className="h-5 w-5 text-[var(--primary)]" />
                                <span className="text-sm">
                                    Personal Roadmap
                                </span>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--primary)]/5 p-4">
                                <CheckCircle2 className="h-5 w-5 text-[var(--primary)]" />
                                <span className="text-sm">
                                    First Milestone Unlocked
                                </span>
                            </div>
                        </div>

                        <button
                            className="group flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--primary)] text-lg font-bold text-[var(--primary-foreground)] transition-all hover:bg-[var(--primary)]/90"
                            onClick={() =>
                                window.open(
                                    "https://calendly.com/minesha-kickoff",
                                    "_blank"
                                )
                            }
                        >
                            Book Your Kickstart Call
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            )}

            {currentStep === "4B" && (
                <div className="w-full max-w-2xl animate-in space-y-8 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white shadow-2xl duration-700 slide-in-from-right-10">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                            <Users className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="font-serif text-3xl font-bold">
                                Community Portal
                            </h2>
                            <p className="text-sm font-bold tracking-widest text-white/70 uppercase">
                                Join the Telegram Collective
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-lg leading-relaxed text-white/90">
                            You are no longer carrying this weight alone. Join
                            our private Telegram collective to connect with
                            other Peace-Driven Leaders, share breakthroughs, and
                            receive daily encouragement from the ProTeam.
                        </p>

                        <button
                            className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-white text-lg font-bold text-indigo-700 transition-all hover:bg-white/90"
                            onClick={() =>
                                window.open(
                                    "https://t.me/minesha_leaders",
                                    "_blank"
                                )
                            }
                        >
                            Connect to Telegram
                            <ArrowRight className="h-5 w-5" />
                        </button>

                        <div className="flex items-start gap-3 rounded-2xl bg-black/10 p-4">
                            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-yellow-300" />
                            <p className="text-xs leading-relaxed text-white/70">
                                Tip: After joining, introduce yourself and share
                                your "Word of the Year" from the previous phase!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === "4C" && (
                <div className="w-full max-w-2xl animate-in space-y-8 rounded-[3rem] border border-border/50 bg-secondary p-10 text-center shadow-2xl duration-700 slide-in-from-bottom-10">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary/10">
                        <Wallet className="h-10 w-10 text-primary" />
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-serif text-3xl font-bold">
                            Financial Alignment
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Your wealth strategist is ready to help you align
                            your cash, credit, and investments with your new
                            state of peace.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-4">
                        <button
                            className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl border-2 border-primary text-lg font-bold text-primary transition-all hover:bg-primary/5"
                            onClick={() =>
                                window.open(
                                    "https://calendly.com/minesha-wealth",
                                    "_blank"
                                )
                            }
                        >
                            Schedule Wealth Strategist Call
                            <ArrowRight className="h-5 w-5" />
                        </button>
                        <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                            This is the final step of your activation pathway.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
