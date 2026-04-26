import { createHmac, randomInt } from "crypto"
import resend from "@/lib/resend"

const DEFAULT_TTL_MINUTES = 10
const MIN_TTL_MINUTES = 5
const MAX_TTL_MINUTES = 30
const DEFAULT_RESEND_COOLDOWN_SECONDS = 60
const MIN_RESEND_COOLDOWN_SECONDS = 30
const MAX_RESEND_COOLDOWN_SECONDS = 300

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getCodeSecret() {
    return (
        process.env.PASSWORD_RESET_CODE_SECRET ||
        process.env.JWT_SECRET ||
        "peace-driven-reset-code-secret"
    )
}

export function normalizeEmail(email: string) {
    return email.trim().toLowerCase()
}

export function isValidEmail(email: string) {
    return EMAIL_REGEX.test(email)
}

export function getResetCodeTtlMinutes() {
    const raw = Number(process.env.PASSWORD_RESET_CODE_TTL_MINUTES)
    if (!Number.isFinite(raw)) {
        return DEFAULT_TTL_MINUTES
    }

    return Math.min(MAX_TTL_MINUTES, Math.max(MIN_TTL_MINUTES, raw))
}

export function getResetCodeExpiryDate() {
    const ttlMinutes = getResetCodeTtlMinutes()
    return new Date(Date.now() + ttlMinutes * 60 * 1000)
}

export function getResetCodeCooldownSeconds() {
    const raw = Number(process.env.PASSWORD_RESET_RESEND_COOLDOWN_SECONDS)
    if (!Number.isFinite(raw)) {
        return DEFAULT_RESEND_COOLDOWN_SECONDS
    }

    return Math.min(
        MAX_RESEND_COOLDOWN_SECONDS,
        Math.max(MIN_RESEND_COOLDOWN_SECONDS, raw)
    )
}

export function getResetCodeCooldownDate() {
    const cooldownSeconds = getResetCodeCooldownSeconds()
    return new Date(Date.now() + cooldownSeconds * 1000)
}

export function generateVerificationCode() {
    return String(randomInt(100000, 1000000))
}

export function hashVerificationCode(email: string, code: string) {
    return createHmac("sha256", getCodeSecret())
        .update(`${normalizeEmail(email)}:${code}`)
        .digest("hex")
}

export async function sendPasswordResetCodeEmail(params: {
    email: string
    firstName?: string
    code: string
    expiresInMinutes: number
}) {
    const { email, firstName, code, expiresInMinutes } = params

    const displayName = firstName?.trim() || "there"
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

    const { error } = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: "Password Reset Code",
        html: `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
            <p>Hi ${displayName},</p>
            <p>Use this verification code to reset your password:</p>
            <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:16px 0">${code}</p>
            <p>This code expires in ${expiresInMinutes} minutes.</p>
            <p>If you did not request this, you can safely ignore this email.</p>
        </div>`,
    })

    if (error) {
        throw new Error(error.message || "Failed to send password reset email")
    }
}
