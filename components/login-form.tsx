"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Login failed")
            }

            toast.success("Welcome back!")

            const redirectPath =
                data.user.role === "admin" ? "/admin" : "/dashboard"
            router.push(redirectPath)
            // keep isLoading=true — spinner holds until page unmounts
        } catch (error: any) {
            toast.error(error.message)
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
                            Signing in...
                        </p>
                    </div>
                </div>
            )}
            <form
                onSubmit={handleSubmit}
                className={cn("flex flex-col gap-6", className)}
                {...props}
            >
                <FieldGroup>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="text-2xl font-bold">
                            Login to your account
                        </h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            className="h-12 border-border/50 bg-secondary"
                        />
                    </Field>
                    <Field>
                        <div className="flex items-center">
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Link
                                href="/forgot-password"
                                className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="h-12 border-border/50 bg-secondary pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                    {showPassword
                                        ? "Hide password"
                                        : "Show password"}
                                </span>
                            </button>
                        </div>
                    </Field>
                    <Field>
                        <Button
                            className="cursor-pointer"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Login"}
                        </Button>
                    </Field>
                    <Field>
                        <FieldDescription className="text-center">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                className="underline underline-offset-4"
                            >
                                Sign up
                            </Link>
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </form>
        </>
    )
}
