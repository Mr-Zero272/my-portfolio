import connectDB from '@/lib/mongodb';
import { Experience, IExperience } from '@/models';
import mongoose from 'mongoose';

export interface CreatePositionData {
  title: string;
  employmentType?: string;
  location?: string;
  startDate: Date | string;
  endDate?: Date | string;
  description?: string;
  icon?: 'code' | 'design' | 'business' | 'education';
  skills?: string[];
}

export interface CreateExperienceData {
  userId: string;
  companyName: string;
  companyLogo?: string;
  isCurrentEmployer?: boolean;
  positions?: CreatePositionData[];
  displayOrder?: number;
  isVisible?: boolean;
}

export interface UpdateExperienceData {
  companyName?: string;
  companyLogo?: string;
  isCurrentEmployer?: boolean;
  positions?: CreatePositionData[];
  displayOrder?: number;
  isVisible?: boolean;
}

export class ExperienceService {
  /**
   * Get all experiences for a user
   */
  static async getExperiencesByUserId(userId: string): Promise<IExperience[]> {
    try {
      await connectDB();
      return await Experience.find({ userId, isVisible: true }).sort({ displayOrder: 1, createdAt: -1 });
    } catch (error) {
      console.error('Error getting experiences by user ID:', error);
      throw new Error('Failed to get experiences');
    }
  }

  /**
   * Get all experiences for a user (including hidden ones, for admin)
   */
  static async getAllExperiencesByUserId(userId: string): Promise<IExperience[]> {
    try {
      await connectDB();
      return await Experience.find({ userId }).sort({ displayOrder: 1, createdAt: -1 });
    } catch (error) {
      console.error('Error getting all experiences by user ID:', error);
      throw new Error('Failed to get all experiences');
    }
  }

  /**
   * Get owner experiences (using ADMIN_ID from env)
   */
  static async getOwnerExperiences(publicOnly: boolean = true): Promise<IExperience[]> {
    try {
      await connectDB();
      const adminId = process.env.ADMIN_ID;
      if (!adminId) {
        throw new Error('ADMIN_ID is not defined in environment variables');
      }

      const query: any = { userId: adminId };
      if (publicOnly) {
        query.isVisible = true;
      }

      return await Experience.find(query).sort({ displayOrder: 1, createdAt: -1 });
    } catch (error) {
      console.error('Error getting owner experiences:', error);
      throw new Error('Failed to get owner experiences');
    }
  }

  /**
   * Get a single experience by ID
   */
  static async getExperienceById(id: string): Promise<IExperience | null> {
    try {
      await connectDB();
      return await Experience.findById(id);
    } catch (error) {
      console.error('Error getting experience by ID:', error);
      throw new Error('Failed to get experience');
    }
  }

  /**
   * Create a new experience
   */
  static async createExperience(data: CreateExperienceData): Promise<IExperience> {
    try {
      await connectDB();
      const experience = await Experience.create(data);
      return experience;
    } catch (error) {
      console.error('Error creating experience:', error);
      throw error;
    }
  }

  /**
   * Update an experience
   */
  static async updateExperience(id: string, userId: string, data: UpdateExperienceData): Promise<IExperience | null> {
    try {
      await connectDB();

      const experience = await Experience.findOneAndUpdate(
        { _id: id, userId },
        { $set: data },
        { new: true, runValidators: true },
      );

      if (!experience) {
        throw new Error('Experience not found or unauthorized');
      }

      return experience;
    } catch (error) {
      console.error('Error updating experience:', error);
      throw error;
    }
  }

  /**
   * Delete an experience (Hard delete)
   */
  static async deleteExperience(id: string, userId: string): Promise<boolean> {
    try {
      await connectDB();
      const result = await Experience.findOneAndDelete({ _id: id, userId });
      return !!result;
    } catch (error) {
      console.error('Error deleting experience:', error);
      throw new Error('Failed to delete experience');
    }
  }

  /**
   * Toggle experience visibility
   */
  static async toggleVisibility(id: string, userId: string): Promise<IExperience | null> {
    try {
      await connectDB();
      const experience = await Experience.findOne({ _id: id, userId });

      if (!experience) {
        throw new Error('Experience not found');
      }

      experience.isVisible = !experience.isVisible;
      await experience.save();

      return experience;
    } catch (error) {
      console.error('Error toggling experience visibility:', error);
      throw error;
    }
  }

  /**
   * Reorder experiences
   */
  static async reorderExperiences(userId: string, orderedIds: string[]): Promise<boolean> {
    try {
      await connectDB();

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        for (let i = 0; i < orderedIds.length; i++) {
          await Experience.findOneAndUpdate({ _id: orderedIds[i], userId }, { $set: { displayOrder: i } }, { session });
        }

        await session.commitTransaction();
        return true;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      console.error('Error reordering experiences:', error);
      throw new Error('Failed to reorder experiences');
    }
  }
}
