import { NextResponse } from "next/server"

type RestCountry = {
    name?: {
        common?: string
    }
    cca2?: string
}

type CountryOption = {
    name: string
    code: string
}

const POPULAR_COUNTRY_CODES = [
    "US",
    "CA",
    "GB",
    "AU",
    "DE",
    "FR",
    "IN",
    "SG",
]

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const query = String(searchParams.get("q") || "")
            .trim()
            .toLowerCase()
        const requestedLimit = Number(searchParams.get("limit") || 8)
        const limit = Number.isFinite(requestedLimit)
            ? Math.min(Math.max(requestedLimit, 1), 20)
            : 8

        const response = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,cca2",
            {
                headers: {
                    Accept: "application/json",
                },
                next: { revalidate: 60 * 60 * 24 },
            }
        )

        if (!response.ok) {
            return NextResponse.json(
                { error: "Could not load countries" },
                { status: 502 }
            )
        }

        const countries = (await response.json()) as RestCountry[]

        const normalized = countries
            .map((country): CountryOption | null => {
                const name = country.name?.common?.trim()
                const code = country.cca2?.trim().toUpperCase()

                if (!name || !code) {
                    return null
                }

                return { name, code }
            })
            .filter((item): item is CountryOption => Boolean(item))
            .sort((a, b) => a.name.localeCompare(b.name))

        const filtered = query
            ? normalized.filter((country) => {
                  return (
                      country.name.toLowerCase().includes(query) ||
                      country.code.toLowerCase().includes(query)
                  )
              })
            : normalized.filter((country) =>
                  POPULAR_COUNTRY_CODES.includes(country.code)
              )

        return NextResponse.json({ countries: filtered.slice(0, limit) })
    } catch (error) {
        console.error("Countries lookup error:", error)
        return NextResponse.json(
            { error: "Could not load countries" },
            { status: 500 }
        )
    }
}
