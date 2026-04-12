"use client"
import { Users, Info, Sparkles, Moon, Heart, Star } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface Phase2Props {
  currentStep: string
  formData: any
  setFormData: (data: any) => void
}

export function Phase2Awareness({ currentStep, formData, setFormData }: Phase2Props) {
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
        awareness_360: [...(formData.awareness_360 || []), { name: "", email: "" }]
      })
    }
  }

  return (
    <div className="min-h-[40vh]">
      {currentStep === "2A" && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-serif flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                360° Feedback Circle
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Now, I want to hear from those you lead, those you follow, and those you value most. List the names of 3-5 people you'd like to invite into this circle.
              </p>
            </div>

            <div className="space-y-4">
              {(formData.awareness_360 || [{ name: "", email: "" }]).map((person: any, i: number) => (
                <div key={i} className="flex gap-4 animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                  <input 
                    type="text"
                    value={person.name}
                    onChange={(e) => update360(i, "name", e.target.value)}
                    placeholder={`Person ${i + 1} Name`}
                    className="flex-1 bg-background border-2 border-border/50 rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <input 
                    type="email"
                    value={person.email}
                    onChange={(e) => update360(i, "email", e.target.value)}
                    placeholder="Email Address"
                    className="flex-1 bg-background border-2 border-border/50 rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              ))}

              {(formData.awareness_360 || []).length < 5 && (
                <button 
                  onClick={add360Layer}
                  className="w-full py-4 border-2 border-dashed border-primary/20 rounded-xl text-primary font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="h-4 w-4" /> Add Feedback Provider
                </button>
              )}
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-2xl">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Note: We will not contact these people until we discuss the process during our orientation call. This is just for initial planning.
              </p>
            </div>
          </div>
        </div>
      )}

      {currentStep === "2B" && (
        <div className="space-y-8 max-w-3xl animate-in fade-in duration-700">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-serif">Historical Growth Inputs</h2>
              <p className="text-muted-foreground">
                Consolidate breakthroughs from previous leadership or personality assessments you've taken in the past.
              </p>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-primary">Key Takeaways & Breakthroughs</label>
              <textarea 
                value={formData.growth_takeaways}
                onChange={(e) => setFormData({...formData, growth_takeaways: e.target.value})}
                className="w-full bg-background border-2 border-border/50 rounded-2xl p-6 focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[300px] text-lg font-serif italic"
                placeholder="What patterns or insights have you already uncovered?"
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === "2C" && (
        <div className="space-y-10 max-w-2xl animate-in fade-in duration-700">
          <div className="p-10 rounded-[3rem] bg-neutral-900 text-neutral-50 shadow-2xl space-y-10 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Moon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-serif">The Evening Pulse</h3>
                <p className="text-primary/70 text-sm">Release. Reflect. Realign.</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Peace Rating */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold uppercase tracking-widest text-primary">Current Peace Level</label>
                  <span className="text-3xl font-bold text-primary">{formData.pulse_level || 5}</span>
                </div>
                <Slider 
                  value={[formData.pulse_level || 5]}
                  onValueChange={(val) => setFormData({...formData, pulse_level: val[0]})}
                  max={10} 
                  step={1} 
                  className="py-4"
                />
                <div className="flex justify-between text-[10px] uppercase font-bold text-neutral-500 tracking-tighter">
                  <span>Extreme Chaos</span>
                  <span>Deep Peace</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Star className="h-3 w-3" /> What went well today?
                </label>
                <textarea 
                  value={formData.pulse_good}
                  onChange={(e) => setFormData({...formData, pulse_good: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 outline-none transition-all min-h-[100px]"
                  placeholder="Celebrate a small win..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Heart className="h-3 w-3" /> What felt heavy today?
                </label>
                <textarea 
                  value={formData.pulse_heavy}
                  onChange={(e) => setFormData({...formData, pulse_heavy: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 outline-none transition-all min-h-[100px]"
                  placeholder="What are you ready to release?"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
