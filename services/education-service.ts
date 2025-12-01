import connectDB from '@/lib/mongodb';
import Education, { type IEducation } from '@/models/Education';

export interface CreateEducationData {
  userId: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  location?: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface UpdateEducationData {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  location?: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export class EducationService {
  /**
   * Get educations by user ID
   */
  static async getEducationsByUserId(userId: string): Promise<IEducation[]> {
    try {
      await connectDB();
      return await Education.find({ userId }).sort({ displayOrder: 1, startDate: -1 });
    } catch (error) {
      console.error('Error getting educations by user ID:', error);
      throw new Error('Failed to get educations');
    }
  }

  /**
   * Get owner educations (using ADMIN_ID from env)
   */
  static async getOwnerEducations(): Promise<IEducation[]> {
    try {
      await connectDB();
      const adminId = process.env.ADMIN_ID;
      if (!adminId) {
        throw new Error('ADMIN_ID is not defined in environment variables');
      }
      return await Education.find({ userId: adminId }).sort({ displayOrder: 1, startDate: -1 });
    } catch (error) {
      console.error('Error getting owner educations:', error);
      throw new Error('Failed to get owner educations');
    }
  }

  /**
   * Get education by ID
   */
  static async getEducationById(id: string): Promise<IEducation | null> {
    try {
      await connectDB();
      return await Education.findById(id);
    } catch (error) {
      console.error('Error getting education by ID:', error);
      throw new Error('Failed to get education');
    }
  }

  /**
   * Create a new education
   */
  static async createEducation(data: CreateEducationData): Promise<IEducation> {
    try {
      await connectDB();
      const education = await Education.create(data);
      return education;
    } catch (error) {
      console.error('Error creating education:', error);
      throw error;
    }
  }

  /**
   * Update education
   */
  static async updateEducation(id: string, userId: string, data: UpdateEducationData): Promise<IEducation | null> {
    try {
      await connectDB();

      const education = await Education.findOneAndUpdate(
        { _id: id, userId },
        { $set: data },
        { new: true, runValidators: true },
      );

      if (!education) {
        throw new Error('Education not found or you do not have permission to update it');
      }

      return education;
    } catch (error) {
      console.error('Error updating education:', error);
      throw error;
    }
  }

  /**
   * Delete education
   */
  static async deleteEducation(id: string, userId: string): Promise<boolean> {
    try {
      await connectDB();

      const result = await Education.findOneAndDelete({ _id: id, userId });

      return !!result;
    } catch (error) {
      console.error('Error deleting education:', error);
      throw new Error('Failed to delete education');
    }
  }
}
