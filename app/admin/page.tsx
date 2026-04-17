"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { StepFunnelChart } from "@/components/admin/charts/bar-chart"
import { CompletionsBarChart } from "@/components/admin/charts/bar-chart-vertical"
import { PhaseDistributionChart } from "@/components/admin/charts/pie-chart"
import { RegistrationAreaChart } from "@/components/admin/charts/area-chart"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, CheckCircle2, Clock } from "lucide-react"

interface Stats {
  totalClients: number
  inProgress: number
  completed: number
  stale: number
  phaseDistribution: { phase: string; count: number }[]
  stepFunnel: { step: string; count: number }[]
  registrationTrend: { week: string; count: number }[]
  completionTrend: { week: string; count: number }[]
}

function StatCard({
  label,
  value,
  icon: Icon,
  warn,
}: {
  label: string
  value: number | null
  icon: React.ElementType
  warn?: boolean
}) {
  return (
    <Card className={`relative overflow-hidden rounded-2xl border ${warn ? 'border-amber-500/20' : 'border-[#b6954a]/20'} bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(182,149,74,0.08)] group`}>
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 group-hover:text-foreground/80 transition-colors">
            {label}
          </p>
          <p className={`mt-2 text-4xl font-extrabold tracking-tight ${warn && value ? "text-amber-500" : "text-foreground"} drop-shadow-sm`}>
            {value ?? "—"}
          </p>
        </div>
        <div className={`rounded-xl p-3 shadow-[inset_0_1px_3px_rgba(255,255,255,0.1)] transition-transform duration-300 group-hover:scale-110 ${warn ? "bg-gradient-to-br from-amber-500/15 to-transparent" : "bg-gradient-to-br from-[#b6954a]/15 to-[#b6954a]/5 ring-1 ring-[#b6954a]/10"}`}>
          <Icon className={`h-5 w-5 ${warn ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-[#b6954a] drop-shadow-[0_0_8px_rgba(182,149,74,0.4)]"}`} />
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 h-1 w-full transition-opacity duration-300 opacity-30 group-hover:opacity-60"
        style={{
          backgroundImage: warn
            ? "linear-gradient(90deg, rgb(245 158 11), transparent)"
            : "linear-gradient(90deg, #b6954a, transparent)",
        }}
      />
    </Card>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-2xl border border-[#b6954a]/15 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#b6954a]/50"></span>
        {title}
      </p>
      {children}
    </Card>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const statCards = [
    { label: "Total Clients", value: stats?.totalClients ?? null, icon: Users },
    { label: "In Progress", value: stats?.inProgress ?? null, icon: TrendingUp },
    { label: "Completed", value: stats?.completed ?? null, icon: CheckCircle2 },
    { label: "Stale (7d+)", value: stats?.stale ?? null, icon: Clock, warn: true },
  ]

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} warn={s.warn} />
        ))}
      </div>

      {/* Charts — left: 3 stacked, right: step funnel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <PhaseDistributionChart data={stats?.phaseDistribution ?? []} loading={loading} />

          <RegistrationAreaChart data={stats?.registrationTrend ?? []} loading={loading} />

          <CompletionsBarChart data={stats?.completionTrend ?? []} loading={loading} />
        </div>

        {/* Right column */}
        <StepFunnelChart data={stats?.stepFunnel ?? []} loading={loading} />
      </div>

      {/* Quick clients link */}
      <Card className="relative overflow-hidden rounded-2xl border border-[#b6954a]/20 bg-card shadow-[0_8px_30px_rgb(182,149,74,0.03)] group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#b6954a]/5 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center justify-between border-b border-[#b6954a]/10 px-6 py-4 relative z-10">
          <div>
            <h2 className="text-sm font-semibold text-foreground tracking-wide">Clients Database</h2>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#b6954a]/80 mt-1">
              {stats?.totalClients ?? "—"} total registered
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="h-8 rounded-lg border-[#b6954a]/20 text-xs hover:bg-[#b6954a]/10 hover:text-[#b6954a]">
            <Link href="/admin/clients">View Registry</Link>
          </Button>
        </div>
        <div className="px-6 py-8 text-center text-sm text-muted-foreground relative z-10">
          Access the{" "}
          <Link href="/admin/clients" className="font-medium text-[#b6954a] transition-all hover:text-[#d6b56c] underline underline-offset-4 decoration-[#b6954a]/30 hover:decoration-[#d6b56c]">
            Client Registry
          </Link>{" "}
          to search, filter, and monitor individual executive progress.
        </div>
      </Card>
    </div>
  )
}
