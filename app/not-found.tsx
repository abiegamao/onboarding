import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center font-sans">
            <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
            <div className="mt-[-4rem] space-y-4">
                <h2 className="text-3xl font-semibold tracking-tight">
                    Path not found
                </h2>
                <p className="mx-auto max-w-md text-muted-foreground">
                    The peace you seek is not down this road. Let's get you back
                    on track.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <Button asChild variant="outline">
                        <Link href="/">Home</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
