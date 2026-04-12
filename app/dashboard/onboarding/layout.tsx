import { OnboardingSidebar } from "@/components/onboarding-sidebar"
import { Progress } from "@/components/ui/progress"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <OnboardingSidebar />

        {/* Main Content Area */}
        <div className="flex-1 max-w-4xl space-y-8">
          {/* Progress Overview (Mobile/Tablet Top Bar) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-primary">Overall Progress</span>
              <span className="text-muted-foreground">15%</span>
            </div>
            <Progress value={15} className="h-2 bg-primary/10" />
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-6 sm:p-10 shadow-xl shadow-primary/5 min-h-[60vh]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
