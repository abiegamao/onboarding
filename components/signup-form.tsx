"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"

type SignupValues = {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2: string
    city: string
    stateProvince: string
    zipCode: string
    countryRegion: string
    phoneDialCode: string
    phoneNumber: string
    email: string
    password: string
    confirmPassword: string
}

type CountryOption = {
    name: string
    code: string
    phoneCode: string
    flag: string
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
    phoneDialCode: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
}

const FIELD_LIMITS: Record<keyof SignupValues, number> = {
    firstName: 50,
    lastName: 50,
    addressLine1: 120,
    addressLine2: 120,
    city: 60,
    stateProvince: 60,
    zipCode: 20,
    countryRegion: 60,
    phoneDialCode: 5,
    phoneNumber: 15,
    email: 254,
    password: 128,
    confirmPassword: 128,
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[A-Za-z][A-Za-z' -]{0,49}$/
const LOCATION_REGEX = /^[A-Za-z][A-Za-z .'-]{0,59}$/
const ZIP_REGEX = /^[A-Za-z0-9\-\s]{3,20}$/
const COUNTRY_CODE_REGEX = /^[A-Za-z]{2}$/

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [values, setValues] = useState<SignupValues>(INITIAL_VALUES)
    const [countryQuery, setCountryQuery] = useState("")
    const [countryOptions, setCountryOptions] = useState<CountryOption[]>([])
    const [cityOptions, setCityOptions] = useState<string[]>([])
    const [isLoadingCountries, setIsLoadingCountries] = useState(false)
    const [isCountryValid, setIsCountryValid] = useState<boolean | null>(null)
    const [isCityCountryValid, setIsCityCountryValid] = useState<
        boolean | null
    >(null)
    const [hasAgreedToPolicies, setHasAgreedToPolicies] = useState(false)
    const [showTCModal, setShowTCModal] = useState(false)
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [isLoadingCities, setIsLoadingCities] = useState(false)
    const [isValidatingLocation, setIsValidatingLocation] = useState(false)
    const [isLiveCheckingLocation, setIsLiveCheckingLocation] = useState(false)
    const [isSelectingCountry, setIsSelectingCountry] = useState(false)
    const isSelectingCountryRef = useRef(false)

    const selectedCountryCode = useMemo(() => {
        const countryInput = values.countryRegion.trim()
        if (!countryInput) {
            return null
        }

        if (COUNTRY_CODE_REGEX.test(countryInput)) {
            return countryInput.toUpperCase()
        }

        const normalizedCountryInput = countryInput.toLowerCase()

        const exactMatch = countryOptions.find((country) => {
            return (
                country.name.toLowerCase() === normalizedCountryInput ||
                country.code.toLowerCase() === normalizedCountryInput
            )
        })

        if (exactMatch) {
            return exactMatch.code
        }

        return null
    }, [values.countryRegion, countryOptions])

    function updateValue(field: keyof SignupValues, value: string) {
        const maxLength = FIELD_LIMITS[field]
        setValues((currentValues) => ({
            ...currentValues,
            [field]: value.slice(0, maxLength),
            ...(field === "countryRegion" ? { city: "" } : {}),
        }))

        if (field === "countryRegion") {
            setIsCountryValid(null)
            setIsCityCountryValid(null)
            setCityOptions([])
        }

        if (field === "city") {
            setIsCityCountryValid(null)
        }
    }

    useEffect(() => {
        async function fetchCountries() {
            if (step !== 2 || isSelectingCountry) {
                return
            }

            setIsLoadingCountries(true)
            try {
                const params = new URLSearchParams({
                    limit: "8",
                })

                if (countryQuery.trim()) {
                    params.set("q", countryQuery.trim())
                }

                const res = await fetch(
                    `/api/location/countries?${params.toString()}`
                )
                const data = await res.json()
                if (!res.ok) {
                    throw new Error(data.error || "Could not load countries")
                }
                setCountryOptions(data.countries || [])
            } catch (error: any) {
                toast.error(error.message || "Could not load countries")
            } finally {
                setIsLoadingCountries(false)
            }
        }

        const timer = setTimeout(() => {
            void fetchCountries()
        }, 250)

        return () => {
            clearTimeout(timer)
        }
    }, [step, countryQuery, isSelectingCountry])

    useEffect(() => {
        setIsCountryValid(Boolean(selectedCountryCode))
    }, [values.countryRegion, selectedCountryCode])

    function handleCountryInputChange(nextValue: string) {
        setCountryQuery(nextValue)

        if (isSelectingCountryRef.current) {
            return
        }

        if (values.countryRegion) {
            updateValue("countryRegion", "")
        }
    }

    function handleCountrySelect(nextValue: CountryOption | null) {
        if (!nextValue) {
            handleCountryInputChange("")
            return
        }

        isSelectingCountryRef.current = true
        setIsSelectingCountry(true)
        updateValue("countryRegion", nextValue.code)
        if (!values.phoneDialCode.trim() && nextValue.phoneCode) {
            updateValue("phoneDialCode", nextValue.phoneCode)
        }
        setCountryQuery(`${nextValue.name} (${nextValue.code})`)
        setIsCountryValid(true)
        setTimeout(() => {
            isSelectingCountryRef.current = false
            setIsSelectingCountry(false)
        }, 0)
    }

    useEffect(() => {
        async function fetchCitySuggestions() {
            if (step !== 2 || !selectedCountryCode) {
                setCityOptions([])
                return
            }

            const cityQuery = values.city.trim()
            if (cityQuery.length < 2) {
                setCityOptions([])
                return
            }

            setIsLoadingCities(true)
            try {
                const params = new URLSearchParams({
                    query: cityQuery,
                    countryCode: selectedCountryCode,
                })
                const res = await fetch(
                    `/api/location/cities?${params.toString()}`
                )
                const data = await res.json()
                if (!res.ok) {
                    throw new Error(data.error || "Could not load cities")
                }
                setCityOptions(data.cities || [])
            } catch (error: any) {
                toast.error(error.message || "Could not load cities")
            } finally {
                setIsLoadingCities(false)
            }
        }

        void fetchCitySuggestions()
    }, [step, values.city, selectedCountryCode])

    useEffect(() => {
        async function validateLiveCityCountry() {
            if (step !== 2 || !selectedCountryCode) {
                setIsCityCountryValid(null)
                return
            }

            const city = values.city.trim()
            if (city.length < 2) {
                setIsCityCountryValid(null)
                return
            }

            setIsLiveCheckingLocation(true)
            try {
                const isValid = await validateCityCountryPair(
                    city,
                    selectedCountryCode
                )
                setIsCityCountryValid(isValid)
            } catch {
                setIsCityCountryValid(null)
            } finally {
                setIsLiveCheckingLocation(false)
            }
        }

        const timer = setTimeout(() => {
            void validateLiveCityCountry()
        }, 500)

        return () => {
            clearTimeout(timer)
        }
    }, [step, values.city, selectedCountryCode])

    function handleAgreementCheckboxClick() {
        if (hasAgreedToPolicies) {
            setHasAgreedToPolicies(false)
        } else {
            setHasScrolledToBottom(false)
            setShowTCModal(true)
        }
    }

    function handleTCScroll(e: React.UIEvent<HTMLDivElement>) {
        const el = e.currentTarget
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
            setHasScrolledToBottom(true)
        }
    }

    function handleTCAgree() {
        setHasAgreedToPolicies(true)
        setShowTCModal(false)
    }

    function validateStep(currentStep: number) {
        if (currentStep === 1) {
            const firstName = values.firstName.trim()
            const lastName = values.lastName.trim()

            if (!firstName || !lastName) {
                toast.error("Fill in your name to continue")
                return false
            }

            if (!NAME_REGEX.test(firstName) || !NAME_REGEX.test(lastName)) {
                toast.error(
                    "Use valid names (letters, spaces, hyphen, apostrophe)"
                )
                return false
            }
        }

        if (currentStep === 2) {
            const addressLine1 = values.addressLine1.trim()
            const city = values.city.trim()
            const stateProvince = values.stateProvince.trim()
            const zipCode = values.zipCode.trim()
            const countryRegion = values.countryRegion.trim()
            const phoneDialCode = values.phoneDialCode.trim()
            const phoneNumber = values.phoneNumber.trim()
            const normalizedPhoneNumber = phoneNumber.replace(/\D/g, "")

            if (
                !addressLine1 ||
                !city ||
                !stateProvince ||
                !zipCode ||
                !countryRegion ||
                !phoneDialCode ||
                !phoneNumber
            ) {
                toast.error("Fill in contact details to continue")
                return false
            }

            if (
                addressLine1.length > FIELD_LIMITS.addressLine1 ||
                values.addressLine2.trim().length > FIELD_LIMITS.addressLine2
            ) {
                toast.error("Address is too long")
                return false
            }

            if (
                !LOCATION_REGEX.test(city) ||
                !LOCATION_REGEX.test(stateProvince) ||
                !LOCATION_REGEX.test(countryRegion)
            ) {
                toast.error(
                    "City, state, and country contain invalid characters"
                )
                return false
            }

            if (!selectedCountryCode) {
                toast.error("Pick a valid country from dropdown")
                return false
            }

            if (!ZIP_REGEX.test(zipCode)) {
                toast.error("Enter a valid zip/postal code")
                return false
            }

            if (
                normalizedPhoneNumber.length < 6 ||
                normalizedPhoneNumber.length > 15
            ) {
                toast.error("Enter a valid phone number")
                return false
            }
        }

        if (currentStep === 3) {
            const email = values.email.trim()

            if (!email || !values.password || !values.confirmPassword) {
                toast.error("Fill in account details to continue")
                return false
            }

            if (!EMAIL_REGEX.test(email)) {
                toast.error("Enter a valid email address")
                return false
            }

            if (values.password.length < 8) {
                toast.error("Password must be at least 8 characters")
                return false
            }

            if (values.password.length > FIELD_LIMITS.password) {
                toast.error("Password is too long")
                return false
            }

            if (values.password !== values.confirmPassword) {
                toast.error("Passwords do not match")
                return false
            }

            if (!hasAgreedToPolicies) {
                toast.error("Agree to Terms and Privacy Policy to continue")
                return false
            }
        }

        return true
    }

    async function validateCityCountryPair(
        city: string,
        countryRegion: string
    ) {
        const res = await fetch("/api/location/validate-city-country", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city, countryRegion }),
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || "Could not validate location")
        }

        return Boolean(data.valid)
    }

    function formatPhoneNumberForSubmit() {
        const dialCode = values.phoneDialCode.trim()
        const localNumber = values.phoneNumber.replace(/\D/g, "")
        return `${dialCode}${localNumber}`
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (step < 3) {
            if (!validateStep(step)) {
                return
            }

            if (step === 2) {
                setIsValidatingLocation(true)
                try {
                    const isLocationValid = await validateCityCountryPair(
                        values.city.trim(),
                        selectedCountryCode || values.countryRegion.trim()
                    )

                    if (!isLocationValid) {
                        toast.error("City does not match selected country")
                        return
                    }
                } catch (error: any) {
                    toast.error(error.message || "Could not validate location")
                    return
                } finally {
                    setIsValidatingLocation(false)
                }
            }

            setStep((currentStep) => currentStep + 1)
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
                    countryRegion:
                        selectedCountryCode || values.countryRegion.trim(),
                    phoneNumber: formatPhoneNumberForSubmit(),
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
                                maxLength={FIELD_LIMITS.firstName}
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
                                maxLength={FIELD_LIMITS.lastName}
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
                            <FieldLabel htmlFor="countryRegion">
                                Country / Region
                            </FieldLabel>
                            <Combobox
                                items={countryOptions}
                                value={
                                    countryOptions.find(
                                        (country) =>
                                            country.code === selectedCountryCode
                                    ) || null
                                }
                                inputValue={countryQuery}
                                onInputValueChange={handleCountryInputChange}
                                onValueChange={(value) => {
                                    const country =
                                        value as CountryOption | null
                                    if (!country) {
                                        handleCountryInputChange("")
                                        return
                                    }
                                    handleCountrySelect(country)
                                }}
                                itemToStringLabel={(item) =>
                                    `${item.name} (${item.code})`
                                }
                            >
                                <ComboboxInput
                                    id="countryRegion"
                                    name="countryRegion"
                                    placeholder="Type country name or code"
                                    className="h-12 w-full border-border/50 bg-secondary"
                                    maxLength={FIELD_LIMITS.countryRegion}
                                    showClear
                                />
                                <ComboboxContent>
                                    {isLoadingCountries ? (
                                        <div className="flex items-center justify-center gap-2 py-6">
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                Searching countries...
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <ComboboxEmpty>
                                                No country found. Keep typing.
                                            </ComboboxEmpty>
                                            <ComboboxList>
                                                {(country: CountryOption) => (
                                                    <ComboboxItem
                                                        key={country.code}
                                                        value={country}
                                                    >
                                                        {country.name} (
                                                        {country.code})
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </>
                                    )}
                                </ComboboxContent>
                            </Combobox>
                            <FieldDescription>
                                {isLoadingCountries
                                    ? "Searching countries..."
                                    : isCountryValid === true
                                      ? `Country selected: ${selectedCountryCode}`
                                      : "Type to search country (shows small matched list)"}
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="city">City</FieldLabel>
                            <Combobox
                                items={cityOptions}
                                value={values.city || null}
                                inputValue={values.city}
                                onInputValueChange={(value) =>
                                    updateValue("city", value)
                                }
                                onValueChange={(value) =>
                                    updateValue("city", String(value || ""))
                                }
                                disabled={!selectedCountryCode}
                            >
                                <ComboboxInput
                                    id="city"
                                    name="city"
                                    placeholder={
                                        selectedCountryCode
                                            ? "Type city name"
                                            : "Select country first"
                                    }
                                    className="h-12 w-full border-border/50 bg-secondary"
                                    maxLength={FIELD_LIMITS.city}
                                    showClear
                                    disabled={!selectedCountryCode}
                                />
                                <ComboboxContent>
                                    {isLoadingCities ? (
                                        <div className="flex items-center justify-center gap-2 py-6">
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                Loading cities...
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <ComboboxEmpty>
                                                No city match. Keep typing.
                                            </ComboboxEmpty>
                                            <ComboboxList>
                                                {(cityOption: string) => (
                                                    <ComboboxItem
                                                        key={cityOption}
                                                        value={cityOption}
                                                    >
                                                        {cityOption}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </>
                                    )}
                                </ComboboxContent>
                            </Combobox>
                            <FieldDescription>
                                {isLoadingCities
                                    ? "Loading city suggestions..."
                                    : isLiveCheckingLocation
                                      ? "Checking city and country..."
                                      : isCityCountryValid === true
                                        ? "City matches selected country"
                                        : isCityCountryValid === false
                                          ? "City does not match selected country"
                                          : selectedCountryCode
                                            ? "Type city name to search"
                                            : "Choose country first"}
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="addressLine1">
                                Address Line 1
                            </FieldLabel>
                            <Input
                                id="addressLine1"
                                name="addressLine1"
                                type="text"
                                placeholder="5001 Lake Front Dr"
                                maxLength={FIELD_LIMITS.addressLine1}
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
                                maxLength={FIELD_LIMITS.addressLine2}
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
                        <Field>
                            <FieldLabel htmlFor="stateProvince">
                                State / Province
                            </FieldLabel>
                            <Input
                                id="stateProvince"
                                name="stateProvince"
                                type="text"
                                placeholder="FL"
                                maxLength={FIELD_LIMITS.stateProvince}
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
                        <Field>
                            <FieldLabel htmlFor="zipCode">Zip Code</FieldLabel>
                            <Input
                                id="zipCode"
                                name="zipCode"
                                type="text"
                                placeholder="32303-7173"
                                maxLength={FIELD_LIMITS.zipCode}
                                value={values.zipCode}
                                onChange={(event) =>
                                    updateValue("zipCode", event.target.value)
                                }
                                className="h-12 border-border/50 bg-secondary"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="phoneNumber">
                                Phone Number
                            </FieldLabel>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                placeholder="+1 123 456 7890"
                                maxLength={FIELD_LIMITS.phoneNumber + 5}
                                value={values.phoneNumber}
                                onChange={(e) =>
                                    updateValue("phoneNumber", e.target.value)
                                }
                                className="h-12 border-border/50 bg-secondary"
                            />
                            <FieldDescription>
                                Please enter your full phone number with country
                                code.
                            </FieldDescription>
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
                                maxLength={FIELD_LIMITS.email}
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
                                    minLength={8}
                                    maxLength={FIELD_LIMITS.password}
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
                                    minLength={8}
                                    maxLength={FIELD_LIMITS.confirmPassword}
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
                        <Field>
                            <label
                                htmlFor="agreeToPolicies"
                                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 bg-secondary/40 p-3"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleAgreementCheckboxClick()
                                }}
                            >
                                <input
                                    id="agreeToPolicies"
                                    name="agreeToPolicies"
                                    type="checkbox"
                                    checked={hasAgreedToPolicies}
                                    readOnly
                                    className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border/70 accent-primary"
                                />
                                <span className="text-sm text-foreground">
                                    I have read and agree to the{" "}
                                    <span className="font-medium text-primary underline underline-offset-4">
                                        Terms &amp; Privacy Policy
                                    </span>
                                    .
                                </span>
                            </label>
                            <FieldDescription>
                                You must read and agree before creating account.
                            </FieldDescription>
                        </Field>

                        <Dialog
                            open={showTCModal}
                            onOpenChange={(open) => {
                                if (!open) setShowTCModal(false)
                            }}
                        >
                            <DialogContent
                                className="flex max-h-[85vh] max-w-lg flex-col gap-0 p-0"
                                showCloseButton={false}
                            >
                                <DialogHeader className="shrink-0 border-b border-border/40 px-6 py-5">
                                    <DialogTitle className="text-base font-semibold">
                                        Terms &amp; Privacy Policy
                                    </DialogTitle>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Please read carefully and scroll to the
                                        bottom to agree.
                                    </p>
                                </DialogHeader>

                                <div
                                    className="flex-1 overflow-y-auto px-6 py-4 text-sm leading-relaxed text-foreground/80"
                                    onScroll={handleTCScroll}
                                >
                                    <h3 className="mb-2 font-semibold text-foreground">
                                        1. Acceptance of Terms
                                    </h3>
                                    <p className="mb-4">
                                        By creating an account and accessing the
                                        Minesha onboarding platform, you
                                        acknowledge that you have read,
                                        understood, and agree to be bound by
                                        these Terms of Service and our Privacy
                                        Policy. If you do not agree, you may not
                                        use this platform.
                                    </p>

                                    <h3 className="mb-2 font-semibold text-foreground">
                                        2. Use of the Platform
                                    </h3>
                                    <p className="mb-4">
                                        You agree to use the platform solely for
                                        its intended purpose — participating in
                                        the guided onboarding journey. You must
                                        not misuse, reverse-engineer, or attempt
                                        to gain unauthorized access to any part
                                        of the system.
                                    </p>

                                    <h3 className="mb-2 font-semibold text-foreground">
                                        3. Account Responsibility
                                    </h3>
                                    <p className="mb-4">
                                        You are responsible for maintaining the
                                        confidentiality of your login
                                        credentials. You agree to notify us
                                        immediately of any unauthorized use of
                                        your account. We are not liable for any
                                        loss arising from unauthorized access
                                        caused by your failure to protect your
                                        credentials.
                                    </p>

                                    <h3 className="mb-2 font-semibold text-foreground">
                                        4. Personal Information &amp; Privacy
                                    </h3>
                                    <p className="mb-4">
                                        We collect and process personal
                                        information you provide during
                                        registration and throughout the
                                        onboarding process. This data is used to
                                        personalize your experience, track your
                                        progress, and communicate with you. We
                                        do not sell or share your personal data
                                        with third parties except as required by
                                        law or as described in our full Privacy
                                        Policy.
                                    </p>

                                    <h3 className="mb-2 font-semibold text-foreground">
                                        5. Data Retention
                                    </h3>
                                    <p className="mb-4">
                                        Your data will be retained for as long
                                        as your account is active or as needed
                                        to provide services. You may request
                                        deletion of your account and associated
                                        data at any time by contacting our
                                        support team.
                                    </p>

                                    <h3 className="mb-2 font-semibold text-foreground">
                                        6. Intellectual Property
                                    </h3>
                                    <p className="mb-4">
                                        All content, materials, and features on
                                        this platform are the exclusive property
                                        of Minesha and its licensors. You may
                                        not copy, distribute, or create
                                        derivative works from any platform
                                        content without prior written permission.
                                    </p>

                                    <h3 className="mb-2 font-semibold text-foreground">
                                        7. Limitation of Liability
                                    </h3>
                                    <p className="mb-4">
                                        To the maximum extent permitted by
                                        applicable law, Minesha shall not be
                                        liable for any indirect, incidental,
                                        special, or consequential damages arising
                                        from your use of, or inability to use,
                                        the platform.
                                    </p>

                                    <h3 className="mb-2 font-semibold text-foreground">
                                        8. Modifications
                                    </h3>
                                    <p className="mb-4">
                                        We reserve the right to update these
                                        Terms at any time. Continued use of the
                                        platform after changes are posted
                                        constitutes your acceptance of the
                                        revised Terms.
                                    </p>

                                    <h3 className="mb-2 font-semibold text-foreground">
                                        9. Governing Law
                                    </h3>
                                    <p className="mb-6">
                                        These Terms are governed by applicable
                                        law. Any disputes arising out of or
                                        related to these Terms shall be resolved
                                        through binding arbitration or in the
                                        courts of the applicable jurisdiction.
                                    </p>

                                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
                                        By clicking &quot;I Agree&quot; below,
                                        you confirm you have read and accept all
                                        terms above.
                                    </div>
                                </div>

                                {!hasScrolledToBottom && (
                                    <div className="shrink-0 border-t border-border/40 bg-muted/30 px-6 py-2 text-center text-xs text-muted-foreground">
                                        Scroll down to read all terms and enable
                                        the agree button
                                    </div>
                                )}

                                <DialogFooter className="shrink-0 gap-2 border-t border-border/40 px-6 py-4 sm:flex-row">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setShowTCModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        className="flex-1"
                                        disabled={!hasScrolledToBottom}
                                        onClick={handleTCAgree}
                                    >
                                        I Agree
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
                            disabled={isLoading || isValidatingLocation}
                        >
                            Back
                        </Button>
                    ) : null}
                    <Button
                        className="flex-1 cursor-pointer"
                        type="submit"
                        disabled={
                            isLoading ||
                            isValidatingLocation ||
                            (step === 3 && !hasAgreedToPolicies)
                        }
                    >
                        {isValidatingLocation
                            ? "Validating location..."
                            : isLoading
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
