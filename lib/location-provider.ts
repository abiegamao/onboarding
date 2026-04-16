import "server-only"

import { GetCountries } from "react-country-state-city"

type ProviderCountry = {
    id: number
    name: string
    iso2: string
}

type ProviderCity = {
    name: string
}

type ProviderStateCities = {
    id: number
    cities?: ProviderCity[]
}

type ProviderCountryCities = {
    id: number
    states?: ProviderStateCities[]
}

const CITIES_DATA_URL =
    "https://venkatmcajj.github.io/react-country-state-city/data/citiesminified.json"

let countriesPromise: Promise<ProviderCountry[]> | null = null
let countryCitiesPromise: Promise<ProviderCountryCities[]> | null = null

function normalize(value: string) {
    return value.trim().toLowerCase()
}

export async function loadCountries() {
    if (!countriesPromise) {
        countriesPromise = GetCountries()
            .then((payload) => {
                if (!Array.isArray(payload)) {
                    return []
                }

                return payload
                    .map((country) => ({
                        id: country.id,
                        name: country.name,
                        iso2: country.iso2,
                    }))
                    .filter((country) => country.name && country.iso2)
            })
            .catch((error) => {
                countriesPromise = null
                throw error
            })
    }

    return countriesPromise
}

async function loadCountryCities() {
    if (!countryCitiesPromise) {
        countryCitiesPromise = fetch(CITIES_DATA_URL, {
            headers: { Accept: "application/json" },
            next: { revalidate: 60 * 60 * 24 },
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Could not load country city dataset")
                }

                const payload = (await res.json()) as unknown
                return Array.isArray(payload)
                    ? (payload as ProviderCountryCities[])
                    : []
            })
            .catch((error) => {
                countryCitiesPromise = null
                throw error
            })
    }

    return countryCitiesPromise
}

export async function resolveCountry(input: string) {
    const countries = await loadCountries()
    const normalizedInput = normalize(input)

    return (
        countries.find(
            (country) =>
                normalize(country.iso2) === normalizedInput ||
                normalize(country.name) === normalizedInput
        ) || null
    )
}

export async function getCountryCityNamesByIso2(countryIso2: string) {
    const country = await resolveCountry(countryIso2)
    if (!country) {
        return []
    }

    const countriesWithCities = await loadCountryCities()
    const countryCities = countriesWithCities.find(
        (countryEntry) => countryEntry.id === country.id
    )

    if (!countryCities?.states?.length) {
        return []
    }

    return Array.from(
        new Set(
            countryCities.states
                .flatMap((state) => state.cities || [])
                .map((city) => city.name?.trim())
                .filter((city): city is string => Boolean(city))
        )
    )
}

export { normalize }
