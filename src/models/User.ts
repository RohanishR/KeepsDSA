import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider?: string;
  username?: string;
  privacySettings?: {
    isProfilePublic: boolean;
    showStats: boolean;
    showSolutions: boolean;
    showNotes: boolean;
  };
  emailVerified?: Date | null;
  accounts?: any[];
  sessions?: any[];
  extensionToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    provider: { type: String, default: 'credentials' },
    username: { type: String, unique: true, sparse: true },
    privacySettings: {
      isProfilePublic: { type: Boolean, default: false },
      showStats: { type: Boolean, default: true },
      showSolutions: { type: Boolean, default: true },
      showNotes: { type: Boolean, default: true },
    },
    emailVerified: { type: Date, default: null },
    accounts: [{ type: Schema.Types.Mixed }],
    sessions: [{ type: Schema.Types.Mixed }],
    extensionToken: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
