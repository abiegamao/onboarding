"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
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
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react"

const STEPS = ["1A","1B","1C","1D","1E","1F","2A","2B","2C","3A","3B","3C","3D","3E","4A","4B","4C"]
const STALE_DAYS = 7

const PHASES = [
  { id: 1, name: "Connection",    steps: ["1A","1B","1C","1D","1E","1F"] },
  { id: 2, name: "Awareness",     steps: ["2A","2B","2C"] },
  { id: 3, name: "Stabilization", steps: ["3A","3B","3C","3D","3E"] },
  { id: 4, name: "Activation",    steps: ["4A","4B","4C"] },
]

const STEP_LABELS: Record<string, string> = {
  "1A": "Foundation Video",    "1B": "Getting to Know You",
  "1C": "Leadership Triage",   "1D": "Open Share",
  "1E": "Culture Takeaways",   "1F": "Schedule Orientation",
  "2A": "360° Feedback",       "2B": "Growth Inputs",
  "2C": "Evening Pulse",       "3A": "Vision Activation",
  "3B": "Vision Statements",   "3C": "Ideal Day Narrative",
  "3D": "Word of the Year",    "3E": "Family Mission",
  "4A": "Kickstart Call",      "4B": "Join Telegram",
  "4C": "Wealth Strategy",
}

const VISION_DOMAINS = [
  "Spiritual", "Health/Physical", "Family/Marriage", "Business/Career",
  "Financial", "Social/Community", "Intellectual/Personal Growth", "Recreational/Fun",
]

interface UserData {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  addressLine1: string
  city: string
  stateProvince: string
  zipCode: string
  countryRegion: string
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
  connection?: { gettingToKnowYou?: Record<string, unknown>; triage?: Record<string, unknown>; openShare?: string; cultureTakeaways?: string }
  awareness?: { evaluation360?: Array<Record<string, string>>; growthInputs?: Record<string, string>; eveningPulse?: { goodToday?: string; heavyToday?: string; peaceLevel?: number } }
  stabilization?: { visionActivation?: Record<string, string>; visionStatements?: Record<string, string>; idealDayStory?: string; wordOfYear?: string; familyMission?: { values?: string[]; statement?: string } }
  activation?: { kickstartCallBooked?: boolean; telegramJoined?: boolean; wealthStrategyComplete?: boolean }
}

function Field({ label, value }: { label: string; value?: unknown }) {
  if (!value) return null
  const display = Array.isArray(value) ? (value as string[]).join(", ") : String(value)
  if (!display.trim()) return null
  return (
    <div className="space-y-0.5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">{label}</p>
      <p className="text-base text-foreground whitespace-pre-wrap">{display}</p>
    </div>
  )
}

