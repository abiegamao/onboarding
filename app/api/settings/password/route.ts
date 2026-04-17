import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { requireAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function PATCH(req: Request) {
    const auth = await requireAuth()
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const currentPassword = String(body.currentPassword || "")
    const newPassword = String(body.newPassword || "")

    if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    if (newPassword.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }
    if (newPassword.length > 128) {
        return NextResponse.json({ error: "Password too long" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findById(auth.userId).select("password")
    if (!user || !user.password) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await User.findByIdAndUpdate(auth.userId, { password: hashed })

    return NextResponse.json({ message: "Password updated" })
}
