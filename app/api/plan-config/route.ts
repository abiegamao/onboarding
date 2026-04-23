import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import PlanConfig from "@/models/PlanConfig"
import { PLAN_SEEDS } from "@/lib/planSeeds"

// Public — returns merged plan config for the plans page
export async function GET() {
    try {
        await connectDB()
        const dbConfigs = await PlanConfig.find({}).lean()
        const dbMap: Record<string, any> = Object.fromEntries(
            dbConfigs.map((c) => [c.planId as string, c])
        )

        const plans = PLAN_SEEDS.map((seed) => ({
            ...seed,
            ...(dbMap[seed.planId] ?? {}),
        }))

        return NextResponse.json({ plans })
    } catch {
        // Fall back to static seeds if DB is unavailable
        return NextResponse.json({ plans: PLAN_SEEDS })
    }
}
