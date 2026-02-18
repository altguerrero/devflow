import { Model, Schema, Types, model, models } from "mongoose";

export interface ICollection {
  author: Types.ObjectId;
  question: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true, index: true },
  },
  { timestamps: true }
);

CollectionSchema.index({ author: 1, question: 1 }, { unique: true });

const Collection: Model<ICollection> =
  models.Collection || model<ICollection>("Collection", CollectionSchema);

export default Collection;
