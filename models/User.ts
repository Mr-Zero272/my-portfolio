import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'admin',
      enum: ['admin'],
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Tạo unique index để tối ưu query
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
