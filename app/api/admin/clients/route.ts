import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import OnboardingProfile from "@/models/OnboardingProfile"
import { requireAdmin } from "@/lib/adminAuth"

const STEPS = ["1A","1B","1C","1D","1E","1F","2A","2B","2C","3A","3B","3C","3D","3E","4A","4B","4C"]
const STALE_DAYS = 7

export async function GET(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await connectDB()

  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")))
  const phase = searchParams.get("phase")
  const staleOnly = searchParams.get("stale") === "true"
  const search = searchParams.get("search") || ""

  const now = new Date()
  const staleThreshold = new Date(now.getTime() - STALE_DAYS * 24 * 60 * 60 * 1000)

  const userQuery: Record<string, unknown> = { role: "client" }
  if (search) {
    const regex = new RegExp(search, "i")
    userQuery.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }]
  }

  const allUsers = await User.find(userQuery).select("_id firstName lastName email createdAt").lean()
  const userIds = allUsers.map((u) => u._id)

  const profileQuery: Record<string, unknown> = { userId: { $in: userIds } }
  if (phase === "completed") {
    profileQuery["status.isCompleted"] = true
  } else if (phase && ["1", "2", "3", "4"].includes(phase)) {
    profileQuery["status.isCompleted"] = false
    profileQuery["status.currentPhase"] = parseInt(phase)
  }
  if (staleOnly) {
    profileQuery["status.isCompleted"] = false
    profileQuery["status.updatedAt"] = { $lt: staleThreshold }
  }

  const total = await OnboardingProfile.countDocuments(profileQuery)
  const profiles = await OnboardingProfile.find(profileQuery)
    .select("userId status")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  const userMap = Object.fromEntries(allUsers.map((u) => [u._id.toString(), u]))

  const clients = profiles.map((p) => {
    const user = userMap[p.userId.toString()]
    const stepIdx = STEPS.indexOf(p.status.currentStep)
    const progress = p.status.isCompleted ? 100 : Math.round((stepIdx / STEPS.length) * 100)
    const isStale =
      !p.status.isCompleted &&
      p.status.updatedAt &&
      new Date(p.status.updatedAt) < staleThreshold

    return {
      id: p.userId.toString(),
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      currentPhase: p.status.currentPhase,
      currentStep: p.status.currentStep,
      progress,
      isCompleted: p.status.isCompleted,
      isStale: !!isStale,
      lastActive: p.status.updatedAt || null,
      joinedAt: user?.createdAt || null,
    }
  })

  return NextResponse.json({
    clients,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
