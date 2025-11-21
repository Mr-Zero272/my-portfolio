import apiClient from '@/lib/axios';
import type { IProfile, ISocialLink } from '@/models';

export interface ProfileWithSocialLinks {
  profile: IProfile | null;
  socialLinks: ISocialLink[];
}

export interface CreateProfileDto {
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
}

export interface UpdateProfileDto {
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

export interface CreateSocialLinkDto {
  platform: string;
  url: string;
  username?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateSocialLinkDto {
  platform?: string;
  url?: string;
  username?: string;
  isActive?: boolean;
  displayOrder?: number;
}

// ==================== PROFILE APIs ====================

/**
 * Get public profile (active profile with social links)
 */
export const getPublicProfile = async (): Promise<ProfileWithSocialLinks> => {
  const response = await apiClient.get<ProfileWithSocialLinks>('/api/profile?public=true');
  return response.data;
};

/**
 * Get profile by user ID
 */
export const getProfileByUserId = async (userId: string): Promise<ProfileWithSocialLinks> => {
  const response = await apiClient.get<ProfileWithSocialLinks>(`/api/profile?userId=${userId}`);
  return response.data;
};

/**
 * Get authenticated user's profile
 */
export const getMyProfile = async (): Promise<ProfileWithSocialLinks> => {
  const response = await apiClient.get<ProfileWithSocialLinks>('/api/profile');
  return response.data;
};

/**
 * Create a new profile
 */
export const createProfile = async (data: CreateProfileDto): Promise<IProfile> => {
  const response = await apiClient.post<IProfile>('/api/profile', data);
  return response.data;
};

/**
 * Update profile
 */
export const updateProfile = async (data: UpdateProfileDto): Promise<IProfile> => {
  const response = await apiClient.patch<IProfile>('/api/profile', data);
  return response.data;
};

/**
 * Delete profile
 */
export const deleteProfile = async (): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>('/api/profile');
  return response.data;
};

// ==================== SOCIAL LINK APIs ====================

/**
 * Get all social links for a user
 */
export const getSocialLinksByUserId = async (userId?: string): Promise<ISocialLink[]> => {
  const url = userId ? `/api/social-links?userId=${userId}` : '/api/social-links';
  const response = await apiClient.get<ISocialLink[]>(url);
  return response.data;
};

/**
 * Get a single social link by ID
 */
export const getSocialLinkById = async (id: string): Promise<ISocialLink> => {
  const response = await apiClient.get<ISocialLink>(`/api/social-links/${id}`);
  return response.data;
};

/**
 * Create a new social link
 */
export const createSocialLink = async (data: CreateSocialLinkDto): Promise<ISocialLink> => {
  const response = await apiClient.post<ISocialLink>('/api/social-links', data);
  return response.data;
};

/**
 * Update a social link
 */
export const updateSocialLink = async (id: string, data: UpdateSocialLinkDto): Promise<ISocialLink> => {
  const response = await apiClient.patch<ISocialLink>(`/api/social-links/${id}`, data);
  return response.data;
};

/**
 * Delete a social link (soft delete)
 */
export const deleteSocialLink = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/api/social-links/${id}`);
  return response.data;
};

/**
 * Permanently delete a social link
 */
export const permanentlyDeleteSocialLink = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/api/social-links/${id}?permanent=true`);
  return response.data;
};

/**
 * Reorder social links
 */
export const reorderSocialLinks = async (orderedIds: string[]): Promise<{ message: string }> => {
  const response = await apiClient.patch<{ message: string }>('/api/social-links', { orderedIds });
  return response.data;
};

// ==================== PROFILE API OBJECT ====================

export const profileApi = {
  // Profile methods
  getProfile: getMyProfile,
  getProfileByUserId,
  getPublicProfile,
  createProfile,
  updateProfile,
  deleteProfile,

  // Social link methods
  getSocialLinks: getSocialLinksByUserId,
  getSocialLinkById,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  permanentlyDeleteSocialLink,
  reorderSocialLinks,
};
