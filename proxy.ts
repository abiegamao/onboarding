import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value
    const { pathname } = request.nextUrl

    // 1. Identify public vs protected paths
    const isPublicPath = pathname === "/login" || pathname === "/signup"
    const isProtectedPath = pathname.startsWith("/dashboard")

    // 2. Validate token if present
    let isValid = false
    if (token) {
        try {
            await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
            isValid = true
        } catch (error) {
            isValid = false
        }
    }

    // 3. Redirect logic
    if (isProtectedPath && !isValid) {
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("auth_token") // Cleanup stale token
        return response
    }

    if (isPublicPath && isValid) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // 4. Manual 404 handling for specific non-existent paths if needed
    // (Next.js handles most via filesystem routing)

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
}
