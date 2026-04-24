import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import OnboardingProfile from "@/models/OnboardingProfile"
import { requireAdmin } from "@/lib/adminAuth"
import { withCache } from "@/lib/redis"

export type NotificationType =
    | "new_signup"
    | "pending_approval"
    | "stale_client"
    | "onboarding_complete"

export type NotificationPriority = "high" | "medium" | "info"

export interface AdminNotification {
    id: string
    type: NotificationType
    priority: NotificationPriority
    message: string
    clientName: string
    clientId: string
    timestamp: string
    href: string
}

const STALE_DAYS = 7

export async function GET() {
    const admin = await requireAdmin()
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()

    const notifications = await withCache(
        "admin:notifications",
        30,
        async () => {
            const now = new Date()
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)
            const staleThreshold = new Date(
                now.getTime() - STALE_DAYS * 24 * 60 * 60 * 1000
            )

            const [newSignups, pendingUsers, staleProfiles, completedProfiles] =
                await Promise.all([
                    User.find({ role: "client", createdAt: { $gte: oneDayAgo } })
                        .select("firstName lastName _id createdAt")
                        .sort({ createdAt: -1 })
                        .limit(10)
                        .lean(),
                    User.find({ role: "client", accountStatus: "pending" })
                        .select("firstName lastName _id updatedAt plan")
                        .sort({ updatedAt: -1 })
                        .limit(20)
                        .lean(),
                    OnboardingProfile.find({
                        "status.isCompleted": false,
                        "status.updatedAt": {
                            $exists: true,
                            $lt: staleThreshold,
                        },
                    })
                        .select("userId status.updatedAt")
                        .limit(10)
                        .lean(),
                    OnboardingProfile.find({
                        "status.isCompleted": true,
                        "status.updatedAt": { $gte: twoDaysAgo },
                    })
                        .select("userId status.updatedAt")
                        .sort({ "status.updatedAt": -1 })
                        .limit(10)
                        .lean(),
                ])

            const staleUserIds = staleProfiles.map((p) => p.userId)
            const completedUserIds = completedProfiles.map((p) => p.userId)
            const profileUserIds = [...staleUserIds, ...completedUserIds]

            const profileUsers = profileUserIds.length
                ? await User.find({ _id: { $in: profileUserIds } })
                      .select("firstName lastName _id")
                      .lean()
                : []

            const userMap = new Map(
                profileUsers.map((u) => [u._id.toString(), u])
            )

            const notifs: AdminNotification[] = []
            const newSignupIds = new Set(
                newSignups.map((u) => u._id.toString())
            )

            for (const u of newSignups) {
                notifs.push({
                    id: `signup-${u._id}`,
                    type: "new_signup",
                    priority: "high",
                    message: "New client signed up",
                    clientName: `${u.firstName} ${u.lastName}`,
                    clientId: u._id.toString(),
                    timestamp: (u.createdAt as Date).toISOString(),
                    href: "/admin/clients",
                })
            }

            for (const u of pendingUsers) {
                if (newSignupIds.has(u._id.toString())) continue
                notifs.push({
                    id: `pending-${u._id}`,
                    type: "pending_approval",
                    priority: "high",
                    message: `Awaiting approval${u.plan ? ` — ${u.plan} plan` : ""}`,
                    clientName: `${u.firstName} ${u.lastName}`,
                    clientId: u._id.toString(),
                    timestamp: (u.updatedAt as Date).toISOString(),
                    href: "/admin/clients",
                })
            }

            for (const p of staleProfiles) {
                const u = userMap.get(p.userId.toString())
                if (!u) continue
                notifs.push({
                    id: `stale-${p.userId}`,
                    type: "stale_client",
                    priority: "medium",
                    message: `No activity for ${STALE_DAYS}+ days`,
                    clientName: `${u.firstName} ${u.lastName}`,
                    clientId: p.userId.toString(),
                    timestamp: (p.status.updatedAt as Date).toISOString(),
                    href: "/admin/clients",
                })
            }

            for (const p of completedProfiles) {
                const u = userMap.get(p.userId.toString())
                if (!u) continue
                notifs.push({
                    id: `complete-${p.userId}`,
                    type: "onboarding_complete",
                    priority: "info",
                    message: "Completed onboarding journey",
                    clientName: `${u.firstName} ${u.lastName}`,
                    clientId: p.userId.toString(),
                    timestamp: (p.status.updatedAt as Date).toISOString(),
                    href: "/admin/clients",
                })
            }

            notifs.sort(
                (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
            )

            return notifs
        }
    )

    return NextResponse.json({
        notifications,
        total: (notifications as AdminNotification[]).length,
    })
}
