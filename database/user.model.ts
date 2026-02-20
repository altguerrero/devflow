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
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, select: false },
    bio: { type: String },
    image: { type: String },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);

export default User;
