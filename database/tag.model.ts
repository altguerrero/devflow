import { type Model, Schema, type Types, model, models } from "mongoose";

export interface ITag {
  name: string;
  description?: string;
  questionsCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 1,
      maxlength: 20,
      match: /^[a-z0-9-]+$/,
    },
    description: { type: String, maxlength: 300 },
    questionsCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

TagSchema.index({ name: 1 });
TagSchema.index({ name: "text", description: "text" });
TagSchema.index({ questionsCount: -1, name: 1 });

const Tag: Model<ITag> = models.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
