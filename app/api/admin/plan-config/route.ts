import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import PlanConfig from "@/models/PlanConfig"
import { requireAdmin } from "@/lib/adminAuth"
import { PLAN_SEEDS } from "@/lib/planSeeds"

// GET — return all plan configs (DB overrides seeds)
export async function GET() {
    const auth = await requireAdmin()
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const dbConfigs = await PlanConfig.find({}).lean()
    const dbMap: Record<string, any> = Object.fromEntries(
        dbConfigs.map((c) => [c.planId as string, c])
    )

    const plans = PLAN_SEEDS.map((seed) => ({
        ...seed,
        ...(dbMap[seed.planId] ?? {}),
        _isDefault: !dbMap[seed.planId],
    }))

    return NextResponse.json({ plans })
}

// PATCH — upsert one plan config
export async function PATCH(req: Request) {
    const auth = await requireAdmin()
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { planId, ...fields } = body

    const allowed = ["name", "price", "period", "description", "features", "stripeUrl", "ctaLabel", "isActive"]
    const validPlanIds = ["basic", "intermediate", "custom"]

    if (!validPlanIds.includes(planId)) {
        return NextResponse.json({ error: "Invalid planId" }, { status: 400 })
    }

    const update: Record<string, any> = {}
    for (const key of allowed) {
        if (fields[key] !== undefined) update[key] = fields[key]
    }

    if (Object.keys(update).length === 0) {
        return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    await connectDB()
    const seed = PLAN_SEEDS.find((p) => p.planId === planId)!
    const doc = await PlanConfig.findOneAndUpdate(
        { planId },
        { $set: update, $setOnInsert: { ...seed, planId } },
        { upsert: true, new: true }
    )

    return NextResponse.json({ ok: true, plan: doc })
}

// DELETE — reset one plan to seed defaults
export async function DELETE(req: Request) {
    const auth = await requireAdmin()
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { planId } = await req.json()
    await connectDB()
    await PlanConfig.deleteOne({ planId })
    return NextResponse.json({ ok: true })
}
