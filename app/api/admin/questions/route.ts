import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import QuestionConfig from "@/models/QuestionConfig"
import { requireAdmin } from "@/lib/adminAuth"
import { QUESTION_SEEDS } from "@/lib/questionSeeds"

// GET /api/admin/questions — list all question configs
export async function GET() {
    try {
        await requireAdmin()
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        await connectDB()
        const configs = await QuestionConfig.find({}).sort({ phase: 1, stepId: 1 }).lean()

        // Merge with seeds so steps without DB records still show up
        const dbMap: Record<string, any> = Object.fromEntries(
            configs.map((c) => [c.stepId, c])
        )

        const merged = QUESTION_SEEDS.map((seed) => ({
            ...(dbMap[seed.stepId] || seed),
            _isDefault: !dbMap[seed.stepId],
        }))

        return NextResponse.json({ configs: merged })
    } catch (error) {
        console.error("GET /api/admin/questions error:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}

// POST /api/admin/questions/seed — seed all default configs into DB
export async function POST() {
    try {
        await requireAdmin()
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        await connectDB()

        const results = await Promise.allSettled(
            QUESTION_SEEDS.map((seed) =>
                QuestionConfig.findOneAndUpdate(
                    { stepId: seed.stepId },
                    { $setOnInsert: seed },
                    { upsert: true, new: true }
                )
            )
        )

        const seeded = results.filter((r) => r.status === "fulfilled").length
        return NextResponse.json({ seeded, total: QUESTION_SEEDS.length })
    } catch (error) {
        console.error("POST /api/admin/questions seed error:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
