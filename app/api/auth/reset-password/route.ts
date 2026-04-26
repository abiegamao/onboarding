import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import {
    hashVerificationCode,
    isValidEmail,
    normalizeEmail,
} from "@/lib/passwordReset"
import PasswordResetCode from "@/models/PasswordResetCode"
import User from "@/models/User"

const MAX_FAILED_ATTEMPTS = 5

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const email = normalizeEmail(String(body.email || ""))
        const code = String(body.code || "").trim()
        const newPassword = String(body.newPassword || "")

        if (!email || !isValidEmail(email) || !code || !newPassword) {
            return NextResponse.json(
                { error: "Missing or invalid fields" },
                { status: 400 }
            )
        }

        if (!/^\d{6}$/.test(code)) {
            return NextResponse.json(
                { error: "Verification code must be 6 digits" },
                { status: 400 }
            )
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            )
        }

        if (newPassword.length > 128) {
            return NextResponse.json(
                { error: "Password too long" },
                { status: 400 }
            )
        }

        await connectDB()

        const user = await User.findOne({ email }).select("_id")
        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired verification code" },
                { status: 400 }
            )
        }

        const resetRecord = await PasswordResetCode.findOne({
            userId: user._id,
            email,
            expiresAt: { $gt: new Date() },
        }).sort({ createdAt: -1 })

        if (!resetRecord) {
            return NextResponse.json(
                { error: "Invalid or expired verification code" },
                { status: 400 }
            )
        }

        const expectedCodeHash = hashVerificationCode(email, code)

        if (expectedCodeHash !== resetRecord.codeHash) {
            const attempts = resetRecord.attempts + 1
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                await PasswordResetCode.deleteMany({ userId: user._id })
            } else {
                resetRecord.attempts = attempts
                await resetRecord.save()
            }

            return NextResponse.json(
                { error: "Invalid or expired verification code" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)

        await User.findByIdAndUpdate(user._id, { password: hashedPassword })
        await PasswordResetCode.deleteMany({ userId: user._id })

        return NextResponse.json({ message: "Password has been reset" })
    } catch (error: any) {
        console.error("Reset password error:", error)
        return NextResponse.json(
            { error: "Unable to reset password" },
            { status: 500 }
        )
    }
}
