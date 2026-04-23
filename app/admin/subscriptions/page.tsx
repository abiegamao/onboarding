"use client"

import { useEffect, useState, useCallback, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    CheckCircle2,
    Clock,
    Ban,
    Zap,
    Sparkles,
    MessageSquare,
} from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
    unsubscribed: "Unsubscribed",
    pending: "Pending",
    active: "Active",
}

const PLAN_LABELS: Record<string, string> = {
    basic: "Basic",
    intermediate: "Intermediate",
    custom: "Custom",
}

const PLAN_ICONS: Record<string, React.ElementType> = {
    basic: Zap,
    intermediate: Sparkles,
    custom: MessageSquare,
}

const PAGE_SIZES = [10, 25, 50]

interface Subscription {
    id: string
    firstName: string
    lastName: string
    email: string
    accountStatus: "unsubscribed" | "pending" | "active"
    plan: "basic" | "intermediate" | "custom" | null
    joinedAt: string | null
}

interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

function StatusBadge({ status }: { status: string }) {
    if (status === "active")
        return (
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                <CheckCircle2 className="h-3 w-3" />
                Active
            </span>
        )
    if (status === "pending")
        return (
            <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-500">
                <Clock className="h-3 w-3" />
                Pending
            </span>
        )
    return (
        <span className="flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            <Ban className="h-3 w-3" />
            Unsubscribed
        </span>
    )
}

function PlanBadge({ plan }: { plan: string | null }) {
    if (!plan)
        return (
            <span className="flex items-center gap-1 rounded-full border border-border/40 bg-muted/30 px-2.5 py-0.5 text-xs font-medium text-muted-foreground/50">
                No plan
            </span>
        )
    const Icon = PLAN_ICONS[plan] ?? Zap
    return (
        <span className="flex items-center gap-1.5 rounded-full border border-[#b6954a]/20 bg-[#b6954a]/5 px-2.5 py-0.5 text-xs font-medium text-[#b6954a]">
            <Icon className="h-3 w-3" />
            {PLAN_LABELS[plan] ?? plan}
        </span>
    )
}

