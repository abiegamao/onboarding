import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json()

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        await connectDB()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json({ error: "User exists" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        // Split name into first and last
        const nameParts = name.trim().split(" ")
        const firstName = nameParts[0]
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        })

        await newUser.save()

        return NextResponse.json({ message: "User created" }, { status: 201 })
    } catch (error: any) {
        console.error("Signup error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
