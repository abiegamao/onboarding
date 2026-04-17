"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, CheckCircle2 } from "lucide-react"

interface Client {
    id: string
    email: string
    firstName: string
    lastName: string
}

const STAT_CARDS = [
    { label: "Total Clients", value: "3", icon: Users, trend: null },
    { label: "Active Progress", value: "2", icon: TrendingUp, trend: null },
    { label: "Completed", value: "1", icon: CheckCircle2, trend: null },
]

export default function AdminDashboard() {
    const [clients, setClients] = useState<Client[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setClients([
            { id: "1", email: "client1@example.com", firstName: "John", lastName: "Doe" },
            { id: "2", email: "client2@example.com", firstName: "Jane", lastName: "Smith" },
            { id: "3", email: "client3@example.com", firstName: "Bob", lastName: "Johnson" },
        ])
        setIsLoading(false)
    }, [])

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {STAT_CARDS.map((stat) => (
                    <Card
                        key={stat.label}
                        className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
                                    {stat.label}
                                </p>
                                <p className="mt-2 text-4xl font-extrabold tracking-tight text-foreground">
                                    {stat.value}
                                </p>
                            </div>
                            <div className="rounded-xl bg-primary/8 p-2.5">
                                <stat.icon className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                        <div
                            className="absolute bottom-0 left-0 h-0.5 w-full"
                            style={{
                                backgroundImage:
                                    "linear-gradient(90deg, var(--primary), transparent)",
                                opacity: 0.3,
                            }}
                        />
                    </Card>
                ))}
            </div>

            {/* Clients table */}
            <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">Clients</h2>
                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
                            {clients.length} total
                        </p>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg border-border/50 text-xs"
                    >
                        View All
                    </Button>
                </div>

                <div className="divide-y divide-border/30">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                            Loading...
                        </div>
                    ) : (
                        clients.map((client) => (
                            <div
                                key={client.id}
                                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-primary/3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold uppercase text-primary">
                                        {client.firstName[0]}
                                        {client.lastName[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {client.firstName} {client.lastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {client.email}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 rounded-lg border-border/50 text-xs"
                                >
                                    View Progress
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    )
}
