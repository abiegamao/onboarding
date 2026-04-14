"use client"
import { Play, ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadershipAssessment } from "@/components/onboarding/LeadershipAssessment"

interface Phase1Props {
  currentStep: string
  formData: any
  setFormData: (data: any) => void
}

export function Phase1Connection({ currentStep, formData, setFormData }: Phase1Props) {
  return (
    <div className="min-h-[40vh]">
      {currentStep === "1A" && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">

          {/* Narrative Section */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Human-First Leadership
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                In this phase, we move beyond metrics. We want to understand the heartbeat of your leadership. Who you are when the pressure is off.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Extreme Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Everything shared here is encrypted and accessible only to your dedicated Activation Team. This is your safe harbor.
              </p>
            </div>
          </div>
        </div>
      )}

      {currentStep === "1B" && (
        <div className="space-y-8 max-w-2xl px-1 animate-in fade-in duration-700">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-primary">Your Primary Role & Responsibility</label>
              <textarea 
                value={formData.snapshot_1}
                onChange={(e) => setFormData({...formData, snapshot_1: e.target.value})}
                className="w-full bg-background border-2 border-border/50 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px] text-lg"
                placeholder="What is your current focus?"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-primary">Current Challenges</label>
              <textarea 
                value={formData.snapshot_2}
                onChange={(e) => setFormData({...formData, snapshot_2: e.target.value})}
                className="w-full bg-background border-2 border-border/50 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px] text-lg"
                placeholder="What's been feeling heavy lately?"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-primary">Desired Outcomes</label>
              <textarea 
                value={formData.snapshot_3}
                onChange={(e) => setFormData({...formData, snapshot_3: e.target.value})}
                className="w-full bg-background border-2 border-border/50 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px] text-lg"
                placeholder="What does 'stabilized' look like for you?"
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === "1C" && (
        <div className="space-y-10 max-w-4xl animate-in fade-in duration-700">
          <div className="grid gap-8">
            {/* Mind */}
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-serif">Mind (The Wiring)</h3>
              </div>
              
              <div className="space-y-6">
                {/* PDL Score ~ Embedded Assessment */}
                <div className="pb-6 border-b border-primary/10">
                  <LeadershipAssessment
                    value={formData.triage_pdl || ""}
                    onChange={(score) => setFormData({...formData, triage_pdl: score})}
                  />
                </div>

                {/* Neurodiversity */}
                <div className="flex flex-col md:flex-row md:items-end gap-6 pb-6 border-b border-primary/10">
                  <div className="flex-1 space-y-3">
                    <p className="font-bold text-sm uppercase tracking-wide">High Functioning Neurodiversity</p>
                    <a 
                      href="https://exceptionalindividuals.com/neurodiversity/"
                      target="_blank"
                      className="inline-flex items-center text-primary hover:underline text-sm font-medium"
                    >
                      Take Neurodiversity Test <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                  <div className="w-full md:w-48">
                    <input 
                      type="text"
                      value={formData.triage_neuro}
                      onChange={(e) => setFormData({...formData, triage_neuro: e.target.value})}
                      placeholder="Result Summary"
                      className="w-full bg-background border-2 border-border/50 rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>

                {/* Internal Wiring */}
                <div className="space-y-3">
                  <p className="font-bold text-sm uppercase tracking-wide">Internal Wiring (CliftonStrengths / Human Design)</p>
                  <input 
                    type="text"
                    value={formData.triage_wiring}
                    onChange={(e) => setFormData({...formData, triage_wiring: e.target.value})}
                    placeholder="Enter your strengths or design profile..."
                    className="w-full bg-background border-2 border-border/50 rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-serif">Body (The Interaction)</h3>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                <div className="flex-1 space-y-3">
                  <p className="font-bold text-sm uppercase tracking-wide">DiSC Assessment</p>
                  <a 
                    href="https://discpersonalitytesting.com/free-disc-test/"
                    target="_blank"
                    className="inline-flex items-center text-primary hover:underline text-sm font-medium"
                  >
                    Start Free DiSC Test <ArrowRight className="ml-1 h-3 w-3" />
                  </a>
                </div>
                <div className="w-full md:w-48">
                  <input 
                    type="text"
                    value={formData.triage_disc}
                    onChange={(e) => setFormData({...formData, triage_disc: e.target.value})}
                    placeholder="Your Result"
                    className="w-full bg-background border-2 border-border/50 rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === "1D" && (
        <div className="space-y-8 max-w-3xl animate-in fade-in duration-700">
          <div className="p-10 rounded-[3rem] bg-primary/5 border-2 border-primary/20 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-serif">"Before we meet, is there anything on your heart, your mind, or your plate that you want me to be aware of?"</h2>
              <p className="text-muted-foreground text-lg italic">
                Nothing is too BIG or small for us to hold.
              </p>
            </div>
            <textarea 
              value={formData.open_share}
              onChange={(e) => setFormData({...formData, open_share: e.target.value})}
              className="w-full bg-background/50 border-2 border-border/50 rounded-3xl p-6 focus:ring-2 focus:ring-primary/40 outline-none transition-all min-h-[300px] text-xl leading-relaxed font-serif"
              placeholder="Share your thoughts here..."
            />
          </div>
        </div>
      )}

      {currentStep === "1E" && (
        <div className="space-y-12 animate-in fade-in duration-700 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-10">
            {[
              { title: "Mission & Vision", id: "ft9eAypjpac", icon: <Sparkles className="h-4 w-4" /> },
              { title: "Our Culture", id: "G-IJMF9WN6I", icon: <Heart className="h-4 w-4" /> },
              { title: "Signature Key Terms", id: "b75eF1j3BdE", icon: <ShieldCheck className="h-4 w-4" /> }
            ].map((video) => (
              <div key={video.id} className="space-y-4">
                <div className="relative aspect-video rounded-sm overflow-hidden bg-neutral-900 border border-primary/10 shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 px-2">
                  {video.icon}
                  {video.title}
                </h3>
              </div>
            ))}
          </div>

          <div className="p-10 rounded-[2.5rem] bg-primary/5 border border-primary/20 space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold font-serif italic text-primary">"What resonated most with you?"</h3>
              <p className="text-muted-foreground">Jot down any thoughts, breakthroughs, or questions that surfaced while watching.</p>
            </div>
            <textarea 
              value={formData.culture_takeaways}
              onChange={(e) => setFormData({...formData, culture_takeaways: e.target.value})}
              className="w-full bg-background/50 border-2 border-border/50 rounded-2xl p-6 focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[150px] text-lg font-serif italic"
              placeholder="Your takeaways..."
            />
          </div>
        </div>
      )}

      {currentStep === "1F" && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in zoom-in duration-500">
          <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-4 max-w-lg">
            <h2 className="text-3xl font-bold">Divine Identity Uncovered</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              This reveals your Divine Identity ~ The Real You ~ uncovered from the weight of past experiences and the noise of your present reality.
            </p>
          </div>
          <Button size="lg" className="h-16 px-12 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20 group">
            <a href="https://giftstest.com/?utm_source=chatgpt.com" target="_blank" className="flex items-center gap-2">
              Book Your 1:1 Orientation Call
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
