import connectDB from '@/lib/mongodb';
import { Image, type IImage } from '@/models';
import { BaseResponse } from '@/types/response';

interface IFilter {
  [key: string]: unknown;
}

export class ImageService {
  static async getImageById(id: string): Promise<BaseResponse<IImage | null>> {
    try {
      await connectDB();
      const image = await Image.findById(id);
      return { status: 'success', data: image };
    } catch (error) {
      console.error('Error getting image by ID:', error);
      return { status: 'error', message: 'Error getting image by ID', data: null as never };
    }
  }

  static async getAllImages(
    options: {
      page?: number;
      limit?: number;
      userCreated?: string;
    } = {},
  ): Promise<BaseResponse<{ images: IImage[]; total: number; totalPages: number }>> {
    try {
      await connectDB();
      const { page = 1, limit = 10, userCreated } = options;
      const skip = (page - 1) * limit;

      const filter: IFilter = {};
      if (userCreated) {
        filter.userCreated = userCreated;
      }

      const [images, total] = await Promise.all([
        Image.find(filter).populate('userCreated', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
        Image.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        status: 'success',
        data: { images, total, totalPages },
      };
    } catch (error) {
      console.error('Error getting all images:', error);
      return {
        status: 'error',
        message: 'Error getting all images',
        data: null as never,
      };
    }
  }

  static async createImage(data: Partial<IImage>): Promise<BaseResponse<IImage | null>> {
    try {
      await connectDB();
      const newImage = new Image(data);
      const result = await newImage.save();
      return { status: 'success', data: result };
    } catch (error) {
      console.error('Error creating image:', error);
      return { status: 'error', message: 'Error creating image', data: null as never };
    }
  }

  static async updateImage(id: string, data: Partial<IImage>): Promise<BaseResponse<IImage | null>> {
    try {
      await connectDB();
      const updatedImage = await Image.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true },
      ).populate('userCreated', 'name email');

      if (!updatedImage) {
        return { status: 'error', message: 'Image not found', data: null as never };
      }

      return { status: 'success', data: updatedImage };
    } catch (error) {
      console.error('Error updating image:', error);
      return { status: 'error', message: 'Error updating image', data: null as never };
    }
  }

  static async deleteImage(id: string): Promise<BaseResponse<{ message: string }>> {
    try {
      await connectDB();
      const deletedImage = await Image.findByIdAndDelete(id);

      if (!deletedImage) {
        return { status: 'error', message: 'Image not found', data: null as never };
      }

      return { status: 'success', data: { message: 'Image deleted successfully' } };
    } catch (error) {
      console.error('Error deleting image:', error);
      return { status: 'error', message: 'Error deleting image', data: null as never };
    }
  }

  static async getImagesByUser(
    userId: string,
    options: {
      page?: number;
      limit?: number;
    } = {},
  ): Promise<BaseResponse<{ images: IImage[]; total: number; totalPages: number }>> {
    try {
      await connectDB();
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const [images, total] = await Promise.all([
        Image.find({ userCreated: userId })
          .populate('userCreated', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Image.countDocuments({ userCreated: userId }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        status: 'success',
        data: { images, total, totalPages },
      };
    } catch (error) {
      console.error('Error getting images by user:', error);
      return {
        status: 'error',
        message: 'Error getting images by user',
        data: null as never,
      };
    }
  }

  static async searchImages(
    query: string,
    options: {
      page?: number;
      limit?: number;
      userCreated?: string;
    } = {},
  ): Promise<BaseResponse<{ images: IImage[]; total: number; totalPages: number }>> {
    try {
      await connectDB();
      const { page = 1, limit = 10, userCreated } = options;
      const skip = (page - 1) * limit;

      const filter: IFilter = {
        $or: [{ name: { $regex: query, $options: 'i' } }, { caption: { $regex: query, $options: 'i' } }],
      };

      if (userCreated) {
        filter.userCreated = userCreated;
      }

      const [images, total] = await Promise.all([
        Image.find(filter).populate('userCreated', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
        Image.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        status: 'success',
        data: { images, total, totalPages },
      };
    } catch (error) {
      console.error('Error searching images:', error);
      return {
        status: 'error',
        message: 'Error searching images',
        data: null as never,
      };
    }
  }
}
