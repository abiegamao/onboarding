import { NextResponse } from "next/server"

const LOCATION_REGEX = /^[A-Za-z][A-Za-z .'-]{0,59}$/

type NominatimResult = {
    address?: {
        country_code?: string
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const city = String(body.city || "").trim()
        const countryRegion = String(body.countryRegion || "").trim()

        if (!city || !countryRegion) {
            return NextResponse.json(
                { error: "City and country are required" },
                { status: 400 }
            )
        }

        if (!LOCATION_REGEX.test(city) || !LOCATION_REGEX.test(countryRegion)) {
            return NextResponse.json(
                { error: "Invalid city or country format" },
                { status: 400 }
            )
        }

        const isCountryCode = /^[A-Za-z]{2}$/.test(countryRegion)
        const query = new URLSearchParams({
            city,
            format: "jsonv2",
            addressdetails: "1",
            limit: "5",
        })

        if (isCountryCode) {
            query.set("countrycodes", countryRegion.toLowerCase())
        } else {
            query.set("country", countryRegion)
        }

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${query.toString()}`,
            {
                headers: {
                    "User-Agent":
                        "onboarding-fork/1.0 (signup-location-validation)",
                    Accept: "application/json",
                },
                cache: "no-store",
            }
        )

        if (!response.ok) {
            return NextResponse.json(
                { error: "Could not validate location right now" },
                { status: 502 }
            )
        }

        const results = (await response.json()) as NominatimResult[]

        if (!Array.isArray(results) || results.length === 0) {
            return NextResponse.json({ valid: false })
        }

        if (isCountryCode) {
            const countryCode = countryRegion.toLowerCase()
            const hasMatch = results.some(
                (item) => item.address?.country_code === countryCode
            )
            return NextResponse.json({ valid: hasMatch })
        }

        return NextResponse.json({ valid: true })
    } catch (error) {
        console.error("Location validation error:", error)
        return NextResponse.json(
            { error: "Could not validate location" },
            { status: 500 }
        )
    }
}
