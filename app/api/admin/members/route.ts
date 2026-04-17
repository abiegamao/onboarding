import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { requireAdmin } from "@/lib/adminAuth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[A-Za-z][A-Za-z' -]{0,49}$/

export async function GET() {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()

    const members = await User.find({ role: "admin" })
        .select("_id firstName lastName email createdAt")
        .sort({ createdAt: -1 })
        .lean()

    return NextResponse.json({ members })
}

export async function POST(req: Request) {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const firstName = String(body.firstName || "").trim()
    const lastName = String(body.lastName || "").trim()
    const email = String(body.email || "").trim().toLowerCase()
    const password = String(body.password || "")

    if (!firstName || !lastName || !email || !password) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    if (!NAME_REGEX.test(firstName) || !NAME_REGEX.test(lastName)) {
        return NextResponse.json({ error: "Invalid name format" }, { status: 400 })
    }
    if (!EMAIL_REGEX.test(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }
    if (password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }
    if (firstName.length > 50 || lastName.length > 50 || email.length > 254 || password.length > 128) {
        return NextResponse.json({ error: "Field too long" }, { status: 400 })
    }

    await connectDB()

    const existing = await User.findOne({ email })
    if (existing) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    const newAdmin = await User.create({
        firstName,
        lastName,
        email,
        password: hashed,
        role: "admin",
        addressLine1: "N/A",
        city: "N/A",
        stateProvince: "N/A",
        zipCode: "00000",
        countryRegion: "N/A",
        phoneNumber: "0000000000",
    })

    return NextResponse.json(
        {
            member: {
                _id: newAdmin._id,
                firstName: newAdmin.firstName,
                lastName: newAdmin.lastName,
                email: newAdmin.email,
                createdAt: newAdmin.createdAt,
            },
        },
        { status: 201 }
    )
}
