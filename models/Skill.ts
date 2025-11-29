import mongoose, { Document, Schema } from 'mongoose';

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Proficient' | 'Expert';
export type SkillCategory = 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Tools' | 'Language' | 'Other';

export interface ISkill extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  proficiency: ProficiencyLevel;
  category: SkillCategory;
  icon?: string; // Icon name or URL
  iconColor?: string; // Hex color for hover effect
  description?: string;
  yearsOfExperience?: number;
  displayOrder: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema: Schema = new Schema(
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
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Proficient', 'Expert'],
      required: true,
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Language', 'Other'],
      required: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    iconColor: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
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
SkillSchema.index({ userId: 1, category: 1, displayOrder: 1 });

export default mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
