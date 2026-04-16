import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import OnboardingProfile from "@/models/OnboardingProfile"

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, password } = await req.json()

        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            )
        }

        await connectDB()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json({ error: "User exists" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        })

        await newUser.save()
        await OnboardingProfile.create({ userId: newUser._id })

        return NextResponse.json({ message: "User created" }, { status: 201 })
    } catch (error: any) {
        console.error("Signup error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
