import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import QuestionConfig from "@/models/QuestionConfig"
import { requireAdmin } from "@/lib/adminAuth"
import { QUESTION_SEED_MAP } from "@/lib/questionSeeds"

// GET /api/admin/questions/[stepId]
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ stepId: string }> }
) {
    try {
        await requireAdmin()
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { stepId } = await params

    try {
        await connectDB()
        const config = await QuestionConfig.findOne({ stepId }).lean()

        if (config) return NextResponse.json({ config })

        // Fall back to seed
        const seed = QUESTION_SEED_MAP[stepId]
        if (!seed)
            return NextResponse.json(
                { error: "Step not found" },
                { status: 404 }
            )

        return NextResponse.json({ config: { ...seed, _isDefault: true } })
    } catch (error) {
        console.error(`GET /api/admin/questions/${stepId} error:`, error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}

// PATCH /api/admin/questions/[stepId] — update questions for a step
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ stepId: string }> }
) {
    try {
        await requireAdmin()
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { stepId } = await params

    const seed = QUESTION_SEED_MAP[stepId]
    if (!seed)
        return NextResponse.json({ error: "Step not found" }, { status: 404 })

    try {
        const body = await req.json()
        const { questions } = body

        if (!Array.isArray(questions)) {
            return NextResponse.json(
                { error: "questions must be an array" },
                { status: 400 }
            )
        }

        await connectDB()

        const config = await QuestionConfig.findOneAndUpdate(
            { stepId },
            {
                $set: {
                    questions,
                    stepId,
                    phase: seed.phase,
                    stepLabel: seed.stepLabel,
                    description: seed.description,
                },
            },
            { upsert: true, new: true }
        )

        return NextResponse.json({ config })
    } catch (error) {
        console.error(`PATCH /api/admin/questions/${stepId} error:`, error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}

// DELETE /api/admin/questions/[stepId] — reset to defaults
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ stepId: string }> }
) {
    try {
        await requireAdmin()
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { stepId } = await params

    try {
        await connectDB()
        await QuestionConfig.deleteOne({ stepId })
        return NextResponse.json({ reset: true })
    } catch (error) {
        console.error(`DELETE /api/admin/questions/${stepId} error:`, error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
