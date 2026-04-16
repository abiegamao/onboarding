import { NextResponse } from "next/server"
import { loadCountries } from "@/lib/location-provider"

type CountryOption = {
    name: string
    code: string
}

const POPULAR_COUNTRY_CODES = ["US", "CA", "GB", "AU", "DE", "FR", "IN", "SG"]

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

        const countries = await loadCountries()
        const countryOptions: CountryOption[] = countries
            .map((country) => ({
                name: country.name,
                code: country.iso2,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))

        const filtered = query
            ? countryOptions.filter((country) => {
                  return (
                      country.name.toLowerCase().includes(query) ||
                      country.code.toLowerCase().includes(query)
                  )
              })
            : countryOptions.filter((country) =>
                  POPULAR_COUNTRY_CODES.includes(country.code)
              )

        return NextResponse.json({ countries: filtered.slice(0, limit) })
    } catch (error) {
        console.error("Countries lookup error:", error)
        return NextResponse.json({ countries: [] })
    }
}
