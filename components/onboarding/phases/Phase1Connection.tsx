"use client"
import { ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TriageDomainForm } from "@/components/onboarding/TriageDomainForm"
import { STEP_TO_DOMAIN } from "@/lib/triageConfig"
import type { QuestionField } from "@/lib/questionSeeds"

interface Phase1Props {
    currentStep: string
    formData: any
    setFormData: (data: any) => void
    questionConfigs?: Record<string, any>
}

// Static fallbacks for step 1B
const DEFAULT_1B_QUESTIONS: QuestionField[] = [
    { key: "favoriteFoodSnacks", label: "What's your favorite food and snacks?", placeholder: "Example: stuffed mushrooms" },
    { key: "hobbiesJoy", label: "What do you like to do for fun — what hobbies bring you joy?", placeholder: "Example: nature, short adventures, dancing" },
    { key: "selfCareTop3", label: "What are your top 3 favorite things to do for self-care?", placeholder: "One per line or comma-separated. Example: Meditation, Nature Walks, Journaling" },
    { key: "favoriteMoviesShows", label: "What are your favorite movies or shows you could rewatch anytime?", placeholder: "Example: anything funny" },
    { key: "dreamDestinationsTop3", label: "If you could travel anywhere, what are your top 3 dream destinations you haven't been to yet?", placeholder: "One per line or comma-separated. Example: Paris, Dubai, Hawaii" },
    { key: "financialGoals", label: "What are your financial goals for this year and over the next 12 months?", placeholder: "Example: learn how to flow off written budget" },
    { key: "bucketListTop3", label: "What are the top 3 things on your bucket list?", placeholder: "One per line or comma-separated" },
    { key: "proudGrowth", label: "If we were looking back a year from now, what would make you feel proud of your growth?", placeholder: "Example: remain consistent and true to myself without giving up" },
    { key: "workBusiness", label: "Tell me a little about your work or business — what do you love most, and what drains you the most?", placeholder: "Share what you love most and what drains you most" },
    { key: "boundaries", label: "When you think about your boundaries with family, friends, and clients, what feels easy? What feels hard?", placeholder: "Share what feels easy and what feels hard" },
    { key: "importantPeople", label: "Who are the most important people in your life right now?", placeholder: "Example: family, close connections" },
    { key: "personalPrinciples", label: "What personal principles guide your decisions in life and leadership?", placeholder: "Share the principles that guide your decisions" },
    { key: "uncompromisableStandards", label: "What standards do you hold for yourself that you'd never compromise on?", placeholder: "Share your non-negotiables" },
]

// Map question key to formData key
const FORM_KEY_MAP: Record<string, string> = {
    favoriteFoodSnacks: "getting_favoriteFoodSnacks",
    hobbiesJoy: "getting_hobbiesJoy",
    selfCareTop3: "getting_selfCareTop3",
    favoriteMoviesShows: "getting_favoriteMoviesShows",
    dreamDestinationsTop3: "getting_dreamDestinationsTop3",
    financialGoals: "getting_financialGoals",
    bucketListTop3: "getting_bucketListTop3",
    proudGrowth: "getting_proudGrowth",
    workBusiness: "getting_workBusiness",
    boundaries: "getting_boundaries",
    importantPeople: "getting_importantPeople",
    personalPrinciples: "getting_personalPrinciples",
    uncompromisableStandards: "getting_uncompromisableStandards",
}

