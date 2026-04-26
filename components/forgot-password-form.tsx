"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type Step = "request" | "reset"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const router = useRouter()

    const [step, setStep] = useState<Step>("request")
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0)

    const trimmedEmail = email.trim().toLowerCase()

    function validateEmail(value: string) {
        return EMAIL_REGEX.test(value)
    }

    useEffect(() => {
        if (resendCooldownSeconds <= 0) return

        const timer = setInterval(() => {
            setResendCooldownSeconds((prev) => Math.max(0, prev - 1))
        }, 1000)

        return () => clearInterval(timer)
    }, [resendCooldownSeconds])

    async function handleRequestCode(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!validateEmail(trimmedEmail)) {
            toast.error("Please enter a valid email")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: trimmedEmail }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(
                    data.error || "Unable to send verification code"
                )
            }

            if (typeof data.resendCooldownSeconds === "number") {
                setResendCooldownSeconds(data.resendCooldownSeconds)
            }

            toast.success(
                data.message ||
                    "If an account exists, we sent a verification code to your email."
            )
            setStep("reset")
        } catch (error: any) {
            toast.error(error.message || "Unable to send verification code")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!validateEmail(trimmedEmail)) {
            toast.error("Please enter a valid email")
            return
        }

        if (!/^\d{6}$/.test(code.trim())) {
            toast.error("Enter the 6-digit verification code")
            return
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: trimmedEmail,
                    code: code.trim(),
                    newPassword,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Unable to reset password")
            }

            toast.success("Password updated. Please sign in.")
            router.push("/login")
        } catch (error: any) {
            toast.error(error.message || "Unable to reset password")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <p className="text-sm text-muted-foreground">
                            {step === "request"
                                ? "Sending code..."
                                : "Resetting password..."}
                        </p>
                    </div>
                </div>
            )}

            <form
                onSubmit={
                    step === "request" ? handleRequestCode : handleResetPassword
                }
                className={cn("flex flex-col gap-6", className)}
                {...props}
            >
                <FieldGroup>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="text-2xl font-bold">Forgot password</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {step === "request"
                                ? "Enter your email to receive a verification code"
                                : "Enter the code from your email and set a new password"}
                        </p>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="m@example.com"
                            required
                            className="h-12 border-border/50 bg-secondary"
                        />
                    </Field>

                    {step === "reset" && (
                        <>
                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="code">
                                        Verification code
                                    </FieldLabel>
                                    <button
                                        type="button"
                                        className="text-sm underline-offset-4 hover:underline"
                                        disabled={
                                            isLoading ||
                                            resendCooldownSeconds > 0
                                        }
                                        onClick={async () => {
                                            if (!validateEmail(trimmedEmail)) {
                                                toast.error(
                                                    "Please enter a valid email"
                                                )
                                                return
                                            }

                                            setIsLoading(true)
                                            try {
                                                const res = await fetch(
                                                    "/api/auth/forgot-password",
                                                    {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type":
                                                                "application/json",
                                                        },
                                                        body: JSON.stringify({
                                                            email: trimmedEmail,
                                                        }),
                                                    }
                                                )
                                                const data = await res.json()
                                                if (!res.ok) {
                                                    throw new Error(
                                                        data.error ||
                                                            "Unable to resend code"
                                                    )
                                                }

                                                if (
                                                    typeof data.resendCooldownSeconds ===
                                                    "number"
                                                ) {
                                                    setResendCooldownSeconds(
                                                        data.resendCooldownSeconds
                                                    )
                                                }
                                                toast.success(
                                                    data.message ||
                                                        "Verification code sent"
                                                )
                                            } catch (error: any) {
                                                toast.error(
                                                    error.message ||
                                                        "Unable to resend code"
                                                )
                                            } finally {
                                                setIsLoading(false)
                                            }
                                        }}
                                    >
                                        {resendCooldownSeconds > 0
                                            ? `Resend in ${resendCooldownSeconds}s`
                                            : "Resend code"}
                                    </button>
                                </div>
                                <Input
                                    id="code"
                                    name="code"
                                    value={code}
                                    onChange={(e) =>
                                        setCode(
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 6)
                                        )
                                    }
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    placeholder="123456"
                                    required
                                    className="h-12 border-border/50 bg-secondary"
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="newPassword">
                                    New password
                                </FieldLabel>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        required
                                        className="h-12 border-border/50 bg-secondary pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNewPassword(!showNewPassword)
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">
                                            {showNewPassword
                                                ? "Hide password"
                                                : "Show password"}
                                        </span>
                                    </button>
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="confirmPassword">
                                    Confirm password
                                </FieldLabel>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        required
                                        className="h-12 border-border/50 bg-secondary pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">
                                            {showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"}
                                        </span>
                                    </button>
                                </div>
                            </Field>

                            <Field>
                                <FieldDescription className="text-xs text-muted-foreground">
                                    Codes expire automatically. If yours
                                    expires, request a new one.
                                </FieldDescription>
                            </Field>
                        </>
                    )}

                    <Field>
                        <Button type="submit" disabled={isLoading}>
                            {step === "request"
                                ? isLoading
                                    ? "Sending code..."
                                    : "Send verification code"
                                : isLoading
                                  ? "Resetting..."
                                  : "Reset password"}
                        </Button>
                    </Field>

                    <Field>
                        <FieldDescription className="text-center">
                            Back to{" "}
                            <Link
                                href="/login"
                                className="underline underline-offset-4"
                            >
                                Login
                            </Link>
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </form>
        </>
    )
}
