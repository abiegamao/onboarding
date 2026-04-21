import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/adminAuth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin()
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params

    if (id === admin.userId) {
        return NextResponse.json(
            { error: "Cannot delete your own account" },
            { status: 400 }
        )
    }

    await connectDB()

    const target = await User.findById(id).select("role")
    if (!target)
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    if (target.role !== "admin") {
        return NextResponse.json(
            { error: "Target is not an admin" },
            { status: 400 }
        )
    }

    await User.findByIdAndDelete(id)

    return NextResponse.json({ message: "Admin removed" })
}
