"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  Circle,
  Lock,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react"

const STEPS = ["1A","1B","1C","1D","1E","1F","2A","2B","2C","3A","3B","3C","3D","3E","4A","4B","4C"]
const LOCKED_STEPS = new Set(["2C", "3E"])
const STALE_DAYS = 7

const STEP_LABELS: Record<string, string> = {
  "1A": "Foundation Video",
  "1B": "Getting to Know You",
  "1C": "Leadership Triage",
  "1D": "Open Share",
  "1E": "Culture Takeaways",
  "1F": "Schedule Orientation",
  "2A": "360° Feedback",
  "2B": "Growth Inputs",
  "2C": "Evening Pulse",
  "3A": "Vision Activation",
  "3B": "Vision Statements",
  "3C": "Ideal Day Narrative",
  "3D": "Word of the Year",
  "3E": "Family Mission",
  "4A": "Kickstart Call",
  "4B": "Join Telegram",
  "4C": "Wealth Strategy",
}

const VISION_DOMAINS = [
  "Spiritual",
  "Health/Physical",
  "Family/Marriage",
  "Business/Career",
  "Financial",
  "Social/Community",
  "Intellectual/Personal Growth",
  "Recreational/Fun",
]

interface UserData {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  stateProvince: string
  zipCode: string
  countryRegion: string
  role: string
  createdAt: string
}

interface ProfileData {
  status: {
    currentPhase: number
    currentStep: string
    isCompleted: boolean
    updatedAt: string | null
    hasSeenCelebration: boolean
  }
  connection?: {
    gettingToKnowYou?: Record<string, unknown>
    triage?: Record<string, unknown>
    openShare?: string
    cultureTakeaways?: string
  }
  awareness?: {
    evaluation360?: Array<Record<string, string>>
    growthInputs?: Record<string, string>
    eveningPulse?: { goodToday?: string; heavyToday?: string; peaceLevel?: number }
  }
  stabilization?: {
    visionActivation?: Record<string, string>
    visionStatements?: Record<string, string>
    idealDayStory?: string
    wordOfYear?: string
    familyMission?: { values?: string[]; statement?: string }
  }
  activation?: {
    kickstartCallBooked?: boolean
    telegramJoined?: boolean
    wealthStrategyComplete?: boolean
  }
}

function Field({ label, value }: { label: string; value?: unknown }) {
  if (!value) return null
  const display = Array.isArray(value) ? (value as string[]).join(", ") : String(value)
  if (!display.trim()) return null
  return (
    <div className="space-y-0.5">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">{label}</p>
      <p className="text-sm text-foreground whitespace-pre-wrap">{display}</p>
    </div>
  )
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border/30 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-primary/3"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-6 pb-6 space-y-4">{children}</div>}
    </div>
  )
}

