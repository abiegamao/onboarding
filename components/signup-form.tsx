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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type SignupValues = {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2: string
    city: string
    stateProvince: string
    zipCode: string
    countryRegion: string
    phoneNumber: string
    email: string
    password: string
    confirmPassword: string
}

const INITIAL_VALUES: SignupValues = {
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    zipCode: "",
    countryRegion: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
}

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [values, setValues] = useState<SignupValues>(INITIAL_VALUES)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    function updateValue(field: keyof SignupValues, value: string) {
        setValues((currentValues) => ({
            ...currentValues,
            [field]: value,
        }))
    }

    function validateStep(currentStep: number) {
        if (currentStep === 1) {
            if (!values.firstName.trim() || !values.lastName.trim()) {
                toast.error("Fill in your name to continue")
                return false
            }
        }

        if (currentStep === 2) {
            if (
                !values.addressLine1.trim() ||
                !values.city.trim() ||
                !values.stateProvince.trim() ||
                !values.zipCode.trim() ||
                !values.countryRegion.trim() ||
                !values.phoneNumber.trim()
            ) {
                toast.error("Fill in contact details to continue")
                return false
            }
        }

        if (currentStep === 3) {
            if (
                !values.email.trim() ||
                !values.password ||
                !values.confirmPassword
            ) {
                toast.error("Fill in account details to continue")
                return false
            }

            if (values.password !== values.confirmPassword) {
                toast.error("Passwords do not match")
                return false
            }
        }

        return true
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (step < 3) {
            if (validateStep(step)) {
                setStep((currentStep) => currentStep + 1)
            }
            return
        }

        if (!validateStep(3)) {
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                body: JSON.stringify({
                    firstName: values.firstName.trim(),
                    lastName: values.lastName.trim(),
                    addressLine1: values.addressLine1.trim(),
                    addressLine2: values.addressLine2.trim(),
                    city: values.city.trim(),
                    stateProvince: values.stateProvince.trim(),
                    zipCode: values.zipCode.trim(),
                    countryRegion: values.countryRegion.trim(),
                    phoneNumber: values.phoneNumber.trim(),
                    email: values.email.trim(),
                    password: values.password,
                }),
                headers: { "Content-Type": "application/json" },
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Signup failed")
            }

            toast.success("Account created! Please sign in.")
            router.push("/login")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const stepTitle =
        step === 1
            ? "About you"
            : step === 2
              ? "Contact details"
              : "Secure your account"

    return (
        <form
            onSubmit={handleSubmit}
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Step {step} of 3: {stepTitle}
                    </p>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3].map((itemStep) => (
                        <div
                            key={itemStep}
                            className={cn(
                                "h-1.5 flex-1 rounded-full transition-colors",
                                step >= itemStep ? "bg-primary" : "bg-border"
                            )}
                        />
                    ))}
                </div>

                {step === 1 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="firstName">
                                First Name
                            </FieldLabel>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="John"
                                value={values.firstName}
                                onChange={(event) =>
                                    updateValue("firstName", event.target.value)
                                }
                                className="h-12 border-border/50 bg-secondary"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="lastName">
                                Last Name
                            </FieldLabel>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Doe"
                                value={values.lastName}
                                onChange={(event) =>
                                    updateValue("lastName", event.target.value)
                                }
                                className="h-12 border-border/50 bg-secondary"
                            />
                        </Field>
                    </div>
                ) : null}

                {step === 2 ? (
                    <>
                        <Field>
                            <FieldLabel htmlFor="addressLine1">
                                Address Line 1
                            </FieldLabel>
                            <Input
                                id="addressLine1"
                                name="addressLine1"
                                type="text"
                                placeholder="5001 Lake Front Dr"
                                value={values.addressLine1}
                                onChange={(event) =>
                                    updateValue(
                                        "addressLine1",
                                        event.target.value
                                    )
                                }
                                className="h-12 border-border/50 bg-secondary"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="addressLine2">
                                Address Line 2
                            </FieldLabel>
                            <Input
                                id="addressLine2"
                                name="addressLine2"
                                type="text"
                                placeholder="Apt G2"
                                value={values.addressLine2}
                                onChange={(event) =>
                                    updateValue(
                                        "addressLine2",
                                        event.target.value
                                    )
                                }
                                className="h-12 border-border/50 bg-secondary"
                            />
                        </Field>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="city">City</FieldLabel>
                                <Input
                                    id="city"
                                    name="city"
                                    type="text"
                                    placeholder="Tallahassee"
                                    value={values.city}
                                    onChange={(event) =>
                                        updateValue("city", event.target.value)
                                    }
                                    className="h-12 border-border/50 bg-secondary"
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="stateProvince">
                                    State / Province
                                </FieldLabel>
                                <Input
                                    id="stateProvince"
                                    name="stateProvince"
                                    type="text"
                                    placeholder="FL"
                                    value={values.stateProvince}
                                    onChange={(event) =>
                                        updateValue(
                                            "stateProvince",
                                            event.target.value
                                        )
                                    }
                                    className="h-12 border-border/50 bg-secondary"
                                />
                            </Field>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="zipCode">
                                    Zip Code
                                </FieldLabel>
                                <Input
                                    id="zipCode"
                                    name="zipCode"
                                    type="text"
                                    placeholder="32303-7173"
                                    value={values.zipCode}
                                    onChange={(event) =>
                                        updateValue(
                                            "zipCode",
                                            event.target.value
                                        )
                                    }
                                    className="h-12 border-border/50 bg-secondary"
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="countryRegion">
                                    Country / Region
                                </FieldLabel>
                                <Input
                                    id="countryRegion"
                                    name="countryRegion"
                                    type="text"
                                    placeholder="US"
                                    value={values.countryRegion}
                                    onChange={(event) =>
                                        updateValue(
                                            "countryRegion",
                                            event.target.value
                                        )
                                    }
                                    className="h-12 border-border/50 bg-secondary"
                                />
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel htmlFor="phoneNumber">
                                Phone Number
                            </FieldLabel>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                placeholder="(555) 123-4567"
                                value={values.phoneNumber}
                                onChange={(event) =>
                                    updateValue(
                                        "phoneNumber",
                                        event.target.value
                                    )
                                }
                                className="h-12 border-border/50 bg-secondary"
                            />
                        </Field>
                    </>
                ) : null}

                {step === 3 ? (
                    <>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                value={values.email}
                                onChange={(event) =>
                                    updateValue("email", event.target.value)
                                }
                                className="h-12 border-border/50 bg-secondary"
                            />
                            <FieldDescription>
                                We&apos;ll use this to contact you. We will not
                                share your email with anyone else.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={values.password}
                                    onChange={(event) =>
                                        updateValue(
                                            "password",
                                            event.target.value
                                        )
                                    }
                                    className="h-12 border-border/50 bg-secondary pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
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
                            <FieldDescription>
                                Must be at least 8 characters long.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirm-password">
                                Confirm Password
                            </FieldLabel>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={values.confirmPassword}
                                    onChange={(event) =>
                                        updateValue(
                                            "confirmPassword",
                                            event.target.value
                                        )
                                    }
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
                            <FieldDescription>
                                Please confirm your password.
                            </FieldDescription>
                        </Field>
                    </>
                ) : null}

                <div className="flex gap-3">
                    {step > 1 ? (
                        <Button
                            className="flex-1 cursor-pointer"
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setStep((currentStep) => currentStep - 1)
                            }
                            disabled={isLoading}
                        >
                            Back
                        </Button>
                    ) : null}
                    <Button
                        className="flex-1 cursor-pointer"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Creating account..."
                            : step < 3
                              ? "Continue"
                              : "Create Account"}
                    </Button>
                </div>
                <Field>
                    <FieldDescription className="px-6 text-center">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="underline underline-offset-4"
                        >
                            Sign in
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}