function SkeletonRow() {
    return (
        <div className="grid grid-cols-[1fr_140px_140px_160px_120px] items-center px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-[#b6954a]/10" />
                <div className="space-y-1.5">
                    <div className="h-3 w-28 animate-pulse rounded bg-[#b6954a]/10" />
                    <div className="h-2.5 w-36 animate-pulse rounded bg-[#b6954a]/5" />
                </div>
            </div>
            <div className="h-5 w-20 animate-pulse rounded-full bg-[#b6954a]/10" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-[#b6954a]/10" />
            <div className="h-3 w-24 animate-pulse rounded bg-[#b6954a]/5" />
            <div className="h-7 w-20 animate-pulse rounded-lg bg-[#b6954a]/10" />
        </div>
    )
}

function SubscriptionsPageInner() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [subs, setSubs] = useState<Subscription[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [loading, setLoading] = useState(true)
    const [activating, setActivating] = useState<string | null>(null)
    const [settingPlan, setSettingPlan] = useState<string | null>(null)

    const [search, setSearch] = useState(searchParams.get("search") ?? "")
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "")
    const [planFilter, setPlanFilter] = useState(searchParams.get("plan") ?? "")
    const [page, setPage] = useState(Number(searchParams.get("page") ?? 1))
    const [limit, setLimit] = useState(Number(searchParams.get("limit") ?? 10))

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [debouncedSearch, setDebouncedSearch] = useState(search)

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 300)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [search])

    const fetchSubs = useCallback(() => {
        setLoading(true)
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        if (debouncedSearch) params.set("search", debouncedSearch)
        if (statusFilter) params.set("status", statusFilter)
        if (planFilter) params.set("plan", planFilter)

        fetch(`/api/admin/subscriptions?${params}`)
            .then((r) => r.json())
            .then((data) => {
                setSubs(data.subscriptions ?? [])
                setPagination(data.pagination ?? null)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [page, limit, debouncedSearch, statusFilter, planFilter])

    useEffect(() => {
        fetchSubs()
        const p = new URLSearchParams()
        if (debouncedSearch) p.set("search", debouncedSearch)
        if (statusFilter) p.set("status", statusFilter)
        if (planFilter) p.set("plan", planFilter)
        if (page > 1) p.set("page", String(page))
        if (limit !== 10) p.set("limit", String(limit))
        router.replace(`/admin/subscriptions?${p.toString()}`, { scroll: false })
    }, [fetchSubs, debouncedSearch, statusFilter, planFilter, page, limit, router])

    async function setStatus(id: string, accountStatus: string) {
        setActivating(id)
        try {
            await fetch(`/api/admin/subscriptions/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountStatus }),
            })
            fetchSubs()
        } finally {
            setActivating(null)
        }
    }

    async function setPlan(id: string, plan: string | null) {
        setSettingPlan(id)
        try {
            await fetch(`/api/admin/subscriptions/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            })
            fetchSubs()
        } finally {
            setSettingPlan(null)
        }
    }

    function formatDate(iso: string | null) {
        if (!iso) return "—"
        return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }

    const start = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0
    const end = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage client plans and account activation.
                </p>
            </div>

            <Card className="overflow-hidden rounded-2xl border border-[#b6954a]/15 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 border-b border-[#b6954a]/10 bg-muted/10 px-6 py-4">
                    <div className="relative min-w-48 flex-1">
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
                        <input
                            type="text"
                            placeholder="Search name or email…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-8 w-full rounded-lg border border-[#b6954a]/20 bg-background pr-3 pl-8 text-xs text-[#b6954a] transition-all placeholder:text-muted-foreground/40 focus:border-[#b6954a]/40 focus:ring-1 focus:ring-[#b6954a]/30 focus:outline-none"
                        />
                    </div>

                    {/* Status filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs transition-all ${statusFilter ? "border-[#b6954a]/40 bg-[#b6954a]/10 text-[#b6954a]" : "border-[#b6954a]/20 bg-background text-muted-foreground hover:border-[#b6954a]/40 hover:bg-[#b6954a]/5 hover:text-foreground"}`}>
                                {statusFilter ? STATUS_LABELS[statusFilter] : "All statuses"}
                                <ChevronDown className="h-3 w-3 opacity-60" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-44">
                            <DropdownMenuItem onClick={() => { setStatusFilter(""); setPage(1) }}>All statuses</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                <DropdownMenuItem key={val} onClick={() => { setStatusFilter(val); setPage(1) }}>{label}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Plan filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs transition-all ${planFilter ? "border-[#b6954a]/40 bg-[#b6954a]/10 text-[#b6954a]" : "border-[#b6954a]/20 bg-background text-muted-foreground hover:border-[#b6954a]/40 hover:bg-[#b6954a]/5 hover:text-foreground"}`}>
                                {planFilter ? PLAN_LABELS[planFilter] : "All plans"}
                                <ChevronDown className="h-3 w-3 opacity-60" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-44">
                            <DropdownMenuItem onClick={() => { setPlanFilter(""); setPage(1) }}>All plans</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {Object.entries(PLAN_LABELS).map(([val, label]) => (
                                <DropdownMenuItem key={val} onClick={() => { setPlanFilter(val); setPage(1) }}>{label}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Page size */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex h-8 items-center gap-1.5 rounded-lg border border-[#b6954a]/20 bg-background px-3 text-xs text-muted-foreground transition-all hover:border-[#b6954a]/40 hover:bg-[#b6954a]/5 hover:text-foreground">
                                {limit} / page
                                <ChevronDown className="h-3 w-3 opacity-60" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-28">
                            {PAGE_SIZES.map((s) => (
                                <DropdownMenuItem key={s} onClick={() => { setLimit(s); setPage(1) }}>{s} per page</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Column headers */}
                <div className="hidden grid-cols-[1fr_140px_140px_160px_120px] items-center border-b border-[#b6954a]/10 bg-muted/5 px-6 py-2 sm:grid">
                    {["Client", "Plan", "Status", "Joined", "Action"].map((h) => (
                        <span key={h} className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40 uppercase">{h}</span>
                    ))}
                </div>

                {/* Rows */}
                <div className="divide-y divide-[#b6954a]/10">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                    ) : subs.length === 0 ? (
                        <div className="py-16 text-center text-sm text-muted-foreground">No subscriptions found.</div>
                    ) : (
                        subs.map((sub) => (
                            <div key={sub.id} className="grid grid-cols-[1fr_140px_140px_160px_120px] items-center px-6 py-4 transition-all hover:bg-[#b6954a]/[0.02]">
                                {/* Avatar + name */}
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b6954a]/10 text-xs font-bold text-[#b6954a] uppercase ring-1 ring-[#b6954a]/20">
                                        {sub.firstName[0]}{sub.lastName[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-foreground">{sub.firstName} {sub.lastName}</p>
                                        <p className="truncate text-xs text-muted-foreground">{sub.email}</p>
                                    </div>
                                </div>

                                <PlanBadge plan={sub.plan} />
                                <StatusBadge status={sub.accountStatus} />
                                <span className="text-xs text-muted-foreground/60">{formatDate(sub.joinedAt)}</span>

                                {/* Action */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={activating === sub.id || settingPlan === sub.id}
                                            className="h-7 rounded-lg border-[#b6954a]/20 px-3 text-xs text-[#b6954a] hover:border-[#b6954a]/40 hover:bg-[#b6954a]/10"
                                        >
                                            {activating === sub.id || settingPlan === sub.id ? "Saving…" : "Manage"}
                                            <ChevronDown className="ml-1 h-3 w-3 opacity-60" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                        <DropdownMenuLabel className="text-[10px] tracking-widest text-muted-foreground/50 uppercase">Change Status</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setStatus(sub.id, "active")} className="gap-2 text-emerald-600">
                                            <CheckCircle2 className="h-3.5 w-3.5" /> Activate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setStatus(sub.id, "pending")} className="gap-2 text-amber-600">
                                            <Clock className="h-3.5 w-3.5" /> Set Pending
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setStatus(sub.id, "unsubscribed")} className="gap-2 text-muted-foreground">
                                            <Ban className="h-3.5 w-3.5" /> Unsubscribe
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel className="text-[10px] tracking-widest text-muted-foreground/50 uppercase">Set Plan</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setPlan(sub.id, "basic")} className="gap-2">
                                            <Zap className="h-3.5 w-3.5 text-[#b6954a]" /> Basic
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPlan(sub.id, "intermediate")} className="gap-2">
                                            <Sparkles className="h-3.5 w-3.5 text-[#b6954a]" /> Intermediate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPlan(sub.id, "custom")} className="gap-2">
                                            <MessageSquare className="h-3.5 w-3.5 text-[#b6954a]" /> Custom
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPlan(sub.id, null)} className="gap-2 text-muted-foreground">
                                            <Ban className="h-3.5 w-3.5" /> Remove Plan
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-[#b6954a]/10 bg-muted/10 px-6 py-3">
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                        {pagination && pagination.total > 0 ? `Showing ${start}–${end} of ${pagination.total}` : "No results"}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-7 w-7 rounded-lg border-[#b6954a]/20 bg-transparent p-0 text-muted-foreground transition-all hover:border-[#b6954a]/40 hover:bg-[#b6954a]/10 hover:text-[#b6954a] disabled:opacity-30" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                        <span className="font-mono text-[10px] text-muted-foreground/50">{pagination ? `${pagination.page} / ${pagination.totalPages}` : "—"}</span>
                        <Button variant="outline" size="sm" className="h-7 w-7 rounded-lg border-[#b6954a]/20 bg-transparent p-0 text-muted-foreground transition-all hover:border-[#b6954a]/40 hover:bg-[#b6954a]/10 hover:text-[#b6954a] disabled:opacity-30" disabled={!pagination || page >= pagination.totalPages || loading} onClick={() => setPage((p) => p + 1)}>
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default function SubscriptionsPage() {
    return (
        <Suspense fallback={
            <Card className="overflow-hidden rounded-2xl border border-[#b6954a]/15 bg-card">
                <div className="flex flex-wrap items-center gap-3 border-b border-[#b6954a]/10 bg-muted/10 px-6 py-4">
                    <div className="h-8 min-w-48 flex-1 animate-pulse rounded-lg bg-[#b6954a]/5" />
                    <div className="h-8 w-24 animate-pulse rounded-lg bg-[#b6954a]/5" />
                </div>
                <div className="divide-y divide-[#b6954a]/10">
                    {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
                </div>
            </Card>
        }>
            <SubscriptionsPageInner />
        </Suspense>
    )
}
