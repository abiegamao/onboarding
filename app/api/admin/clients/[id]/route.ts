import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import OnboardingProfile from "@/models/OnboardingProfile"
import { requireAdmin } from "@/lib/adminAuth"

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin()
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()

    const { id } = await params

    const [user, profile] = await Promise.all([
        User.findById(id).select("-password").lean(),
        OnboardingProfile.findOne({ userId: id }).lean(),
    ])

    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

    return NextResponse.json({ user, profile })
}
