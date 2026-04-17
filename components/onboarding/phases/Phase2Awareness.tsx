"use client"
import { Users, Info, Sparkles, Moon, Heart, Star } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface Phase2Props {
    currentStep: string
    formData: any
    setFormData: (data: any) => void
}

export function Phase2Awareness({
    currentStep,
    formData,
    setFormData,
}: Phase2Props) {
    // Helpers for 360 Eval list
    const update360 = (index: number, field: string, value: string) => {
        const list = [...(formData.awareness_360 || [{ name: "", email: "" }])]
        list[index] = { ...list[index], [field]: value }
        setFormData({ ...formData, awareness_360: list })
    }

    const add360Layer = () => {
        if ((formData.awareness_360 || []).length < 5) {
            setFormData({
                ...formData,
                awareness_360: [
                    ...(formData.awareness_360 || []),
                    { name: "", email: "" },
                ],
            })
        }
    }

    return (
        <div className="min-h-[40vh]">
            {currentStep === "2A" && (
                <div className="animate-in space-y-10 duration-1000 fade-in slide-in-from-bottom-4">
                    <div className="space-y-8 rounded-[2.5rem] border border-primary/10 bg-primary/5 p-8">
                        <div className="space-y-4">
                            <h2 className="flex items-center gap-3 font-serif text-2xl font-bold">
                                <Users className="h-6 w-6 text-primary" />
                                360° Feedback Circle
                            </h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                Now, I want to hear from those you lead, those
                                you follow, and those you value most. List the
                                names of 3-5 people you'd like to invite into
                                this circle.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {(
                                formData.awareness_360 || [
                                    { name: "", email: "" },
                                ]
                            ).map((person: any, i: number) => (
                                <div
                                    key={i}
                                    className="flex animate-in gap-4 duration-300 slide-in-from-left-2"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <input
                                        type="text"
                                        value={person.name}
                                        onChange={(e) =>
                                            update360(i, "name", e.target.value)
                                        }
                                        placeholder={`Person ${i + 1} Name`}
                                        className="flex-1 rounded-xl border-2 border-border/50 bg-background p-3 outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    <input
                                        type="email"
                                        value={person.email}
                                        onChange={(e) =>
                                            update360(
                                                i,
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Email Address"
                                        className="flex-1 rounded-xl border-2 border-border/50 bg-background p-3 outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            ))}

                            {(formData.awareness_360 || []).length < 5 && (
                                <button
                                    onClick={add360Layer}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/20 py-4 font-bold text-primary transition-colors hover:bg-primary/5"
                                >
                                    <Users className="h-4 w-4" /> Add Feedback
                                    Provider
                                </button>
                            )}
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl bg-secondary/30 p-4">
                            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                Note: We will not contact these people until we
                                discuss the process during our orientation call.
                                This is just for initial planning.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === "2B" && (
                <div className="max-w-3xl animate-in space-y-8 duration-700 fade-in">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="font-serif text-2xl font-bold">
                                Historical Growth Inputs
                            </h2>
                            <p className="text-muted-foreground">
                                Consolidate breakthroughs from previous
                                leadership or personality assessments you've
                                taken in the past.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                Key Takeaways & Breakthroughs
                            </label>
                            <textarea
                                value={formData.growth_takeaways}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        growth_takeaways: e.target.value,
                                    })
                                }
                                className="min-h-[300px] w-full rounded-2xl border-2 border-border/50 bg-background p-6 font-serif text-lg italic transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="What patterns or insights have you already uncovered?"
                            />
                        </div>
                    </div>
                </div>
            )}

            {currentStep === "2C" && (
                <div className="max-w-2xl animate-in space-y-8 duration-700 fade-in">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20">
                            <Moon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-serif text-2xl font-bold">
                                The Evening Pulse
                            </h3>
                            <p className="text-sm text-primary/70">
                                Release. Reflect. Realign.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-end justify-between">
                                <label className="text-sm font-bold tracking-widest text-primary uppercase">
                                    Current Peace Level
                                </label>
                                <span className="text-3xl font-bold text-primary">
                                    {formData.pulse_level || 5}
                                </span>
                            </div>
                            <Slider
                                value={[formData.pulse_level || 5]}
                                onValueChange={(val) =>
                                    setFormData({
                                        ...formData,
                                        pulse_level: val[0],
                                    })
                                }
                                max={10}
                                step={1}
                                className="py-4"
                            />
                            <div className="flex justify-between text-[10px] font-bold tracking-tighter text-muted-foreground/50 uppercase">
                                <span>Extreme Chaos</span>
                                <span>Deep Peace</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-bold tracking-widest text-primary uppercase">
                                <Star className="h-3 w-3" /> What went well
                                today?
                            </label>
                            <textarea
                                value={formData.pulse_good}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        pulse_good: e.target.value,
                                    })
                                }
                                className="min-h-[100px] w-full rounded-2xl border border-border bg-muted/40 p-4 transition-all outline-none focus:ring-2 focus:ring-primary/40"
                                placeholder="Celebrate a small win..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-bold tracking-widest text-primary uppercase">
                                <Heart className="h-3 w-3" /> What felt heavy
                                today?
                            </label>
                            <textarea
                                value={formData.pulse_heavy}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        pulse_heavy: e.target.value,
                                    })
                                }
                                className="min-h-[100px] w-full rounded-2xl border border-border bg-muted/40 p-4 transition-all outline-none focus:ring-2 focus:ring-primary/40"
                                placeholder="What are you ready to release?"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
