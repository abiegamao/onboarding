"use client"

import { useEffect, useState, useCallback, useRef } from "react"
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
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

const PHASE_LABELS: Record<string, string> = {
  "1": "Connection",
  "2": "Awareness",
  "3": "Stabilization",
  "4": "Activation",
  completed: "Completed",
}

const PHASE_COLORS: Record<number, string> = {
  1: "bg-[#f1ddb0]/5 text-[#f1ddb0] border border-[#f1ddb0]/20",
  2: "bg-[#d6b56c]/5 text-[#d6b56c] border border-[#d6b56c]/20",
  3: "bg-[#b6954a]/10 text-[#b6954a] border border-[#b6954a]/20",
  4: "bg-[#806b38]/15 text-[#806b38] border border-[#806b38]/30",
}

const PAGE_SIZES = [10, 25, 50]
const SORT_OPTIONS = [
  { label: "Name A–Z", field: "name", dir: "asc" },
  { label: "Name Z–A", field: "name", dir: "desc" },
  { label: "Phase ↑", field: "phase", dir: "asc" },
  { label: "Phase ↓", field: "phase", dir: "desc" },
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
  currentPhase: number
  currentStep: string
  progress: number
  isCompleted: boolean
  isStale: boolean
  lastActive: string | null
  joinedAt: string | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[1fr_200px_160px_160px] items-center px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-[#b6954a]/10 animate-pulse shrink-0" />
        <div className="space-y-1.5">
          <div className="h-3 w-28 rounded bg-[#b6954a]/10 animate-pulse" />
          <div className="h-2.5 w-36 rounded bg-[#b6954a]/5 animate-pulse" />
        </div>
      </div>
      <div className="h-5 w-28 rounded-full bg-[#b6954a]/10 animate-pulse" />
      <div className="h-2 w-24 rounded-full bg-[#b6954a]/10 animate-pulse" />
      <div className="h-3 w-24 rounded bg-[#b6954a]/5 animate-pulse" />
    </div>
  )
}

