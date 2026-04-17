"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
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

const PHASE_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"]

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
    <Card className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
            {label}
          </p>
          <p className={`mt-2 text-4xl font-extrabold tracking-tight ${warn && value ? "text-amber-500" : "text-foreground"}`}>
            {value ?? "—"}
          </p>
        </div>
        <div className={`rounded-xl p-2.5 ${warn ? "bg-amber-500/10" : "bg-primary/8"}`}>
          <Icon className={`h-5 w-5 ${warn ? "text-amber-500" : "text-primary"}`} />
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 h-0.5 w-full"
        style={{
          backgroundImage: warn
            ? "linear-gradient(90deg, rgb(245 158 11), transparent)"
            : "linear-gradient(90deg, var(--primary), transparent)",
          opacity: 0.3,
        }}
      />
    </Card>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
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

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Phase Distribution">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats?.phaseDistribution}
                  dataKey="count"
                  nameKey="phase"
                  cx="40%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={48}
                  paddingAngle={3}
                >
                  {stats?.phaseDistribution.map((_, i) => (
                    <Cell key={i} fill={PHASE_COLORS[i % PHASE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {stats?.phaseDistribution.map((d, i) => (
              <span key={d.phase} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: PHASE_COLORS[i % PHASE_COLORS.length] }}
                />
                {d.phase} ({d.count})
              </span>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Step Funnel — Drop-off">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={stats?.stepFunnel}
                layout="vertical"
                margin={{ left: 16, right: 16, top: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <YAxis
                  type="category"
                  dataKey="step"
                  width={28}
                  tick={{ fontSize: 9 }}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="New Registrations (8 weeks)">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={stats?.registrationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 9 }}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#6366f1" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Completions (8 weeks)">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={stats?.completionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 9 }}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#10b981" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Quick clients link */}
      <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Clients</h2>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
              {stats?.totalClients ?? "—"} total
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="h-8 rounded-lg border-border/50 text-xs">
            <Link href="/admin/clients">View All</Link>
          </Button>
        </div>
        <div className="px-6 py-8 text-center text-sm text-muted-foreground">
          Go to{" "}
          <Link href="/admin/clients" className="text-primary underline underline-offset-2">
            Clients
          </Link>{" "}
          to search, filter, and view individual progress.
        </div>
      </Card>
    </div>
  )
}
