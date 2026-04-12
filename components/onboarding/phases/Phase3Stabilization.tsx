"use client"
import { Eye, Target, Sun, Home, Heart, Sparkles, Plus, Trash2 } from "lucide-react"

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
  "Recreational/Fun"
]

export function Phase3Stabilization({ currentStep, formData, setFormData }: Phase3Props) {
  
  const updateDomain = (domain: string, value: string) => {
    setFormData({
      ...formData,
      stabilization_activation: {
        ...(formData.stabilization_activation || {}),
        [domain]: value
      }
    })
  }

  const updateStatement = (key: string, value: string) => {
    setFormData({
      ...formData,
      stabilization_statements: {
        ...(formData.stabilization_statements || {}),
        [key]: value
      }
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
      stabilization_values: [...(formData.stabilization_values || []), ""]
    })
  }

  const removeValue = (index: number) => {
    const values = (formData.stabilization_values || []).filter((_: any, i: number) => i !== index)
    setFormData({ ...formData, stabilization_values: values })
  }

  return (
    <div className="min-h-[40vh] space-y-10">
      {currentStep === "3A" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-serif flex items-center gap-3">
              <Eye className="h-8 w-8 text-primary" />
              Vision Activation
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Write a brief description of how you envision each domain of your life functioning in a state of deep peace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DOMAINS.map((domain) => (
              <div key={domain} className="p-6 rounded-[2rem] bg-secondary/30 border border-border/50 space-y-3 transition-all hover:border-primary/20">
                <label className="text-sm font-bold uppercase tracking-wider text-primary">{domain}</label>
                <textarea 
                  value={formData.stabilization_activation?.[domain] || ""}
                  onChange={(e) => updateDomain(domain, e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[100px] text-sm"
                  placeholder={`Describe your vision for ${domain}...`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === "3B" && (
        <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-700">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold font-serif">Vision Statements</h2>
            <p className="text-muted-foreground italic">"I am thankful that I..."</p>
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-start gap-4">
                <div className="mt-4 shrink-0 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {num}
                </div>
                <div className="flex-1 space-y-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Outcome Statement</span>
                  <input 
                    type="text"
                    value={formData.stabilization_statements?.[`s${num}`] || ""}
                    onChange={(e) => updateStatement(`s${num}`, e.target.value)}
                    className="w-full bg-background border-2 border-border/50 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg font-serif italic"
                    placeholder="I am thankful that I..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === "3C" && (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-serif flex items-center gap-3">
              <Sun className="h-8 w-8 text-orange-500" />
              Ideal Day Narrative
            </h2>
            <p className="text-muted-foreground text-lg">
              Walk through your perfect day, from the moment you wake up to the moment you drift off to sleep.
            </p>
          </div>

          <textarea 
            value={formData.stabilization_story}
            onChange={(e) => setFormData({...formData, stabilization_story: e.target.value})}
            className="w-full bg-background border-2 border-border/50 rounded-[3rem] p-10 focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[500px] text-xl font-serif italic leading-relaxed"
            placeholder="The sun begins to peek through my window..."
          />
        </div>
      )}

      {currentStep === "3D" && (
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center space-y-12 py-20 animate-in zoom-in duration-1000">
          <div className="text-center space-y-4">
            <Sparkles className="h-16 w-16 text-primary mx-auto animate-pulse" />
            <h2 className="text-4xl font-bold font-serif">Word of the Year</h2>
            <p className="text-muted-foreground text-lg">What single word will anchor your journey this year?</p>
          </div>

          <input 
            type="text"
            value={formData.stabilization_word}
            onChange={(e) => setFormData({...formData, stabilization_word: e.target.value})}
            className="w-full bg-transparent border-b-4 border-primary/20 focus:border-primary text-center text-6xl font-black uppercase tracking-[0.2em] outline-none transition-all py-4 placeholder:text-neutral-200"
            placeholder="ANCHOR"
          />
        </div>
      )}

      {currentStep === "3E" && (
        <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-700">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-serif flex items-center gap-3">
              <Home className="h-8 w-8 text-primary" />
              Family Mission
            </h2>
            <p className="text-muted-foreground text-lg">Define the core values and mission that unite your home.</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Heart className="h-4 w-4" /> Core Family Values
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(formData.stabilization_values || ["", "", ""]).map((val: string, i: number) => (
                  <div key={i} className="group relative">
                    <input 
                      type="text"
                      value={val}
                      onChange={(e) => updateValue(i, e.target.value)}
                      className="w-full bg-secondary/30 border border-border/50 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder={`Value ${i + 1}`}
                    />
                    {i > 2 && (
                      <button 
                        onClick={() => removeValue(i)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  onClick={addValue}
                  className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border/50 rounded-xl text-sm font-bold text-muted-foreground hover:border-primary/20 hover:text-primary transition-all"
                >
                  <Plus className="h-4 w-4" /> Add Value
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-widest text-primary">Mission Statement</label>
              <textarea 
                value={formData.stabilization_mission}
                onChange={(e) => setFormData({...formData, stabilization_mission: e.target.value})}
                className="w-full bg-background border-2 border-border/50 rounded-2xl p-6 focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[150px] text-lg font-serif"
                placeholder="In this house, we..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
