import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
    email: string
    password?: string
    firstName: string
    lastName: string
    onboardingStatus: {
        hasSeenCelebration: boolean
        currentPhase: number
        currentStep: string
        isCompleted: boolean
        updatedAt: Date
    }
    // Phase 1 Data: Connection
    connection: {
        snapshot: Map<string, any> // Step 1B
        triage: {
            pdlLeaderScore?: string
            neurodiversity?: string
            internalWiring?: string // CliftonStrengths/Human Design
            disc?: string // Body
            spiritualGiftsBooked?: boolean
        }
        openShare?: string
    }
    // Phase 2 Data: Awareness
    awareness: {
        evaluation360: any[] 
        growthInputs: Map<string, string>
        eveningPulse: {
            goodToday: string
            heavyToday: string
            peaceLevel: number
        }
        rhythmSnapshot: Map<string, any>
        bossIndex: Map<string, any>
        capacityPulse: string[]
        commitments: string[]
    }
    // Phase 3 Data: Stabilization
    stabilization: {
        visionActivation: Map<string, string>
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
            hasSeenCelebration: { type: Boolean, default: false },
            currentPhase: { type: Number, default: 1 },
            currentStep: { type: String, default: "1A" },
            isCompleted: { type: Boolean, default: false },
            updatedAt: { type: Date, default: Date.now },
        },
        connection: {
            snapshot: { type: Map, of: Schema.Types.Mixed, default: {} },
            triage: {
                pdlLeaderScore: String,
                neurodiversity: String,
                internalWiring: String,
                disc: String,
                spiritualGiftsBooked: { type: Boolean, default: false },
            },
            openShare: String,
        },
        awareness: {
            evaluation360: [{ type: Map, of: String }],
            growthInputs: { type: Map, of: String, default: {} },
            eveningPulse: {
                goodToday: String,
                heavyToday: String,
                peaceLevel: { type: Number, min: 1, max: 10 },
            },
            rhythmSnapshot: { type: Map, of: Schema.Types.Mixed, default: {} },
            bossIndex: { type: Map, of: Schema.Types.Mixed, default: {} },
            capacityPulse: [String],
            commitments: [String],
        },
        stabilization: {
            visionActivation: { type: Map, of: String, default: {} },
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
