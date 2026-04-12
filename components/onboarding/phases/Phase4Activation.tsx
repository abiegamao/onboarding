"use client"
import { Phone, Users, Wallet, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"

interface Phase4Props {
  currentStep: string
  formData: any
  setFormData: (data: any) => void
}

export function Phase4Activation({ currentStep, formData, setFormData }: Phase4Props) {
  
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      {currentStep === "4A" && (
        <div className="max-w-2xl w-full p-10 rounded-[3rem] bg-neutral-900 text-neutral-50 shadow-2xl space-y-8 border border-white/5 animate-in fade-in zoom-in duration-700">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Phone className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-serif">The Kickstart Call</h2>
              <p className="text-primary/70 text-sm font-bold uppercase tracking-widest">Ground Rules & Milestones</p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-lg text-neutral-300 leading-relaxed">
              This is where the transformation truly begins. In this session, we will establish the "Rules of the Game," unlock your first major rewards, and set the milestones that will track your progress.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Personal Roadmap</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">First Milestone Unlocked</span>
              </div>
            </div>

            <button 
              className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all group"
              onClick={() => window.open("https://calendly.com/minesha-kickoff", "_blank")}
            >
              Book Your Kickstart Call
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {currentStep === "4B" && (
        <div className="max-w-2xl w-full p-10 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl space-y-8 animate-in slide-in-from-right-10 duration-700">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-serif">Community Portal</h2>
              <p className="text-white/70 text-sm font-bold uppercase tracking-widest">Join the Telegram Collective</p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-lg text-white/90 leading-relaxed">
              You are no longer carrying this weight alone. Join our private Telegram collective to connect with other Peace-Driven Leaders, share breakthroughs, and receive daily encouragement from the ProTeam.
            </p>

            <button 
              className="w-full h-16 bg-white text-indigo-700 hover:bg-white/90 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all"
              onClick={() => window.open("https://t.me/minesha_leaders", "_blank")}
            >
              Connect to Telegram
              <ArrowRight className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-3 p-4 bg-black/10 rounded-2xl">
              <Sparkles className="h-5 w-5 text-yellow-300 shrink-0 mt-0.5" />
              <p className="text-xs text-white/70 leading-relaxed">
                Tip: After joining, introduce yourself and share your "Word of the Year" from the previous phase!
              </p>
            </div>
          </div>
        </div>
      )}

      {currentStep === "4C" && (
        <div className="max-w-2xl w-full p-10 rounded-[3rem] bg-secondary border border-border/50 shadow-2xl space-y-8 animate-in slide-in-from-bottom-10 duration-700 text-center">
          <div className="h-20 w-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-serif">Financial Alignment</h2>
            <p className="text-muted-foreground text-lg">
              Your wealth strategist is ready to help you align your cash, credit, and investments with your new state of peace.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <button 
              className="w-full h-16 border-2 border-primary text-primary hover:bg-primary/5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all"
              onClick={() => window.open("https://calendly.com/minesha-wealth", "_blank")}
            >
              Schedule Wealth Strategist Call
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">This is the final step of your activation pathway.</p>
          </div>
        </div>
      )}
    </div>
  )
}
