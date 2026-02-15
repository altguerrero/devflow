import { Model, Schema, Types, model, models } from "mongoose";

export interface IAccount {
  userId: Types.ObjectId;
  provider: string;
  providerAccountId: string;
  type: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType?: string;
  scope?: string;
  idToken?: string;
  sessionState?: string;
}

const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    provider: { type: String, required: true, trim: true, lowercase: true },
    providerAccountId: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true, lowercase: true },
    accessToken: { type: String },
    refreshToken: { type: String },
    expiresAt: { type: Number },
    tokenType: { type: String },
    scope: { type: String },
    idToken: { type: String },
    sessionState: { type: String },
  },
  { timestamps: true }
);

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const Account: Model<IAccount> = models.Account || model<IAccount>("Account", AccountSchema);

export default Account;
