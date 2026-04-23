"use client"

import { useEffect, useState, useCallback, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
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
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
    ContextMenuLabel,
} from "@/components/ui/context-menu"
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Ban,
    Zap,
    Sparkles,
    MessageSquare,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    X,
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
    none: "No Plan",
}

const PLAN_ICONS: Record<string, React.ElementType> = {
    basic: Zap,
    intermediate: Sparkles,
    custom: MessageSquare,
}

const PAGE_SIZES = [10, 25, 50]

const SORT_OPTIONS = [
    { label: "Name A–Z", field: "name", dir: "asc" },
    { label: "Name Z–A", field: "name", dir: "desc" },
    { label: "Progress ↑", field: "progress", dir: "asc" },
    { label: "Progress ↓", field: "progress", dir: "desc" },
    { label: "Last Active ↑", field: "lastActive", dir: "asc" },
    { label: "Last Active ↓", field: "lastActive", dir: "desc" },
]

interface Client {
    id: string
    firstName: string
    lastName: string
    email: string
    accountStatus: "unsubscribed" | "pending" | "active"
    plan: "basic" | "intermediate" | "custom" | null
    joinedAt: string | null
    progress: number
    currentPhase: number | "completed" | null
    isCompleted: boolean
    isStale: boolean
    lastActive: string | null
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

const PHASE_LABELS: Record<string, { label: string; color: string }> = {
    "1": { label: "Connection", color: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
    "2": { label: "Awareness", color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
    "3": { label: "Stabilization", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
    "4": { label: "Activation", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
    completed: { label: "Done", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
}

function PhaseBadge({ phase }: { phase: number | "completed" | null }) {
    if (phase === null)
        return <span className="text-xs text-muted-foreground/40">—</span>
    const key = phase === "completed" ? "completed" : String(phase)
    const cfg = PHASE_LABELS[key]
    if (!cfg) return null
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.color}`}>
            {phase !== "completed" && <span className="mr-1 font-mono opacity-60">P{phase}</span>}
            {cfg.label}
        </span>
    )
}

function SkeletonRow() {
    return (
        <div className="grid grid-cols-[2fr_1.5fr_130px_100px_110px_48px] items-center gap-x-4 px-6 py-5">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[#b6954a]/10" />
                <div className="space-y-1.5">
                    <div className="h-3 w-28 animate-pulse rounded bg-[#b6954a]/10" />
                    <div className="h-2.5 w-36 animate-pulse rounded bg-[#b6954a]/5" />
                </div>
            </div>
            <div className="h-2 w-full animate-pulse rounded-full bg-[#b6954a]/10" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-[#b6954a]/10" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-[#b6954a]/10" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-[#b6954a]/10" />
            <div className="h-7 w-7 animate-pulse rounded-lg bg-[#b6954a]/10" />
        </div>
    )
}

function ClientsPageInner() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [clients, setClients] = useState<Client[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState(searchParams.get("search") ?? "")
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "")
    const [planFilter, setPlanFilter] = useState(searchParams.get("plan") ?? "")
    const [staleOnly, setStaleOnly] = useState(searchParams.get("stale") === "true")
    const [page, setPage] = useState(Number(searchParams.get("page") ?? 1))
    const [limit, setLimit] = useState(Number(searchParams.get("limit") ?? 10))
    const [sortField, setSortField] = useState(searchParams.get("sortField") ?? "")
    const [sortDir, setSortDir] = useState(searchParams.get("sortDir") ?? "asc")

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

    const fetchClients = useCallback(() => {
        setLoading(true)
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        if (debouncedSearch) params.set("search", debouncedSearch)
        if (statusFilter) params.set("status", statusFilter)
        if (planFilter) params.set("plan", planFilter)
        if (staleOnly) params.set("stale", "true")
        if (sortField) { params.set("sortField", sortField); params.set("sortDir", sortDir) }

        fetch(`/api/admin/subscriptions?${params}`)
            .then((r) => r.json())
            .then((data) => {
                setClients(data.clients ?? [])
                setPagination(data.pagination ?? null)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [page, limit, debouncedSearch, statusFilter, planFilter, staleOnly, sortField, sortDir])

    useEffect(() => {
        fetchClients()
        const p = new URLSearchParams()
        if (debouncedSearch) p.set("search", debouncedSearch)
        if (statusFilter) p.set("status", statusFilter)
        if (planFilter) p.set("plan", planFilter)
        if (staleOnly) p.set("stale", "true")
        if (page > 1) p.set("page", String(page))
        if (limit !== 10) p.set("limit", String(limit))
        if (sortField) { p.set("sortField", sortField); p.set("sortDir", sortDir) }
        router.replace(`/admin/clients?${p.toString()}`, { scroll: false })
    }, [fetchClients, debouncedSearch, statusFilter, planFilter, staleOnly, page, limit, sortField, sortDir, router])

    async function setStatus(id: string, accountStatus: string) {
        const prev = clients.find((c) => c.id === id)
        setClients((cur) => cur.map((c) => c.id === id ? { ...c, accountStatus: accountStatus as Client["accountStatus"] } : c))
        try {
            const res = await fetch(`/api/admin/subscriptions/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountStatus }),
            })
            if (!res.ok) throw new Error()
        } catch {
            if (prev) setClients((cur) => cur.map((c) => c.id === id ? prev : c))
        }
    }

    async function setPlan(id: string, plan: string | null) {
        const prev = clients.find((c) => c.id === id)
        setClients((cur) => cur.map((c) => c.id === id ? { ...c, plan: plan as Client["plan"] } : c))
        try {
            const res = await fetch(`/api/admin/subscriptions/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            })
            if (!res.ok) throw new Error()
        } catch {
            if (prev) setClients((cur) => cur.map((c) => c.id === id ? prev : c))
        }
    }

    function formatDate(iso: string | null) {
        if (!iso) return "—"
        return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }

    const activeSort = SORT_OPTIONS.find((s) => s.field === sortField && s.dir === sortDir)
    const start = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0
    const end = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0
    const hasFilters = !!(search || statusFilter || planFilter || staleOnly || sortField)

    function clearFilters() {
        setSearch("")
        setDebouncedSearch("")
        setStatusFilter("")
        setPlanFilter("")
        setStaleOnly(false)
        setSortField("")
        setSortDir("asc")
        setPage(1)
    }

    return (
        <div className="space-y-4">
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

                    {/* Sort */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs transition-all ${sortField ? "border-[#b6954a]/40 bg-[#b6954a]/10 text-[#b6954a]" : "border-[#b6954a]/20 bg-background text-muted-foreground hover:border-[#b6954a]/40 hover:bg-[#b6954a]/5 hover:text-foreground"}`}>
                                <ArrowUpDown className="h-3 w-3" />
                                {activeSort?.label ?? "Sort"}
                                <ChevronDown className="h-3 w-3 opacity-60" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-44">
                            <DropdownMenuLabel className="text-[10px] tracking-widest text-muted-foreground/50 uppercase">Sort by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSortField(""); setPage(1) }}>Default</DropdownMenuItem>
                            {SORT_OPTIONS.map((s) => (
                                <DropdownMenuItem key={`${s.field}-${s.dir}`} onClick={() => { setSortField(s.field); setSortDir(s.dir); setPage(1) }} className="flex items-center gap-1.5">
                                    {s.dir === "asc" ? <ArrowUp className="h-3 w-3 opacity-50" /> : <ArrowDown className="h-3 w-3 opacity-50" />}
                                    {s.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Stale toggle */}
                    <button
                        onClick={() => { setStaleOnly((v) => !v); setPage(1) }}
                        className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs transition-colors ${staleOnly ? "border-amber-500/40 bg-amber-500/10 text-amber-500" : "border-[#b6954a]/20 bg-background text-muted-foreground hover:border-[#b6954a]/40 hover:bg-[#b6954a]/5 hover:text-foreground"}`}
                    >
                        <AlertTriangle className="h-3 w-3" />
                        Stale only
                    </button>

                    {/* Clear filters */}
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex h-8 items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 text-xs text-red-500 transition-colors hover:bg-red-500/10"
                        >
                            <X className="h-3 w-3" />
                            Clear
                        </button>
                    )}

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

                {/* Scrollable table area */}
                <div className="overflow-x-auto">
                <div className="min-w-[750px]">

                {/* Column headers */}
                <div className="grid grid-cols-[2fr_1.5fr_130px_100px_110px_48px] items-center gap-x-4 border-b border-[#b6954a]/10 bg-muted/20 px-6 py-3">
                    {["Client", "Progress", "Phase", "Plan", "Status", ""].map((h) => (
                        <span key={h} className="text-xs font-semibold tracking-widest text-muted-foreground/70 uppercase">{h}</span>
                    ))}
                </div>

                {/* Rows */}
                <div className="divide-y divide-[#b6954a]/10">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                    ) : clients.length === 0 ? (
                        <div className="py-16 text-center text-sm text-muted-foreground">No clients found.</div>
                    ) : (
                        clients.map((client) => (
                            <ContextMenu key={client.id}>
                                <ContextMenuTrigger asChild>
                                    <div className="grid grid-cols-[2fr_1.5fr_130px_100px_110px_48px] items-center gap-x-4 px-6 py-5 transition-all hover:bg-[#b6954a]/[0.02]">
                                        {/* Avatar + name */}
                                        <Link href={`/admin/clients/${client.id}`} className="group flex min-w-0 items-center gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b6954a]/10 text-sm font-bold text-[#b6954a] uppercase ring-1 ring-[#b6954a]/20 transition-all group-hover:scale-105 group-hover:bg-[#b6954a]/20">
                                                {client.firstName[0]}{client.lastName[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-semibold text-foreground group-hover:text-[#b6954a] transition-colors">
                                                        {client.firstName} {client.lastName}
                                                    </p>
                                                    {client.isStale && (
                                                        <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-500 shrink-0">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            Stale
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="truncate text-xs text-muted-foreground/80 mt-0.5">{client.email}</p>
                                            </div>
                                        </Link>

                                        {/* Progress bar */}
                                        <div className="flex items-center gap-2 pr-2">
                                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#b6954a]/10">
                                                <div
                                                    className={`h-full rounded-full transition-all ${client.isCompleted ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-gradient-to-r from-[#b6954a] to-[#d6b56c] shadow-[0_0_8px_rgba(182,149,74,0.3)]"}`}
                                                    style={{ width: `${client.progress}%` }}
                                                />
                                            </div>
                                            <span className="w-8 text-right font-mono text-[10px] text-muted-foreground/60 shrink-0">
                                                {client.progress}%
                                            </span>
                                        </div>

                                        <PhaseBadge phase={client.currentPhase} />
                                        <PlanBadge plan={client.plan} />
                                        <StatusBadge status={client.accountStatus} />

                                        {/* Manage dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg border-[#b6954a]/20 text-muted-foreground hover:border-[#b6954a]/40 hover:bg-[#b6954a]/10 hover:text-[#b6954a]">
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44">
                                                <DropdownMenuLabel className="text-[10px] tracking-widest text-muted-foreground/50 uppercase">Change Status</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setStatus(client.id, "active")} className="gap-2 text-emerald-600">
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Activate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setStatus(client.id, "pending")} className="gap-2 text-amber-600">
                                                    <Clock className="h-3.5 w-3.5" /> Set Pending
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setStatus(client.id, "unsubscribed")} className="gap-2 text-muted-foreground">
                                                    <Ban className="h-3.5 w-3.5" /> Unsubscribe
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel className="text-[10px] tracking-widest text-muted-foreground/50 uppercase">Set Plan</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setPlan(client.id, "basic")} className="gap-2">
                                                    <Zap className="h-3.5 w-3.5 text-[#b6954a]" /> Basic
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setPlan(client.id, "intermediate")} className="gap-2">
                                                    <Sparkles className="h-3.5 w-3.5 text-[#b6954a]" /> Intermediate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setPlan(client.id, "custom")} className="gap-2">
                                                    <MessageSquare className="h-3.5 w-3.5 text-[#b6954a]" /> Custom
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setPlan(client.id, null)} className="gap-2 text-muted-foreground">
                                                    <Ban className="h-3.5 w-3.5" /> Remove Plan
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </ContextMenuTrigger>
                                <ContextMenuContent className="w-44">
                                    <ContextMenuLabel className="text-[10px] tracking-widest text-muted-foreground/50 uppercase">Change Status</ContextMenuLabel>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem onClick={() => setStatus(client.id, "active")} className="gap-2 text-emerald-600">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Activate
                                    </ContextMenuItem>
                                    <ContextMenuItem onClick={() => setStatus(client.id, "pending")} className="gap-2 text-amber-600">
                                        <Clock className="h-3.5 w-3.5" /> Set Pending
                                    </ContextMenuItem>
                                    <ContextMenuItem onClick={() => setStatus(client.id, "unsubscribed")} className="gap-2 text-muted-foreground">
                                        <Ban className="h-3.5 w-3.5" /> Unsubscribe
                                    </ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuLabel className="text-[10px] tracking-widest text-muted-foreground/50 uppercase">Set Plan</ContextMenuLabel>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem onClick={() => setPlan(client.id, "basic")} className="gap-2">
                                        <Zap className="h-3.5 w-3.5 text-[#b6954a]" /> Basic
                                    </ContextMenuItem>
                                    <ContextMenuItem onClick={() => setPlan(client.id, "intermediate")} className="gap-2">
                                        <Sparkles className="h-3.5 w-3.5 text-[#b6954a]" /> Intermediate
                                    </ContextMenuItem>
                                    <ContextMenuItem onClick={() => setPlan(client.id, "custom")} className="gap-2">
                                        <MessageSquare className="h-3.5 w-3.5 text-[#b6954a]" /> Custom
                                    </ContextMenuItem>
                                    <ContextMenuItem onClick={() => setPlan(client.id, null)} className="gap-2 text-muted-foreground">
                                        <Ban className="h-3.5 w-3.5" /> Remove Plan
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        ))
                    )}
                </div>

                </div>{/* end min-w */}
                </div>{/* end overflow-x-auto */}

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

export default function ClientsPage() {
    return (
        <Suspense fallback={
            <Card className="overflow-hidden rounded-2xl border border-[#b6954a]/15 bg-card">
                <div className="flex flex-wrap items-center gap-3 border-b border-[#b6954a]/10 bg-muted/10 px-6 py-4">
                    <div className="h-8 min-w-48 flex-1 animate-pulse rounded-lg bg-[#b6954a]/5" />
                    <div className="h-8 w-24 animate-pulse rounded-lg bg-[#b6954a]/5" />
                    <div className="h-8 w-24 animate-pulse rounded-lg bg-[#b6954a]/5" />
                </div>
                <div className="divide-y divide-[#b6954a]/10">
                    {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
                </div>
            </Card>
        }>
            <ClientsPageInner />
        </Suspense>
    )
}