function StepBadge({ step, currentStep, isCompleted }: { step: string; currentStep: string; isCompleted: boolean }) {
  const currentIdx = STEPS.indexOf(currentStep)
  const stepIdx = STEPS.indexOf(step)
  const done = isCompleted || stepIdx < currentIdx
  const active = !isCompleted && stepIdx === currentIdx
  const locked = LOCKED_STEPS.has(step) && !done

  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
      done ? "bg-emerald-500/8 text-emerald-600" :
      active ? "bg-primary/8 text-primary font-semibold" :
      locked ? "bg-border/30 text-muted-foreground/40" :
      "bg-border/20 text-muted-foreground/60"
    }`}>
      {done ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> :
       locked ? <Lock className="h-3.5 w-3.5 shrink-0" /> :
       <Circle className="h-3.5 w-3.5 shrink-0" />}
      <span>{step} — {STEP_LABELS[step]}</span>
    </div>
  )
}

function parseLeaderScore(raw?: unknown): { question: string; score: number }[] | null {
  if (!raw) return null
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw
    if (!parsed?.answers) return null
    return Object.entries(parsed.answers as Record<string, number>).map(([q, score]) => ({
      question: `Q${q.replace("q", "")}`,
      score,
    }))
  } catch {
    return null
  }
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<UserData | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/clients/${id}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null }
        return r.json()
      })
      .then((data) => {
        if (!data) return
        setUser(data.user)
        setProfile(data.profile)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Loading…
      </div>
    )
  }

  if (notFound || !user) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-muted-foreground">Client not found.</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/admin/clients">Back to clients</Link>
        </Button>
      </div>
    )
  }

  const status = profile?.status
  const isStale = status && !status.isCompleted && status.updatedAt
    ? new Date(status.updatedAt) < new Date(Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000)
    : false

  const currentIdx = status ? STEPS.indexOf(status.currentStep) : 0
  const progress = status?.isCompleted ? 100 : Math.round((currentIdx / STEPS.length) * 100)

  const leaderScoreData = parseLeaderScore(profile?.connection?.triage?.pdlLeaderScore)
  const gky = profile?.connection?.gettingToKnowYou || {}
  const triage = profile?.connection?.triage || {}
  const awareness = profile?.awareness || {}
  const stabilization = profile?.stabilization || {}
  const activation = profile?.activation || {}

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <Link href="/admin/clients">
          <ChevronLeft className="h-3.5 w-3.5" />
          All clients
        </Link>
      </Button>

      {/* Profile header */}
      <Card className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold uppercase text-primary">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">{user.firstName} {user.lastName}</h1>
              {status?.isCompleted && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                  <CheckCircle2 className="h-3 w-3" /> Completed
                </span>
              )}
              {isStale && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-500">
                  <AlertTriangle className="h-3 w-3" /> Stale
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{user.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{user.phoneNumber}</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {[user.city, user.stateProvince, user.countryRegion].filter(Boolean).join(", ")}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Progress */}
          {status && (
            <div className="min-w-48 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">Progress</span>
                <span className="font-mono text-[10px] text-muted-foreground/60">{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-border/50">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              {!status.isCompleted && (
                <p className="text-xs text-muted-foreground">
                  Current: <span className="font-medium text-foreground">{status.currentStep} — {STEP_LABELS[status.currentStep]}</span>
                </p>
              )}
              {status.updatedAt && (
                <p className="text-xs text-muted-foreground/60">
                  Last active {new Date(status.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Progress timeline */}
      {status && (
        <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
          <div className="border-b border-border/40 px-6 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">Step Timeline</p>
          </div>
          <div className="grid grid-cols-2 gap-2 p-6 sm:grid-cols-3 lg:grid-cols-4">
            {STEPS.map((step) => (
              <StepBadge
                key={step}
                step={step}
                currentStep={status.currentStep}
                isCompleted={status.isCompleted}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Content accordion */}
      {profile && (
        <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
          <div className="border-b border-border/40 px-6 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">Onboarding Content</p>
          </div>

          {/* Phase 1 */}
          <Section title="Phase 1 — Connection">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Favorite Food & Snacks" value={gky.favoriteFoodSnacks as string} />
              <Field label="Hobbies & Joy" value={gky.hobbiesJoy as string} />
              <Field label="Self Care Top 3" value={gky.selfCareTop3 as string[]} />
              <Field label="Favorite Movies/Shows" value={gky.favoriteMoviesShows as string} />
              <Field label="Dream Destinations" value={gky.dreamDestinationsTop3 as string[]} />
              <Field label="Financial Goals" value={gky.financialGoals as string} />
              <Field label="Bucket List Top 3" value={gky.bucketListTop3 as string} />
              <Field label="Proud Growth" value={gky.proudGrowth as string} />
              <Field label="Work / Business" value={gky.workBusiness as string} />
              <Field label="Boundaries" value={gky.boundaries as string} />
              <Field label="Important People" value={gky.importantPeople as string} />
              <Field label="Personal Principles" value={gky.personalPrinciples as string} />
              <Field label="Uncompromisable Standards" value={gky.uncompromisableStandards as string} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Neurodiversity" value={triage.neurodiversity as string} />
              <Field label="Internal Wiring (CliftonStrengths / Human Design)" value={triage.internalWiring as string} />
              <Field label="DISC Profile" value={triage.disc as string} />
            </div>

            {leaderScoreData && leaderScoreData.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">PDL Leadership Score</p>
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={leaderScoreData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="question" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                    <Radar
                      dataKey="score"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.2}
                      dot={{ r: 3, fill: "#6366f1" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            <Field label="Open Share" value={profile.connection?.openShare} />
            <Field label="Culture Takeaways" value={profile.connection?.cultureTakeaways} />
          </Section>

          {/* Phase 2 */}
          <Section title="Phase 2 — Awareness">
            {awareness.evaluation360 && awareness.evaluation360.length > 0 && (
              <div className="space-y-1.5">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">360° Contacts</p>
                <div className="divide-y divide-border/30 rounded-lg border border-border/40">
                  {(awareness.evaluation360 as Array<Record<string, string>>).map((contact, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2 text-sm">
                      <span className="font-medium text-foreground">{contact.name || "—"}</span>
                      <span className="text-muted-foreground">{contact.email || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {awareness.growthInputs && Object.keys(awareness.growthInputs).length > 0 && (
              <div className="space-y-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">Growth Inputs</p>
                {Object.entries(awareness.growthInputs as Record<string, string>).map(([k, v]) => (
                  <Field key={k} label={k} value={v} />
                ))}
              </div>
            )}

            {awareness.eveningPulse && (
              <div className="space-y-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">Evening Pulse</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Peace Level</span>
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-border/50">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${((awareness.eveningPulse.peaceLevel ?? 0) / 10) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {awareness.eveningPulse.peaceLevel ?? "—"}/10
                  </span>
                </div>
                <Field label="Good Today" value={awareness.eveningPulse.goodToday} />
                <Field label="Heavy Today" value={awareness.eveningPulse.heavyToday} />
              </div>
            )}
          </Section>

          {/* Phase 3 */}
          <Section title="Phase 3 — Stabilization">
            {stabilization.visionActivation && (
              <div className="space-y-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">Vision Activation — 8 Domains</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {VISION_DOMAINS.map((domain) => (
                    <Field
                      key={domain}
                      label={domain}
                      value={(stabilization.visionActivation as Record<string, string>)[domain]}
                    />
                  ))}
                </div>
              </div>
            )}

            {stabilization.visionStatements && (
              <div className="space-y-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">Vision Statements</p>
                {Object.entries(stabilization.visionStatements as Record<string, string>).map(([k, v]) => (
                  <Field key={k} label={`Statement ${k.replace("s", "")}`} value={v} />
                ))}
              </div>
            )}

            <Field label="Ideal Day Story" value={stabilization.idealDayStory} />
            <Field label="Word of the Year" value={stabilization.wordOfYear} />

            {stabilization.familyMission && (
              <div className="space-y-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">Family Mission</p>
                <Field label="Values" value={stabilization.familyMission.values} />
                <Field label="Mission Statement" value={stabilization.familyMission.statement} />
              </div>
            )}
          </Section>

          {/* Phase 4 */}
          <Section title="Phase 4 — Activation">
            <div className="flex flex-col gap-3">
              {[
                { label: "Kickstart Call Booked", value: activation.kickstartCallBooked },
                { label: "Telegram Joined", value: activation.telegramJoined },
                { label: "Wealth Strategy Complete", value: activation.wealthStrategyComplete },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  {value ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-border" />
                  )}
                  <span className={`text-sm ${value ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                </div>
              ))}
            </div>
          </Section>
        </Card>
      )}
    </div>
  )
}
