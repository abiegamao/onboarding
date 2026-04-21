import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export async function LandingNav() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    let isLoggedIn = false
    if (token) {
        try {
            await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
            isLoggedIn = true
        } catch {
            isLoggedIn = false
        }
    }

    return (
        <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-4 py-6 md:px-8">
            <Link href="/" className="flex items-center gap-2 md:gap-3">
                <div className="relative h-8 w-8 overflow-hidden md:h-10 md:w-10">
                    <Image
                        src="/assets/logo.png"
                        alt="Logo"
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="text-lg font-bold tracking-tight md:text-xl">
                    <span className="hidden sm:inline">
                        The Peace-Driven Leader
                    </span>
                    <span className="sm:hidden">Minesha</span>
                </span>
            </Link>
            <div className="flex items-center gap-3 md:gap-6">
                {isLoggedIn ? (
                    <Link href="/dashboard/onboarding">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-primary/30 bg-primary/5 text-xs hover:bg-primary/10 md:text-base"
                        >
                            Go to Dashboard
                        </Button>
                    </Link>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground md:text-sm"
                        >
                            Sign In
                        </Link>
                        <Link href="/signup">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-primary/30 bg-primary/5 text-xs hover:bg-primary/10 md:text-base"
                            >
                                Join
                            </Button>
                        </Link>
                    </>
                )}
                <ModeToggle />
            </div>
        </nav>
    )
}
