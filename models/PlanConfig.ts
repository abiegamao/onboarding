import mongoose, { Schema, Document } from "mongoose"

export interface IPlanConfig extends Document {
    planId: "basic" | "intermediate" | "custom"
    name: string
    price: string
    period: string
    description: string
    features: string[]
    stripeUrl: string | null
    ctaLabel: string
    isActive: boolean
    updatedAt: Date
}

const PlanConfigSchema = new Schema<IPlanConfig>(
    {
        planId: {
            type: String,
            enum: ["basic", "intermediate", "custom"],
            required: true,
            unique: true,
        },
        name: { type: String, required: true },
        price: { type: String, required: true },
        period: { type: String, default: "/mo" },
        description: { type: String, default: "" },
        features: [{ type: String }],
        stripeUrl: { type: String, default: null },
        ctaLabel: { type: String, default: "Get Started" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export default mongoose.models.PlanConfig ||
    mongoose.model<IPlanConfig>("PlanConfig", PlanConfigSchema)
