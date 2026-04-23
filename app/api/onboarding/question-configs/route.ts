import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import QuestionConfig from "@/models/QuestionConfig"
import { QUESTION_SEEDS, QUESTION_SEED_MAP } from "@/lib/questionSeeds"

// GET /api/onboarding/question-configs — returns merged DB + seed configs (auth not required, question text is not sensitive)
export async function GET() {
    try {
        await connectDB()
        const dbConfigs = await QuestionConfig.find({}).lean()

        const dbMap: Record<string, any> = Object.fromEntries(
            dbConfigs.map((c) => [c.stepId as string, c])
        )

        // DB values override seeds
        const merged: Record<string, any> = {}
        for (const seed of QUESTION_SEEDS) {
            merged[seed.stepId] = dbMap[seed.stepId] ?? seed
        }

        return NextResponse.json({ configs: merged })
    } catch (error) {
        console.error("GET /api/onboarding/question-configs error:", error)
        // On error, return static seeds so onboarding is never blocked
        const fallback: Record<string, any> = {}
        for (const seed of QUESTION_SEEDS) fallback[seed.stepId] = seed
        return NextResponse.json({ configs: fallback })
    }
}
