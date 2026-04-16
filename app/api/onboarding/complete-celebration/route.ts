import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import OnboardingProfile from "@/models/OnboardingProfile"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export async function POST() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("auth_token")?.value

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        )
        const userId = (payload as any).userId

        await connectDB()
        const user = await User.findById(userId).select("_id")
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        await OnboardingProfile.findOneAndUpdate(
            { userId },
            {
                "status.hasSeenCelebration": true,
                "status.updatedAt": new Date(),
            },
            { upsert: true }
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Celebration completion error:", error)
        return NextResponse.json({ error: "Internal Error" }, { status: 500 })
    }
}
