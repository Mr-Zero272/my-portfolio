import connectDB from '@/lib/mongodb';
import { Image, type IImage } from '@/models';
import { BaseResponse } from '@/types/response';

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
}
