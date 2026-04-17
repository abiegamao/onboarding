import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface IOnboardingProfile extends Document {
    userId: Types.ObjectId
    status: {
        hasSeenCelebration: boolean
        currentPhase: number
        currentStep: string
        isCompleted: boolean
        updatedAt: Date
    }
    connection: {
        snapshot: Map<string, any>
        gettingToKnowYou: {
            favoriteFoodSnacks?: string
            hobbiesJoy?: string
            selfCareTop3?: string[]
            favoriteMoviesShows?: string
            dreamDestinationsTop3?: string[]
            financialGoals?: string
            bucketListTop3?: string
            proudGrowth?: string
            workBusiness?: string
            boundaries?: string
            importantPeople?: string
            personalPrinciples?: string
            uncompromisableStandards?: string
        }
        triage: {
            selfCare?: { q1?: string; q2?: string; q3?: string; q4?: string; q5?: string }
            wealthCreation?: { q1?: string; q2?: string; q3?: string; q4?: string; q5?: string }
            literacy?: { q1?: string; q2?: string; q3?: string; q4?: string; q5?: string }
            actualization?: { q1?: string; q2?: string; q3?: string; q4?: string; q5?: string }
            succession?: { q1?: string; q2?: string; q3?: string; q4?: string; q5?: string }
            outreach?: { q1?: string; q2?: string; q3?: string; q4?: string; q5?: string }
            relationships?: { q1?: string; q2?: string; q3?: string; q4?: string; q5?: string }
            health?: { q1?: string; q2?: string; q3?: string; q4?: string; q5?: string }
            openReflection?: { q1?: string }
            neurodiversity?: string
            internalWiring?: string
            disc?: string
            spiritualGiftsBooked?: boolean
        }
        openShare?: string
        cultureTakeaways?: string
    }
    awareness: {
        evaluation360: any[]
        growthInputs: Map<string, string>
        eveningPulse: {
            goodToday?: string
            heavyToday?: string
            peaceLevel?: number
        }
        rhythmSnapshot: Map<string, any>
        bossIndex: Map<string, any>
        capacityPulse: string[]
        commitments: string[]
    }
    stabilization: {
        visionActivation: Map<string, any>
        visionStatements: Map<string, any>
        idealDayStory?: string
        wordOfYear?: string
        familyMission: {
            values: string[]
            statement?: string
        }
    }
    activation: {
        kickstartCallBooked?: boolean
        telegramJoined?: boolean
        wealthStrategyComplete?: boolean
    }
    createdAt?: Date
    updatedAt?: Date
}

const OnboardingProfileSchema = new Schema<IOnboardingProfile>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        status: {
            hasSeenCelebration: { type: Boolean, default: false },
            currentPhase: { type: Number, default: 1 },
            currentStep: { type: String, default: "1A" },
            isCompleted: { type: Boolean, default: false },
            updatedAt: { type: Date, default: Date.now },
        },
        connection: {
            snapshot: { type: Map, of: Schema.Types.Mixed, default: {} },
            gettingToKnowYou: {
                favoriteFoodSnacks: String,
                hobbiesJoy: String,
                selfCareTop3: { type: [String], default: [] },
                favoriteMoviesShows: String,
                dreamDestinationsTop3: { type: [String], default: [] },
                financialGoals: String,
                bucketListTop3: String,
                proudGrowth: String,
                workBusiness: String,
                boundaries: String,
                importantPeople: String,
                personalPrinciples: String,
                uncompromisableStandards: String,
            },
            triage: {
                selfCare: { q1: String, q2: String, q3: String, q4: String, q5: String },
                wealthCreation: { q1: String, q2: String, q3: String, q4: String, q5: String },
                literacy: { q1: String, q2: String, q3: String, q4: String, q5: String },
                actualization: { q1: String, q2: String, q3: String, q4: String, q5: String },
                succession: { q1: String, q2: String, q3: String, q4: String, q5: String },
                outreach: { q1: String, q2: String, q3: String, q4: String, q5: String },
                relationships: { q1: String, q2: String, q3: String, q4: String, q5: String },
                health: { q1: String, q2: String, q3: String, q4: String, q5: String },
                openReflection: { q1: String },
                neurodiversity: String,
                internalWiring: String,
                disc: String,
                spiritualGiftsBooked: { type: Boolean, default: false },
            },
            openShare: String,
            cultureTakeaways: String,
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
            capacityPulse: { type: [String], default: [] },
            commitments: { type: [String], default: [] },
        },
        stabilization: {
            visionActivation: {
                type: Map,
                of: Schema.Types.Mixed,
                default: {},
            },
            visionStatements: {
                type: Map,
                of: Schema.Types.Mixed,
                default: {},
            },
            idealDayStory: String,
            wordOfYear: String,
            familyMission: {
                values: { type: [String], default: [] },
                statement: String,
            },
        },
        activation: {
            kickstartCallBooked: { type: Boolean, default: false },
            telegramJoined: { type: Boolean, default: false },
            wealthStrategyComplete: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
)

OnboardingProfileSchema.index({ "status.currentPhase": 1 })
OnboardingProfileSchema.index({ "status.isCompleted": 1 })

const OnboardingProfile: Model<IOnboardingProfile> =
    mongoose.models.OnboardingProfile ||
    mongoose.model<IOnboardingProfile>(
        "OnboardingProfile",
        OnboardingProfileSchema
    )

export default OnboardingProfile
