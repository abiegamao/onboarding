import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

async function getUserId() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return (payload as any).userId
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findById(userId)
    
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Progress fetch error:", error)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { currentPhase, currentStep, isCompleted, data } = await req.json()

    await connectDB()
    const update: any = {
      "onboardingStatus.updatedAt": new Date()
    }
    
    if (currentPhase !== undefined) {
      update["onboardingStatus.currentPhase"] = Math.max(1, Math.min(4, currentPhase))
    }
    if (currentStep !== undefined) update["onboardingStatus.currentStep"] = currentStep
    if (isCompleted !== undefined) update["onboardingStatus.isCompleted"] = isCompleted

    // Handle generic data updates (e.g., "connection.triage.neurodiversity")
    if (data && typeof data === "object") {
      Object.entries(data).forEach(([key, value]) => {
        update[key] = value
      })
    }

    const user = await User.findByIdAndUpdate(userId, update, { returnDocument: "after" })
    
    return NextResponse.json(user?.onboardingStatus)
  } catch (error) {
    console.error("Progress update error:", error)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}
