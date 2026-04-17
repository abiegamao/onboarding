"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Sparkles } from "lucide-react"
import { Phase1Connection } from "@/components/onboarding/phases/Phase1Connection"
import { Phase2Awareness } from "@/components/onboarding/phases/Phase2Awareness"
import { Phase3Stabilization } from "@/components/onboarding/phases/Phase3Stabilization"
import { Phase4Activation } from "@/components/onboarding/phases/Phase4Activation"
import { TRIAGE_DOMAINS, STEP_TO_DOMAIN } from "@/lib/triageConfig"


function splitListInput(value: string) {
    return value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean)
}

function joinListValue(value?: string[]) {
    return value?.join("\n") || ""
}

export default function OnboardingContent() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState<any>(null)
    const [userData, setUserData] = useState<any>(null)
    const [formData, setFormData] = useState<any>({})
    const [isUpdating, setIsUpdating] = useState(false)
    const [hasShownToast, setHasShownToast] = useState(false)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/onboarding/progress")
                if (res.ok) {
                    const data = await res.json()
                    setUserData(data)
                    setStatus(data.onboardingStatus)

                    setFormData({
                        // Phase 1
                        getting_favoriteFoodSnacks:
                            data.connection?.gettingToKnowYou
                                ?.favoriteFoodSnacks || "",
                        getting_hobbiesJoy:
                            data.connection?.gettingToKnowYou?.hobbiesJoy || "",
                        getting_selfCareTop3: joinListValue(
                            data.connection?.gettingToKnowYou?.selfCareTop3
                        ),
                        getting_favoriteMoviesShows:
                            data.connection?.gettingToKnowYou
                                ?.favoriteMoviesShows || "",
                        getting_dreamDestinationsTop3: joinListValue(
                            data.connection?.gettingToKnowYou
                                ?.dreamDestinationsTop3
                        ),
                        getting_financialGoals:
                            data.connection?.gettingToKnowYou?.financialGoals ||
                            "",
                        getting_bucketListTop3:
                            data.connection?.gettingToKnowYou?.bucketListTop3 ||
                            "",
                        getting_proudGrowth:
                            data.connection?.gettingToKnowYou?.proudGrowth ||
                            "",
                        getting_workBusiness:
                            data.connection?.gettingToKnowYou?.workBusiness ||
                            "",
                        getting_boundaries:
                            data.connection?.gettingToKnowYou?.boundaries || "",
                        getting_importantPeople:
                            data.connection?.gettingToKnowYou
                                ?.importantPeople || "",
                        getting_personalPrinciples:
                            data.connection?.gettingToKnowYou
                                ?.personalPrinciples || "",
                        getting_uncompromisableStandards:
                            data.connection?.gettingToKnowYou
                                ?.uncompromisableStandards || "",
                        triage_selfCare: {
                            q1: data.connection?.triage?.selfCare?.q1 || "",
                            q2: data.connection?.triage?.selfCare?.q2 || "",
                            q3: data.connection?.triage?.selfCare?.q3 || "",
                            q4: data.connection?.triage?.selfCare?.q4 || "",
                            q5: data.connection?.triage?.selfCare?.q5 || "",
                        },
                        triage_wealthCreation: {
                            q1: data.connection?.triage?.wealthCreation?.q1 || "",
                            q2: data.connection?.triage?.wealthCreation?.q2 || "",
                            q3: data.connection?.triage?.wealthCreation?.q3 || "",
                            q4: data.connection?.triage?.wealthCreation?.q4 || "",
                            q5: data.connection?.triage?.wealthCreation?.q5 || "",
                        },
                        triage_literacy: {
                            q1: data.connection?.triage?.literacy?.q1 || "",
                            q2: data.connection?.triage?.literacy?.q2 || "",
                            q3: data.connection?.triage?.literacy?.q3 || "",
                            q4: data.connection?.triage?.literacy?.q4 || "",
                            q5: data.connection?.triage?.literacy?.q5 || "",
                        },
                        triage_actualization: {
                            q1: data.connection?.triage?.actualization?.q1 || "",
                            q2: data.connection?.triage?.actualization?.q2 || "",
                            q3: data.connection?.triage?.actualization?.q3 || "",
                            q4: data.connection?.triage?.actualization?.q4 || "",
                            q5: data.connection?.triage?.actualization?.q5 || "",
                        },
                        triage_succession: {
                            q1: data.connection?.triage?.succession?.q1 || "",
                            q2: data.connection?.triage?.succession?.q2 || "",
                            q3: data.connection?.triage?.succession?.q3 || "",
                            q4: data.connection?.triage?.succession?.q4 || "",
                            q5: data.connection?.triage?.succession?.q5 || "",
                        },
                        triage_outreach: {
                            q1: data.connection?.triage?.outreach?.q1 || "",
                            q2: data.connection?.triage?.outreach?.q2 || "",
                            q3: data.connection?.triage?.outreach?.q3 || "",
                            q4: data.connection?.triage?.outreach?.q4 || "",
                            q5: data.connection?.triage?.outreach?.q5 || "",
                        },
                        triage_relationships: {
                            q1: data.connection?.triage?.relationships?.q1 || "",
                            q2: data.connection?.triage?.relationships?.q2 || "",
                            q3: data.connection?.triage?.relationships?.q3 || "",
                            q4: data.connection?.triage?.relationships?.q4 || "",
                            q5: data.connection?.triage?.relationships?.q5 || "",
                        },
                        triage_health: {
                            q1: data.connection?.triage?.health?.q1 || "",
                            q2: data.connection?.triage?.health?.q2 || "",
                            q3: data.connection?.triage?.health?.q3 || "",
                            q4: data.connection?.triage?.health?.q4 || "",
                            q5: data.connection?.triage?.health?.q5 || "",
                        },
                        triage_openReflection: {
                            q1: data.connection?.triage?.openReflection?.q1 || "",
                        },
                        open_share: data.connection?.openShare || "",
                        culture_takeaways:
                            data.connection?.cultureTakeaways || "",
                        // Phase 2
                        awareness_360: data.awareness?.evaluation360 || [
                            { name: "", email: "" },
                        ],
                        growth_takeaways:
                            data.awareness?.growthInputs?.takeaways || "",
                        pulse_good:
                            data.awareness?.eveningPulse?.goodToday || "",
                        pulse_heavy:
                            data.awareness?.eveningPulse?.heavyToday || "",
                        pulse_level:
                            data.awareness?.eveningPulse?.peaceLevel || 5,
                        // Phase 3
                        stabilization_activation:
                            data.stabilization?.visionActivation || {},
                        stabilization_statements:
                            data.stabilization?.visionStatements || {},
                        stabilization_story:
                            data.stabilization?.idealDayStory || "",
                        stabilization_word:
                            data.stabilization?.wordOfYear || "",
                        stabilization_values: data.stabilization?.familyMission
                            ?.values || ["", "", ""],
                        stabilization_mission:
                            data.stabilization?.familyMission?.statement || "",
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
        const currentStep = status?.currentStep || "1A"
        try {
            let nextPhase = status?.currentPhase || 1
            let nextStep = currentStep
            let dataToSave: any = {}

            if (nextStep === "1B") {
                dataToSave["connection.gettingToKnowYou.favoriteFoodSnacks"] =
                    formData.getting_favoriteFoodSnacks
                dataToSave["connection.gettingToKnowYou.hobbiesJoy"] =
                    formData.getting_hobbiesJoy
                dataToSave["connection.gettingToKnowYou.selfCareTop3"] =
                    splitListInput(formData.getting_selfCareTop3)
                dataToSave["connection.gettingToKnowYou.favoriteMoviesShows"] =
                    formData.getting_favoriteMoviesShows
                dataToSave[
                    "connection.gettingToKnowYou.dreamDestinationsTop3"
                ] = splitListInput(formData.getting_dreamDestinationsTop3)
                dataToSave["connection.gettingToKnowYou.financialGoals"] =
                    formData.getting_financialGoals
                dataToSave["connection.gettingToKnowYou.bucketListTop3"] =
                    formData.getting_bucketListTop3
                dataToSave["connection.gettingToKnowYou.proudGrowth"] =
                    formData.getting_proudGrowth
                dataToSave["connection.gettingToKnowYou.workBusiness"] =
                    formData.getting_workBusiness
                dataToSave["connection.gettingToKnowYou.boundaries"] =
                    formData.getting_boundaries
                dataToSave["connection.gettingToKnowYou.importantPeople"] =
                    formData.getting_importantPeople
                dataToSave["connection.gettingToKnowYou.personalPrinciples"] =
                    formData.getting_personalPrinciples
                dataToSave[
                    "connection.gettingToKnowYou.uncompromisableStandards"
                ] = formData.getting_uncompromisableStandards
            } else if (nextStep.startsWith("1C-")) {
                const domain = STEP_TO_DOMAIN[nextStep]
                if (domain) {
                    const answers = formData[`triage_${domain.key}`] || {}
                    Object.entries(answers).forEach(([q, v]) => {
                        dataToSave[`connection.triage.${domain.key}.${q}`] = v
                    })
                }
            } else if (nextStep === "1D") {
                dataToSave["connection.openShare"] = formData.open_share
            } else if (nextStep === "1E") {
                dataToSave["connection.cultureTakeaways"] =
                    formData.culture_takeaways
            } else if (nextStep === "2A") {
                dataToSave["awareness.evaluation360"] = formData.awareness_360
            } else if (nextStep === "2B") {
                dataToSave["awareness.growthInputs.takeaways"] =
                    formData.growth_takeaways
            } else if (nextStep === "2C") {
                dataToSave["awareness.eveningPulse.goodToday"] =
                    formData.pulse_good
                dataToSave["awareness.eveningPulse.heavyToday"] =
                    formData.pulse_heavy
                dataToSave["awareness.eveningPulse.peaceLevel"] =
                    formData.pulse_level
            } else if (nextStep === "3A") {
                dataToSave["stabilization.visionActivation"] =
                    formData.stabilization_activation
            } else if (nextStep === "3B") {
                dataToSave["stabilization.visionStatements"] =
                    formData.stabilization_statements
            } else if (nextStep === "3C") {
                dataToSave["stabilization.idealDayStory"] =
                    formData.stabilization_story
            } else if (nextStep === "3D") {
                dataToSave["stabilization.wordOfYear"] =
                    formData.stabilization_word
            } else if (nextStep === "3E") {
                dataToSave["stabilization.familyMission.values"] =
                    formData.stabilization_values
                dataToSave["stabilization.familyMission.statement"] =
                    formData.stabilization_mission
            }

            // Advance step
            if (nextStep === "1A") nextStep = "1B"
            else if (nextStep === "1B") nextStep = "1C-1"
            else if (nextStep.startsWith("1C-")) {
                const idx = TRIAGE_DOMAINS.findIndex((d) => d.stepId === nextStep)
                nextStep = idx < TRIAGE_DOMAINS.length - 1 ? TRIAGE_DOMAINS[idx + 1].stepId : "1D"
            }
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
                dataToSave["onboardingStatus.isCompleted"] = true
            }

            const res = await fetch("/api/onboarding/progress", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPhase: nextPhase,
                    currentStep: nextStep,
                    data: dataToSave,
                }),
            })

            if (res.ok) {
                const newStatus = await res.json()
                setStatus(newStatus)
                if (!hasShownToast && currentStep === "1A") {
                    toast.success("Pathway Activated!", { duration: 3000 })
                    setHasShownToast(true)
                }
                router.refresh()

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
                dataToSave["connection.gettingToKnowYou.favoriteFoodSnacks"] =
                    formData.getting_favoriteFoodSnacks
                dataToSave["connection.gettingToKnowYou.hobbiesJoy"] =
                    formData.getting_hobbiesJoy
                dataToSave["connection.gettingToKnowYou.selfCareTop3"] =
                    splitListInput(formData.getting_selfCareTop3)
                dataToSave["connection.gettingToKnowYou.favoriteMoviesShows"] =
                    formData.getting_favoriteMoviesShows
                dataToSave[
                    "connection.gettingToKnowYou.dreamDestinationsTop3"
                ] = splitListInput(formData.getting_dreamDestinationsTop3)
                dataToSave["connection.gettingToKnowYou.financialGoals"] =
                    formData.getting_financialGoals
                dataToSave["connection.gettingToKnowYou.bucketListTop3"] =
                    formData.getting_bucketListTop3
                dataToSave["connection.gettingToKnowYou.proudGrowth"] =
                    formData.getting_proudGrowth
                dataToSave["connection.gettingToKnowYou.workBusiness"] =
                    formData.getting_workBusiness
                dataToSave["connection.gettingToKnowYou.boundaries"] =
                    formData.getting_boundaries
                dataToSave["connection.gettingToKnowYou.importantPeople"] =
                    formData.getting_importantPeople
                dataToSave["connection.gettingToKnowYou.personalPrinciples"] =
                    formData.getting_personalPrinciples
                dataToSave[
                    "connection.gettingToKnowYou.uncompromisableStandards"
                ] = formData.getting_uncompromisableStandards
            } else if (currentStep.startsWith("1C-")) {
                const domain = STEP_TO_DOMAIN[currentStep]
                if (domain) {
                    const answers = formData[`triage_${domain.key}`] || {}
                    Object.entries(answers).forEach(([q, v]) => {
                        dataToSave[`connection.triage.${domain.key}.${q}`] = v
                    })
                }
            } else if (currentStep === "1D") {
                dataToSave["connection.openShare"] = formData.open_share
            } else if (currentStep === "1E") {
                dataToSave["connection.cultureTakeaways"] =
                    formData.culture_takeaways
            } else if (currentStep === "2A") {
                dataToSave["awareness.evaluation360"] = formData.awareness_360
            } else if (currentStep === "2B") {
                dataToSave["awareness.growthInputs.takeaways"] =
                    formData.growth_takeaways
            } else if (currentStep === "2C") {
                dataToSave["awareness.eveningPulse.goodToday"] =
                    formData.pulse_good
                dataToSave["awareness.eveningPulse.heavyToday"] =
                    formData.pulse_heavy
                dataToSave["awareness.eveningPulse.peaceLevel"] =
                    formData.pulse_level
            } else if (currentStep === "3A") {
                dataToSave["stabilization.visionActivation"] =
                    formData.stabilization_activation
            } else if (currentStep === "3B") {
                dataToSave["stabilization.visionStatements"] =
                    formData.stabilization_statements
            } else if (currentStep === "3C") {
                dataToSave["stabilization.idealDayStory"] =
                    formData.stabilization_story
            } else if (currentStep === "3D") {
                dataToSave["stabilization.wordOfYear"] =
                    formData.stabilization_word
            } else if (currentStep === "3E") {
                dataToSave["stabilization.familyMission.values"] =
                    formData.stabilization_values
                dataToSave["stabilization.familyMission.statement"] =
                    formData.stabilization_mission
            }

            if (Object.keys(dataToSave).length > 0) {
                await fetch("/api/onboarding/progress", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: dataToSave }),
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
            else if (prevStep === "1C-1") prevStep = "1B"
            else if (prevStep.startsWith("1C-")) {
                const idx = TRIAGE_DOMAINS.findIndex((d) => d.stepId === prevStep)
                prevStep = idx > 0 ? TRIAGE_DOMAINS[idx - 1].stepId : "1B"
            }
            else if (prevStep === "1D") prevStep = "1C-9"
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
                    currentStep: prevStep,
                }),
            })

            if (res.ok) {
                const newStatus = await res.json()
                setStatus(newStatus)
                toast.success("Moving back...")
                router.refresh()

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
            <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="animate-pulse text-muted-foreground">
                    Syncing your journey...
                </p>
            </div>
        )
    }

    const currentStep = status?.currentStep || "1A"
    return (
        <div className="animate-in space-y-10 duration-1000 fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold tracking-widest text-primary uppercase">
                    <Sparkles className="h-3 w-3" />
                    Orientation • Phase {status?.currentPhase || 1} • Step{" "}
                    {currentStep}
                </div>

                {currentStep === "1A" && (
                    <>
                        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            The First Step: Connection
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Establishing the foundation of your journey."
                        </p>
                    </>
                )}

                {currentStep === "1B" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Getting to Know You
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Insight to support you well ~ without the need to
                            repeat yourself."
                        </p>
                    </>
                )}

                {STEP_TO_DOMAIN[currentStep] && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Your Leadership Triage
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            {STEP_TO_DOMAIN[currentStep].title}
                        </p>
                    </>
                )}

                {currentStep === "1D" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Open Share
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Nothing is too big or too small for us to hold."
                        </p>
                    </>
                )}

                {currentStep === "1E" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Getting to Know Us
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Understanding the heartbeat and rhythm of Minesha."
                        </p>
                    </>
                )}

                {currentStep === "1F" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Book Your Call
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Now that I have a glimpse into your world... let's
                            connect."
                        </p>
                    </>
                )}

                {currentStep === "2A" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            360° Evaluation
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Seeing your leadership through the eyes of those
                            you value."
                        </p>
                    </>
                )}

                {currentStep === "2B" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Growth Inputs
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Consolidating your breakthroughs and historical
                            insights."
                        </p>
                    </>
                )}

                {currentStep === "2C" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Evening Pulse
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Release. Reflect. Realign."
                        </p>
                    </>
                )}

                {currentStep === "3A" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Vision Activation
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Envisioning peace across every domain of your
                            life."
                        </p>
                    </>
                )}

                {currentStep === "3B" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Vision Statements
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Aligning with outcomes: 'I am thankful that I...'"
                        </p>
                    </>
                )}

                {currentStep === "3C" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Ideal Day Narrative
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Walking through the life you desire."
                        </p>
                    </>
                )}

                {currentStep === "3D" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Word of the Year
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "A single word to anchor your path."
                        </p>
                    </>
                )}

                {currentStep === "3E" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Family Mission
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Establishing peace and purpose in your home."
                        </p>
                    </>
                )}

                {currentStep.startsWith("2") && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Awareness Phase
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Gaining clarity on your current reality."
                        </p>
                    </>
                )}

                {currentStep.startsWith("3") && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Stabilization Phase
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Embodying the vision of your desired future."
                        </p>
                    </>
                )}

                {currentStep.startsWith("4") && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Activation Phase
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
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
                <div className="flex flex-col items-center justify-center space-y-4 p-20 text-center">
                    <Sparkles className="h-12 w-12 animate-bounce text-primary" />
                    <h2 className="text-2xl font-bold">
                        Path Activation Complete
                    </h2>
                    <p className="max-w-sm text-muted-foreground">
                        You have completed the Peace-Driven Leader Activation
                        Pathway. Your ProTeam will reach out shortly.
                    </p>
                </div>
            )}

            {/* CTA Area */}
            <div className="mt-4 border-t border-border/30 pt-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="mb-0.5 font-mono text-[10px] tracking-widest text-muted-foreground/50 uppercase">
                            Up next
                        </p>
                        <p className="text-sm font-medium text-foreground/70">
                            {(
                                <>
                                    {currentStep === "1A" &&
                                        "Getting to Know You"}
                                    {currentStep === "1B" && "Self-Care — Triage"}
                                    {currentStep.startsWith("1C-") && (() => {
                                        const idx = TRIAGE_DOMAINS.findIndex((d) => d.stepId === currentStep)
                                        const next = TRIAGE_DOMAINS[idx + 1]
                                        return next
                                            ? next.title.split(" | ")[0].replace(/^[IVX]+\.\s+/, "") + " — Triage"
                                            : "Open Share"
                                    })()}
                                    {currentStep === "1D" &&
                                        "Getting to Know Us"}
                                    {currentStep === "1E" &&
                                        "Schedule Orientation"}
                                    {currentStep === "1F" && "360 Evaluation"}
                                    {currentStep === "2A" && "Growth Inputs"}
                                    {currentStep === "2B" && "Evening Pulse"}
                                    {currentStep === "2C" &&
                                        "Phase 3 ~ Stabilization"}
                                    {currentStep === "3A" &&
                                        "Vision Statements"}
                                    {currentStep === "3B" &&
                                        "Ideal Day Narrative"}
                                    {currentStep === "3C" && "Word of the Year"}
                                    {currentStep === "3D" && "Family Mission"}
                                    {currentStep === "3E" &&
                                        "Final Kickoff Phase"}
                                    {currentStep === "4A" && "Community Access"}
                                    {currentStep === "4B" && "Wealth Strategy"}
                                    {currentStep === "4C" &&
                                        "Complete Your Pathway"}
                                </>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {currentStep !== "1A" && (
                            <button
                                onClick={handleBack}
                                disabled={isUpdating}
                                className="h-12 rounded-xl border border-border/40 px-6 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground disabled:opacity-40"
                            >
                                Back
                            </button>
                        )}

                        <button
                            onClick={handleContinue}
                            disabled={isUpdating}
                            className="group relative h-12 overflow-hidden rounded-xl border border-transparent px-10 text-sm font-bold tracking-wider uppercase transition-all duration-300 hover:border-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
                            style={{
                                backgroundImage: "linear-gradient(135deg, var(--primary), var(--accent-foreground, #d4b483))",
                                color: "var(--primary-foreground)",
                                boxShadow: "0 4px 24px rgba(182,149,74,0.25), 0 0 0 1px rgba(182,149,74,0.1)",
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isUpdating ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                                        Saving
                                    </>
                                ) : currentStep === "4C" ? (
                                    status?.onboardingStatus?.isCompleted ? (
                                        "Dashboard"
                                    ) : (
                                        "Complete"
                                    )
                                ) : (
                                    <>
                                        Continue
                                        <svg
                                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                            />
                                        </svg>
                                    </>
                                )}
                            </span>
                            {!isUpdating && (
                                <span
                                    className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(135deg, var(--accent-foreground, #d4b483), var(--primary))",
                                    }}
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
