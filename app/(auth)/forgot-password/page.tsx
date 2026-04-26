import { ModeToggle } from "@/components/mode-toggle"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { KeyRound, MailCheck, ShieldCheck } from "lucide-react"

const SECURITY_NOTES = [
    {
        icon: MailCheck,
        title: "Email verification",
        desc: "We send a 6-digit code to confirm this request came from you.",
    },
    {
        icon: KeyRound,
        title: "Short-lived code",
        desc: "Codes expire quickly and are automatically removed.",
    },
    {
        icon: ShieldCheck,
        title: "Secure reset",
        desc: "After verification, your old code is invalidated.",
    },
]

export default function ForgotPasswordPage() {
    return (
        <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background">
            <div className="absolute top-4 right-4 z-20">
                <ModeToggle />
            </div>

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
                <div className="hidden lg:block">
                    <style>{`
            @keyframes sGlow { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
            @keyframes sFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
            .s-note { animation: sFadeUp 0.6s ease-out both; }
            .s-note:nth-child(1) { animation-delay: 0.1s; }
            .s-note:nth-child(2) { animation-delay: 0.25s; }
            .s-note:nth-child(3) { animation-delay: 0.4s; }
          `}</style>

                    <div className="relative overflow-hidden rounded-3xl border border-[#e0d5c0] bg-gradient-to-br from-[#f6f0e4] via-[#f9f5ed] to-[#f2eadb] p-8 xl:p-10 dark:border-white/5 dark:from-[#10241f] dark:via-[#1a2e28] dark:to-[#0d1f1a]">
                        <div
                            className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(182,149,74,0.2) 0%, transparent 70%)",
                                animation: "sGlow 6s ease-in-out infinite",
                            }}
                        />

                        <div className="relative z-10">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                                <ShieldCheck
                                    size={10}
                                    className="text-primary"
                                />
                                <span className="font-mono text-[9px] tracking-[4px] text-primary uppercase">
                                    Account Security
                                </span>
                            </div>

                            <h2 className="mb-3 text-3xl leading-[0.95] font-bold text-foreground xl:text-4xl">
                                Secure your
                                <span
                                    className="ml-2 font-normal italic"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(135deg, #b6954a, #d4b483)",
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                        color: "transparent",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    access.
                                </span>
                            </h2>
                            <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground italic">
                                Reset your password with a short-lived code and
                                get back into your dashboard safely.
                            </p>

                            <div className="space-y-4">
                                {SECURITY_NOTES.map((note) => (
                                    <div
                                        key={note.title}
                                        className="s-note flex items-start gap-4"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                                            <note.icon
                                                size={16}
                                                className="text-primary"
                                            />
                                        </div>
                                        <div className="pt-1">
                                            <p className="text-sm font-semibold text-foreground">
                                                {note.title}
                                            </p>
                                            <p className="text-xs leading-relaxed text-muted-foreground/80">
                                                {note.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-md">
                    <div className="rounded-2xl border border-border/60 bg-background/80 p-6 shadow-xl backdrop-blur-sm sm:p-8">
                        <ForgotPasswordForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
