"use client"

import { useEffect, useState } from "react"
import { Save, RotateCcw, Loader2, Plus, Trash2, Zap, Sparkles, MessageSquare, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

interface PlanData {
    planId: "basic" | "intermediate" | "custom"
    name: string
    price: string
    period: string
    description: string
    features: string[]
    stripeUrl: string | null
    ctaLabel: string
    isActive: boolean
    _isDefault?: boolean
}

const PLAN_ICONS = {
    basic: Zap,
    intermediate: Sparkles,
    custom: MessageSquare,
}

const PLAN_ORDER: Array<"basic" | "intermediate" | "custom"> = ["basic", "intermediate", "custom"]

export default function PlanConfigPage() {
    const [plans, setPlans] = useState<PlanData[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)
    const [resetting, setResetting] = useState<string | null>(null)
    const [dirty, setDirty] = useState<Set<string>>(new Set())

    useEffect(() => {
        fetch("/api/admin/plan-config")
            .then((r) => r.json())
            .then((d) => {
                const sorted = PLAN_ORDER
                    .map((id) => d.plans.find((p: PlanData) => p.planId === id))
                    .filter(Boolean)
                setPlans(sorted)
            })
            .catch(() => toast.error("Failed to load plan config"))
            .finally(() => setLoading(false))
    }, [])

    function updatePlan(planId: string, field: keyof PlanData, value: any) {
        setPlans((prev) =>
            prev.map((p) => (p.planId === planId ? { ...p, [field]: value } : p))
        )
        setDirty((prev) => new Set(prev).add(planId))
    }

    function updateFeature(planId: string, index: number, value: string) {
        setPlans((prev) =>
            prev.map((p) => {
                if (p.planId !== planId) return p
                const features = [...p.features]
                features[index] = value
                return { ...p, features }
            })
        )
        setDirty((prev) => new Set(prev).add(planId))
    }

    function addFeature(planId: string) {
        setPlans((prev) =>
            prev.map((p) =>
                p.planId === planId ? { ...p, features: [...p.features, ""] } : p
            )
        )
        setDirty((prev) => new Set(prev).add(planId))
    }

    function removeFeature(planId: string, index: number) {
        setPlans((prev) =>
            prev.map((p) => {
                if (p.planId !== planId) return p
                const features = p.features.filter((_, i) => i !== index)
                return { ...p, features }
            })
        )
        setDirty((prev) => new Set(prev).add(planId))
    }

    async function savePlan(planId: string) {
        const plan = plans.find((p) => p.planId === planId)
        if (!plan) return
        setSaving(planId)
        try {
            const res = await fetch("/api/admin/plan-config", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(plan),
            })
            if (!res.ok) throw new Error()
            toast.success(`${plan.name} plan saved`)
            setDirty((prev) => {
                const next = new Set(prev)
                next.delete(planId)
                return next
            })
            setPlans((prev) =>
                prev.map((p) => (p.planId === planId ? { ...p, _isDefault: false } : p))
            )
        } catch {
            toast.error("Failed to save")
        } finally {
            setSaving(null)
        }
    }

    async function resetPlan(planId: string) {
        if (!confirm("Reset this plan to default values? This cannot be undone.")) return
        setResetting(planId)
        try {
            await fetch("/api/admin/plan-config", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId }),
            })
            const res = await fetch("/api/admin/plan-config")
            const data = await res.json()
            const updated = data.plans.find((p: PlanData) => p.planId === planId)
            if (updated) {
                setPlans((prev) => prev.map((p) => (p.planId === planId ? updated : p)))
            }
            setDirty((prev) => {
                const next = new Set(prev)
                next.delete(planId)
                return next
            })
            toast.success("Reset to defaults")
        } catch {
            toast.error("Failed to reset")
        } finally {
            setResetting(null)
        }
    }

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#b6954a]" />
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Plan Configuration
                </h1>
                <p className="mt-1.5 font-mono text-[10px] tracking-[0.25em] text-[#b6954a]/70 uppercase">
                    Pricing, payment links, and features per tier
                </p>
            </div>

            {plans.map((plan) => {
                const Icon = PLAN_ICONS[plan.planId]
                const isDirty = dirty.has(plan.planId)
                const isSaving = saving === plan.planId
                const isResetting = resetting === plan.planId

                return (
                    <Card
                        key={plan.planId}
                        className="overflow-hidden rounded-2xl border border-[#b6954a]/20 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    >
                        {/* Card header */}
                        <div className="flex items-center justify-between border-b border-[#b6954a]/15 bg-muted/30 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-gradient-to-br from-[#b6954a]/15 to-[#b6954a]/5 p-2.5 ring-1 ring-[#b6954a]/10">
                                    <Icon className="h-4 w-4 text-[#b6954a]" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-foreground">{plan.name}</span>
                                        {plan._isDefault && (
                                            <span className="rounded-full bg-[#b6954a]/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-[#b6954a] uppercase">
                                                Default
                                            </span>
                                        )}
                                        {isDirty && (
                                            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-amber-500 ring-1 ring-amber-500/20 uppercase">
                                                Unsaved
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-mono text-[10px] text-muted-foreground/50">{plan.planId}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => resetPlan(plan.planId)}
                                    disabled={!!resetting || !!saving}
                                    className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-red-500/30 hover:text-red-500 disabled:opacity-40"
                                >
                                    {isResetting ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                                    Reset
                                </button>
                                <button
                                    onClick={() => savePlan(plan.planId)}
                                    disabled={!isDirty || !!saving || !!resetting}
                                    className="flex items-center gap-1.5 rounded-xl bg-[#b6954a] px-3 py-2 text-xs font-bold text-white transition-opacity hover:bg-[#d6b56c] disabled:opacity-40"
                                >
                                    {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* Price + Period + CTA row */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                                        Price Display
                                    </label>
                                    <input
                                        type="text"
                                        value={plan.price}
                                        onChange={(e) => updatePlan(plan.planId, "price", e.target.value)}
                                        placeholder="e.g. $297"
                                        className="w-full rounded-xl border border-[#b6954a]/20 bg-background/50 px-3.5 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-[#b6954a]/50 focus:ring-2 focus:ring-[#b6954a]/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                                        Period
                                    </label>
                                    <input
                                        type="text"
                                        value={plan.period}
                                        onChange={(e) => updatePlan(plan.planId, "period", e.target.value)}
                                        placeholder="/mo — or leave blank"
                                        className="w-full rounded-xl border border-[#b6954a]/20 bg-background/50 px-3.5 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-[#b6954a]/50 focus:ring-2 focus:ring-[#b6954a]/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                                        Button Label
                                    </label>
                                    <input
                                        type="text"
                                        value={plan.ctaLabel}
                                        onChange={(e) => updatePlan(plan.planId, "ctaLabel", e.target.value)}
                                        placeholder="Get Started"
                                        className="w-full rounded-xl border border-[#b6954a]/20 bg-background/50 px-3.5 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-[#b6954a]/50 focus:ring-2 focus:ring-[#b6954a]/20"
                                    />
                                </div>
                            </div>

                            {/* Stripe URL */}
                            <div className="space-y-2">
                                <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                                    Stripe Payment Link
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="url"
                                        value={plan.stripeUrl ?? ""}
                                        onChange={(e) =>
                                            updatePlan(plan.planId, "stripeUrl", e.target.value || null)
                                        }
                                        placeholder="https://buy.stripe.com/..."
                                        className="flex-1 rounded-xl border border-[#b6954a]/20 bg-background/50 px-3.5 py-3 font-mono text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-[#b6954a]/50 focus:ring-2 focus:ring-[#b6954a]/20"
                                    />
                                    {plan.stripeUrl && (
                                        <a
                                            href={plan.stripeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 rounded-xl border border-[#b6954a]/20 bg-[#b6954a]/5 px-3 py-3 text-xs text-[#b6954a] transition-colors hover:bg-[#b6954a]/10"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                </div>
                                <p className="text-[11px] text-muted-foreground/50">
                                    Leave blank for plans without a Stripe checkout (e.g. Custom).
                                </p>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                                    Description
                                </label>
                                <textarea
                                    value={plan.description}
                                    onChange={(e) => updatePlan(plan.planId, "description", e.target.value)}
                                    rows={2}
                                    placeholder="Short plan description shown on the plans page..."
                                    className="w-full rounded-xl border border-[#b6954a]/20 bg-background/50 px-3.5 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-[#b6954a]/50 focus:ring-2 focus:ring-[#b6954a]/20"
                                />
                            </div>

                            {/* Features */}
                            <div className="space-y-3">
                                <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                                    Features
                                </label>
                                <div className="space-y-2">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => updateFeature(plan.planId, i, e.target.value)}
                                                placeholder={`Feature ${i + 1}`}
                                                className="flex-1 rounded-xl border border-[#b6954a]/20 bg-background/50 px-3.5 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-[#b6954a]/50 focus:ring-2 focus:ring-[#b6954a]/20"
                                            />
                                            <button
                                                onClick={() => removeFeature(plan.planId, i)}
                                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground/40 transition-colors hover:border-red-500/30 hover:text-red-500"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addFeature(plan.planId)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#b6954a]/25 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-[#b6954a]/50 hover:text-[#b6954a]"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add Feature
                                    </button>
                                </div>
                            </div>

                            {/* Visibility toggle */}
                            <div className="flex items-center justify-between rounded-xl border border-[#b6954a]/15 bg-muted/30 px-4 py-3">
                                <div>
                                    <p className="text-sm font-medium text-foreground">Plan Visibility</p>
                                    <p className="text-xs text-muted-foreground">
                                        {plan.isActive ? "Shown on the plans page" : "Hidden from the plans page"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => updatePlan(plan.planId, "isActive", !plan.isActive)}
                                    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
                                        plan.isActive ? "bg-[#b6954a]" : "bg-muted-foreground/20"
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                            plan.isActive ? "translate-x-5" : "translate-x-0"
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}
