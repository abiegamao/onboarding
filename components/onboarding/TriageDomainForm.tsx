"use client"

import type { TriageQuestion } from "@/lib/triageConfig"

interface TriageDomainFormProps {
    title: string
    questions: TriageQuestion[]
    answers: Record<string, string>
    onChange: (q: string, val: string) => void
}

export function TriageDomainForm({
    title,
    questions,
    answers,
    onChange,
}: TriageDomainFormProps) {
    return (
        <div className="max-w-3xl animate-in space-y-8 duration-700 fade-in">
            <div className="rounded-2xl border border-primary/15 bg-primary/5 px-6 py-4">
                <p className="text-sm font-bold tracking-wider text-primary uppercase">
                    {title}
                </p>
            </div>
            <div className="space-y-8">
                {questions.map((q, i) => (
                    <div key={q.key} className="space-y-3">
                        <label className="block text-sm leading-relaxed font-semibold text-foreground/80">
                            <span className="mr-2 font-mono text-primary">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            {q.text}
                        </label>
                        <textarea
                            value={answers[q.key] || ""}
                            onChange={(e) => onChange(q.key, e.target.value)}
                            className="min-h-[130px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-base leading-relaxed transition-all outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
                            placeholder="Share your thoughts..."
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
