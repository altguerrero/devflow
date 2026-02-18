import { Model, Schema, Types, model, models } from "mongoose";

export type VoteTargetType = "Question" | "Answer";
export type VoteValue = 1 | -1;

export interface IVote {
  voter: Types.ObjectId;
  targetType: VoteTargetType;
  targetId: Types.ObjectId;
  value: VoteValue;
  createdAt?: Date;
  updatedAt?: Date;
}

const VoteSchema = new Schema<IVote>(
  {
    voter: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetType: { type: String, enum: ["Question", "Answer"], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    value: { type: Number, enum: [1, -1], required: true },
  },
  { timestamps: true }
);

VoteSchema.index({ voter: 1, targetType: 1, targetId: 1 }, { unique: true });
VoteSchema.index({ targetType: 1, targetId: 1, value: 1 });

const Vote: Model<IVote> = models.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