export default function ClientsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [clients, setClients] = useState<Client[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [phase, setPhase] = useState(searchParams.get("phase") ?? "")
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
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search])

  const syncURL = useCallback(() => {
    const p = new URLSearchParams()
    if (debouncedSearch) p.set("search", debouncedSearch)
    if (phase) p.set("phase", phase)
    if (staleOnly) p.set("stale", "true")
    if (page > 1) p.set("page", String(page))
    if (limit !== 10) p.set("limit", String(limit))
    if (sortField) { p.set("sortField", sortField); p.set("sortDir", sortDir) }
    router.replace(`/admin/clients?${p.toString()}`, { scroll: false })
  }, [debouncedSearch, phase, staleOnly, page, limit, sortField, sortDir, router])

  const fetchClients = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (debouncedSearch) params.set("search", debouncedSearch)
    if (phase) params.set("phase", phase)
    if (staleOnly) params.set("stale", "true")
    if (sortField) { params.set("sortField", sortField); params.set("sortDir", sortDir) }

    fetch(`/api/admin/clients?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setClients(data.clients ?? [])
        setPagination(data.pagination ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [page, limit, debouncedSearch, phase, staleOnly, sortField, sortDir])

  useEffect(() => { fetchClients(); syncURL() }, [fetchClients, syncURL])

  function formatDate(iso: string | null) {
    if (!iso) return "—"
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  function emptyMessage() {
    if (staleOnly) return "No stale clients."
    if (phase) return `No clients in ${PHASE_LABELS[phase] ?? "this"} phase.`
    if (debouncedSearch) return `No results for "${debouncedSearch}".`
    return "No clients found."
  }

  const activeSort = SORT_OPTIONS.find((s) => s.field === sortField && s.dir === sortDir)
  const start = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0
  const end = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border border-[#b6954a]/15 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#b6954a]/10 bg-muted/10 px-6 py-4">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#b6954a]/20 bg-background pl-8 pr-3 text-xs text-[#b6954a] placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#b6954a]/40 focus:ring-1 focus:ring-[#b6954a]/30 transition-all"
            />
          </div>

          {/* Phase filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs transition-all ${
                phase ? "border-[#b6954a]/40 bg-[#b6954a]/10 text-[#b6954a]" : "border-[#b6954a]/20 bg-background text-muted-foreground hover:text-foreground hover:border-[#b6954a]/40 hover:bg-[#b6954a]/5"
              }`}>
                {phase ? PHASE_LABELS[phase] : "All phases"}
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuItem onClick={() => { setPhase(""); setPage(1) }}>
                All phases
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {Object.entries(PHASE_LABELS).map(([val, label]) => (
                <DropdownMenuItem key={val} onClick={() => { setPhase(val); setPage(1) }}>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs transition-all ${
                sortField ? "border-[#b6954a]/40 bg-[#b6954a]/10 text-[#b6954a]" : "border-[#b6954a]/20 bg-background text-muted-foreground hover:text-foreground hover:border-[#b6954a]/40 hover:bg-[#b6954a]/5"
              }`}>
                <ArrowUpDown className="h-3 w-3" />
                {activeSort?.label ?? "Sort"}
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/50">Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { setSortField(""); setPage(1) }}>
                Default
              </DropdownMenuItem>
              {SORT_OPTIONS.map((s) => (
                <DropdownMenuItem
                  key={`${s.field}-${s.dir}`}
                  onClick={() => { setSortField(s.field); setSortDir(s.dir); setPage(1) }}
                  className="flex items-center gap-1.5"
                >
                  {s.dir === "asc" ? <ArrowUp className="h-3 w-3 opacity-50" /> : <ArrowDown className="h-3 w-3 opacity-50" />}
                  {s.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Stale toggle */}
          <button
            onClick={() => { setStaleOnly((v) => !v); setPage(1) }}
            className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs transition-colors ${
              staleOnly
                ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                : "border-[#b6954a]/20 bg-background text-muted-foreground hover:text-foreground hover:border-[#b6954a]/40 hover:bg-[#b6954a]/5"
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            Stale only
          </button>

          {/* Page size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-8 items-center gap-1.5 rounded-lg border border-[#b6954a]/20 bg-background px-3 text-xs text-muted-foreground hover:text-foreground hover:border-[#b6954a]/40 hover:bg-[#b6954a]/5 transition-all">
                {limit} / page
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28">
              {PAGE_SIZES.map((s) => (
                <DropdownMenuItem key={s} onClick={() => { setLimit(s); setPage(1) }}>
                  {s} per page
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Column headers */}
        <div className="hidden grid-cols-[1fr_200px_160px_160px] items-center border-b border-[#b6954a]/10 bg-muted/5 px-6 py-2 sm:grid">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">Client</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">Phase</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">Progress</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">Last Active</span>
        </div>

        {/* Table */}
        <div className="divide-y divide-[#b6954a]/10">
          {loading ? (
            Array.from({ length: limit > 10 ? 8 : 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : clients.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">{emptyMessage()}</div>
          ) : (
            clients.map((client) => (
              <Link
                key={client.id}
                href={`/admin/clients/${client.id}`}
                className="grid grid-cols-[1fr_200px_160px_160px] items-center px-6 py-4 transition-all hover:bg-[#b6954a]/[0.02] group"
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b6954a]/10 text-xs font-bold uppercase text-[#b6954a] ring-1 ring-[#b6954a]/20 group-hover:bg-[#b6954a]/20 group-hover:scale-105 transition-all">
                    {client.firstName[0]}{client.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {client.firstName} {client.lastName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{client.email}</p>
                  </div>
                </div>

                {/* Phase + stale */}
                <div className="flex items-center gap-2">
                  {client.isCompleted ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500 border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </span>
                  ) : (
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PHASE_COLORS[client.currentPhase] ?? ""}`}>
                      {PHASE_LABELS[String(client.currentPhase)]} · {client.currentStep}
                    </span>
                  )}
                  {client.isStale && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-500">
                      <AlertTriangle className="h-3 w-3" />
                      Stale
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2 pr-4">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#b6954a]/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                    <div
                      className={`h-full rounded-full ${client.isCompleted ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-gradient-to-r from-[#b6954a] to-[#d6b56c] shadow-[0_0_8px_rgba(182,149,74,0.3)]"}`}
                      style={{ width: `${client.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground/60 w-8 text-right">{client.progress}%</span>
                </div>

                {/* Last active */}
                <span className="text-xs text-muted-foreground/60 whitespace-nowrap">
                  {client.lastActive ? `Active ${formatDate(client.lastActive)}` : `Joined ${formatDate(client.joinedAt)}`}
                </span>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#b6954a]/10 bg-muted/10 px-6 py-3">
          <span className="font-mono text-[10px] text-muted-foreground/50">
            {pagination && pagination.total > 0
              ? `Showing ${start}–${end} of ${pagination.total}`
              : "No results"}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 rounded-lg border-[#b6954a]/20 bg-transparent text-muted-foreground hover:bg-[#b6954a]/10 hover:text-[#b6954a] hover:border-[#b6954a]/40 p-0 disabled:opacity-30 disabled:border-[#b6954a]/10 transition-all"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="font-mono text-[10px] text-muted-foreground/50">
              {pagination ? `${pagination.page} / ${pagination.totalPages}` : "—"}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 rounded-lg border-[#b6954a]/20 bg-transparent text-muted-foreground hover:bg-[#b6954a]/10 hover:text-[#b6954a] hover:border-[#b6954a]/40 p-0 disabled:opacity-30 disabled:border-[#b6954a]/10 transition-all"
              disabled={!pagination || page >= pagination.totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
