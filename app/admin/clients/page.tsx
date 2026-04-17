"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react"

const PHASE_LABELS: Record<number, string> = {
  1: "Connection",
  2: "Awareness",
  3: "Stabilization",
  4: "Activation",
}

const PHASE_COLORS: Record<number, string> = {
  1: "bg-indigo-500/10 text-indigo-500",
  2: "bg-purple-500/10 text-purple-500",
  3: "bg-violet-500/10 text-violet-500",
  4: "bg-fuchsia-500/10 text-fuchsia-500",
}

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

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [phase, setPhase] = useState("")
  const [staleOnly, setStaleOnly] = useState(false)
  const [page, setPage] = useState(1)

  const fetchClients = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    if (search) params.set("search", search)
    if (phase) params.set("phase", phase)
    if (staleOnly) params.set("stale", "true")

    fetch(`/api/admin/clients?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setClients(data.clients ?? [])
        setPagination(data.pagination ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [page, search, phase, staleOnly])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  function formatDate(iso: string | null) {
    if (!iso) return "—"
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border/40 px-6 py-4">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="h-8 w-full rounded-lg border border-border/50 bg-background pl-8 pr-3 text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <select
            value={phase}
            onChange={(e) => { setPhase(e.target.value); setPage(1) }}
            className="h-8 rounded-lg border border-border/50 bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="">All phases</option>
            <option value="1">Connection</option>
            <option value="2">Awareness</option>
            <option value="3">Stabilization</option>
            <option value="4">Activation</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => { setStaleOnly((v) => !v); setPage(1) }}
            className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs transition-colors ${
              staleOnly
                ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                : "border-border/50 bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            Stale only
          </button>

          <p className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
            {pagination?.total ?? "—"} total
          </p>
        </div>

        {/* Table */}
        <div className="divide-y divide-border/30">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Loading…
            </div>
          ) : clients.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">No clients found.</div>
          ) : (
            clients.map((client) => (
              <div
                key={client.id}
                className="flex flex-wrap items-center gap-4 px-6 py-4 transition-colors hover:bg-primary/3"
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-3 min-w-48">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold uppercase text-primary">
                    {client.firstName[0]}{client.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {client.firstName} {client.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{client.email}</p>
                  </div>
                </div>

                {/* Phase badge */}
                <div className="flex items-center gap-2">
                  {client.isCompleted ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </span>
                  ) : (
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PHASE_COLORS[client.currentPhase] ?? ""}`}>
                      {PHASE_LABELS[client.currentPhase]} · {client.currentStep}
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
                {!client.isCompleted && (
                  <div className="flex min-w-32 items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/50">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${client.progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground/60">{client.progress}%</span>
                  </div>
                )}

                {/* Last active */}
                <span className="ml-auto text-xs text-muted-foreground/60">
                  {client.lastActive ? `Active ${formatDate(client.lastActive)}` : `Joined ${formatDate(client.joinedAt)}`}
                </span>

                <Button asChild variant="outline" size="sm" className="h-8 rounded-lg border-border/50 text-xs">
                  <Link href={`/admin/clients/${client.id}`}>View</Link>
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/40 px-6 py-3">
            <span className="font-mono text-[10px] text-muted-foreground/50">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 rounded-lg border-border/50 p-0"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 rounded-lg border-border/50 p-0"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
