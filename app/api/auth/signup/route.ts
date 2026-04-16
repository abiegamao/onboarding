import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import OnboardingProfile from "@/models/OnboardingProfile"

const FIELD_LIMITS = {
    firstName: 50,
    lastName: 50,
    addressLine1: 120,
    addressLine2: 120,
    city: 60,
    stateProvince: 60,
    zipCode: 20,
    countryRegion: 60,
    phoneNumber: 20,
    email: 254,
    password: 128,
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[A-Za-z][A-Za-z' -]{0,49}$/
const LOCATION_REGEX = /^[A-Za-z][A-Za-z .'-]{0,59}$/
const PHONE_REGEX = /^[+]?[0-9()\-\s]{7,20}$/
const ZIP_REGEX = /^[A-Za-z0-9\-\s]{3,20}$/

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

        if (
            firstName.length > FIELD_LIMITS.firstName ||
            lastName.length > FIELD_LIMITS.lastName ||
            addressLine1.length > FIELD_LIMITS.addressLine1 ||
            addressLine2.length > FIELD_LIMITS.addressLine2 ||
            city.length > FIELD_LIMITS.city ||
            stateProvince.length > FIELD_LIMITS.stateProvince ||
            zipCode.length > FIELD_LIMITS.zipCode ||
            countryRegion.length > FIELD_LIMITS.countryRegion ||
            phoneNumber.length > FIELD_LIMITS.phoneNumber ||
            email.length > FIELD_LIMITS.email ||
            password.length > FIELD_LIMITS.password
        ) {
            return NextResponse.json(
                { error: "One or more fields are too long" },
                { status: 400 }
            )
        }

        if (!NAME_REGEX.test(firstName) || !NAME_REGEX.test(lastName)) {
            return NextResponse.json(
                { error: "Invalid name format" },
                { status: 400 }
            )
        }

        if (
            !LOCATION_REGEX.test(city) ||
            !LOCATION_REGEX.test(stateProvince) ||
            !LOCATION_REGEX.test(countryRegion)
        ) {
            return NextResponse.json(
                { error: "Invalid location format" },
                { status: 400 }
            )
        }

        if (!ZIP_REGEX.test(zipCode)) {
            return NextResponse.json(
                { error: "Invalid zip/postal code" },
                { status: 400 }
            )
        }

        if (!PHONE_REGEX.test(phoneNumber)) {
            return NextResponse.json(
                { error: "Invalid phone number" },
                { status: 400 }
            )
        }

        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
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
