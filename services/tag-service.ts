import connectDB from '@/lib/mongodb';
import Tag, { ITag } from '@/models/Tag';

export class TagService {
  static async getTagById(id: string): Promise<ITag | null> {
    try {
      await connectDB();
      return await Tag.findById(id);
    } catch (error) {
      console.error('Error getting tag by ID:', error);
      return null;
    }
  }

  static async getAllTags({
    limit = 10,
    page = 1,
  }: {
    limit?: number;
    page?: number;
  }): Promise<{ data: ITag[]; total: number; totalPages: number; page: number; limit: number } | []> {
    try {
      await connectDB();
      const skip = (page - 1) * limit;

      const [tags, total] = await Promise.all([
        Tag.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Tag.countDocuments(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: tags,
        page: page,
        limit: limit,
        total,
        totalPages,
      };
    } catch (error) {
      console.error('Error getting all tags:', error);
      return [];
    }
  }

  static async createTag({ name, slug }: Partial<ITag>): Promise<ITag | null> {
    try {
      await connectDB();
      const newTag = new Tag({ name, slug });
      return await newTag.save();
    } catch (error) {
      console.error('Error creating tag:', error);
      return null;
    }
  }

  static async deleteTag(id: string): Promise<boolean> {
    try {
      await connectDB();
      const result = await Tag.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting tag:', error);
      return false;
    }
  }

  static async updateTag({ id, name, slug }: Partial<ITag>): Promise<ITag | null> {
    try {
      await connectDB();
      const updatedTag = await Tag.findByIdAndUpdate(id, { name, slug }, { new: true });
      return updatedTag;
    } catch (error) {
      console.error('Error updating tag:', error);
      return null;
    }
  }
}
