import { type Model, Schema, type Types, model, models } from "mongoose";

export interface IAnswer {
  author: Types.ObjectId;
  question: Types.ObjectId;
  content: string;
  upvotesCount: number;
  downvotesCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const AnswerSchema = new Schema<IAnswer>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true, index: true },
    content: { type: String, required: true, trim: true, minlength: 20 },
    upvotesCount: { type: Number, default: 0, min: 0 },
    downvotesCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

AnswerSchema.index({ question: 1, createdAt: -1 });
AnswerSchema.index({ author: 1, createdAt: -1 });

const Answer: Model<IAnswer> = models.Answer || model<IAnswer>("Answer", AnswerSchema);

export default Answer;
