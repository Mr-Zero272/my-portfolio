import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  // Basic Info
  name: string;
  email: string;
  phone?: string;
  nationality?: string;
  address?: string;
  avatar?: string;
  resumePath?: string;

  // Bio & Introduction
  tagline?: string; // e.g., "Full Stack Developer"
  bio?: string; // Short description
  description?: string; // Longer description

  // Professional Info
  freelanceAvailable: boolean;
  languages: string[]; // e.g., ["Vietnamese", "English"]

  // Social Links
  githubUsername?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;

  // Rotating words for homepage
  rotatingWords: string[]; // e.g., ["Web", "Software", "Mainframe"]

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;

  // Settings
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Basic Info
    name: {
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
    phone: {
      type: String,
      trim: true,
    },
    nationality: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    resumePath: {
      type: String,
    },

    // Bio & Introduction
    tagline: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    // Professional Info
    freelanceAvailable: {
      type: Boolean,
      default: true,
    },
    languages: {
      type: [String],
      default: ['Vietnamese', 'English'],
    },

    // Social Links
    githubUsername: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      trim: true,
    },
    twitterUrl: {
      type: String,
      trim: true,
    },

    // Rotating words for homepage
    rotatingWords: {
      type: [String],
      default: ['Web', 'Software', 'Mainframe'],
    },

    // SEO
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    ogImage: {
      type: String,
    },

    // Settings
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index
ProfileSchema.index({ userId: 1 });

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