export function Phase1Connection({
    currentStep,
    formData,
    setFormData,
    questionConfigs = {},
}: Phase1Props) {
    const step1BQuestions: QuestionField[] =
        questionConfigs["1B"]?.questions ?? DEFAULT_1B_QUESTIONS

    return (
        <div className="min-h-[40vh]">
            {currentStep === "1A" && (
                <div className="animate-in space-y-10 duration-1000 fade-in slide-in-from-bottom-4">
                    {/* Narrative Section */}
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-4">
                            <h2 className="flex items-center gap-2 text-2xl font-bold">
                                <Heart className="h-5 w-5 text-primary" />
                                Human-First Leadership
                            </h2>
                            <p className="leading-relaxed text-muted-foreground">
                                In this phase, we move beyond metrics. We want
                                to understand the heartbeat of your leadership.
                                Who you are when the pressure is off.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="flex items-center gap-2 text-2xl font-bold">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                Extreme Privacy
                            </h2>
                            <p className="leading-relaxed text-muted-foreground">
                                Everything shared here is encrypted and
                                accessible only to your dedicated Activation
                                Team. This is your safe harbor.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === "1B" && (
                <div className="max-w-5xl animate-in space-y-10 px-1 duration-700 fade-in">
                    <div className="grid gap-8 md:grid-cols-2">
                        {step1BQuestions.map((q) => {
                            const formKey = FORM_KEY_MAP[q.key] ?? `getting_${q.key}`
                            return (
                                <div key={q.key} className="space-y-3 md:col-span-2">
                                    <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                        {q.label}
                                    </label>
                                    <textarea
                                        value={formData[formKey] ?? ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                [formKey]: e.target.value,
                                            })
                                        }
                                        className="min-h-[120px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder={q.placeholder ?? ""}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {STEP_TO_DOMAIN[currentStep] && (
                <TriageDomainForm
                    title={
                        questionConfigs[currentStep]?.description ||
                        STEP_TO_DOMAIN[currentStep].title
                    }
                    questions={
                        questionConfigs[currentStep]?.questions ||
                        STEP_TO_DOMAIN[currentStep].questions
                    }
                    answers={
                        formData[`triage_${STEP_TO_DOMAIN[currentStep].key}`] ||
                        {}
                    }
                    onChange={(q, val) =>
                        setFormData({
                            ...formData,
                            [`triage_${STEP_TO_DOMAIN[currentStep].key}`]: {
                                ...formData[
                                    `triage_${STEP_TO_DOMAIN[currentStep].key}`
                                ],
                                [q]: val,
                            },
                        })
                    }
                />
            )}

            {currentStep === "1D" && (
                <div className="max-w-3xl animate-in space-y-8 duration-700 fade-in">
                    <div className="space-y-8 rounded-[3rem] border-2 border-primary/20 bg-primary/5 p-10">
                        <div className="space-y-4">
                            <h2 className="font-serif text-2xl font-bold">
                                "Before we meet, is there anything on your
                                heart, your mind, or your plate that you want me
                                to be aware of?"
                            </h2>
                            <p className="text-lg text-muted-foreground italic">
                                Nothing is too BIG or small for us to hold.
                            </p>
                        </div>
                        <textarea
                            value={formData.open_share}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    open_share: e.target.value,
                                })
                            }
                            className="min-h-[300px] w-full rounded-3xl border-2 border-border/50 bg-background/50 p-6 font-serif text-xl leading-relaxed transition-all outline-none focus:ring-2 focus:ring-primary/40"
                            placeholder="Share your thoughts here..."
                        />
                    </div>
                </div>
            )}

            {currentStep === "1E" && (
                <div className="mx-auto max-w-4xl animate-in space-y-12 duration-700 fade-in">
                    <div className="grid grid-cols-1 gap-10">
                        {[
                            {
                                title: "Mission & Vision",
                                id: "1182657390",
                                icon: <Sparkles className="h-4 w-4" />,
                            },
                            {
                                title: "Our Culture",
                                id: "1182657388",
                                icon: <Heart className="h-4 w-4" />,
                            },
                            {
                                title: "Signature Key Terms",
                                id: "1182657395",
                                icon: <ShieldCheck className="h-4 w-4" />,
                            },
                        ].map((video) => (
                            <div key={video.id} className="space-y-4">
                                <div className="relative aspect-video overflow-hidden rounded-sm border border-primary/10 bg-neutral-900 shadow-2xl">
                                    <iframe
                                        src={`https://player.vimeo.com/video/${video.id}?h=0&title=0&byline=0&portrait=0`}
                                        className="absolute inset-0 h-full w-full"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <h3 className="flex items-center gap-2 px-2 text-sm font-bold tracking-wider uppercase">
                                    {video.icon}
                                    {video.title}
                                </h3>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6 rounded-[2.5rem] border border-primary/20 bg-primary/5 p-10">
                        <div className="space-y-3">
                            <h3 className="font-serif text-2xl font-bold text-primary italic">
                                "What resonated most with you?"
                            </h3>
                            <p className="text-muted-foreground">
                                Jot down any thoughts, breakthroughs, or
                                questions that surfaced while watching.
                            </p>
                        </div>
                        <textarea
                            value={formData.culture_takeaways}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    culture_takeaways: e.target.value,
                                })
                            }
                            className="min-h-[150px] w-full rounded-2xl border-2 border-border/50 bg-background/50 p-6 font-serif text-lg italic transition-all outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Your takeaways..."
                        />
                    </div>
                </div>
            )}

            {currentStep === "1F" && (
                <div className="flex animate-in flex-col items-center justify-center space-y-8 py-20 text-center duration-500 zoom-in">
                    <div className="flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-primary/20">
                        <Sparkles className="h-12 w-12 text-primary" />
                    </div>
                    <div className="max-w-lg space-y-4">
                        <h2 className="text-3xl font-bold">
                            Divine Identity Uncovered
                        </h2>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            This reveals your Divine Identity ~ The Real You ~
                            uncovered from the weight of past experiences and
                            the noise of your present reality.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="group h-16 rounded-2xl px-12 text-xl font-bold shadow-xl shadow-primary/20"
                    >
                        <a
                            href="https://giftstest.com/?utm_source=chatgpt.com"
                            target="_blank"
                            className="flex items-center gap-2"
                        >
                            Book Your 1:1 Orientation Call
                            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                        </a>
                    </Button>
                </div>
            )}
        </div>
    )
}