function PhaseSection({
  phaseId,
  title,
  isActive,
  isDone,
  children,
  sectionRef,
}: {
  phaseId: number
  title: string
  isActive: boolean
  isDone: boolean
  children: React.ReactNode
  sectionRef: RefObject<HTMLDivElement | null>
}) {
  const [open, setOpen] = useState(isActive || isDone)

  return (
    <Card
      ref={sectionRef}
      id={`phase-${phaseId}`}
      className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-primary/3"
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
            isDone ? "bg-emerald-500 text-white" :
            isActive ? "bg-primary text-white" :
            "bg-border/40 text-muted-foreground/50"
          }`}>
            {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : phaseId}
          </div>
          <span className="text-base font-semibold text-foreground">{title}</span>
          {isDone && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">Done</span>
          )}
          {isActive && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">In Progress</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-border/30 px-6 py-6 space-y-6">{children}</div>}
    </Card>
  )
}

function TimelineSidebar({
  phases,
  status,
  stepDone,
  phaseStatus,
  scrollToPhase,
}: {
  phases: typeof PHASES
  status: { currentStep: string; isCompleted: boolean }
  stepDone: (step: string) => boolean
  phaseStatus: (steps: string[]) => string
  scrollToPhase: (id: number) => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="w-full lg:w-60 lg:shrink-0 lg:sticky lg:top-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
        {/* Header — toggle on mobile */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 lg:cursor-default lg:pointer-events-none"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50">Journey</p>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform lg:hidden ${expanded ? "rotate-180" : ""}`} />
        </button>

        {expanded && (
          <div className="relative px-5 pb-5">
            {/* Vertical connector line */}
            <div className="absolute left-[31px] top-0 bottom-5 w-px bg-border/40" />

            {phases.map((phase) => {
              const ps = phaseStatus(phase.steps)
              const isDone = ps === "done"
              const isActive = ps === "active"

              return (
                <div key={phase.id} className="relative flex gap-3 pb-5 last:pb-0">
                  <div className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-colors ${
                    isDone   ? "border-emerald-500 bg-emerald-500 text-white" :
                    isActive ? "border-primary bg-primary text-white" :
                               "border-border/50 bg-card text-muted-foreground/40"
                  }`}>
                    {isDone ? <CheckCircle2 className="h-3 w-3" /> : phase.id}
                  </div>

                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => scrollToPhase(phase.id)}
                      className={`text-left text-sm font-semibold leading-tight hover:text-primary transition-colors ${
                        isActive ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground/50"
                      }`}
                    >
                      {phase.name}
                    </button>

                    <div className="mt-2 space-y-1.5 border-l border-border/30 pl-3">
                      {phase.steps.map((step) => {
                        const done = stepDone(step)
                        const active = !status.isCompleted && step === status.currentStep
                        return (
                          <div key={step} className="flex items-center gap-1.5">
                            <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              done ? "bg-emerald-500" : active ? "bg-primary" : "bg-border/50"
                            }`} />
                            <span className={`truncate text-xs leading-tight ${
                              active ? "font-semibold text-primary" : done ? "text-muted-foreground/60" : "text-muted-foreground/50"
                            }`}>
                              {STEP_LABELS[step]}
                            </span>
                            {active && <span className="shrink-0 rounded bg-primary/10 px-1 font-mono text-[10px] text-primary">NOW</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
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
  } catch { return null }
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<UserData | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)
  const ref4 = useRef<HTMLDivElement>(null)
  const sectionRefs: Record<number, RefObject<HTMLDivElement | null>> = { 1: ref1, 2: ref2, 3: ref3, 4: ref4 }

  useEffect(() => {
    fetch(`/api/admin/clients/${id}`)
      .then((r) => { if (r.status === 404) { setNotFound(true); return null } return r.json() })
      .then((data) => { if (!data) return; setUser(data.user); setProfile(data.profile); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  function scrollToPhase(phaseId: number) {
    sectionRefs[phaseId]?.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

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

  function stepDone(step: string) {
    if (!status) return false
    if (status.isCompleted) return true
    return STEPS.indexOf(step) < STEPS.indexOf(status.currentStep)
  }

  function phaseStatus(phaseSteps: string[]) {
    if (!status) return "pending"
    if (status.isCompleted || phaseSteps.every((s) => stepDone(s))) return "done"
    if (phaseSteps.some((s) => s === status.currentStep || stepDone(s))) return "active"
    return "pending"
  }

  const gky = profile?.connection?.gettingToKnowYou || {}
  const triage = profile?.connection?.triage || {}
  const awareness = profile?.awareness || {}
  const stabilization = profile?.stabilization || {}
  const activation = profile?.activation || {}
  const leaderScoreData = parseLeaderScore(triage.pdlLeaderScore)

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <Link href="/admin/clients">
          <ChevronLeft className="h-3.5 w-3.5" />
          All clients
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Profile card */}
        <Card className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold uppercase text-primary">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0 flex-1">
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
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              <span>{user.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              <span className="truncate">{[user.city, user.stateProvince, user.countryRegion].filter(Boolean).join(", ")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              <span>Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
        </Card>

        {/* Progress card */}
        {status && (
          <Card className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-end justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50">Overall Progress</p>
              <span className={`text-3xl font-extrabold tracking-tight ${status.isCompleted ? "text-emerald-500" : "text-foreground"}`}>
                {progress}<span className="text-base font-normal text-muted-foreground">%</span>
              </span>
            </div>

            <div className="mb-5 h-2 overflow-hidden rounded-full bg-border/50">
              <div
                className={`h-full rounded-full transition-all ${status.isCompleted ? "bg-emerald-500" : "bg-primary"}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Phase pills */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              {PHASES.map((phase) => {
                const ps = phaseStatus(phase.steps)
                return (
                  <div key={phase.id} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    ps === "done"   ? "bg-emerald-500/8 text-emerald-600" :
                    ps === "active" ? "bg-primary/8 text-primary" :
                                     "bg-border/20 text-muted-foreground/50"
                  }`}>
                    <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      ps === "done" ? "bg-emerald-500" : ps === "active" ? "bg-primary" : "bg-border/50"
                    }`} />
                    <span className="font-medium">{phase.name}</span>
                    {ps === "done" && <CheckCircle2 className="ml-auto h-3 w-3" />}
                    {ps === "active" && <span className="ml-auto font-mono text-[10px]">NOW</span>}
                  </div>
                )
              })}
            </div>

            <div className="space-y-1 border-t border-border/30 pt-3 text-sm text-muted-foreground">
              {!status.isCompleted && (
                <p>Current step: <span className="font-medium text-foreground">{status.currentStep} — {STEP_LABELS[status.currentStep]}</span></p>
              )}
              {status.updatedAt && (
                <p>Last active: <span className="text-foreground">{new Date(status.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></p>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* 2-col: timeline left, content right */}
      {profile && status && (
        <div className="flex flex-col gap-6 items-start lg:flex-row">

          {/* LEFT: Vertical timeline (sticky on desktop, collapsible on mobile) */}
          <TimelineSidebar
            phases={PHASES}
            status={status}
            stepDone={stepDone}
            phaseStatus={phaseStatus}
            scrollToPhase={scrollToPhase}
          />

          {/* RIGHT: Phase content */}
          <div className="w-full min-w-0 space-y-4 lg:flex-1">

            {/* Phase 1 */}
            <PhaseSection
              phaseId={1}
              title="Phase 1 — Connection"
              isActive={phaseStatus(PHASES[0].steps) === "active"}
              isDone={phaseStatus(PHASES[0].steps) === "done"}
              sectionRef={sectionRefs[1]}
            >
              <div>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">Getting to Know You</p>
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
              </div>

              <div>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">Leadership Triage</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Neurodiversity" value={triage.neurodiversity as string} />
                  <Field label="Internal Wiring" value={triage.internalWiring as string} />
                  <Field label="DISC Profile" value={triage.disc as string} />
                </div>
                {leaderScoreData && leaderScoreData.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">PDL Leadership Score</p>
                    <ResponsiveContainer width="100%" height={240}>
                      <RadarChart data={leaderScoreData}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="question" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                        <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} dot={{ r: 3, fill: "#6366f1" }} />
                        <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Open Share" value={profile.connection?.openShare} />
                <Field label="Culture Takeaways" value={profile.connection?.cultureTakeaways} />
              </div>
            </PhaseSection>

            {/* Phase 2 */}
            <PhaseSection
              phaseId={2}
              title="Phase 2 — Awareness"
              isActive={phaseStatus(PHASES[1].steps) === "active"}
              isDone={phaseStatus(PHASES[1].steps) === "done"}
              sectionRef={sectionRefs[2]}
            >
              {awareness.evaluation360 && awareness.evaluation360.length > 0 && (
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">360° Contacts</p>
                  <div className="divide-y divide-border/30 rounded-xl border border-border/40 overflow-hidden">
                    {awareness.evaluation360.map((contact, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <span className="font-medium text-foreground">{contact.name || "—"}</span>
                        <span className="text-sm text-muted-foreground">{contact.email || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {awareness.growthInputs && Object.keys(awareness.growthInputs).length > 0 && (
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">Growth Inputs</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Object.entries(awareness.growthInputs as Record<string, string>).map(([k, v]) => (
                      <Field key={k} label={k} value={v} />
                    ))}
                  </div>
                </div>
              )}

              {awareness.eveningPulse && (
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">Evening Pulse</p>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Peace Level</span>
                    <div className="h-2 w-40 overflow-hidden rounded-full bg-border/50">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${((awareness.eveningPulse.peaceLevel ?? 0) / 10) * 100}%` }} />
                    </div>
                    <span className="font-mono text-sm font-bold text-foreground">{awareness.eveningPulse.peaceLevel ?? "—"}<span className="text-xs text-muted-foreground">/10</span></span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Good Today" value={awareness.eveningPulse.goodToday} />
                    <Field label="Heavy Today" value={awareness.eveningPulse.heavyToday} />
                  </div>
                </div>
              )}
            </PhaseSection>

            {/* Phase 3 */}
            <PhaseSection
              phaseId={3}
              title="Phase 3 — Stabilization"
              isActive={phaseStatus(PHASES[2].steps) === "active"}
              isDone={phaseStatus(PHASES[2].steps) === "done"}
              sectionRef={sectionRefs[3]}
            >
              {stabilization.visionActivation && (
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">Vision Activation — 8 Domains</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {VISION_DOMAINS.map((domain) => (
                      <Field key={domain} label={domain} value={(stabilization.visionActivation as Record<string, string>)[domain]} />
                    ))}
                  </div>
                </div>
              )}

              {stabilization.visionStatements && (
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">Vision Statements</p>
                  <div className="space-y-3">
                    {Object.entries(stabilization.visionStatements as Record<string, string>).map(([k, v]) => (
                      <Field key={k} label={`Statement ${k.replace("s", "")}`} value={v} />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Ideal Day Story" value={stabilization.idealDayStory} />
                <Field label="Word of the Year" value={stabilization.wordOfYear} />
              </div>

              {stabilization.familyMission && (
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">Family Mission</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Values" value={stabilization.familyMission.values} />
                    <Field label="Mission Statement" value={stabilization.familyMission.statement} />
                  </div>
                </div>
              )}
            </PhaseSection>

            {/* Phase 4 */}
            <PhaseSection
              phaseId={4}
              title="Phase 4 — Activation"
              isActive={phaseStatus(PHASES[3].steps) === "active"}
              isDone={phaseStatus(PHASES[3].steps) === "done"}
              sectionRef={sectionRefs[4]}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "Kickstart Call Booked", value: activation.kickstartCallBooked },
                  { label: "Telegram Joined", value: activation.telegramJoined },
                  { label: "Wealth Strategy Complete", value: activation.wealthStrategyComplete },
                ].map(({ label, value }) => (
                  <div key={label} className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center ${
                    value ? "border-emerald-500/20 bg-emerald-500/5" : "border-border/40 bg-border/5"
                  }`}>
                    {value
                      ? <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      : <Circle className="h-6 w-6 text-border" />}
                    <span className={`text-sm font-medium ${value ? "text-emerald-600" : "text-muted-foreground"}`}>{label}</span>
                  </div>
                ))}
              </div>
            </PhaseSection>

          </div>
        </div>
      )}
    </div>
  )
}
