import mongoose, { Document, Schema } from 'mongoose';

export interface IEducation extends Document {  
  userId: mongoose.Types.ObjectId;
  institution: string; // University/School name
  degree: string; // Bachelor, Master, Certificate, etc.
  fieldOfStudy?: string; // Information Technology, Computer Science, etc.
  startDate: Date;
  endDate?: Date; // null if current
  description?: string;
  location?: string;
  displayOrder: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    fieldOfStudy: {
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
    location: {
      type: String,
      trim: true,
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
EducationSchema.index({ userId: 1, displayOrder: 1 });

export default mongoose.models.Education || mongoose.model<IEducation>('Education', EducationSchema);
