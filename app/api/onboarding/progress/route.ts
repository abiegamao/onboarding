import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import OnboardingProfile from "@/models/OnboardingProfile"
import redis, { withCache } from "@/lib/redis"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

async function getUserId() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) return null

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        )
        return (payload as any).userId
    } catch {
        return null
    }
}

async function getOrCreateProfile(userId: string) {
    const existing = await OnboardingProfile.findOne({ userId })
    if (existing) return existing

    return OnboardingProfile.create({ userId })
}

function mapUpdateKeys(data: Record<string, unknown>) {
    const mapped: Record<string, unknown> = {}

    Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith("onboardingStatus.")) {
            mapped[key.replace("onboardingStatus.", "status.")] = value
            return
        }

        mapped[key] = value
    })

    return mapped
}

export async function GET() {
    try {
        const userId = await getUserId()
        if (!userId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        await connectDB()
        const user = await User.findById(userId).select("_id")

        if (!user)
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )

        const data = await withCache(
            `onboarding:progress:${userId}`,
            30,
            async () => {
                const profile = await getOrCreateProfile(userId)
                return {
                    onboardingStatus: profile.status,
                    connection: profile.connection,
                    awareness: profile.awareness,
                    stabilization: profile.stabilization,
                    activation: profile.activation,
                }
            }
        )

        return NextResponse.json(data)
    } catch (error) {
        console.error("Progress fetch error:", error)
        return NextResponse.json({ error: "Internal Error" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const userId = await getUserId()
        if (!userId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { currentPhase, currentStep, isCompleted, data } =
            await req.json()

        await connectDB()
        const user = await User.findById(userId).select("_id")
        if (!user)
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )

        const update: any = {
            "status.updatedAt": new Date(),
        }

        if (currentPhase !== undefined) {
            update["status.currentPhase"] = Math.max(
                1,
                Math.min(4, currentPhase)
            )
        }
        if (currentStep !== undefined)
            update["status.currentStep"] = currentStep
        if (isCompleted !== undefined)
            update["status.isCompleted"] = isCompleted

        // Support dot-path payloads from UI while remapping legacy onboardingStatus paths.
        if (data && typeof data === "object") {
            const mappedData = mapUpdateKeys(data as Record<string, unknown>)
            Object.entries(mappedData).forEach(([key, value]) => {
                update[key] = value
            })
        }

        const profile = await OnboardingProfile.findOneAndUpdate(
            { userId },
            update,
            { returnDocument: "after", upsert: true }
        )

        await redis.del(`onboarding:progress:${userId}`)

        return NextResponse.json(profile?.status)
    } catch (error) {
        console.error("Progress update error:", error)
        return NextResponse.json({ error: "Internal Error" }, { status: 500 })
    }
}
