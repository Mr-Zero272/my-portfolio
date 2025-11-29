import connectDB from '@/lib/mongodb';
import { Project, type IProject } from '@/models';

export interface CreateProjectData {
  userId: string;
  name: string;
  slug: string;
  description: string;
  responsibilities?: string;
  type?: string;
  status?: string;
  images?: string[];
  thumbnailImage?: string;
  demoUrl?: string;
  sourceCodeUrl?: string;
  technologies?: string[];
  databases?: string[];
  startDate?: Date;
  endDate?: Date;
  isFeatured?: boolean;
  displayOrder?: number;
  isVisible?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateProjectData {
  name?: string;
  slug?: string;
  description?: string;
  responsibilities?: string;
  type?: string;
  status?: string;
  images?: string[];
  thumbnailImage?: string;
  demoUrl?: string;
  sourceCodeUrl?: string;
  technologies?: string[];
  databases?: string[];
  startDate?: Date;
  endDate?: Date;
  isFeatured?: boolean;
  displayOrder?: number;
  isVisible?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export class ProjectService {
  /**
   * Get projects by user ID
   */
  static async getProjectsByUserId(userId: string): Promise<IProject[]> {
    try {
      await connectDB();
      return await Project.find({ userId }).sort({ displayOrder: 1, createdAt: -1 });
    } catch (error) {
      console.error('Error getting projects by user ID:', error);
      throw new Error('Failed to get projects');
    }
  }

  /**
   * Get owner projects (using ADMIN_ID from env)
   */
  static async getOwnerProjects(): Promise<IProject[]> {
    try {
      await connectDB();
      const adminId = process.env.ADMIN_ID;
      if (!adminId) {
        throw new Error('ADMIN_ID is not defined in environment variables');
      }
      return await Project.find({ userId: adminId }).sort({ displayOrder: 1, createdAt: -1 });
    } catch (error) {
      console.error('Error getting owner projects:', error);
      throw new Error('Failed to get owner projects');
    }
  }

  /**
   * Get project by ID
   */
  static async getProjectById(id: string): Promise<IProject | null> {
    try {
      await connectDB();
      return await Project.findById(id);
    } catch (error) {
      console.error('Error getting project by ID:', error);
      throw new Error('Failed to get project');
    }
  }

  /**
   * Create a new project
   */
  static async createProject(data: CreateProjectData): Promise<IProject> {
    try {
      await connectDB();

      // Check if slug already exists
      const existingProject = await Project.findOne({ slug: data.slug });
      if (existingProject) {
        throw new Error(`Project with slug '${data.slug}' already exists`);
      }

      const project = await Project.create(data);
      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Update project
   */
  static async updateProject(id: string, userId: string, data: UpdateProjectData): Promise<IProject | null> {
    try {
      await connectDB();

      // If slug is being updated, check for duplicates
      if (data.slug) {
        const existingProject = await Project.findOne({
          slug: data.slug,
          _id: { $ne: id },
        });

        if (existingProject) {
          throw new Error(`Project with slug '${data.slug}' already exists`);
        }
      }

      const project = await Project.findOneAndUpdate(
        { _id: id, userId },
        { $set: data },
        { new: true, runValidators: true },
      );

      if (!project) {
        throw new Error('Project not found or you do not have permission to update it');
      }

      return project;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  /**
   * Delete project (Hard delete)
   */
  static async deleteProject(id: string, userId: string): Promise<boolean> {
    try {
      await connectDB();

      const result = await Project.findOneAndDelete({ _id: id, userId });

      return !!result;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  }
}
