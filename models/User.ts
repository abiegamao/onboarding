import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
    email: string
    password?: string
    firstName: string
    lastName: string
    createdAt?: Date
    updatedAt?: Date
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    { timestamps: true }
)

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
