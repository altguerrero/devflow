import { Model, Schema, Types, model, models } from "mongoose";

export type InteractionAction =
  | "view"
  | "ask_question"
  | "answer_question"
  | "upvote"
  | "downvote"
  | "save"
  | "unsave"
  | "search";

export type InteractionTargetType = "Question" | "Answer" | "Tag" | "User" | "Search";

export interface IInteraction {
  user: Types.ObjectId;
  action: InteractionAction;
  targetType: InteractionTargetType;
  targetId?: Types.ObjectId;
  tags?: string[];
  searchQuery?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: {
      type: String,
      enum: ["view", "ask_question", "answer_question", "upvote", "downvote", "save", "unsave", "search"],
      required: true,
    },
    targetType: { type: String, enum: ["Question", "Answer", "Tag", "User", "Search"], required: true },
    targetId: { type: Schema.Types.ObjectId, index: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    searchQuery: { type: String, trim: true },
  },
  { timestamps: true }
);

InteractionSchema.index({ user: 1, createdAt: -1 });
InteractionSchema.index({ action: 1, targetType: 1, targetId: 1 });

const Interaction: Model<IInteraction> =
  models.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
