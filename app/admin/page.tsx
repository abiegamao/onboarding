"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Client {
    id: string
    email: string
    firstName: string
    lastName: string
}

export default function AdminDashboard() {
    const [clients, setClients] = useState<Client[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Dummy data for now
        setClients([
            {
                id: "1",
                email: "client1@example.com",
                firstName: "John",
                lastName: "Doe",
            },
            {
                id: "2",
                email: "client2@example.com",
                firstName: "Jane",
                lastName: "Smith",
            },
            {
                id: "3",
                email: "client3@example.com",
                firstName: "Bob",
                lastName: "Johnson",
            },
        ])
        setIsLoading(false)
    }, [])

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="mt-2 text-muted-foreground">
                    Manage clients and track onboarding progress
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="p-6">
                    <div className="text-sm font-medium text-muted-foreground">
                        Total Clients
                    </div>
                    <div className="mt-2 text-3xl font-bold">
                        {clients.length}
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="text-sm font-medium text-muted-foreground">
                        Active Progress
                    </div>
                    <div className="mt-2 text-3xl font-bold">2</div>
                </Card>
                <Card className="p-6">
                    <div className="text-sm font-medium text-muted-foreground">
                        Completed
                    </div>
                    <div className="mt-2 text-3xl font-bold">1</div>
                </Card>
            </div>

            <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Clients</h2>
                {isLoading ? (
                    <div className="py-8 text-center text-muted-foreground">
                        Loading...
                    </div>
                ) : (
                    <div className="space-y-3">
                        {clients.map((client) => (
                            <div
                                key={client.id}
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div>
                                    <p className="font-medium">
                                        {client.firstName} {client.lastName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {client.email}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    View Progress
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}
