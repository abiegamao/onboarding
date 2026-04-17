import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative min-h-screen bg-background">
            <DashboardHeader />
            <main className="pt-16">{children}</main>
        </div>
    )
}
