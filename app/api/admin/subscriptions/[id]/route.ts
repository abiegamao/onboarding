import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { requireAdmin } from "@/lib/adminAuth"
import { sendAccountActivatedEmail } from "@/lib/accountEmails"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin()
    if (!auth)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { accountStatus, plan } = body

    const update: any = {}

    if (accountStatus !== undefined) {
        if (!["unsubscribed", "pending", "active"].includes(accountStatus)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            )
        }
        update.accountStatus = accountStatus
    }

    if (plan !== undefined) {
        if (
            plan !== null &&
            !["basic", "intermediate", "custom"].includes(plan)
        ) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
        }
        update.plan = plan
    }

    if (Object.keys(update).length === 0) {
        return NextResponse.json(
            { error: "Nothing to update" },
            { status: 400 }
        )
    }

    await connectDB()

    const existingUser = await User.findById(id).select(
        "email firstName accountStatus role"
    )
    if (!existingUser) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const wasActive = existingUser.accountStatus === "active"

    const user = await User.findByIdAndUpdate(id, update, { new: true }).select(
        "email firstName accountStatus plan role"
    )

    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const becameActive =
        update.accountStatus === "active" &&
        !wasActive &&
        user.accountStatus === "active" &&
        user.role === "client"

    let activationEmailSent = false

    if (becameActive && user.email) {
        try {
            await sendAccountActivatedEmail({
                email: user.email,
                firstName: user.firstName,
            })
            activationEmailSent = true
        } catch (error) {
            console.error("Activation email send failed:", error)
        }
    }

    return NextResponse.json({
        ok: true,
        accountStatus: user.accountStatus,
        plan: user.plan,
        activationEmailSent,
    })
}
