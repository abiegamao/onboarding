import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import OnboardingProfile from "@/models/OnboardingProfile"
import { requireAdmin } from "@/lib/adminAuth"

const STEPS = [
    "1A","1B","1C","1D","1E","1F",
    "2A","2B","2C",
    "3A","3B","3C","3D","3E",
    "4A","4B","4C",
]
const STALE_DAYS = 7

export async function GET(req: Request) {
    const auth = await requireAdmin()
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get("page") ?? 1))
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 10)))
    const search = searchParams.get("search")?.trim() ?? ""
    const status = searchParams.get("status") ?? ""
    const plan = searchParams.get("plan") ?? ""
    const staleOnly = searchParams.get("stale") === "true"
    const sortField = searchParams.get("sortField") ?? ""
    const sortDir = searchParams.get("sortDir") === "desc" ? -1 : 1

    await connectDB()

    const staleThreshold = new Date(Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000)

    const query: any = { role: "client" }
    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ]
    }
    if (status) query.accountStatus = status
    if (plan === "none") query.plan = { $in: [null, undefined] }
    else if (plan) query.plan = plan

    if (staleOnly) {
        const staleProfiles = await OnboardingProfile.find({
            "status.isCompleted": false,
            "status.updatedAt": { $lt: staleThreshold },
        }).select("userId").lean()
        query._id = { $in: (staleProfiles as any[]).map((p) => p.userId) }
    }

    const total = await User.countDocuments(query)
    const users = await User.find(query)
        .select("firstName lastName email accountStatus plan createdAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const userIds = (users as any[]).map((u) => u._id)
    const profiles = await OnboardingProfile.find({ userId: { $in: userIds } })
        .select("userId status")
        .lean()

    const profileMap = Object.fromEntries(
        (profiles as any[]).map((p) => [p.userId.toString(), p])
    )

    let clients = (users as any[]).map((u) => {
        const profile = profileMap[u._id.toString()]
        const stepIdx = profile ? STEPS.indexOf(profile.status.currentStep) : -1
        const progress = profile
            ? profile.status.isCompleted ? 100 : Math.max(0, Math.round((stepIdx / STEPS.length) * 100))
            : 0
        const isStale = profile
            ? !profile.status.isCompleted && !!profile.status.updatedAt && new Date(profile.status.updatedAt) < staleThreshold
            : false

        return {
            id: u._id.toString(),
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            accountStatus: u.accountStatus,
            plan: u.plan ?? null,
            joinedAt: u.createdAt?.toISOString() ?? null,
            progress,
            currentPhase: profile?.status.isCompleted ? "completed" : (profile?.status.currentPhase ?? null),
            isCompleted: profile?.status.isCompleted ?? false,
            isStale: !!isStale,
            lastActive: profile?.status.updatedAt?.toISOString() ?? null,
        }
    })

    if (sortField) {
        clients.sort((a, b) => {
            let av: any, bv: any
            if (sortField === "name") { av = `${a.firstName} ${a.lastName}`; bv = `${b.firstName} ${b.lastName}` }
            else if (sortField === "progress") { av = a.progress; bv = b.progress }
            else if (sortField === "lastActive") { av = a.lastActive ?? ""; bv = b.lastActive ?? "" }
            else return 0
            if (av < bv) return -1 * sortDir
            if (av > bv) return 1 * sortDir
            return 0
        })
    }

    return NextResponse.json({
        clients,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
}
