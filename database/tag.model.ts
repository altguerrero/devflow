import { Model, Schema, Types, model, models } from "mongoose";

export interface ITag {
  name: string;
  description?: string;
  questions: Types.ObjectId[];
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
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

TagSchema.index({ name: 1 });
TagSchema.index({ name: "text", description: "text" });

const Tag: Model<ITag> = models.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
