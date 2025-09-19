import connectDB from '@/lib/mongodb';
import Tag, { ITag } from '@/models/Tag';
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
        Tag.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Tag.countDocuments(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        status: 'success',
        data: tags,
        page: page,
        limit: limit,
        total,
        totalPages,
      };
    } catch (error) {
      console.error('Error getting all tags:', error);
      return { status: 'error', message: 'Error getting all tags', data: [], page: 1, limit, total: 0, totalPages: 0 };
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
}
