import mongoose, { Schema, Document } from "mongoose"

export interface IQuestionField {
    key: string
    label: string
    placeholder?: string
    hint?: string
}

export interface IQuestionConfig extends Document {
    stepId: string
    phase: number
    stepLabel: string
    description?: string
    questions: IQuestionField[]
    createdAt: Date
    updatedAt: Date
}

const QuestionFieldSchema = new Schema<IQuestionField>(
    {
        key: { type: String, required: true },
        label: { type: String, required: true },
        placeholder: String,
        hint: String,
    },
    { _id: false }
)

const QuestionConfigSchema = new Schema<IQuestionConfig>(
    {
        stepId: { type: String, required: true, unique: true, index: true },
        phase: { type: Number, required: true },
        stepLabel: { type: String, required: true },
        description: String,
        questions: [QuestionFieldSchema],
    },
    { timestamps: true }
)

export default mongoose.models.QuestionConfig ||
    mongoose.model<IQuestionConfig>("QuestionConfig", QuestionConfigSchema)
