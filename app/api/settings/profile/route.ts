import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[A-Za-z][A-Za-z' -]{0,49}$/

export async function PATCH(req: Request) {
    const auth = await requireAuth()
    if (!auth)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const firstName = String(body.firstName || "").trim()
    const lastName = String(body.lastName || "").trim()
    const email = String(body.email || "")
        .trim()
        .toLowerCase()

    if (!firstName || !lastName || !email) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    if (!NAME_REGEX.test(firstName) || !NAME_REGEX.test(lastName)) {
        return NextResponse.json(
            { error: "Invalid name format" },
            { status: 400 }
        )
    }
    if (!EMAIL_REGEX.test(email)) {
        return NextResponse.json(
            { error: "Invalid email format" },
            { status: 400 }
        )
    }
    if (firstName.length > 50 || lastName.length > 50 || email.length > 254) {
        return NextResponse.json({ error: "Field too long" }, { status: 400 })
    }

    await connectDB()

    const existing = await User.findOne({ email, _id: { $ne: auth.userId } })
    if (existing) {
        return NextResponse.json(
            { error: "Email already in use" },
            { status: 409 }
        )
    }

    const updated = await User.findByIdAndUpdate(
        auth.userId,
        { firstName, lastName, email },
        { new: true, select: "firstName lastName email role" }
    )

    if (!updated)
        return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json({ user: updated })
}
