"use client"
import { Play, ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadershipAssessment } from "@/components/onboarding/LeadershipAssessment"

interface Phase1Props {
    currentStep: string
    formData: any
    setFormData: (data: any) => void
}

export function Phase1Connection({
    currentStep,
    formData,
    setFormData,
}: Phase1Props) {
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
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                What’s your favorite food and snacks?
                            </label>
                            <textarea
                                value={formData.getting_favoriteFoodSnacks}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        getting_favoriteFoodSnacks:
                                            e.target.value,
                                    })
                                }
                                className="min-h-[120px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Example: stuffed mushrooms"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                What do you like to do for fun - what hobbies
                                bring you joy?
                            </label>
                            <textarea
                                value={formData.getting_hobbiesJoy}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        getting_hobbiesJoy: e.target.value,
                                    })
                                }
                                className="min-h-[140px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Example: nature, short adventures, dancing, star watching, beach, parks, taking pictures of nature"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                What are your top 3 favorite things to do for
                                self-care? Choose your Top 3.
                            </label>
                            <textarea
                                value={formData.getting_selfCareTop3}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        getting_selfCareTop3: e.target.value,
                                    })
                                }
                                className="min-h-[120px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="One per line or comma-separated. Example: Meditation, Nature Walks, Journaling"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                What are your favorite movies or shows you could
                                rewatch anytime?
                            </label>
                            <textarea
                                value={formData.getting_favoriteMoviesShows}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        getting_favoriteMoviesShows:
                                            e.target.value,
                                    })
                                }
                                className="min-h-[120px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Example: anything funny"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                If you could travel anywhere, what are your top
                                3 dream destinations you haven’t been to yet?
                            </label>
                            <textarea
                                value={formData.getting_dreamDestinationsTop3}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        getting_dreamDestinationsTop3:
                                            e.target.value,
                                    })
                                }
                                className="min-h-[120px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="One per line or comma-separated. Example: Paris, Dubai, Hawaii"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                What are your financial goals for this year and
                                over the next 12 months?
                            </label>
                            <textarea
                                value={formData.getting_financialGoals}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        getting_financialGoals: e.target.value,
                                    })
                                }
                                className="min-h-[140px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Example: learn how to flow off written budget, set a spending plan, start a savings plan"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                What are the top 3 things on your bucket list?
                            </label>
                            <textarea
                                value={formData.getting_bucketListTop3}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        getting_bucketListTop3: e.target.value,
                                    })
                                }
                                className="min-h-[120px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="One per line or comma-separated. Example: take a cruise, get on an airplane, visit somewhere I need a passport"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                If we were looking back a year from now, what
                                would make you feel proud of your growth?
                            </label>
                            <textarea
                                value={formData.getting_proudGrowth}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        getting_proudGrowth: e.target.value,
                                    })
                                }
                                className="min-h-[140px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Example: remain consistent and true to myself without giving up"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                Tell me a little about your work or business -
                                what do you love most, and what drains you the
                                most?
                            </label>
                            <textarea
                                value={formData.getting_workBusiness}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        getting_workBusiness: e.target.value,
                                    })
                                }
                                className="min-h-[180px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Share what you love most and what drains you most"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                When you think about your boundaries with
                                family, friends, and clients, what feels easy
                                for you? What feels hard?
                            </label>
                            <textarea
                                value={formData.getting_boundaries}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        getting_boundaries: e.target.value,
                                    })
                                }
                                className="min-h-[180px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Share what feels easy and what feels hard"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                Who are the most important people in your life
                                right now?
                            </label>
                            <textarea
                                value={formData.getting_importantPeople}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        getting_importantPeople: e.target.value,
                                    })
                                }
                                className="min-h-[120px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Example: girls, grandbaby, grandmother, family, close connections"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                What personal principles guide your decisions in
                                life and leadership?
                            </label>
                            <textarea
                                value={formData.getting_personalPrinciples}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        getting_personalPrinciples:
                                            e.target.value,
                                    })
                                }
                                className="min-h-[180px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Share the principles that guide your decisions"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                What standards do you hold for yourself that
                                you’d never compromise on?
                            </label>
                            <textarea
                                value={
                                    formData.getting_uncompromisableStandards
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        getting_uncompromisableStandards:
                                            e.target.value,
                                    })
                                }
                                className="min-h-[140px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Share your non-negotiables"
                            />
                        </div>
                    </div>
                </div>
            )}

            {currentStep === "1C" && (
                <div className="max-w-4xl animate-in space-y-10 duration-700 fade-in">
                    <div className="grid gap-8">
                        {/* Mind */}
                        <div className="space-y-6 rounded-3xl border border-primary/10 bg-primary/5 p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-serif text-xl font-bold">
                                    Mind (The Wiring)
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {/* PDL Score ~ Embedded Assessment */}
                                <div className="border-b border-primary/10 pb-6">
                                    <LeadershipAssessment
                                        value={formData.triage_pdl || ""}
                                        onChange={(score) =>
                                            setFormData({
                                                ...formData,
                                                triage_pdl: score,
                                            })
                                        }
                                    />
                                </div>

                                {/* Neurodiversity */}
                                <div className="flex flex-col gap-6 border-b border-primary/10 pb-6 md:flex-row md:items-end">
                                    <div className="flex-1 space-y-3">
                                        <p className="text-sm font-bold tracking-wide uppercase">
                                            High Functioning Neurodiversity
                                        </p>
                                        <a
                                            href="https://exceptionalindividuals.com/neurodiversity/"
                                            target="_blank"
                                            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                                        >
                                            Take Neurodiversity Test{" "}
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </a>
                                    </div>
                                    <div className="w-full md:w-48">
                                        <input
                                            type="text"
                                            value={formData.triage_neuro}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    triage_neuro:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="Result Summary"
                                            className="w-full rounded-xl border-2 border-border/50 bg-background p-3 outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                {/* Internal Wiring */}
                                <div className="space-y-3">
                                    <p className="text-sm font-bold tracking-wide uppercase">
                                        Internal Wiring (CliftonStrengths /
                                        Human Design)
                                    </p>
                                    <input
                                        type="text"
                                        value={formData.triage_wiring}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                triage_wiring: e.target.value,
                                            })
                                        }
                                        placeholder="Enter your strengths or design profile..."
                                        className="w-full rounded-xl border-2 border-border/50 bg-background p-3 outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="space-y-6 rounded-3xl border border-border/50 bg-secondary/30 p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50">
                                    <Heart className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-serif text-xl font-bold">
                                    Body (The Interaction)
                                </h3>
                            </div>

                            <div className="flex flex-col gap-6 md:flex-row md:items-end">
                                <div className="flex-1 space-y-3">
                                    <p className="text-sm font-bold tracking-wide uppercase">
                                        DiSC Assessment
                                    </p>
                                    <a
                                        href="https://discpersonalitytesting.com/free-disc-test/"
                                        target="_blank"
                                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                                    >
                                        Start Free DiSC Test{" "}
                                        <ArrowRight className="ml-1 h-3 w-3" />
                                    </a>
                                </div>
                                <div className="w-full md:w-48">
                                    <input
                                        type="text"
                                        value={formData.triage_disc}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                triage_disc: e.target.value,
                                            })
                                        }
                                        placeholder="Your Result"
                                        className="w-full rounded-xl border-2 border-border/50 bg-background p-3 outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
