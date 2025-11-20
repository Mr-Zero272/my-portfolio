import connectDB from '@/lib/mongodb';
import { Profile, SocialLink, type IProfile, type ISocialLink } from '@/models';
import mongoose from 'mongoose';

export interface CreateProfileData {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  nationality?: string;
  address?: string;
  avatar?: string;
  resumePath?: string;
  tagline?: string;
  bio?: string;
  description?: string;
  freelanceAvailable?: boolean;
  languages?: string[];
  rotatingWords?: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  isActive?: boolean;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  address?: string;
  avatar?: string;
  resumePath?: string;
  tagline?: string;
  bio?: string;
  description?: string;
  freelanceAvailable?: boolean;
  languages?: string[];
  rotatingWords?: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  isActive?: boolean;
}

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

export class ProfileService {
  // ==================== PROFILE METHODS ====================

  /**
   * Get profile by user ID
   */
  static async getProfileByUserId(userId: string): Promise<IProfile | null> {
    try {
      await connectDB();
      return await Profile.findOne({ userId, isActive: true }).populate('userId', 'username email avatar');
    } catch (error) {
      console.error('Error getting profile by user ID:', error);
      throw new Error('Failed to get profile');
    }
  }

  /**
   * Get active profile (for public display)
   */
  static async getActiveProfile(): Promise<IProfile | null> {
    try {
      await connectDB();
      return await Profile.findOne({ isActive: true }).populate('userId', 'username email avatar');
    } catch (error) {
      console.error('Error getting active profile:', error);
      throw new Error('Failed to get active profile');
    }
  }

  /**
   * Create a new profile
   */
  static async createProfile(data: CreateProfileData): Promise<IProfile> {
    try {
      await connectDB();

      // Check if profile already exists for this user
      const existingProfile = await Profile.findOne({ userId: data.userId });
      if (existingProfile) {
        throw new Error('Profile already exists for this user');
      }

      const profile = await Profile.create(data);
      return profile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  /**
   * Update profile
   */
  static async updateProfile(userId: string, data: UpdateProfileData): Promise<IProfile | null> {
    try {
      await connectDB();

      const profile = await Profile.findOneAndUpdate(
        { userId },
        { $set: data },
        { new: true, runValidators: true },
      ).populate('userId', 'username email avatar');

      if (!profile) {
        throw new Error('Profile not found');
      }

      return profile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Delete profile (soft delete by setting isActive to false)
   */
  static async deleteProfile(userId: string): Promise<boolean> {
    try {
      await connectDB();

      const result = await Profile.findOneAndUpdate({ userId }, { $set: { isActive: false } }, { new: true });

      return !!result;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw new Error('Failed to delete profile');
    }
  }

  // ==================== SOCIAL LINK METHODS ====================

  /**
   * Get all social links for a user
   */
  static async getSocialLinksByUserId(userId: string): Promise<ISocialLink[]> {
    try {
      await connectDB();
      return await SocialLink.find({ userId, isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    } catch (error) {
      console.error('Error getting social links:', error);
      throw new Error('Failed to get social links');
    }
  }

  /**
   * Get a single social link by ID
   */
  static async getSocialLinkById(id: string): Promise<ISocialLink | null> {
    try {
      await connectDB();
      return await SocialLink.findById(id);
    } catch (error) {
      console.error('Error getting social link:', error);
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
   * Update a social link
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
        throw new Error('Social link not found');
      }

      return socialLink;
    } catch (error) {
      console.error('Error updating social link:', error);
      throw error;
    }
  }

  /**
   * Delete a social link (soft delete)
   */
  static async deleteSocialLink(id: string, userId: string): Promise<boolean> {
    try {
      await connectDB();

      const result = await SocialLink.findOneAndUpdate(
        { _id: id, userId },
        { $set: { isActive: false } },
        { new: true },
      );

      return !!result;
    } catch (error) {
      console.error('Error deleting social link:', error);
      throw new Error('Failed to delete social link');
    }
  }

  /**
   * Hard delete a social link (permanently remove)
   */
  static async permanentlyDeleteSocialLink(id: string, userId: string): Promise<boolean> {
    try {
      await connectDB();

      const result = await SocialLink.findOneAndDelete({ _id: id, userId });

      return !!result;
    } catch (error) {
      console.error('Error permanently deleting social link:', error);
      throw new Error('Failed to permanently delete social link');
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

  /**
   * Get complete profile with social links
   */
  static async getCompleteProfile(userId: string): Promise<{
    profile: IProfile | null;
    socialLinks: ISocialLink[];
  }> {
    try {
      await connectDB();

      const [profile, socialLinks] = await Promise.all([
        this.getProfileByUserId(userId),
        this.getSocialLinksByUserId(userId),
      ]);

      return {
        profile,
        socialLinks,
      };
    } catch (error) {
      console.error('Error getting complete profile:', error);
      throw new Error('Failed to get complete profile');
    }
  }

  /**
   * Get public profile (active profile with social links)
   */
  static async getPublicProfile(): Promise<{
    profile: IProfile | null;
    socialLinks: ISocialLink[];
  }> {
    try {
      await connectDB();

      const profile = await this.getActiveProfile();

      if (!profile) {
        return {
          profile: null,
          socialLinks: [],
        };
      }

      const socialLinks = await this.getSocialLinksByUserId(profile.userId.toString());

      return {
        profile,
        socialLinks,
      };
    } catch (error) {
      console.error('Error getting public profile:', error);
      throw new Error('Failed to get public profile');
    }
  }
}
