import { type Model, Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation: number;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 20,
      match: /^[a-z0-9_]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    password: { type: String, select: false },
    bio: { type: String, maxlength: 500 },
    image: { type: String },
    location: { type: String, maxlength: 100 },
    portfolio: { type: String },
    reputation: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

UserSchema.index({ createdAt: -1 });

const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);

export default User;
