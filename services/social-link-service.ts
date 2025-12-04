import connectDB from '@/lib/mongodb';
import SocialLink, { type ISocialLink } from '@/models/SocialLink';
import mongoose from 'mongoose';

export interface CreateSocialLinkData {
  userId: string;
  platform: string;
  url: string;
  username?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateSocialLinkData {
  platform?: string;
  url?: string;
  username?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export class SocialLinkService {
  /**
   * Get social links by user ID
   */
  static async getSocialLinksByUserId(userId: string): Promise<ISocialLink[]> {
    try {
      await connectDB();
      return await SocialLink.find({ userId }).sort({ displayOrder: 1, createdAt: 1 });
    } catch (error) {
      console.error('Error getting social links by user ID:', error);
      throw new Error('Failed to get social links');
    }
  }

  /**
   * Get owner social links (using ADMIN_ID from env)
   */
  static async getOwnerSocialLinks({ limit = 10 }: { limit?: number }): Promise<ISocialLink[]> {
    try {
      await connectDB();
      const adminId = process.env.ADMIN_ID;
      if (!adminId) {
        throw new Error('ADMIN_ID is not defined in environment variables');
      }
      return await SocialLink.find({ userId: adminId }).sort({ displayOrder: 1, createdAt: 1 }).limit(limit);
    } catch (error) {
      console.error('Error getting owner social links:', error);
      throw new Error('Failed to get owner social links');
    }
  }

  /**
   * Get social link by ID
   */
  static async getSocialLinkById(id: string): Promise<ISocialLink | null> {
    try {
      await connectDB();
      return await SocialLink.findById(id);
    } catch (error) {
      console.error('Error getting social link by ID:', error);
      throw new Error('Failed to get social link');
    }
  }

  /**
   * Create a new social link
   */
  static async createSocialLink(data: CreateSocialLinkData): Promise<ISocialLink> {
    try {
      await connectDB();

      // Check if social link with same platform already exists for this user
      const existingLink = await SocialLink.findOne({
        userId: data.userId,
        platform: data.platform.toLowerCase(),
      });

      if (existingLink) {
        throw new Error(`Social link for platform '${data.platform}' already exists`);
      }

      const socialLink = await SocialLink.create({
        ...data,
        platform: data.platform.toLowerCase(),
      });

      return socialLink;
    } catch (error) {
      console.error('Error creating social link:', error);
      throw error;
    }
  }

  /**
   * Update social link
   */
  static async updateSocialLink(id: string, userId: string, data: UpdateSocialLinkData): Promise<ISocialLink | null> {
    try {
      await connectDB();

      // If platform is being updated, check for duplicates
      if (data.platform) {
        const existingLink = await SocialLink.findOne({
          userId,
          platform: data.platform.toLowerCase(),
          _id: { $ne: id },
        });

        if (existingLink) {
          throw new Error(`Social link for platform '${data.platform}' already exists`);
        }

        data.platform = data.platform.toLowerCase();
      }

      const socialLink = await SocialLink.findOneAndUpdate(
        { _id: id, userId },
        { $set: data },
        { new: true, runValidators: true },
      );

      if (!socialLink) {
        throw new Error('Social link not found or you do not have permission to update it');
      }

      return socialLink;
    } catch (error) {
      console.error('Error updating social link:', error);
      throw error;
    }
  }

  /**
   * Delete social link
   */
  static async deleteSocialLink(id: string, userId: string): Promise<boolean> {
    try {
      await connectDB();

      const result = await SocialLink.findOneAndDelete({ _id: id, userId });

      return !!result;
    } catch (error) {
      console.error('Error deleting social link:', error);
      throw new Error('Failed to delete social link');
    }
  }

  /**
   * Reorder social links
   */
  static async reorderSocialLinks(userId: string, orderedIds: string[]): Promise<boolean> {
    try {
      await connectDB();

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Update display order for each social link
        for (let i = 0; i < orderedIds.length; i++) {
          await SocialLink.findOneAndUpdate({ _id: orderedIds[i], userId }, { $set: { displayOrder: i } }, { session });
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
      console.error('Error reordering social links:', error);
      throw new Error('Failed to reorder social links');
    }
  }
}
