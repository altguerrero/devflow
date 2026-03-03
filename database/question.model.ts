import { type Model, Schema, type Types, model, models } from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  author: Types.ObjectId;
  tags: Types.ObjectId[];
  views: number;
  answerCount: number;
  upvotesCount: number;
  downvotesCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true, trim: true, minlength: 10, maxlength: 200 },
    content: { type: String, required: true, minlength: 20 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: true }],
    views: { type: Number, default: 0, min: 0 },
    answerCount: { type: Number, default: 0, min: 0 },
    upvotesCount: { type: Number, default: 0, min: 0 },
    downvotesCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

QuestionSchema.index({ title: "text", content: "text" });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ createdAt: -1 });
QuestionSchema.index({ author: 1, createdAt: -1 });

const Question: Model<IQuestion> = models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
