import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
    email: string
    password?: string
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    stateProvince: string
    zipCode: string
    countryRegion: string
    phoneNumber: string
    role: "admin" | "client"
    createdAt?: Date
    updatedAt?: Date
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        stateProvince: { type: String, required: true },
        zipCode: { type: String, required: true },
        countryRegion: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        role: { type: String, enum: ["admin", "client"], default: "client" },
    },
    { timestamps: true }
)

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
