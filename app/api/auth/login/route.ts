import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { cookies } from "next/headers"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            )
        }

        await connectDB()

        const user = await User.findOne({ email })
        if (!user || !user.password) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            )
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            )
        }

        const token = await new SignJWT({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(new TextEncoder().encode(JWT_SECRET))

        const cookieStore = await cookies()
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        })

        return NextResponse.json({
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        })
    } catch (error: any) {
        console.error("Login error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
