import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import connectDB from "@/lib/mongodb"
import OnboardingProfile from "@/models/OnboardingProfile"
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
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(JWT_SECRET)
            )
            const userId = (payload as any).userId
            await connectDB()
            const profile = await OnboardingProfile.findOne({ userId }).select(
                "status"
            )
            if (profile) {
                status = JSON.parse(JSON.stringify(profile.status))
            }
        } catch (error) {
            console.error("Layout progress fetch error:", error)
        }
    }

    const allSteps = [
        "1A", "1B",
        "1C-1", "1C-2", "1C-3", "1C-4", "1C-5", "1C-6", "1C-7", "1C-8", "1C-9",
        "1D", "1E",
        "2A", "2B", "2C",
        "3A", "3B", "3C", "3D", "3E",
        "4A", "4B", "4C",
    ]
    const currentStepIndex = allSteps.indexOf(status.currentStep)
    const progressValue = status.isCompleted
        ? 100
        : Math.max(0, (currentStepIndex / allSteps.length) * 100)

    return (
        <div className="container mx-auto animate-in px-4 py-8 duration-700 fade-in sm:px-6 lg:px-8">
            <div className="flex flex-col gap-12 lg:flex-row">
                {/* Sidebar */}
                <OnboardingSidebar
                    currentPhase={status.currentPhase}
                    currentStep={status.currentStep}
                />

                {/* Main Content Area */}
                <div className="max-w-4xl flex-1 space-y-8">
                    {/* Progress Overview */}
                    <OnboardingProgress
                        currentPhase={status.currentPhase}
                        currentStep={status.currentStep}
                        progressValue={progressValue}
                    />

                    <div className="min-h-[60vh] rounded-3xl border border-border/50 bg-card/50 p-6 shadow-xl shadow-primary/5 backdrop-blur-sm sm:p-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
