import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
    email: string
    password?: string
    firstName: string
    lastName: string
    onboardingStatus: {
        currentPhase: number
        currentStep: string
        isCompleted: boolean
        updatedAt: Date
    }
    // Phase 1 Data: Connection
    connection: {
        snapshot: Map<string, any> // Step 1B
        triage: {
            neurodiversity?: string
            internalWiring?: string // CliftonStrengths/Human Design
            disc?: string // Body
            spiritualGiftsBooked?: boolean
        }
        openShare?: string
    }
    // Phase 2 Data: Awareness
    awareness: {
        evaluation360: Map<string, string>[]
        rhythmSnapshot: Map<string, any>
        bossIndex: Map<string, any>
        eveningCheck: string
        capacityPulse: string[]
        commitments: string[]
    }
    // Phase 3 Data: Stabilization
    stabilization: {
        visionStatements: Map<string, string>
        idealDayStory: string
        wordOfYear: string
        familyMission: {
            values: string[]
            statement: string
        }
    }
    createdAt: Date
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        onboardingStatus: {
            currentPhase: { type: Number, default: 1 },
            currentStep: { type: String, default: "1A" },
            isCompleted: { type: Boolean, default: false },
            updatedAt: { type: Date, default: Date.now },
        },
        connection: {
            snapshot: { type: Map, of: Schema.Types.Mixed, default: {} },
            triage: {
                neurodiversity: String,
                internalWiring: String,
                disc: String,
                spiritualGiftsBooked: { type: Boolean, default: false },
            },
            openShare: String,
        },
        awareness: {
            evaluation360: [
                { type: Map, of: String }
            ],
            rhythmSnapshot: { type: Map, of: Schema.Types.Mixed, default: {} },
            bossIndex: { type: Map, of: Schema.Types.Mixed, default: {} },
            eveningCheck: String,
            capacityPulse: [String],
            commitments: [String],
        },
        stabilization: {
            visionStatements: { type: Map, of: String, default: {} },
            idealDayStory: String,
            wordOfYear: String,
            familyMission: {
                values: [String],
                statement: String,
            },
        },
    },
    { timestamps: true }
)

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
