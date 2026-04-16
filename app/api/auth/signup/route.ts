import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import OnboardingProfile from "@/models/OnboardingProfile"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const firstName = String(body.firstName || "").trim()
        const lastName = String(body.lastName || "").trim()
        const addressLine1 = String(body.addressLine1 || "").trim()
        const addressLine2 = String(body.addressLine2 || "").trim()
        const city = String(body.city || "").trim()
        const stateProvince = String(body.stateProvince || "").trim()
        const zipCode = String(body.zipCode || "").trim()
        const countryRegion = String(body.countryRegion || "").trim()
        const phoneNumber = String(body.phoneNumber || "").trim()
        const email = String(body.email || "")
            .trim()
            .toLowerCase()
        const password = String(body.password || "")

        if (
            !firstName ||
            !lastName ||
            !addressLine1 ||
            !city ||
            !stateProvince ||
            !zipCode ||
            !countryRegion ||
            !phoneNumber ||
            !email ||
            !password
        ) {
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
            addressLine1,
            addressLine2: addressLine2 || undefined,
            city,
            stateProvince,
            zipCode,
            countryRegion,
            phoneNumber,
            email,
            password: hashedPassword,
        })

        await newUser.save()
        await OnboardingProfile.create({ userId: newUser._id })

        return NextResponse.json(
            {
                message: "User created",
                user: {
                    id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                },
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Signup error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
