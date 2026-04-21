import { NextResponse } from "next/server"
import { getCountryCityNamesByIso2 } from "@/lib/location-provider"

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

        const queryLower = query.toLowerCase()
        const countryCities = await getCountryCityNamesByIso2(
            countryCode.toUpperCase()
        )
        const cities = countryCities
            .filter((cityName) => cityName.toLowerCase().includes(queryLower))
            .slice(0, 8)

        return NextResponse.json({ cities })
    } catch (error) {
        console.error("City suggestions lookup error:", error)
        return NextResponse.json({ cities: [] })
    }
}
