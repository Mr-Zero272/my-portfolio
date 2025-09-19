import connectDB from '@/lib/mongodb';
import Post, { IPost } from '@/models/Post';
import { BasePaginationResponse, BaseResponse } from '@/types/response';
import mongoose from 'mongoose';

export interface PostQueryOptions {
  published?: boolean;
  tag?: string;
  page?: number;
  limit?: number;
}

export class PostService {
  static async createPost(data: Partial<IPost>): Promise<BaseResponse<IPost | null>> {
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
      const result = await newPost.save();
      return { status: 'success', data: result };
    } catch (error) {
      console.error('Error creating post:', error);
      return { status: 'error', message: (error as Error).message || 'Error creating post', data: null as never };
    }
  }

  static async getAllPosts(options: PostQueryOptions = {}): Promise<BasePaginationResponse<IPost>> {
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

      const posts = await Post.find(query).populate('tags').sort({ createdAt: -1 }).skip(skip).limit(limit);
      const total = await Post.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      return { status: 'success', data: posts, total, page, limit, totalPages };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  static async getPostBySlug(slug: string): Promise<BaseResponse<IPost | null>> {
    try {
      await connectDB();
      const post = await Post.findOne({ slug }).populate('tags comments');
      return { status: 'success', data: post };
    } catch (error) {
      console.error('Error fetching post:', error);
      return { status: 'error', message: 'Error fetching post', data: null as never };
    }
  }

  static async updatePost(slug: string, data: Partial<IPost>): Promise<BaseResponse<IPost | null>> {
    try {
      await connectDB();

      // If updating slug, check for conflicts
      if (data.slug && data.slug !== slug) {
        const existingPost = await Post.findOne({ slug: data.slug });
        if (existingPost) {
          throw new Error('Post with this slug already exists');
        }
      }

      const updatedPost = await Post.findOneAndUpdate({ slug }, data, { new: true, runValidators: true }).populate(
        'tags',
      );
      return { status: 'success', data: updatedPost };
    } catch (error) {
      console.error('Error updating post:', error);
      return { status: 'error', message: (error as Error).message || 'Error updating post', data: null as never };
    }
  }

  static async deletePost(slug: string): Promise<BaseResponse<boolean>> {
    try {
      await connectDB();
      const result = await Post.findOneAndDelete({ slug });
      return { status: 'success', data: result ? true : false };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { status: 'error', message: 'Error deleting post', data: false };
    }
  }

  static async searchPosts(searchTerm: string, options: PostQueryOptions = {}): Promise<BasePaginationResponse<IPost>> {
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

      const posts = await Post.find(query).populate('tags').sort({ createdAt: -1 }).skip(skip).limit(limit);
      const total = await Post.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      return { status: 'success', data: posts, total, page, limit, totalPages };
    } catch (error) {
      console.error('Error searching posts:', error);
      return {
        status: 'error',
        message: 'Error searching posts',
        data: [],
        total: 0,
        page: 1,
        limit: 0,
        totalPages: 0,
      };
    }
  }

  static async getPostCount(
    options: { published?: boolean; tag?: string } = {},
  ): Promise<BaseResponse<{ count: number }>> {
    try {
      await connectDB();

      const query: { published?: boolean; tags?: string } = {};

      if (options.published !== undefined) {
        query.published = options.published;
      }

      if (options.tag && mongoose.Types.ObjectId.isValid(options.tag)) {
        query.tags = options.tag;
      }

      const count = await Post.countDocuments(query);
      return { status: 'success', data: { count } };
    } catch (error) {
      console.error('Error counting posts:', error);
      return { status: 'error', message: 'Error counting posts', data: { count: 0 } };
    }
  }
}
