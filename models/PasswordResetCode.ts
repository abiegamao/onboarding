import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface IPasswordResetCode extends Document {
    userId: Types.ObjectId
    email: string
    codeHash: string
    expiresAt: Date
    resendAvailableAt: Date
    attempts: number
    createdAt?: Date
}

const PasswordResetCodeSchema = new Schema<IPasswordResetCode>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        codeHash: {
            type: String,
            required: true,
        },
        // TTL index removes expired reset codes automatically.
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 },
        },
        resendAvailableAt: {
            type: Date,
            required: true,
        },
        attempts: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
)

const PasswordResetCode: Model<IPasswordResetCode> =
    mongoose.models.PasswordResetCode ||
    mongoose.model<IPasswordResetCode>(
        "PasswordResetCode",
        PasswordResetCodeSchema
    )

export default PasswordResetCode
