import { NextResponse } from "next/server"

type NominatimResult = {
    address?: {
        city?: string
        town?: string
        village?: string
        municipality?: string
        hamlet?: string
    }
    name?: string
    display_name?: string
}

function pickCityName(item: NominatimResult) {
    return (
        item.address?.city ||
        item.address?.town ||
        item.address?.village ||
        item.address?.municipality ||
        item.address?.hamlet ||
        item.name ||
        item.display_name?.split(",")[0]
    )
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const query = String(searchParams.get("query") || "").trim()
        const countryCode = String(searchParams.get("countryCode") || "")
            .trim()
            .toLowerCase()

        if (!query || query.length < 2) {
            return NextResponse.json({ cities: [] })
        }

        if (!/^[a-z]{2}$/.test(countryCode)) {
            return NextResponse.json(
                { error: "countryCode must be 2-letter ISO code" },
                { status: 400 }
            )
        }

        const params = new URLSearchParams({
            city: query,
            countrycodes: countryCode,
            format: "jsonv2",
            addressdetails: "1",
            limit: "8",
        })

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${params.toString()}`,
            {
                headers: {
                    "User-Agent": "onboarding-fork/1.0 (city-suggestions)",
                    Accept: "application/json",
                },
                cache: "no-store",
            }
        )

        if (!response.ok) {
            return NextResponse.json(
                { error: "Could not load city suggestions" },
                { status: 502 }
            )
        }

        const results = (await response.json()) as NominatimResult[]
        const cities = Array.from(
            new Set(
                results
                    .map((item) => pickCityName(item)?.trim())
                    .filter((item): item is string => Boolean(item))
            )
        )

        return NextResponse.json({ cities })
    } catch (error) {
        console.error("City suggestions lookup error:", error)
        return NextResponse.json(
            { error: "Could not load city suggestions" },
            { status: 500 }
        )
    }
}
