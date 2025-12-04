import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  userId: mongoose.Types.ObjectId;

  // Site Information
  siteName: string;
  siteTagline?: string;
  siteDescription?: string;
  siteUrl?: string;

  // SEO
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  defaultOgImage?: string;

  // Homepage Content
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;

  // Features
  enableBlog: boolean;
  enableProjects: boolean;
  enableContact: boolean;
  enableComments: boolean;

  // Analytics
  googleAnalyticsId?: string;
  googleSiteVerification?: string;

  // Setup
  isSetupCompleted: boolean;
  setupCompletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Site Information
    siteName: {
      type: String,
      required: true,
      trim: true,
      default: 'My Portfolio',
    },
    siteTagline: {
      type: String,
      trim: true,
    },
    siteDescription: {
      type: String,
      trim: true,
    },
    siteUrl: {
      type: String,
      trim: true,
    },

    // SEO
    defaultMetaTitle: {
      type: String,
      trim: true,
    },
    defaultMetaDescription: {
      type: String,
      trim: true,
    },
    defaultOgImage: {
      type: String,
    },

    // Homepage Content
    heroTitle: {
      type: String,
      trim: true,
    },
    heroSubtitle: {
      type: String,
      trim: true,
    },
    heroDescription: {
      type: String,
      trim: true,
    },

    // Theme & Appearance
    primaryColor: {
      type: String,
      trim: true,
    },
    secondaryColor: {
      type: String,
      trim: true,
    },

    // Features
    enableBlog: {
      type: Boolean,
      default: true,
    },
    enableProjects: {
      type: Boolean,
      default: true,
    },
    enableContact: {
      type: Boolean,
      default: true,
    },
    enableComments: {
      type: Boolean,
      default: true,
    },

    // Analytics
    googleAnalyticsId: {
      type: String,
      trim: true,
    },
    googleSiteVerification: {
      type: String,
      trim: true,
    },

    // Setup
    isSetupCompleted: {
      type: Boolean,
      default: false,
    },
    setupCompletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Index
// SiteSettingsSchema.index({ userId: 1 });

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
