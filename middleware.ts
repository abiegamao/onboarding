import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Get token from cookies
    const token = request.cookies.get("auth_token")?.value

    // Protect admin routes
    if (pathname.startsWith("/dashboard/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url))
        }

        try {
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(JWT_SECRET)
            )

            const role = (payload as any).role

            // Only admins can access admin routes
            if (role !== "admin") {
                return NextResponse.redirect(
                    new URL("/dashboard/onboarding", request.url)
                )
            }
        } catch (error) {
            console.error("Token verification error:", error)
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    // Protect onboarding routes
    if (pathname.startsWith("/dashboard/onboarding")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url))
        }

        try {
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(JWT_SECRET)
            )

            const role = (payload as any).role

            // Only clients can access onboarding routes
            if (role !== "client") {
                return NextResponse.redirect(
                    new URL("/dashboard/admin", request.url)
                )
            }
        } catch (error) {
            console.error("Token verification error:", error)
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    // Protect base dashboard route - redirect to specific dashboard based on role
    if (pathname === "/dashboard") {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url))
        }

        try {
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(JWT_SECRET)
            )

            const role = (payload as any).role
            const redirectPath =
                role === "admin" ? "/dashboard/admin" : "/dashboard/onboarding"
            return NextResponse.redirect(new URL(redirectPath, request.url))
        } catch (error) {
            console.error("Token verification error:", error)
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*"],
}
