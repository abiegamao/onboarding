import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { OnboardingSidebar } from "@/components/onboarding-sidebar"
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  let status = { currentPhase: 1, currentStep: "1A", isCompleted: false }

  if (token) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
      const userId = (payload as any).userId
      await connectDB()
      const user = await User.findById(userId).select("onboardingStatus")
      if (user) {
        status = JSON.parse(JSON.stringify(user.onboardingStatus))
      }
    } catch (error) {
      console.error("Layout progress fetch error:", error)
    }
  }

  const allSteps = [
    "1A", "1B", "1C", "1D", "1E",
    "2A", "2B", "2C",
    "3A", "3B", "3C", "3D", "3E",
    "4A", "4B", "4C"
  ]
  const currentStepIndex = allSteps.indexOf(status.currentStep)
  const progressValue = status.isCompleted 
    ? 100 
    : Math.max(0, (currentStepIndex / allSteps.length) * 100)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <OnboardingSidebar 
          currentPhase={status.currentPhase} 
          currentStep={status.currentStep} 
        />

        {/* Main Content Area */}
        <div className="flex-1 max-w-4xl space-y-8">
          {/* Progress Overview */}
          <OnboardingProgress
            currentPhase={status.currentPhase}
            currentStep={status.currentStep}
            progressValue={progressValue}
          />

          <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-6 sm:p-10 shadow-xl shadow-primary/5 min-h-[60vh]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
