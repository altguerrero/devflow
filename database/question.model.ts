import { Model, Schema, Types, model, models } from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  author: Types.ObjectId;
  tags: Types.ObjectId[];
  answers: Types.ObjectId[];
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  views: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true, trim: true, minlength: 10, maxlength: 200 },
    content: { type: String, required: true, minlength: 20 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: true }],
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

QuestionSchema.index({ title: "text", content: "text" });
QuestionSchema.index({ tags: 1 });

const Question: Model<IQuestion> = models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
