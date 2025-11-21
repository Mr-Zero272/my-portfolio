import mongoose, { Document, Schema } from 'mongoose';

export type ProjectType = 'website' | 'mobile' | 'desktop' | 'api' | 'library' | 'other';
export type ProjectStatus = 'planning' | 'developing' | 'completed' | 'deployed' | 'maintenance' | 'archived';

export interface IProject extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  responsibilities?: string;
  type: ProjectType;
  status: ProjectStatus;

  // Media
  images: string[]; // Array of image URLs
  thumbnailImage?: string;
  demoUrl?: string;
  sourceCodeUrl?: string;

  // Technical Details
  technologies: string[];
  databases: string[];

  // Dates
  startDate?: Date;
  endDate?: Date;

  // Display
  isFeatured: boolean;
  displayOrder: number;
  isVisible: boolean;

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    responsibilities: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['website', 'mobile', 'desktop', 'api', 'library', 'other'],
      default: 'website',
    },
    status: {
      type: String,
      enum: ['planning', 'developing', 'completed', 'deployed', 'maintenance', 'archived'],
      default: 'developing',
    },

    // Media
    images: {
      type: [String],
      default: [],
    },
    thumbnailImage: {
      type: String,
    },
    demoUrl: {
      type: String,
      trim: true,
    },
    sourceCodeUrl: {
      type: String,
      trim: true,
    },

    // Technical Details
    technologies: {
      type: [String],
      default: [],
    },
    databases: {
      type: [String],
      default: [],
    },

    // Dates
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },

    // Display
    isFeatured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
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
  },
  {
    timestamps: true,
  },
);

// Indexes
ProjectSchema.index({ userId: 1, displayOrder: 1 });
// ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ isFeatured: 1, isVisible: 1 });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
