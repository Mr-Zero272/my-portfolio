import mongoose, { Document, Schema } from 'mongoose';

export interface ISocialLink extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  platform: string; // e.g., "github", "linkedin", "youtube", "twitter", "facebook", "instagram", etc.
  url: string;
  username?: string; // Optional username for the platform
  isActive: boolean;
  displayOrder: number; // For controlling the order of display
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    platform: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
SocialLinkSchema.index({ userId: 1, displayOrder: 1 });

// Prevent duplicate platform for same user
SocialLinkSchema.index({ userId: 1, platform: 1 }, { unique: true });

export default mongoose.models.SocialLink || mongoose.model<ISocialLink>('SocialLink', SocialLinkSchema);
