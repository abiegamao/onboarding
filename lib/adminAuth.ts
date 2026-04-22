import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export async function requireAdmin(): Promise<{ userId: string } | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    if (!token) return null

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        )
        const userId = (payload as any).userId
        const role = (payload as any).role
        if (!userId || role !== "admin") return null

        return { userId }
    } catch {
        return null
    }
}
