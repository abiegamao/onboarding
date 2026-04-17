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
        <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#b6954a]/20 bg-background/80 px-4 backdrop-blur-md lg:left-64 lg:px-8 shadow-[0_4px_30px_rgba(182,149,74,0.03)] transition-colors duration-300">
            {/* Left: hamburger (mobile) + page title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden rounded-xl p-2.5 text-muted-foreground hover:bg-[#b6954a]/10 hover:text-[#b6954a] transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-bold text-foreground leading-none tracking-tight">
                        {pageTitle}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="h-1 w-1 rounded-full bg-[#b6954a] shadow-[0_0_8px_rgba(182,149,74,0.8)]"></span>
                        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60">
                            Admin Panel
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-muted-foreground hover:bg-[#b6954a]/10 hover:text-[#b6954a] transition-colors"
                >
                    <Bell className="h-4.5 w-4.5" />
                </Button>

                <div className="scale-90">
                    <ModeToggle />
                </div>

                <div className="h-6 w-px bg-[#b6954a]/20 mx-1" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-10 w-10 rounded-full p-0 hover:bg-[#b6954a]/10 transition-colors focus-visible:ring-[#b6954a]/50"
                        >
                            <Avatar className="h-9 w-9 border border-[#b6954a]/30 shadow-sm transition-transform hover:scale-105">
                                <AvatarFallback className="bg-gradient-to-br from-[#b6954a]/20 to-[#b6954a]/5 text-[#b6954a] text-xs font-bold uppercase tracking-wider">
                                    {user
                                        ? `${user.firstName[0]}${user.lastName[0]}`
                                        : "AD"}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-2xl border-[#b6954a]/20 shadow-xl" align="end" sideOffset={8}>
                        <DropdownMenuLabel className="font-normal px-4 py-3">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-semibold tracking-wide text-foreground">
                                    {user
                                        ? `${user.firstName} ${user.lastName}`
                                        : "Admin User"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user?.email ?? "System Access"}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-[#b6954a]/10" />
                        <DropdownMenuItem disabled className="text-xs text-muted-foreground/70 px-4 py-2 font-mono uppercase tracking-wider">
                            Role: Administrator
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#b6954a]/10" />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive px-4 py-2.5 rounded-xl m-1 transition-colors"
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
