import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export async function requireAdmin(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    const userId = (payload as any).userId
    if (!userId) return null

    await connectDB()
    const user = await User.findById(userId).select("role").lean()
    if (!user || (user as any).role !== "admin") return null

    return { userId }
  } catch {
    return null
  }
}
