"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell, LogOut, Menu } from "lucide-react"

const PAGE_TITLES: Record<string, string> = {
    "/admin": "Overview",
    "/admin/clients": "Clients",
    "/admin/onboarding": "Onboarding",
    "/admin/reports": "Reports",
    "/admin/settings": "Settings",
}

interface UserData {
    firstName: string
    lastName: string
    email: string
}

export function AdminTopbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<UserData | null>(null)

    async function handleLogout() {
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" })
            if (res.ok) {
                toast.success("Logged out")
                router.push("/login")
                router.refresh()
            }
        } catch {
            toast.error("Logout failed")
        }
    }

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me")
                if (res.ok) {
                    const data = await res.json()
                    setUser(data.user)
                }
            } catch {}
        }
        fetchUser()
    }, [])

    const pageTitle = PAGE_TITLES[pathname] ?? "Admin"

    return (
        <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border/50 bg-background/95 px-4 backdrop-blur-sm lg:left-64 lg:px-6">
            {/* Left: hamburger (mobile) + page title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden rounded-xl p-2 text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                >
                    <Menu className="h-5 w-5" />
                </button>
            <div className="flex flex-col">
                <h1 className="text-base font-semibold text-foreground leading-tight">
                    {pageTitle}
                </h1>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50">
                    Admin Panel
                </p>
            </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                >
                    <Bell className="h-4 w-4" />
                </Button>

                <ModeToggle />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-9 w-9 rounded-full p-0 hover:bg-primary/10"
                        >
                            <Avatar className="h-8 w-8 border-2 border-primary/20">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                                    {user
                                        ? `${user.firstName[0]}${user.lastName[0]}`
                                        : "AD"}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-52 rounded-xl" align="end">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col gap-0.5">
                                <p className="text-sm font-semibold">
                                    {user
                                        ? `${user.firstName} ${user.lastName}`
                                        : "Admin"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user?.email ?? ""}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                            Role: Administrator
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-destructive focus:text-destructive"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
