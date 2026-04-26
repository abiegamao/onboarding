import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import {
    getResetCodeCooldownDate,
    getResetCodeCooldownSeconds,
    generateVerificationCode,
    getResetCodeExpiryDate,
    getResetCodeTtlMinutes,
    hashVerificationCode,
    isValidEmail,
    normalizeEmail,
    sendPasswordResetCodeEmail,
} from "@/lib/passwordReset"
import PasswordResetCode from "@/models/PasswordResetCode"
import User from "@/models/User"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const email = normalizeEmail(String(body.email || ""))

        if (!email || !isValidEmail(email)) {
            return NextResponse.json(
                { error: "Valid email is required" },
                { status: 400 }
            )
        }

        await connectDB()

        const resendCooldownSeconds = getResetCodeCooldownSeconds()

        const user = await User.findOne({ email }).select("_id email firstName")

        // Always return a generic success response to avoid account enumeration.
        if (!user) {
            return NextResponse.json({
                message:
                    "If an account with that email exists, a verification code has been sent.",
                resendCooldownSeconds,
            })
        }

        const latestResetCode = await PasswordResetCode.findOne({
            userId: user._id,
            email,
        })
            .select("resendAvailableAt createdAt")
            .sort({ createdAt: -1 })

        if (latestResetCode) {
            const fallbackAvailableAt = latestResetCode.createdAt
                ? new Date(
                      latestResetCode.createdAt.getTime() +
                          resendCooldownSeconds * 1000
                  )
                : new Date(0)

            const resendAvailableAt =
                latestResetCode.resendAvailableAt || fallbackAvailableAt

            if (resendAvailableAt > new Date()) {
                return NextResponse.json({
                    message:
                        "If an account with that email exists, a verification code has been sent.",
                    resendCooldownSeconds,
                })
            }
        }

        const code = generateVerificationCode()
        const codeHash = hashVerificationCode(email, code)
        const expiresAt = getResetCodeExpiryDate()
        const resendAvailableAt = getResetCodeCooldownDate()
        const expiresInMinutes = getResetCodeTtlMinutes()

        await PasswordResetCode.deleteMany({ userId: user._id })

        await PasswordResetCode.create({
            userId: user._id,
            email,
            codeHash,
            expiresAt,
            resendAvailableAt,
        })

        await sendPasswordResetCodeEmail({
            email,
            firstName: user.firstName,
            code,
            expiresInMinutes,
        })

        return NextResponse.json({
            message:
                "If an account with that email exists, a verification code has been sent.",
            resendCooldownSeconds,
        })
    } catch (error: any) {
        console.error("Forgot password error:", error)
        return NextResponse.json(
            { error: "Unable to process forgot password request" },
            { status: 500 }
        )
    }
}
