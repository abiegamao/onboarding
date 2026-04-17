"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    User,
    Lock,
    Users,
    Plus,
    Trash2,
    Check,
    AlertCircle,
    Eye,
    EyeOff,
    Loader2,
    Shield,
} from "lucide-react"

type Tab = "account" | "security" | "members"

interface AdminMember {
    _id: string
    firstName: string
    lastName: string
    email: string
    createdAt: string
}

interface CurrentUser {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
}

function SectionHeader({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType
    title: string
    description: string
}) {
    return (
        <div className="flex items-start gap-4 border-b border-[#b6954a]/15 pb-6">
            <div className="rounded-xl bg-gradient-to-br from-[#b6954a]/15 to-[#b6954a]/5 p-3 ring-1 ring-[#b6954a]/10">
                <Icon className="h-5 w-5 text-[#b6954a]" />
            </div>
            <div>
                <h2 className="text-base font-semibold text-foreground">
                    {title}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    )
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
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${type === "success" ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"}`}
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
            const res = await fetch("/api/admin/settings/profile", {
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
        <Card className="rounded-2xl border border-[#b6954a]/20 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <SectionHeader
                icon={User}
                title="Account Information"
                description="Update your name and email address"
            />
            <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="firstName"
                            className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase"
                        >
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="border-[#b6954a]/20 bg-background/50 focus:border-[#b6954a]/50 focus:ring-[#b6954a]/20"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="lastName"
                            className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase"
                        >
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="border-[#b6954a]/20 bg-background/50 focus:border-[#b6954a]/50 focus:ring-[#b6954a]/20"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label
                        htmlFor="email"
                        className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase"
                    >
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-[#b6954a]/20 bg-background/50 focus:border-[#b6954a]/50 focus:ring-[#b6954a]/20"
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
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-[#b6954a] text-white hover:bg-[#d6b56c] disabled:opacity-50"
                    >
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
            const res = await fetch("/api/admin/settings/password", {
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
        <Card className="rounded-2xl border border-[#b6954a]/20 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <SectionHeader
                icon={Lock}
                title="Security"
                description="Change your account password"
            />
            <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="space-y-2">
                    <Label
                        htmlFor="currentPassword"
                        className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase"
                    >
                        Current Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="currentPassword"
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="border-[#b6954a]/20 bg-background/50 pr-10 focus:border-[#b6954a]/50 focus:ring-[#b6954a]/20"
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
                        className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase"
                    >
                        New Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border-[#b6954a]/20 bg-background/50 pr-10 focus:border-[#b6954a]/50 focus:ring-[#b6954a]/20"
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
                        className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase"
                    >
                        Confirm New Password
                    </Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border-[#b6954a]/20 bg-background/50 focus:border-[#b6954a]/50 focus:ring-[#b6954a]/20"
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
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-[#b6954a] text-white hover:bg-[#d6b56c] disabled:opacity-50"
                    >
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

function CreateAdminDialog({
    open,
    onOpenChange,
    onCreated,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    onCreated: () => void
}) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [creating, setCreating] = useState(false)
    const [formStatus, setFormStatus] = useState<{
        type: "success" | "error"
        message: string
    } | null>(null)

    function reset() {
        setFirstName("")
        setLastName("")
        setEmail("")
        setPassword("")
        setFormStatus(null)
    }

    function handleOpenChange(v: boolean) {
        if (!v) reset()
        onOpenChange(v)
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        setCreating(true)
        setFormStatus(null)
        try {
            const res = await fetch("/api/admin/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
            })
            const data = await res.json()
            if (!res.ok) {
                setFormStatus({
                    type: "error",
                    message: data.error ?? "Failed to create admin",
                })
            } else {
                reset()
                onOpenChange(false)
                onCreated()
            }
        } catch {
            setFormStatus({ type: "error", message: "Network error" })
        } finally {
            setCreating(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="border-[#b6954a]/20 bg-card sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                        <Shield className="h-4 w-4 text-[#b6954a]" />
                        New Admin
                    </DialogTitle>
                </DialogHeader>
                <form
                    id="create-admin-form"
                    onSubmit={handleCreate}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                                First Name
                            </Label>
                            <Input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="border-[#b6954a]/20 bg-background/50 focus:border-[#b6954a]/50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                                Last Name
                            </Label>
                            <Input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="border-[#b6954a]/20 bg-background/50 focus:border-[#b6954a]/50"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                            Email
                        </Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-[#b6954a]/20 bg-background/50 focus:border-[#b6954a]/50"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                            Password
                        </Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-[#b6954a]/20 bg-background/50 focus:border-[#b6954a]/50"
                            minLength={8}
                            required
                        />
                        <p className="text-xs text-muted-foreground/50">
                            Minimum 8 characters
                        </p>
                    </div>
                    {formStatus && (
                        <StatusMessage
                            type={formStatus.type}
                            message={formStatus.message}
                        />
                    )}
                </form>
                <DialogFooter>
                    <Button
                        type="submit"
                        form="create-admin-form"
                        disabled={creating}
                        className="bg-[#b6954a] text-white hover:bg-[#d6b56c] disabled:opacity-50"
                    >
                        {creating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                        <span className="ml-2">
                            {creating ? "Creating…" : "Create Admin"}
                        </span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function MembersTab({ currentUserId }: { currentUserId: string }) {
    const [members, setMembers] = useState<AdminMember[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [listError, setListError] = useState<string | null>(null)

    async function loadMembers() {
        setLoading(true)
        setListError(null)
        try {
            const res = await fetch("/api/admin/members")
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            setMembers(data.members)
        } catch (err: any) {
            setListError(err.message ?? "Failed to load members")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadMembers()
    }, [])

    async function handleDelete(id: string) {
        setDeleting(id)
        try {
            const res = await fetch(`/api/admin/members/${id}`, {
                method: "DELETE",
            })
            const data = await res.json()
            if (!res.ok) {
                alert(data.error ?? "Failed to remove admin")
            } else {
                setMembers((prev) => prev.filter((m) => m._id !== id))
            }
        } catch {
            alert("Network error")
        } finally {
            setDeleting(null)
        }
    }

    return (
        <>
            <CreateAdminDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onCreated={loadMembers}
            />
            <Card className="rounded-2xl border border-[#b6954a]/20 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-between border-b border-[#b6954a]/15 pb-6">
                    <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-gradient-to-br from-[#b6954a]/15 to-[#b6954a]/5 p-3 ring-1 ring-[#b6954a]/10">
                            <Users className="h-5 w-5 text-[#b6954a]" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                Admin Members
                            </h2>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Manage admin accounts
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setDialogOpen(true)}
                        size="sm"
                        className="bg-[#b6954a] text-white hover:bg-[#d6b56c]"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="ml-2">Add Admin</span>
                    </Button>
                </div>

                <div className="mt-6 space-y-2">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-[#b6954a]" />
                        </div>
                    ) : listError ? (
                        <StatusMessage type="error" message={listError} />
                    ) : members.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No admin members found
                        </p>
                    ) : (
                        members.map((m) => (
                            <div
                                key={m._id}
                                className="group flex items-center justify-between rounded-xl border border-[#b6954a]/10 bg-background/30 px-4 py-3 transition-colors hover:border-[#b6954a]/20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#b6954a]/20 to-[#b6954a]/5 ring-1 ring-[#b6954a]/15">
                                        <span className="text-xs font-bold text-[#d6b56c]">
                                            {m.firstName[0]}
                                            {m.lastName[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {m.firstName} {m.lastName}
                                            {m._id === currentUserId && (
                                                <span className="ml-2 rounded-full bg-[#b6954a]/15 px-2 py-0.5 font-mono text-[10px] tracking-wider text-[#b6954a] uppercase">
                                                    You
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {m.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 rounded-full bg-[#b6954a]/10 px-2.5 py-1 ring-1 ring-[#b6954a]/15">
                                        <Shield className="h-3 w-3 text-[#b6954a]" />
                                        <span className="font-mono text-[9px] tracking-wider text-[#b6954a] uppercase">
                                            Admin
                                        </span>
                                    </div>
                                    {m._id !== currentUserId && (
                                        <button
                                            onClick={() => handleDelete(m._id)}
                                            disabled={deleting === m._id}
                                            className="rounded-lg p-1.5 text-muted-foreground/40 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                                            title="Remove admin"
                                        >
                                            {deleting === m._id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </>
    )
}

export default function SettingsPage() {
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
        { id: "members", label: "Members", icon: Users },
    ]

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Settings
                </h1>
                <p className="mt-1 font-mono text-[10px] tracking-[0.25em] text-[#b6954a]/70 uppercase">
                    Manage your account and admin access
                </p>
            </div>

            <div className="flex w-fit gap-1 rounded-xl border border-[#b6954a]/15 bg-card p-1.5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                                ? "bg-gradient-to-r from-[#b6954a]/15 to-transparent text-[#d6b56c] shadow-[inset_2px_0_0_#d6b56c] ring-1 ring-[#b6954a]/20"
                                : "text-muted-foreground hover:bg-[#b6954a]/5 hover:text-foreground"
                        }`}
                    >
                        <tab.icon
                            className={`h-4 w-4 ${activeTab === tab.id ? "text-[#d6b56c]" : ""}`}
                        />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "account" && <AccountTab user={currentUser} />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "members" && (
                <MembersTab currentUserId={currentUser?.id ?? ""} />
            )}
        </div>
    )
}
