import connectDB from '@/lib/mongodb';
import { Tag, type ITag } from '@/models';
import { BasePaginationResponse, BaseResponse } from '@/types/response';

export class TagService {
  static async getTagById(id: string): Promise<BaseResponse<ITag | null>> {
    try {
      await connectDB();
      const tag = await Tag.findById(id);
      return { status: 'success', data: tag };
    } catch (error) {
      console.error('Error getting tag by ID:', error);
      return { status: 'error', message: 'Error getting tag by ID', data: null as never };
    }
  }

  static async getAllTags({
    limit = 10,
    page = 1,
  }: {
    limit?: number;
    page?: number;
  }): Promise<BasePaginationResponse<ITag>> {
    try {
      await connectDB();
      const skip = (page - 1) * limit;

      const [tags, total] = await Promise.all([
        Tag.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Tag.countDocuments(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        status: 'success',
        data: tags,
        pagination: {
          page: page,
          limit: limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting all tags:', error);
      return {
        status: 'error',
        message: 'Error getting all tags',
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
    }
  }

  static async createTag({ name, slug }: Partial<ITag>): Promise<BaseResponse<ITag>> {
    try {
      await connectDB();
      const newTag = new Tag({ name, slug });
      const result = await newTag.save();
      return { status: 'success', data: result };
    } catch (error) {
      console.error('Error creating tag:', error);
      return { status: 'error', message: 'Error creating tag', data: null as never };
    }
  }

  static async deleteTag(id: string): Promise<BaseResponse<boolean>> {
    try {
      await connectDB();
      const result = await Tag.findByIdAndDelete(id);
      return { status: 'success', data: result ? true : false };
    } catch (error) {
      console.error('Error deleting tag:', error);
      return { status: 'error', message: 'Error deleting tag', data: false };
    }
  }

  static async updateTag({ id, name, slug }: Partial<ITag>): Promise<BaseResponse<ITag>> {
    try {
      await connectDB();
      const updatedTag = await Tag.findByIdAndUpdate(id, { name, slug }, { new: true });
      return { status: 'success', data: updatedTag! };
    } catch (error) {
      console.error('Error updating tag:', error);
      return { status: 'error', message: 'Error updating tag', data: null as never };
    }
  }

  static async getTagsWithPostCount({
    limit = 10,
    page = 1,
    publishedOnly = true,
  }: {
    limit?: number;
    page?: number;
    publishedOnly?: boolean;
  } = {}): Promise<BasePaginationResponse<ITag & { postCount: number }>> {
    try {
      await connectDB();
      const skip = (page - 1) * limit;

      // Build match conditions for posts
      const postMatchConditions: Record<string, unknown> = {};
      if (publishedOnly) {
        postMatchConditions.published = true;
      }

      const pipeline = [
        // Lookup posts for each tag
        {
          $lookup: {
            from: 'posts', // Collection name in MongoDB
            localField: '_id',
            foreignField: 'tags',
            as: 'posts',
            pipeline: postMatchConditions.published !== undefined ? [{ $match: postMatchConditions }] : [],
          },
        },
        // Add post count field
        {
          $addFields: {
            postCount: { $size: '$posts' },
          },
        },
        // Remove the posts array to keep response clean
        {
          $project: {
            _id: 1,
            name: 1,
            slug: 1,
            createdAt: 1,
            updatedAt: 1,
            postCount: 1,
          },
        },
        // Sort by creation date (newest first)
        { $sort: { createdAt: -1 } },
        // Add pagination
        { $skip: skip },
        { $limit: limit },
      ];

      // Get total count for pagination
      const totalPipeline = [
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'tags',
            as: 'posts',
            pipeline: postMatchConditions.published !== undefined ? [{ $match: postMatchConditions }] : [],
          },
        },
        { $count: 'total' },
      ];

      const [tags, totalResult] = await Promise.all([Tag.aggregate(pipeline as never), Tag.aggregate(totalPipeline)]);

      const total = totalResult[0]?.total || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        status: 'success',
        data: tags,
        pagination: {
          page: page,
          limit: limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting tags with post count:', error);
      return {
        status: 'error',
        message: 'Error getting tags with post count',
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
    }
  }

  static async getTagsStats(): Promise<
    BaseResponse<{
      totalTags: number;
      totalPosts: number;
      tagsWithMostPosts: Array<{ name: string; slug: string; postCount: number }>;
    }>
  > {
    try {
      await connectDB();

      const pipeline = [
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'tags',
            as: 'posts',
            pipeline: [{ $match: { published: true } }],
          },
        },
        {
          $addFields: {
            postCount: { $size: '$posts' },
          },
        },
        {
          $project: {
            name: 1,
            slug: 1,
            postCount: 1,
          },
        },
        { $sort: { postCount: -1 } },
      ];

      const [tagsWithCounts, totalTags, totalPosts] = await Promise.all([
        Tag.aggregate(pipeline as never),
        Tag.countDocuments(),
        Tag.aggregate([
          {
            $lookup: {
              from: 'posts',
              localField: '_id',
              foreignField: 'tags',
              as: 'posts',
              pipeline: [{ $match: { published: true } }],
            },
          },
          {
            $unwind: '$posts',
          },
          {
            $count: 'total',
          },
          {
            $sort: { total: -1 },
          },
        ]),
      ]);

      const tagsWithMostPosts = tagsWithCounts.slice(0, 5); // Top 5 tags
      const totalPostsCount = totalPosts[0]?.total || 0;

      return {
        status: 'success',
        data: {
          totalTags,
          totalPosts: totalPostsCount,
          tagsWithMostPosts,
        },
      };
    } catch (error) {
      console.error('Error getting tags statistics:', error);
      return {
        status: 'error',
        message: 'Error getting tags statistics',
        data: null as never,
      };
    }
  }
}
