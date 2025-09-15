import connectDB from '@/lib/mongodb';
import Post, { IPost } from '@/models/Post';
import mongoose from 'mongoose';

export interface PostQueryOptions {
  published?: boolean;
  tag?: string;
  page?: number;
  limit?: number;
}

export class PostService {
  static async createPost(data: Partial<IPost>): Promise<IPost> {
    try {
      await connectDB();

      // Validate required fields
      if (!data.title || !data.slug || !data.content) {
        throw new Error('Title, slug, and content are required');
      }

      // Check if slug already exists
      const existingPost = await Post.findOne({ slug: data.slug });
      if (existingPost) {
        throw new Error('Post with this slug already exists');
      }

      const newPost = new Post(data);
      return await newPost.save();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error; // Re-throw để caller có thể handle
    }
  }

  static async getAllPosts(options: PostQueryOptions = {}): Promise<IPost[]> {
    try {
      await connectDB();

      const { published, tag, page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const query: { published?: boolean; tags?: string } = {};

      if (published !== undefined) {
        query.published = published;
      }

      if (tag) {
        if (mongoose.Types.ObjectId.isValid(tag)) {
          query.tags = tag;
        }
      }

      return await Post.find(query).populate('tags').sort({ createdAt: -1 }).skip(skip).limit(limit);
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  static async getPostBySlug(slug: string): Promise<IPost | null> {
    try {
      await connectDB();
      return await Post.findOne({ slug }).populate('tags comments');
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  static async updatePost(slug: string, data: Partial<IPost>): Promise<IPost | null> {
    try {
      await connectDB();

      // If updating slug, check for conflicts
      if (data.slug && data.slug !== slug) {
        const existingPost = await Post.findOne({ slug: data.slug });
        if (existingPost) {
          throw new Error('Post with this slug already exists');
        }
      }

      return await Post.findOneAndUpdate({ slug }, data, { new: true, runValidators: true }).populate('tags');
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  static async deletePost(slug: string): Promise<boolean> {
    try {
      await connectDB();
      const result = await Post.findOneAndDelete({ slug });
      return !!result;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  static async searchPosts(searchTerm: string, options: PostQueryOptions = {}): Promise<IPost[]> {
    try {
      await connectDB();

      const { published, tag, page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const baseQuery = {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { content: { $regex: searchTerm, $options: 'i' } },
          { metaDescription: { $regex: searchTerm, $options: 'i' } },
        ],
      };

      const query: typeof baseQuery & { published?: boolean; tags?: string } = { ...baseQuery };

      if (published !== undefined) {
        query.published = published;
      }

      if (tag && mongoose.Types.ObjectId.isValid(tag)) {
        query.tags = tag;
      }

      return await Post.find(query).populate('tags').sort({ createdAt: -1 }).skip(skip).limit(limit);
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }

  static async getPostCount(options: { published?: boolean; tag?: string } = {}): Promise<number> {
    try {
      await connectDB();

      const query: { published?: boolean; tags?: string } = {};

      if (options.published !== undefined) {
        query.published = options.published;
      }

      if (options.tag && mongoose.Types.ObjectId.isValid(options.tag)) {
        query.tags = options.tag;
      }

      return await Post.countDocuments(query);
    } catch (error) {
      console.error('Error counting posts:', error);
      throw error;
    }
  }
}
