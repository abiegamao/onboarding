"use client"
import {
    Eye,
    Target,
    Sun,
    Home,
    Heart,
    Sparkles,
    Plus,
    Trash2,
} from "lucide-react"

interface Phase3Props {
    currentStep: string
    formData: any
    setFormData: (data: any) => void
}

const DOMAINS = [
    "Spiritual",
    "Health/Physical",
    "Family/Marriage",
    "Business/Career",
    "Financial",
    "Social/Community",
    "Intellectual/Personal Growth",
    "Recreational/Fun",
]

export function Phase3Stabilization({
    currentStep,
    formData,
    setFormData,
}: Phase3Props) {
    const updateDomain = (domain: string, value: string) => {
        setFormData({
            ...formData,
            stabilization_activation: {
                ...(formData.stabilization_activation || {}),
                [domain]: value,
            },
        })
    }

    const updateStatement = (key: string, value: string) => {
        setFormData({
            ...formData,
            stabilization_statements: {
                ...(formData.stabilization_statements || {}),
                [key]: value,
            },
        })
    }

    const updateValue = (index: number, value: string) => {
        const values = [...(formData.stabilization_values || ["", "", ""])]
        values[index] = value
        setFormData({ ...formData, stabilization_values: values })
    }

    const addValue = () => {
        setFormData({
            ...formData,
            stabilization_values: [
                ...(formData.stabilization_values || []),
                "",
            ],
        })
    }

    const removeValue = (index: number) => {
        const values = (formData.stabilization_values || []).filter(
            (_: any, i: number) => i !== index
        )
        setFormData({ ...formData, stabilization_values: values })
    }

    return (
        <div className="min-h-[40vh] space-y-10">
            {currentStep === "3A" && (
                <div className="animate-in space-y-8 duration-1000 fade-in slide-in-from-bottom-4">
                    <div className="space-y-4">
                        <h2 className="flex items-center gap-3 font-serif text-3xl font-bold">
                            <Eye className="h-8 w-8 text-primary" />
                            Vision Activation
                        </h2>
                        <p className="max-w-2xl text-lg text-muted-foreground">
                            Write a brief description of how you envision each
                            domain of your life functioning in a state of deep
                            peace.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {DOMAINS.map((domain) => (
                            <div
                                key={domain}
                                className="space-y-3 rounded-[2rem] border border-border/50 bg-secondary/30 p-6 transition-all hover:border-primary/20"
                            >
                                <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                    {domain}
                                </label>
                                <textarea
                                    value={
                                        formData.stabilization_activation?.[
                                            domain
                                        ] || ""
                                    }
                                    onChange={(e) =>
                                        updateDomain(domain, e.target.value)
                                    }
                                    className="min-h-[100px] w-full rounded-xl border border-border/50 bg-background p-3 text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder={`Describe your vision for ${domain}...`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {currentStep === "3B" && (
                <div className="mx-auto max-w-3xl animate-in space-y-10 duration-700 fade-in">
                    <div className="space-y-4 text-center">
                        <h2 className="font-serif text-3xl font-bold">
                            Vision Statements
                        </h2>
                        <p className="text-muted-foreground italic">
                            "I am thankful that I..."
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div key={num} className="flex items-start gap-4">
                                <div className="mt-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                                    {num}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <span className="text-xs font-bold tracking-widest text-primary uppercase">
                                        Outcome Statement
                                    </span>
                                    <input
                                        type="text"
                                        value={
                                            formData.stabilization_statements?.[
                                                `s${num}`
                                            ] || ""
                                        }
                                        onChange={(e) =>
                                            updateStatement(
                                                `s${num}`,
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-2xl border-2 border-border/50 bg-background p-4 font-serif text-lg italic transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="I am thankful that I..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {currentStep === "3C" && (
                <div className="animate-in space-y-8 duration-700 fade-in">
                    <div className="space-y-4">
                        <h2 className="flex items-center gap-3 font-serif text-3xl font-bold">
                            <Sun className="h-8 w-8 text-orange-500" />
                            Ideal Day Narrative
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Walk through your perfect day, from the moment you
                            wake up to the moment you drift off to sleep.
                        </p>
                    </div>

                    <textarea
                        value={formData.stabilization_story}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                stabilization_story: e.target.value,
                            })
                        }
                        className="min-h-[500px] w-full rounded-[3rem] border-2 border-border/50 bg-background p-10 font-serif text-xl leading-relaxed italic transition-all outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="The sun begins to peek through my window..."
                    />
                </div>
            )}

            {currentStep === "3D" && (
                <div className="mx-auto flex max-w-2xl animate-in flex-col items-center justify-center space-y-12 py-20 duration-1000 zoom-in">
                    <div className="space-y-4 text-center">
                        <Sparkles className="mx-auto h-16 w-16 animate-pulse text-primary" />
                        <h2 className="font-serif text-4xl font-bold">
                            Word of the Year
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            What single word will anchor your journey this year?
                        </p>
                    </div>

                    <input
                        type="text"
                        value={formData.stabilization_word}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                stabilization_word: e.target.value,
                            })
                        }
                        className="w-full border-b-4 border-primary/20 bg-transparent py-4 text-center text-6xl font-black tracking-[0.2em] uppercase transition-all outline-none placeholder:text-neutral-200 focus:border-primary"
                        placeholder="ANCHOR"
                    />
                </div>
            )}

            {currentStep === "3E" && (
                <div className="mx-auto max-w-3xl animate-in space-y-12 duration-700 fade-in">
                    <div className="space-y-4">
                        <h2 className="flex items-center gap-3 font-serif text-3xl font-bold">
                            <Home className="h-8 w-8 text-primary" />
                            Family Mission
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Define the core values and mission that unite your
                            home.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-bold tracking-widest text-primary uppercase">
                                <Heart className="h-4 w-4" /> Core Family Values
                            </label>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {(
                                    formData.stabilization_values || [
                                        "",
                                        "",
                                        "",
                                    ]
                                ).map((val: string, i: number) => (
                                    <div key={i} className="group relative">
                                        <input
                                            type="text"
                                            value={val}
                                            onChange={(e) =>
                                                updateValue(i, e.target.value)
                                            }
                                            className="w-full rounded-xl border border-border/50 bg-secondary/30 p-3 pr-10 outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder={`Value ${i + 1}`}
                                        />
                                        {i > 2 && (
                                            <button
                                                onClick={() => removeValue(i)}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addValue}
                                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/50 py-3 text-sm font-bold text-muted-foreground transition-all hover:border-primary/20 hover:text-primary"
                                >
                                    <Plus className="h-4 w-4" /> Add Value
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold tracking-widest text-primary uppercase">
                                Mission Statement
                            </label>
                            <textarea
                                value={formData.stabilization_mission}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        stabilization_mission: e.target.value,
                                    })
                                }
                                className="min-h-[150px] w-full rounded-2xl border-2 border-border/50 bg-background p-6 font-serif text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="In this house, we..."
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
