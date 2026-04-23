"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, RotateCcw, Loader2 } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

function formatKey(key: string) {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/[_-]/g, " ")
        .trim()
        .toUpperCase()
}

interface QuestionField {
    key: string
    label: string
    placeholder?: string
    hint?: string
}

interface StepConfig {
    stepId: string
    stepLabel: string
    description?: string
    phase: number
    questions: QuestionField[]
    _isDefault?: boolean
}

export default function EditQuestionsPage() {
    const { stepId } = useParams<{ stepId: string }>()

    const [config, setConfig] = useState<StepConfig | null>(null)
    const [questions, setQuestions] = useState<QuestionField[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [resetting, setResetting] = useState(false)
    const [dirty, setDirty] = useState(false)

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/admin/questions/${stepId}`)
                if (!res.ok) throw new Error("Failed to load")
                const data = await res.json()
                setConfig(data.config)
                setQuestions(data.config.questions)
            } catch {
                toast.error("Failed to load questions")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [stepId])

    function updateQuestion(index: number, field: keyof QuestionField, value: string) {
        setQuestions((prev) => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
        setDirty(true)
    }

    async function handleSave() {
        setSaving(true)
        try {
            const res = await fetch(`/api/admin/questions/${stepId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questions }),
            })
            if (!res.ok) throw new Error("Save failed")
            toast.success("Questions saved")
            setDirty(false)
        } catch {
            toast.error("Failed to save")
        } finally {
            setSaving(false)
        }
    }

    async function handleReset() {
        if (!confirm("Reset to default questions? This cannot be undone.")) return
        setResetting(true)
        try {
            const res = await fetch(`/api/admin/questions/${stepId}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Reset failed")
            const reload = await fetch(`/api/admin/questions/${stepId}`)
            const data = await reload.json()
            setConfig(data.config)
            setQuestions(data.config.questions)
            setDirty(false)
            toast.success("Reset to defaults")
        } catch {
            toast.error("Failed to reset")
        } finally {
            setResetting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#b6954a]" />
            </div>
        )
    }

    if (!config) {
        return (
            <div className="text-center text-muted-foreground">
                Step not found.{" "}
                <Link href="/admin/questions" className="text-[#b6954a] underline">
                    Go back
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-3xl space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-start justify-between gap-6">
                <div className="space-y-1.5">
                    <Link
                        href="/admin/questions"
                        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/60 transition-colors hover:text-[#b6954a]"
                    >
                        <ArrowLeft className="h-3 w-3" /> Questions
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        <span className="mr-2 font-mono text-[#b6954a]">
                            {config.stepId}
                        </span>
                        {config.stepLabel}
                    </h1>
                    {config.description && (
                        <p className="text-sm text-muted-foreground">
                            {config.description}
                        </p>
                    )}
                </div>
                <div className="flex shrink-0 items-center gap-2 pt-6">
                    <button
                        onClick={handleReset}
                        disabled={resetting}
                        className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-red-500/30 hover:text-red-500 disabled:opacity-50"
                    >
                        {resetting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RotateCcw className="h-4 w-4" />
                        )}
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !dirty}
                        className="flex items-center gap-2 rounded-xl bg-[#b6954a] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#d6b56c] disabled:opacity-40"
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save Changes
                    </button>
                </div>
            </div>

            {config._isDefault && (
                <div className="rounded-2xl border border-[#b6954a]/20 bg-[#b6954a]/5 px-5 py-4 text-sm text-[#b6954a]">
                    Using default questions. Save to create a custom version.
                </div>
            )}

            {/* Questions */}
            <div className="space-y-4">
                {questions.map((q, i) => (
                    <Card
                        key={q.key}
                        className="space-y-5 rounded-2xl border border-[#b6954a]/15 bg-card p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
                    >
                        <div className="flex items-center justify-between border-b border-[#b6954a]/10 pb-3">
                            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#b6954a] uppercase">
                                {formatKey(q.key)}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground/40">
                                {i + 1} / {questions.length}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                                Question Label
                            </label>
                            <textarea
                                value={q.label}
                                onChange={(e) => updateQuestion(i, "label", e.target.value)}
                                rows={2}
                                className="w-full rounded-xl border border-[#b6954a]/20 bg-background/50 px-3.5 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-[#b6954a]/50 focus:ring-2 focus:ring-[#b6954a]/20"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                                    Placeholder
                                </label>
                                <input
                                    type="text"
                                    value={q.placeholder ?? ""}
                                    onChange={(e) => updateQuestion(i, "placeholder", e.target.value)}
                                    className="w-full rounded-xl border border-[#b6954a]/20 bg-background/50 px-3.5 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-[#b6954a]/50 focus:ring-2 focus:ring-[#b6954a]/20"
                                    placeholder="Optional placeholder text..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                                    Hint / Sub-label
                                </label>
                                <input
                                    type="text"
                                    value={q.hint ?? ""}
                                    onChange={(e) => updateQuestion(i, "hint", e.target.value)}
                                    className="w-full rounded-xl border border-[#b6954a]/20 bg-background/50 px-3.5 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-[#b6954a]/50 focus:ring-2 focus:ring-[#b6954a]/20"
                                    placeholder="Optional hint shown below the label..."
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Sticky save bar */}
            {dirty && (
                <div className="sticky bottom-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-2xl bg-[#b6954a] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-[#b6954a]/20 transition-colors hover:bg-[#d6b56c] disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    )
}
