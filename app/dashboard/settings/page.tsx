"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    User,
    Lock,
    Check,
    AlertCircle,
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react"

type Tab = "account" | "security"

interface CurrentUser {
    firstName: string
    lastName: string
    email: string
}

function StatusMessage({
    type,
    message,
}: {
    type: "success" | "error"
    message: string
}) {
    return (
        <div
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${type === "success" ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20" : "bg-destructive/10 text-destructive ring-1 ring-destructive/20"}`}
        >
            {type === "success" ? (
                <Check className="h-4 w-4 shrink-0" />
            ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            {message}
        </div>
    )
}

function AccountTab({ user }: { user: CurrentUser | null }) {
    const [firstName, setFirstName] = useState(user?.firstName ?? "")
    const [lastName, setLastName] = useState(user?.lastName ?? "")
    const [email, setEmail] = useState(user?.email ?? "")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<{
        type: "success" | "error"
        message: string
    } | null>(null)

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName)
            setLastName(user.lastName)
            setEmail(user.email)
        }
    }, [user])

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setStatus(null)
        try {
            const res = await fetch("/api/settings/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email }),
            })
            const data = await res.json()
            if (!res.ok) {
                setStatus({
                    type: "error",
                    message: data.error ?? "Failed to update profile",
                })
            } else {
                setStatus({
                    type: "success",
                    message: "Profile updated successfully",
                })
            }
        } catch {
            setStatus({ type: "error", message: "Network error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="rounded-2xl border border-primary/15 bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4 border-b border-primary/10 pb-6">
                <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/10">
                    <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-base font-semibold">
                        Account Information
                    </h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Update your name and email address
                    </p>
                </div>
            </div>
            <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="firstName"
                            className="text-xs font-medium text-muted-foreground"
                        >
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="lastName"
                            className="text-xs font-medium text-muted-foreground"
                        >
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label
                        htmlFor="email"
                        className="text-xs font-medium text-muted-foreground"
                    >
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {status && (
                    <StatusMessage
                        type={status.type}
                        message={status.message}
                    />
                )}
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Check className="h-4 w-4" />
                        )}
                        <span className="ml-2">
                            {loading ? "Saving…" : "Save Changes"}
                        </span>
                    </Button>
                </div>
            </form>
        </Card>
    )
}

function SecurityTab() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<{
        type: "success" | "error"
        message: string
    } | null>(null)

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setStatus({ type: "error", message: "New passwords do not match" })
            return
        }
        setLoading(true)
        setStatus(null)
        try {
            const res = await fetch("/api/settings/password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            })
            const data = await res.json()
            if (!res.ok) {
                setStatus({
                    type: "error",
                    message: data.error ?? "Failed to update password",
                })
            } else {
                setStatus({
                    type: "success",
                    message: "Password updated successfully",
                })
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            }
        } catch {
            setStatus({ type: "error", message: "Network error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="rounded-2xl border border-primary/15 bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4 border-b border-primary/10 pb-6">
                <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/10">
                    <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-base font-semibold">Security</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Change your account password
                    </p>
                </div>
            </div>
            <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="space-y-2">
                    <Label
                        htmlFor="currentPassword"
                        className="text-xs font-medium text-muted-foreground"
                    >
                        Current Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="currentPassword"
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent((v) => !v)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                        >
                            {showCurrent ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label
                        htmlFor="newPassword"
                        className="text-xs font-medium text-muted-foreground"
                    >
                        New Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pr-10"
                            minLength={8}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew((v) => !v)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                        >
                            {showNew ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground/50">
                        Minimum 8 characters
                    </p>
                </div>
                <div className="space-y-2">
                    <Label
                        htmlFor="confirmPassword"
                        className="text-xs font-medium text-muted-foreground"
                    >
                        Confirm New Password
                    </Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {status && (
                    <StatusMessage
                        type={status.type}
                        message={status.message}
                    />
                )}
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Lock className="h-4 w-4" />
                        )}
                        <span className="ml-2">
                            {loading ? "Updating…" : "Update Password"}
                        </span>
                    </Button>
                </div>
            </form>
        </Card>
    )
}

export default function ClientSettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("account")
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

    useEffect(() => {
        fetch("/api/auth/me")
            .then((r) => r.json())
            .then((data) => {
                if (data.user) setCurrentUser(data.user)
            })
    }, [])

    const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: "account", label: "Account", icon: User },
        { id: "security", label: "Security", icon: Lock },
    ]

    return (
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your account and security
                </p>
            </div>

            <div className="mb-6 flex w-fit gap-1 rounded-xl border border-primary/15 bg-card p-1.5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                                ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                        }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "account" && <AccountTab user={currentUser} />}
            {activeTab === "security" && <SecurityTab />}
        </div>
    )
}
