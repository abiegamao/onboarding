"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Phase1Connection } from "@/components/onboarding/phases/Phase1Connection"
import { Phase2Awareness } from "@/components/onboarding/phases/Phase2Awareness"
import { Phase3Stabilization } from "@/components/onboarding/phases/Phase3Stabilization"
import { Phase4Activation } from "@/components/onboarding/phases/Phase4Activation"
const LOCKED_STEPS = ["1F", "2C", "3E"]

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/onboarding/progress")
        if (res.ok) {
          const data = await res.json()
          setUserData(data)
          setStatus(data.onboardingStatus)
          
          // Flatten data for easy form binding
          setFormData({
            // Phase 1
            snapshot_1: data.connection?.snapshot?.role || "",
            snapshot_2: data.connection?.snapshot?.challenges || "",
            snapshot_3: data.connection?.snapshot?.goals || "",
            triage_pdl: data.connection?.triage?.pdlLeaderScore || "",
            triage_neuro: data.connection?.triage?.neurodiversity || "",
            triage_wiring: data.connection?.triage?.internalWiring || "",
            triage_disc: data.connection?.triage?.disc || "",
            open_share: data.connection?.openShare || "",
            culture_takeaways: data.connection?.cultureTakeaways || "",
            // Phase 2
            awareness_360: data.awareness?.evaluation360 || [{ name: "", email: "" }],
            growth_takeaways: data.awareness?.growthInputs?.takeaways || "",
            pulse_good: data.awareness?.eveningPulse?.goodToday || "",
            pulse_heavy: data.awareness?.eveningPulse?.heavyToday || "",
            pulse_level: data.awareness?.eveningPulse?.peaceLevel || 5,
            // Phase 3
            stabilization_activation: data.stabilization?.visionActivation || {},
            stabilization_statements: data.stabilization?.visionStatements || {},
            stabilization_story: data.stabilization?.idealDayStory || "",
            stabilization_word: data.stabilization?.wordOfYear || "",
            stabilization_values: data.stabilization?.familyMission?.values || ["", "", ""],
            stabilization_mission: data.stabilization?.familyMission?.statement || "",
          })
        }
      } catch (error) {
        toast.error("Failed to sync progress")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  async function handleContinue() {
    setIsUpdating(true)
    try {
      let nextPhase = status?.currentPhase || 1
      let nextStep = status?.currentStep || "1A"
      let dataToSave: any = {}

      if (nextStep === "1B") {
        dataToSave["connection.snapshot.role"] = formData.snapshot_1
        dataToSave["connection.snapshot.challenges"] = formData.snapshot_2
        dataToSave["connection.snapshot.goals"] = formData.snapshot_3
      } else if (nextStep === "1C") {
        dataToSave["connection.triage.pdlLeaderScore"] = formData.triage_pdl
        dataToSave["connection.triage.neurodiversity"] = formData.triage_neuro
        dataToSave["connection.triage.internalWiring"] = formData.triage_wiring
        dataToSave["connection.triage.disc"] = formData.triage_disc
      } else if (nextStep === "1D") {
        dataToSave["connection.openShare"] = formData.open_share
      } else if (nextStep === "1E") {
        dataToSave["connection.cultureTakeaways"] = formData.culture_takeaways
      } else if (nextStep === "2A") {
        dataToSave["awareness.evaluation360"] = formData.awareness_360
      } else if (nextStep === "2B") {
        dataToSave["awareness.growthInputs.takeaways"] = formData.growth_takeaways
      } else if (nextStep === "2C") {
        dataToSave["awareness.eveningPulse.goodToday"] = formData.pulse_good
        dataToSave["awareness.eveningPulse.heavyToday"] = formData.pulse_heavy
        dataToSave["awareness.eveningPulse.peaceLevel"] = formData.pulse_level
      } else if (nextStep === "3A") {
        dataToSave["stabilization.visionActivation"] = formData.stabilization_activation
      } else if (nextStep === "3B") {
        dataToSave["stabilization.visionStatements"] = formData.stabilization_statements
      } else if (nextStep === "3C") {
        dataToSave["stabilization.idealDayStory"] = formData.stabilization_story
      } else if (nextStep === "3D") {
        dataToSave["stabilization.wordOfYear"] = formData.stabilization_word
      } else if (nextStep === "3E") {
        dataToSave["stabilization.familyMission.values"] = formData.stabilization_values
        dataToSave["stabilization.familyMission.statement"] = formData.stabilization_mission
      }

      // Logic to advance steps/phases
      if (nextStep === "1A") nextStep = "1B"
      else if (nextStep === "1B") nextStep = "1C"
      else if (nextStep === "1C") nextStep = "1D"
      else if (nextStep === "1D") nextStep = "1E"
      else if (nextStep === "1E") nextStep = "1F"
      else if (nextStep === "1F") {
        nextPhase = 2
        nextStep = "2A"
      } else if (nextStep === "2A") nextStep = "2B"
      else if (nextStep === "2B") nextStep = "2C"
      else if (nextStep === "2C") {
        nextPhase = 3
        nextStep = "3A"
      } else if (nextStep === "3A") nextStep = "3B"
      else if (nextStep === "3B") nextStep = "3C"
      else if (nextStep === "3C") nextStep = "3D"
      else if (nextStep === "3D") nextStep = "3E"
      else if (nextStep === "3E") {
        nextPhase = 4
        nextStep = "4A"
      } else if (nextStep === "4A") nextStep = "4B"
      else if (nextStep === "4B") nextStep = "4C"
      else if (nextStep === "4C") {
        // Completion
        dataToSave["onboardingStatus.isCompleted"] = true
      }

      if (LOCKED_STEPS.includes(nextStep)) {
        toast.info("This phase is locked for now.")
        setIsUpdating(false)
        return
      }

      const res = await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currentPhase: nextPhase,
          currentStep: nextStep,
          data: dataToSave
        })
      })

      if (res.ok) {
        const newStatus = await res.json()
        setStatus(newStatus)
        toast.success("Pathway Activated!")
        router.refresh() // Sync the server-side sidebar
        
        if (dataToSave["onboardingStatus.isCompleted"]) {
          router.push("/dashboard")
          return
        }

        if (nextStep === `${(status?.currentPhase || 1) + 1}A`) {
          window.location.reload()
        }
      }
    } catch (error) {
      toast.error("Failed to update progress")
    } finally {
      setIsUpdating(false)
    }
  }

  // Debounced auto-save
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const currentStep = status?.currentStep
      if (!currentStep) return

      let dataToSave: any = {}
      if (currentStep === "1B") {
        dataToSave["connection.snapshot.role"] = formData.snapshot_1
        dataToSave["connection.snapshot.challenges"] = formData.snapshot_2
        dataToSave["connection.snapshot.goals"] = formData.snapshot_3
      } else if (currentStep === "1C") {
        dataToSave["connection.triage.pdlLeaderScore"] = formData.triage_pdl
        dataToSave["connection.triage.neurodiversity"] = formData.triage_neuro
        dataToSave["connection.triage.internalWiring"] = formData.triage_wiring
        dataToSave["connection.triage.disc"] = formData.triage_disc
      } else if (currentStep === "1D") {
        dataToSave["connection.openShare"] = formData.open_share
      } else if (currentStep === "1E") {
        dataToSave["connection.cultureTakeaways"] = formData.culture_takeaways
      } else if (currentStep === "2A") {
        dataToSave["awareness.evaluation360"] = formData.awareness_360
      } else if (currentStep === "2B") {
        dataToSave["awareness.growthInputs.takeaways"] = formData.growth_takeaways
      } else if (currentStep === "2C") {
        dataToSave["awareness.eveningPulse.goodToday"] = formData.pulse_good
        dataToSave["awareness.eveningPulse.heavyToday"] = formData.pulse_heavy
        dataToSave["awareness.eveningPulse.peaceLevel"] = formData.pulse_level
      } else if (currentStep === "3A") {
        dataToSave["stabilization.visionActivation"] = formData.stabilization_activation
      } else if (currentStep === "3B") {
        dataToSave["stabilization.visionStatements"] = formData.stabilization_statements
      } else if (currentStep === "3C") {
        dataToSave["stabilization.idealDayStory"] = formData.stabilization_story
      } else if (currentStep === "3D") {
        dataToSave["stabilization.wordOfYear"] = formData.stabilization_word
      } else if (currentStep === "3E") {
        dataToSave["stabilization.familyMission.values"] = formData.stabilization_values
        dataToSave["stabilization.familyMission.statement"] = formData.stabilization_mission
      }

      if (Object.keys(dataToSave).length > 0) {
        await fetch("/api/onboarding/progress", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: dataToSave })
        })
      }
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [formData, status?.currentStep])

  async function handleBack() {
    setIsUpdating(true)
    try {
      let prevPhase = status?.currentPhase || 1
      let prevStep = status?.currentStep || "1A"

      if (prevStep === "1B") prevStep = "1A"
      else if (prevStep === "1C") prevStep = "1B"
      else if (prevStep === "1D") prevStep = "1C"
      else if (prevStep === "1E") prevStep = "1D"
      else if (prevStep === "1F") prevStep = "1E"
      else if (prevStep === "2A") {
        prevPhase = 1
        prevStep = "1F"
      } else if (prevStep === "2B") prevStep = "2A"
      else if (prevStep === "2C") prevStep = "2B"
      else if (prevStep === "3A") {
        prevPhase = 2
        prevStep = "2C"
      } else if (prevStep === "3B") prevStep = "3A"
      else if (prevStep === "3C") prevStep = "3B"
      else if (prevStep === "3D") prevStep = "3C"
      else if (prevStep === "3E") prevStep = "3D"
      else if (prevStep === "4A") {
        prevPhase = 3
        prevStep = "3E"
      } else if (prevStep === "4B") prevStep = "4A"
      else if (prevStep === "4C") prevStep = "4B"

      const res = await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currentPhase: prevPhase,
          currentStep: prevStep 
        })
      })

      if (res.ok) {
        const newStatus = await res.json()
        setStatus(newStatus)
        toast.success("Moving back...")
        router.refresh() // Sync the server-side sidebar
        
        // If it was a phase jump, reload
        if (prevPhase < (status?.currentPhase || 1)) {
          window.location.reload()
        }
      }
    } catch (error) {
      toast.error("Failed to go back")
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Syncing your journey...</p>
      </div>
    )
  }

  const currentStep = status?.currentStep || "1A"
  const isLocked = LOCKED_STEPS.includes(currentStep)

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest">
          <Sparkles className="h-3 w-3" />
          Orientation • Phase {status?.currentPhase || 1} • Step {currentStep}
        </div>
        
        {currentStep === "1A" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              The First Step: Connection
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Establishing the foundation of your journey."
            </p>
          </>
        )}

        {currentStep === "1B" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Getting to Know You
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Insight to support you well ~ without the need to repeat yourself."
            </p>
          </>
        )}

        {currentStep === "1C" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Your Leadership Triage
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Mapping your Mind, Body, and Divine Identity."
            </p>
          </>
        )}

        {currentStep === "1D" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Open Share
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Nothing is too big or too small for us to hold."
            </p>
          </>
        )}

        {currentStep === "1E" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Getting to Know Us
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Understanding the heartbeat and rhythm of Minesha."
            </p>
          </>
        )}

        {currentStep === "1F" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Book Your Call
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Now that I have a glimpse into your world... let's connect."
            </p>
          </>
        )}

        {currentStep === "2A" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              360° Evaluation
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Seeing your leadership through the eyes of those you value."
            </p>
          </>
        )}

        {currentStep === "2B" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Growth Inputs
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Consolidating your breakthroughs and historical insights."
            </p>
          </>
        )}

        {currentStep === "2C" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Evening Pulse
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Release. Reflect. Realign."
            </p>
          </>
        )}

        {currentStep === "3A" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Vision Activation
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Envisioning peace across every domain of your life."
            </p>
          </>
        )}

        {currentStep === "3B" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Vision Statements
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Aligning with outcomes: 'I am thankful that I...'"
            </p>
          </>
        )}

        {currentStep === "3C" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Ideal Day Narrative
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Walking through the life you desire."
            </p>
          </>
        )}

        {currentStep === "3D" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Word of the Year
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "A single word to anchor your path."
            </p>
          </>
        )}

        {currentStep === "3E" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Family Mission
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Establishing peace and purpose in your home."
            </p>
          </>
        )}

        {currentStep.startsWith("2") && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Awareness Phase
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Gaining clarity on your current reality."
            </p>
          </>
        )}

        {currentStep.startsWith("3") && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Stabilization Phase
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Embodying the vision of your desired future."
            </p>
          </>
        )}

        {currentStep.startsWith("4") && (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">
              Activation Phase
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              "Fully activated. Fully supported."
            </p>
          </>
        )}
      </div>
      {status?.currentPhase === 1 && (
        <Phase1Connection 
          currentStep={currentStep} 
          formData={formData} 
          setFormData={setFormData} 
        />
      )}

      {status?.currentPhase === 2 && (
        <Phase2Awareness 
          currentStep={currentStep} 
          formData={formData} 
          setFormData={setFormData} 
        />
      )}

      {status?.currentPhase === 3 && (
        <Phase3Stabilization 
          currentStep={currentStep} 
          formData={formData} 
          setFormData={setFormData} 
        />
      )}

      {status?.currentPhase === 4 && (
        <Phase4Activation 
          currentStep={currentStep} 
          formData={formData} 
          setFormData={setFormData} 
        />
      )}

      {status?.currentPhase > 4 && (
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
          <Sparkles className="h-12 w-12 text-primary animate-bounce" />
          <h2 className="text-2xl font-bold">Path Activation Complete</h2>
          <p className="text-muted-foreground max-w-sm">You have completed the Peace-Driven Leader Activation Pathway. Your ProTeam will reach out shortly.</p>
        </div>
      )}

      {/* CTA Area */}
      <div className="pt-8 mt-4 border-t border-border/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-0.5">
              {isLocked ? "Locked" : "Up next"}
            </p>
            <p className="text-sm font-medium text-foreground/70">
              {isLocked && "Next phase coming soon..."}
              {!isLocked && (
                <>
                  {currentStep === "1A" && "Getting to Know You"}
                  {currentStep === "1B" && "Your Triage"}
                  {currentStep === "1C" && "Open Share"}
                  {currentStep === "1D" && "Getting to Know Us"}
                  {currentStep === "1E" && "Schedule Orientation"}
                  {currentStep === "1F" && "360 Evaluation"}
                  {currentStep === "2A" && "Growth Inputs"}
                  {currentStep === "2B" && "Evening Pulse"}
                  {currentStep === "2C" && "Phase 3 ~ Stabilization"}
                  {currentStep === "3A" && "Vision Statements"}
                  {currentStep === "3B" && "Ideal Day Narrative"}
                  {currentStep === "3C" && "Word of the Year"}
                  {currentStep === "3D" && "Family Mission"}
                  {currentStep === "3E" && "Final Kickoff Phase"}
                  {currentStep === "4A" && "Community Access"}
                  {currentStep === "4B" && "Wealth Strategy"}
                  {currentStep === "4C" && "Complete Your Pathway"}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentStep !== "1A" && (
              <button
                onClick={handleBack}
                disabled={isUpdating}
                className="h-11 px-6 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors disabled:opacity-40"
              >
                Back
              </button>
            )}

            <button
              onClick={handleContinue}
              disabled={isUpdating || isLocked}
              className="group relative h-11 px-8 rounded-xl text-sm font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
              style={{
                backgroundImage: isLocked ? "none" : "linear-gradient(135deg, var(--primary), #d4b483)",
                backgroundColor: isLocked ? "var(--muted)" : undefined,
                color: isLocked ? "var(--muted-foreground)" : "var(--primary-foreground)",
                boxShadow: isLocked ? "none" : "0 4px 20px rgba(182,149,74,0.2)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isUpdating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    Saving
                  </>
                ) : isLocked ? (
                  "Locked"
                ) : currentStep === "4C" ? (
                  status?.onboardingStatus?.isCompleted ? "Dashboard" : "Complete"
                ) : (
                  <>
                    Continue
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </>
                )}
              </span>
              {!isLocked && !isUpdating && (
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                  backgroundImage: "linear-gradient(135deg, #d4b483, var(--primary))",
                }} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
