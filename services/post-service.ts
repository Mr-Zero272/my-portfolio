import connectDB from '@/lib/mongodb';

import { Post, type IPost } from '@/models';
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

      // Validate and sanitize data
      const sanitizedData = { ...data };

      // Sanitize keywords - remove empty strings and trim
      if (sanitizedData.keywords) {
        sanitizedData.keywords = sanitizedData.keywords
          .map((keyword) => keyword.trim())
          .filter((keyword) => keyword.length > 0);
      }

      // Validate authors ObjectIds
      if (sanitizedData.authors && sanitizedData.authors.length > 0) {
        const invalidAuthorIds = sanitizedData.authors.filter((authorId) => !mongoose.Types.ObjectId.isValid(authorId));
        if (invalidAuthorIds.length > 0) {
          throw new Error(`Invalid author IDs: ${invalidAuthorIds.join(', ')}`);
        }
      }

      // Validate tags ObjectIds
      if (sanitizedData.tags && sanitizedData.tags.length > 0) {
        const invalidTagIds = sanitizedData.tags.filter((tagId) => !mongoose.Types.ObjectId.isValid(tagId));
        if (invalidTagIds.length > 0) {
          throw new Error(`Invalid tag IDs: ${invalidTagIds.join(', ')}`);
        }
      }

      const newPost = new Post(sanitizedData);
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

      const posts = await Post.find(query).populate('authors tags').sort({ createdAt: -1 }).skip(skip).limit(limit);
      const total = await Post.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      return { status: 'success', data: posts, pagination: { total, page, limit, totalPages } };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  static async getPostBySlug(slug: string): Promise<BaseResponse<IPost | null>> {
    try {
      await connectDB();

      const post = await Post.findOne({ slug }).populate('authors tags comments');
      return { status: 'success', data: post };
    } catch (error) {
      console.error('Error fetching post:', error);
      return { status: 'error', message: 'Error fetching post', data: null as never };
    }
  }

  static async updatePost(slugOrId: string, data: Partial<IPost>): Promise<BaseResponse<IPost | null>> {
    try {
      await connectDB();

      // First, find the current post to get its current slug
      const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);
      const query = isObjectId ? { _id: slugOrId } : { slug: slugOrId };

      const currentPost = await Post.findOne(query);
      if (!currentPost) {
        throw new Error('Post not found');
      }

      // If updating slug, check for conflicts
      if (data.slug && data.slug !== currentPost.slug) {
        const existingPost = await Post.findOne({ slug: data.slug });
        if (existingPost) {
          throw new Error('Post with this slug already exists');
        }
      }

      // Validate and sanitize update data
      const sanitizedData = { ...data };

      // Sanitize keywords - remove empty strings and trim
      if (sanitizedData.keywords) {
        sanitizedData.keywords = sanitizedData.keywords
          .map((keyword) => keyword.trim())
          .filter((keyword) => keyword.length > 0);
      }

      // Validate authors ObjectIds
      if (sanitizedData.authors && sanitizedData.authors.length > 0) {
        const invalidAuthorIds = sanitizedData.authors.filter((authorId) => !mongoose.Types.ObjectId.isValid(authorId));
        if (invalidAuthorIds.length > 0) {
          throw new Error(`Invalid author IDs: ${invalidAuthorIds.join(', ')}`);
        }
      }

      // Validate tags ObjectIds
      if (sanitizedData.tags && sanitizedData.tags.length > 0) {
        const invalidTagIds = sanitizedData.tags.filter((tagId) => !mongoose.Types.ObjectId.isValid(tagId));
        if (invalidTagIds.length > 0) {
          throw new Error(`Invalid tag IDs: ${invalidTagIds.join(', ')}`);
        }
      }

      const updatedPost = await Post.findOneAndUpdate(query, sanitizedData, {
        new: true,
        runValidators: true,
      }).populate('authors tags');
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
          { keywords: { $in: [new RegExp(searchTerm, 'i')] } },
        ],
      };

      const query: typeof baseQuery & { published?: boolean; tags?: string } = { ...baseQuery };

      if (published !== undefined) {
        query.published = published;
      }

      if (tag && mongoose.Types.ObjectId.isValid(tag)) {
        query.tags = tag;
      }

      const posts = await Post.find(query).populate('authors tags').sort({ createdAt: -1 }).skip(skip).limit(limit);
      const total = await Post.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      return { status: 'success', data: posts, pagination: { total, page, limit, totalPages } };
    } catch (error) {
      console.error('Error searching posts:', error);
      return {
        status: 'error',
        message: 'Error searching posts',
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 0,
          totalPages: 0,
        },
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

  static async getAllPostSlugs(): Promise<BaseResponse<string[]>> {
    try {
      await connectDB();
      const posts = await Post.find(
        {
          published: true,
        },
        'slug',
      );
      const slugs = posts.map((post) => post.slug);
      return { status: 'success', data: slugs };
    } catch (error) {
      console.error('Error fetching post slugs:', error);
      return { status: 'error', message: 'Error fetching post slugs', data: [] };
    }
  }

  static async getStatisticsByStatus(): Promise<BaseResponse<{ published: number; unpublished: number }>> {
    try {
      await connectDB();
      const publishedCount = await Post.countDocuments({ published: true });
      const unpublishedCount = await Post.countDocuments({ published: false });
      return { status: 'success', data: { published: publishedCount, unpublished: unpublishedCount } };
    } catch (error) {
      console.error('Error fetching post statistics:', error);
      return { status: 'error', message: 'Error fetching post statistics', data: { published: 0, unpublished: 0 } };
    }
  }

  static async likePost(slug: string, userId: string): Promise<BaseResponse<IPost | null>> {
    try {
      await connectDB();
      const post = (await Post.findOne({ slug })) as IPost & { likedBy: mongoose.Types.ObjectId[] };
      if (!post) {
        return { status: 'error', message: 'Post not found', data: null as never };
      }

      // Check if user already liked the post
      const userObjectId = new mongoose.Types.ObjectId(userId);
      if (post.likedBy.some((id: mongoose.Types.ObjectId) => id.equals(userObjectId))) {
        return { status: 'error', message: 'User already liked this post', data: null as never };
      }

      post.likes += 1;
      post.likedBy.push(userObjectId);
      await post.save();
      return { status: 'success', data: post };
    } catch (error) {
      console.error('Error liking post:', error);
      return { status: 'error', message: 'Error liking post', data: null as never };
    }
  }

  static async unlikePost(slug: string, userId: string): Promise<BaseResponse<IPost | null>> {
    try {
      await connectDB();
      const post = (await Post.findOne({ slug })) as IPost & { likedBy: mongoose.Types.ObjectId[] };
      if (!post) {
        return { status: 'error', message: 'Post not found', data: null as never };
      }

      // Check if user has liked the post
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const likedIndex = post.likedBy.findIndex((id: mongoose.Types.ObjectId) => id.equals(userObjectId));
      if (likedIndex === -1) {
        return { status: 'error', message: 'User has not liked this post', data: null as never };
      }

      post.likes -= 1;
      post.likedBy.splice(likedIndex, 1);
      await post.save();
      return { status: 'success', data: post };
    } catch (error) {
      console.error('Error unliking post:', error);
      return { status: 'error', message: 'Error unliking post', data: null as never };
    }
  }

  static async incrementViews(slug: string): Promise<BaseResponse<{ views: number }>> {
    try {
      const res = await fetch(`/api/posts/${slug}/view`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to increment views');
      }
      return data;
    } catch (error) {
      console.error('Error incrementing views:', error);
      return { status: 'error', message: 'Error incrementing views', data: { views: 0 } };
    }
  }
}
