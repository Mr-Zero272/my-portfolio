import connectDB from '@/lib/mongodb';
import Skill, { type ISkill, type ProficiencyLevel, type SkillCategory } from '@/models/Skill';

export interface CreateSkillData {
  userId: string;
  name: string;
  proficiency: ProficiencyLevel;
  category: SkillCategory;
  icon?: string;
  iconColor?: string;
  description?: string;
  yearsOfExperience?: number;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface UpdateSkillData {
  name?: string;
  proficiency?: ProficiencyLevel;
  category?: SkillCategory;
  icon?: string;
  iconColor?: string;
  description?: string;
  yearsOfExperience?: number;
  displayOrder?: number;
  isVisible?: boolean;
}

export class SkillService {
  /**
   * Get skills by user ID
   */
  static async getSkillsByUserId(userId: string): Promise<ISkill[]> {
    try {
      await connectDB();
      return await Skill.find({ userId }).sort({ displayOrder: 1, createdAt: -1 });
    } catch (error) {
      console.error('Error getting skills by user ID:', error);
      throw new Error('Failed to get skills');
    }
  }

  /**
   * Get owner skills (using ADMIN_ID from env)
   */
  static async getOwnerSkills(): Promise<ISkill[]> {
    try {
      await connectDB();
      const adminId = process.env.ADMIN_ID;
      if (!adminId) {
        throw new Error('ADMIN_ID is not defined in environment variables');
      }
      return await Skill.find({ userId: adminId }).sort({ displayOrder: 1, createdAt: -1 });
    } catch (error) {
      console.error('Error getting owner skills:', error);
      throw new Error('Failed to get owner skills');
    }
  }

  /**
   * Get skill by ID
   */
  static async getSkillById(id: string): Promise<ISkill | null> {
    try {
      await connectDB();
      return await Skill.findById(id);
    } catch (error) {
      console.error('Error getting skill by ID:', error);
      throw new Error('Failed to get skill');
    }
  }

  /**
   * Create a new skill
   */
  static async createSkill(data: CreateSkillData): Promise<ISkill> {
    try {
      await connectDB();
      const skill = await Skill.create(data);
      return skill;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  }

  /**
   * Update skill
   */
  static async updateSkill(id: string, userId: string, data: UpdateSkillData): Promise<ISkill | null> {
    try {
      await connectDB();

      const skill = await Skill.findOneAndUpdate(
        { _id: id, userId },
        { $set: data },
        { new: true, runValidators: true },
      );

      if (!skill) {
        throw new Error('Skill not found or you do not have permission to update it');
      }

      return skill;
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  }

  /**
   * Delete skill
   */
  static async deleteSkill(id: string, userId: string): Promise<boolean> {
    try {
      await connectDB();

      const result = await Skill.findOneAndDelete({ _id: id, userId });

      return !!result;
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw new Error('Failed to delete skill');
    }
  }
}
