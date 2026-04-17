"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    BarChart3,
    Settings,
    ChevronRight,
    X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Clients", href: "/admin/clients", icon: Users },
    { label: "Onboarding", href: "/admin/onboarding", icon: ClipboardList },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminSidebarProps {
    isOpen?: boolean
    onClose?: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname()

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/50 bg-background transition-transform duration-300",
                // Mobile: slide in/out. Desktop: always visible.
                "lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}
        >
            {/* Brand */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 px-5">
                <div className="flex items-center gap-3">
                    <img
                        src="/assets/logo.png"
                        alt="Logo"
                        className="h-8 w-auto object-contain"
                    />
                    <div className="flex flex-col leading-tight">
                        <span className="text-xs font-bold tracking-widest text-foreground uppercase">
                            PDL
                        </span>
                        <span className="text-[10px] font-mono tracking-[0.2em] text-primary uppercase">
                            Admin
                        </span>
                    </div>
                </div>
                {/* Close button — mobile only */}
                <button
                    onClick={onClose}
                    className="lg:hidden rounded-lg p-1.5 text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                <p className="mb-2 px-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50">
                    Navigation
                </p>
                {NAV_ITEMS.map((item) => {
                    const active = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                active
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    active
                                        ? "text-primary"
                                        : "text-muted-foreground/60 group-hover:text-foreground"
                                )}
                            />
                            <span className="flex-1">{item.label}</span>
                            {active && (
                                <ChevronRight className="h-3 w-3 text-primary/50" />
                            )}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
