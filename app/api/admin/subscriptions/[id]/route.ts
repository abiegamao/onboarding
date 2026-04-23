import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { requireAdmin } from "@/lib/adminAuth"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin()
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { accountStatus, plan } = body

    const update: any = {}

    if (accountStatus !== undefined) {
        if (!["unsubscribed", "pending", "active"].includes(accountStatus)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 })
        }
        update.accountStatus = accountStatus
    }

    if (plan !== undefined) {
        if (plan !== null && !["basic", "intermediate", "custom"].includes(plan)) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
        }
        update.plan = plan
    }

    if (Object.keys(update).length === 0) {
        return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    await connectDB()
    const user = await User.findByIdAndUpdate(id, update, { new: true }).select("accountStatus plan")

    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

    return NextResponse.json({ ok: true, accountStatus: user.accountStatus, plan: user.plan })
}
