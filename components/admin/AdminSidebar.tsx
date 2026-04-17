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
                "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#b6954a]/20 bg-[#10241f] transition-transform duration-300 shadow-[4px_0_24px_rgba(16,36,31,0.5)]",
                // Mobile: slide in/out. Desktop: always visible.
                "lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}
        >
            {/* Brand */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#b6954a]/20 px-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#b6954a]/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-3 relative z-10">
                    <img
                        src="/assets/pdl-logo.png"
                        alt="Logo"
                        className="h-12 w-auto object-contain"
                    />
                    <div className="flex flex-col leading-tight">
                        <span className="text-xs font-bold tracking-widest text-[#f4ead8] uppercase">
                            Peace-Driven Leadership
                        </span>
                    </div>
                </div>
                {/* Close button — mobile only */}
                <button
                    onClick={onClose}
                    className="lg:hidden rounded-lg p-1.5 text-[#f4ead8]/60 hover:bg-[#b6954a]/10 hover:text-[#f4ead8] relative z-10"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4 relative z-10">
                <p className="mb-2 px-2 font-mono text-[9px] uppercase tracking-[0.3em] text-[#f4ead8]/40">
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
                                    ? "bg-gradient-to-r from-[#b6954a]/15 to-transparent text-[#d6b56c] shadow-[inset_2px_0_0_#d6b56c]"
                                    : "text-[#f4ead8]/70 hover:bg-[#b6954a]/10 hover:text-[#f4ead8]"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-4 w-4 shrink-0 transition-all duration-200",
                                    active
                                        ? "text-[#d6b56c]"
                                        : "text-[#f4ead8]/50 group-hover:text-[#d6b56c]"
                                )}
                            />
                            <span className="flex-1">{item.label}</span>
                            {active && (
                                <ChevronRight className="h-3 w-3 text-[#d6b56c]/70 transition-transform group-hover:translate-x-1" />
                            )}
                        </Link>
                    )
                })}
            </nav>


            {/* Background Texture */}
            <div 
                className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f4ead8 1px, transparent 0)', backgroundSize: '24px 24px' }} 
            />
        </aside>
    )
}
