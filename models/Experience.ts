import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date; // null if current
  isCurrent: boolean;
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
  location?: string;
  employmentType?: string; // Full-time, Part-time, Internship, Freelance, etc.
  displayOrder: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract', 'Remote'],
      default: 'Full-time',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
ExperienceSchema.index({ userId: 1, displayOrder: 1 });

export default mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);
