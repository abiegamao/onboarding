import { NextResponse } from "next/server"
import {
    getCountryCityNamesByIso2,
    resolveCountry,
    normalize,
} from "@/lib/location-provider"

const LOCATION_REGEX = /^[A-Za-z][A-Za-z .'-]{0,59}$/

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

        const country = await resolveCountry(countryRegion)
        if (!country) {
            return NextResponse.json({ valid: false })
        }

        const cities = await getCountryCityNamesByIso2(country.iso2)
        const normalizedCity = normalize(city)
        const hasMatch = cities.some(
            (cityName) => normalize(cityName) === normalizedCity
        )

        return NextResponse.json({ valid: hasMatch })
    } catch (error) {
        console.error("Location validation error:", error)
        return NextResponse.json(
            { error: "Could not validate location" },
            { status: 500 }
        )
    }
}
