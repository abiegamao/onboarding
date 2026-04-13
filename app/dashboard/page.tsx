import { redirect } from "next/navigation"
import { cn } from "@/lib/utils"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import Link from "next/link"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { ArrowRight, Sparkles, CheckCircle2, Circle } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
        redirect("/login")
    }

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        )
        const userId = (payload as any).userId

        await connectDB()
        const user = await User.findById(userId)

        if (user && !user.onboardingStatus?.hasSeenCelebration) {
            redirect("/success")
        }

        // Granular progress calculation
        const status = user?.onboardingStatus || {
            currentPhase: 1,
            currentStep: "1A",
            isCompleted: false,
            hasSeenCelebration: false,
        }
        const allSteps = [
            "1A",
            "1B",
            "1C",
            "1D",
            "1E",
            "2A",
            "2B",
            "2C",
            "3A",
            "3B",
            "3C",
            "3D",
            "3E",
            "4A",
            "4B",
            "4C",
        ]
        const currentStep = status?.currentStep || "1A"
        const currentStepIndex = allSteps.indexOf(currentStep)
        const progressValue = status?.isCompleted
            ? 100
            : Math.max(
                  0,
                  Math.round((currentStepIndex / allSteps.length) * 100)
              )

        const phaseNames: Record<number, string> = {
            1: "Connection",
            2: "Awareness",
            3: "Stabilization",
            4: "Activation",
        }

        const stepNames: Record<string, string> = {
            "1A": "Foundation Video",
            "1B": "SNAP Snapshot",
            "1C": "Leadership Triage",
            "1D": "Open Share",
            "1E": "Schedule Orientation",
            "2A": "360° Evaluation",
            "2B": "Growth Inputs",
            "2C": "Evening Pulse",
            "3A": "Vision Activation",
            "3B": "Vision Statements",
            "3C": "Ideal Day Narrative",
            "3D": "Word of the Year",
            "3E": "Family Mission",
            "4A": "Book Kickstart Call",
            "4B": "Join Telegram",
            "4C": "Wealth Strategy",
        }

        const currentPhaseName = phaseNames[status.currentPhase] || "Initiation"
        const nextStepName = stepNames[status.currentStep] || "Next Assessment"

        return (
            <div className="container mx-auto max-w-7xl animate-in p-4 duration-700 fade-in slide-in-from-bottom-4 sm:p-6 lg:p-8">
                <div className="flex flex-col space-y-8">
                    {/* Welcome Section */}
                    <div className="flex flex-col space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Welcome home, {user?.firstName || "Leader"}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Your journey to a peace-driven leadership begins
                            here.
                        </p>
                    </div>

                    {/* Onboarding Overview Card */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-background to-primary/5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 md:col-span-2">
                            <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles className="h-24 w-24" />
                            </div>

                            <CardHeader className="pb-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                                        MVP Activation
                                    </span>
                                </div>
                                <CardTitle className="text-2xl font-bold">
                                    The Peace-Driven Leader
                                    <span className="text-primary">™</span>{" "}
                                    Activation Pathway
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Follow this guided journey to activate your
                                    peace and stabilize your leadership.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="flex items-center gap-2">
                                            <span className="text-primary">
                                                {currentPhaseName} Phase
                                            </span>
                                            <span className="text-muted-foreground">
                                                •
                                            </span>
                                            <span>
                                                {progressValue}% Complete
                                            </span>
                                        </span>
                                        <span className="font-bold text-muted-foreground">
                                            Level {status.currentPhase}
                                        </span>
                                    </div>
                                    <Progress
                                        value={progressValue}
                                        className="h-3 bg-primary/10"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                                    <div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3 shadow-sm">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-muted-foreground">
                                                COMPLETED
                                            </span>
                                            <span className="text-sm font-semibold">
                                                Initiation Phase
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex animate-pulse items-center gap-3 rounded-xl border border-primary/10 bg-primary/5 p-3 shadow-sm">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Circle className="h-5 w-5 fill-primary/20" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold tracking-tighter text-primary uppercase">
                                                Current Action
                                            </span>
                                            <span className="truncate text-sm font-semibold">
                                                {nextStepName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-2">
                                <Button
                                    asChild
                                    className="group h-12 w-full rounded-2xl px-8 transition-all hover:pr-10 sm:w-auto"
                                >
                                    <Link
                                        href="/dashboard/onboarding"
                                        className="flex items-center"
                                    >
                                        {status.isCompleted
                                            ? "View Journey"
                                            : "Resume Journey"}
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Side Info / Support Card */}
                        <div className="space-y-6">
                            <Card className="overflow-hidden border-border bg-background shadow-lg">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">
                                        Journey Roadmap
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="flex flex-col">
                                        {[1, 2, 3, 4].map((phaseNum) => {
                                            const isActive =
                                                status.currentPhase === phaseNum
                                            const isComplete =
                                                status.currentPhase >
                                                    phaseNum ||
                                                (status.isCompleted &&
                                                    phaseNum === 4)
                                            const isLocked =
                                                status.currentPhase < phaseNum

                                            return (
                                                <div
                                                    key={phaseNum}
                                                    className={cn(
                                                        "flex items-center gap-4 border-b border-border/50 px-6 py-4 last:border-0",
                                                        isActive &&
                                                            "bg-primary/5"
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                                                            isComplete &&
                                                                "border-green-500 bg-green-500 text-white",
                                                            isActive &&
                                                                "border-primary bg-primary/10 font-bold text-primary",
                                                            isLocked &&
                                                                "border-border text-muted-foreground"
                                                        )}
                                                    >
                                                        {isComplete ? (
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        ) : (
                                                            <span className="text-xs">
                                                                {phaseNum}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex min-w-0 flex-col">
                                                        <span
                                                            className={cn(
                                                                "text-sm font-semibold",
                                                                isLocked
                                                                    ? "text-muted-foreground"
                                                                    : "text-neutral-900 dark:text-neutral-50"
                                                            )}
                                                        >
                                                            Phase {phaseNum}:{" "}
                                                            {
                                                                phaseNames[
                                                                    phaseNum
                                                                ]
                                                            }
                                                        </span>
                                                        {isActive && (
                                                            <span className="animate-pulse text-[10px] font-bold tracking-wider text-primary uppercase">
                                                                Currently Active
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-background shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Need Support?
                                    </CardTitle>
                                    <CardDescription>
                                        Your ProTeam is here to help you every
                                        step of the way.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-sm leading-relaxed text-muted-foreground">
                                        Whether you have questions about results
                                        or need help stabilizing your rhythm,
                                        click below.
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-xl"
                                    >
                                        Message ProTeam
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    } catch (error: any) {
        if (error.digest?.startsWith("NEXT_REDIRECT")) throw error
        console.error("Dashboard auth check error:", error)
        redirect("/api/auth/logout")
    }
}
