import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import OnboardingContent from "./OnboardingContent"

function OnboardingFallback() {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="animate-pulse text-muted-foreground">
                Loading your journey...
            </p>
        </div>
    )
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<OnboardingFallback />}>
            <OnboardingContent />
        </Suspense>
    )
}
