"use client"

import { useState, useEffect } from "react"
import { Crown, ChevronDown, ChevronUp } from "lucide-react"

const QUESTIONS = [
  {
    id: 1,
    category: "Self-care",
    question: "Do you have a custom system that supports your personal leadership as well as your social, emotional, mental, & spiritual well-being?",
  },
  {
    id: 2,
    category: "Wealth",
    question: "Do you have an automated investment plan that's been reviewed in the last 12 months for retirement, estate planning, and wealth building (where you're generating long-term income through multiple streams)?",
  },
  {
    id: 3,
    category: "Literacy",
    question: "Do you have a system in place that allows you to consistently read and learn new ways to sharpen your intellectual wellness (e.g. mastering a specific knowledge/skill set)?",
  },
  {
    id: 4,
    category: "Actualization",
    question: "Are you currently leading in an Occupation or Business where you have a true sense of meaning/purpose, passion, and satisfaction?",
  },
  {
    id: 5,
    category: "Legacy",
    question: "Are you actively mentoring a successor to live and lead well in your absence?",
  },
  {
    id: 6,
    category: "Outreach",
    question: "Do you currently give of your time, money, and/or resources on a monthly basis to meet someone else's needs?",
  },
  {
    id: 7,
    category: "Relationship",
    question: "Do you currently feel fully satisfied, safe, loved, stretched, and supported by everyone in your inner circle?",
  },
  {
    id: 8,
    category: "Health",
    question: "Are you current with your annual physical, 6-month teeth cleaning, eye exams, screenings for STDs, blood work, pelvic exam, Pap smear, Breast exams (for the ladies), and Colonoscopy (for the men)?",
  },
  {
    id: 9,
    category: "Household",
    question: "Do you have a household manual that gives current detailed instructions on all of your family needs in your absence?",
  },
  {
    id: 10,
    category: "Documents",
    question: "Do you have all of your life documents (will, verification, and financial documents) exceptionally organized in physical and digital file folders?",
  },
]

const SCORE_KEY = [
  { range: "1", label: "No plan or system in place" },
  { range: "2", label: "Have a plan but it's not effective enough" },
  { range: "3-5", label: "Somewhat consistent but inconsistent rhythm" },
  { range: "6-8", label: "Have a system but needs review or optimization" },
  { range: "9-10", label: "Effective system I use daily" },
]

interface Props {
  value: string
  onChange: (score: string) => void
}

export function LeadershipAssessment({ value, onChange }: Props) {
  const [scores, setScores] = useState<Record<number, number>>({})
  const [expanded, setExpanded] = useState(true)
  const [showKey, setShowKey] = useState(false)

  // Parse existing score into individual answers if possible
  useEffect(() => {
    if (value && Object.keys(scores).length === 0) {
      try {
        const parsed = JSON.parse(value)
        if (typeof parsed === "object" && parsed.answers) {
          setScores(parsed.answers)
        }
      } catch {
        // value is just a total score string, leave scores empty
      }
    }
  }, [value])

  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0)
  const maxScore = QUESTIONS.length * 10
  const answeredCount = Object.keys(scores).length
  const pct = Math.round((totalScore / maxScore) * 100)

  const updateScore = (questionId: number, score: number) => {
    const updated = { ...scores, [questionId]: score }
    setScores(updated)
    const total = Object.values(updated).reduce((sum, s) => sum + s, 0)
    onChange(JSON.stringify({ total, answers: updated }))
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return "bg-emerald-500"
    if (score >= 6) return "bg-primary"
    if (score >= 3) return "bg-amber-500"
    return "bg-red-400"
  }

  const getTotalLabel = () => {
    if (answeredCount < QUESTIONS.length) return "In Progress"
    if (pct >= 80) return "Strong Foundation"
    if (pct >= 60) return "Building Momentum"
    if (pct >= 40) return "Growth Opportunity"
    return "Starting Point"
  }

  return (
    <div className="rounded-3xl overflow-hidden border border-primary/20">
      {/* Premium header */}
      <div className="relative p-6 md:p-8" style={{
        background: "linear-gradient(135deg, #10241f 0%, #1a2e28 30%, #10241f 60%, #0d1f1a 100%)",
      }}>
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{
          background: "radial-gradient(circle, rgba(182,149,74,0.2) 0%, transparent 70%)",
        }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                background: "linear-gradient(135deg, rgba(182,149,74,0.25), rgba(212,180,131,0.2))",
                border: "1px solid rgba(182,149,74,0.3)",
              }}>
                <Crown size={18} className="text-[#b6954a]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Leadership Assessment</h3>
                <p className="text-[11px] font-mono uppercase tracking-widest text-white/30">Rate yourself 1-10 for each area</p>
              </div>
            </div>
            <button onClick={() => setExpanded(!expanded)} className="text-white/40 hover:text-white/70 transition-colors">
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {/* Score summary */}
          <div className="flex items-center gap-6">
            <div>
              <p className="font-bold text-3xl tracking-tight" style={{
                backgroundImage: "linear-gradient(135deg, #b6954a, #f1ddb0)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}>{totalScore}<span className="text-lg text-white/20">/{maxScore}</span></p>
            </div>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${answeredCount > 0 ? pct : 0}%`,
                    backgroundImage: "linear-gradient(90deg, #b6954a, #f1ddb0)",
                  }}
                />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mt-1">
                {answeredCount}/{QUESTIONS.length} answered ~ {getTotalLabel()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable body */}
      {expanded && (
        <div className="p-4 md:p-6 space-y-3 bg-card">
          {/* Response key toggle */}
          <button
            onClick={() => setShowKey(!showKey)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest">Response Key</span>
            {showKey ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showKey && (
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 space-y-2">
              {SCORE_KEY.map((item) => (
                <div key={item.range} className="flex items-start gap-3 text-sm">
                  <span className="font-mono text-[11px] font-bold text-primary w-8 shrink-0">{item.range}</span>
                  <span className="text-muted-foreground text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Questions */}
          <div className="space-y-2">
            {QUESTIONS.map((q) => {
              const score = scores[q.id] ?? 0
              return (
                <div key={q.id} className="group rounded-2xl border border-border/30 hover:border-primary/20 transition-all p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest shrink-0 mt-0.5" style={{
                      backgroundImage: "linear-gradient(90deg, #b6954a, #d4b483)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      WebkitTextFillColor: "transparent",
                    }}>{String(q.id).padStart(2, "0")}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">{q.category}</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{q.question}</p>
                    </div>
                    {score > 0 && (
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold ${getScoreColor(score)}`}>
                        {score}
                      </div>
                    )}
                  </div>

                  {/* Slider */}
                  <div className="flex items-center gap-3 pl-8">
                    <span className="text-[10px] font-mono text-muted-foreground w-4">1</span>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={score || 5}
                      onChange={(e) => updateScore(q.id, Number(e.target.value))}
                      className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-primary"
                      style={{
                        background: score > 0
                          ? `linear-gradient(90deg, #b6954a ${((score - 1) / 9) * 100}%, var(--border) ${((score - 1) / 9) * 100}%)`
                          : "var(--border)",
                      }}
                    />
                    <span className="text-[10px] font-mono text-muted-foreground w-6">10</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
