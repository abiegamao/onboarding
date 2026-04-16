import { NextResponse } from "next/server"
import { loadCountries } from "@/lib/location-provider"

type CountryOption = {
    name: string
    code: string
    phoneCode: string
    flag: string
}

const POPULAR_COUNTRY_CODES = ["US", "CA", "GB", "AU", "DE", "FR", "IN", "SG"]

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const query = String(searchParams.get("q") || "")
            .trim()
            .toLowerCase()
        const includeAll =
            String(searchParams.get("all") || "").trim() === "1"
        const requestedLimit = Number(searchParams.get("limit") || 8)
        const limit = Number.isFinite(requestedLimit)
            ? Math.min(Math.max(requestedLimit, 1), 20)
            : 8

        const countries = await loadCountries()
        const countryOptions: CountryOption[] = countries
            .map((country) => ({
                name: country.name,
                code: country.iso2,
                phoneCode: `+${country.phoneCode}`,
                flag: country.flag || "",
            }))
            .sort((a, b) => a.name.localeCompare(b.name))

        const filtered = query
            ? countryOptions.filter((country) => {
                  const normalizedPhoneCode = country.phoneCode.replace(
                      /[^0-9+]/g,
                      ""
                  )
                  const normalizedQuery = query.replace(/[^0-9+]/g, "")
                  const matchesPhoneCode =
                      normalizedQuery.length > 0 &&
                      normalizedPhoneCode.includes(normalizedQuery)
                  return (
                      country.name.toLowerCase().includes(query) ||
                      country.code.toLowerCase().includes(query) ||
                      matchesPhoneCode
                  )
              })
            : includeAll
              ? countryOptions
              : countryOptions.filter((country) =>
                    POPULAR_COUNTRY_CODES.includes(country.code)
                )

        return NextResponse.json({ countries: filtered.slice(0, limit) })
    } catch (error) {
        console.error("Countries lookup error:", error)
        return NextResponse.json({ countries: [] })
    }
}
