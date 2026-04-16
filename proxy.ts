import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export default async function proxy(request: NextRequest) {
    return await proxyHandler(request)
}

export async function proxyHandler(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value
    const { pathname } = request.nextUrl

    // 1. Identify public vs protected paths
    const isPublicPath = pathname === "/login" || pathname === "/signup"
    const isAdminPath = pathname.startsWith("/admin")
    const isDashboardPath = pathname.startsWith("/dashboard")

    // 2. Validate token if present
    let isValid = false
    let userRole: string | null = null
    if (token) {
        try {
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(JWT_SECRET)
            )
            isValid = true
            userRole = (payload as any).role
        } catch (error) {
            isValid = false
        }
    }

    // 3. Redirect logic
    // Protect admin routes
    if (isAdminPath && !isValid) {
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("auth_token") // Cleanup stale token
        return response
    }

    // Only admins can access /admin
    if (isAdminPath && isValid && userRole !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Protect dashboard routes
    if (isDashboardPath && !isValid) {
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("auth_token") // Cleanup stale token
        return response
    }

    // Only clients can access /dashboard
    if (isDashboardPath && isValid && userRole !== "client") {
        return NextResponse.redirect(new URL("/admin", request.url))
    }

    // Redirect from login/signup if already authenticated
    if (isPublicPath && isValid) {
        const redirectPath = userRole === "admin" ? "/admin" : "/dashboard"
        return NextResponse.redirect(new URL(redirectPath, request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/signup"],
}
