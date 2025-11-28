import mongoose, { Document, Schema } from 'mongoose';

export type ExperiencePositionIconType = 'code' | 'design' | 'business' | 'education';

export interface IPosition {
  title: string;
  employmentType?: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  icon?: ExperiencePositionIconType;
  skills?: string[];
}

export interface IExperience extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  companyName: string;
  companyLogo?: string;
  isCurrentEmployer: boolean;
  positions: IPosition[];
  displayOrder: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PositionSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  employmentType: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  description: {
    type: String,
    trim: true,
  },
  icon: {
    type: String,
    enum: ['code', 'design', 'business', 'education'],
    default: 'business',
  },
  skills: {
    type: [String],
    default: [],
  },
});

const ExperienceSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogo: {
      type: String,
      trim: true,
    },
    isCurrentEmployer: {
      type: Boolean,
      default: false,
    },
    positions: {
      type: [PositionSchema],
      default: [],
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
