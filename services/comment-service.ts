import connectDB from '@/lib/mongodb';
import { Comment, Post, type IComment } from '@/models';
import { BasePaginationResponse, BaseResponse } from '@/types/response';
import mongoose from 'mongoose';

export class CommentService {
  /**
   * Tạo comment mới
   */
  static async createComment(data: {
    postId: string;
    content: string;
    author: string;
  }): Promise<BaseResponse<IComment>> {
    try {
      await connectDB();

      // Validate required fields
      if (!data.postId || !data.content || !data.author) {
        throw new Error('PostId, content, and author are required');
      }

      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(data.postId)) {
        throw new Error('Invalid postId format');
      }

      // Check if post exists
      const post = await Post.findById(data.postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // Create comment
      const newComment = new Comment({
        postId: new mongoose.Types.ObjectId(data.postId),
        content: data.content.trim(),
        author: data.author.trim(),
      });

      const savedComment = await newComment.save();

      // Add comment to post's comments array
      await Post.findByIdAndUpdate(data.postId, { $push: { comments: savedComment._id } }, { new: true });

      return {
        status: 'success',
        data: savedComment,
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      return { status: 'error', message: (error as Error).message || 'Error creating comment', data: null as never };
    }
  }

  /**
   * Lấy tất cả comment của một post
   */
  static async getCommentsByPostId({
    postId,
    page = 1,
    limit = 10,
  }: {
    postId: string;
    page?: number;
    limit?: number;
  }): Promise<BasePaginationResponse<IComment>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid postId format');
      }

      const skip = (page - 1) * limit;

      const [comments, total] = await Promise.all([
        Comment.find({ postId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Comment.countDocuments({ postId }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        status: 'success',
        data: comments,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      console.error('Error fetching comments:', error);
      return {
        status: 'error',
        message: (error as Error).message || 'Error fetching comments',
        data: [],
        pagination: { total: 0, page: 1, limit, totalPages: 0 },
      };
    }
  }

  /**
   * Lấy comment theo ID
   */
  static async getCommentById(commentId: string): Promise<BaseResponse<IComment | null>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid commentId format');
      }

      const comment = await Comment.findById(commentId).populate('postId', 'title slug');
      return { status: 'success', data: comment };
    } catch (error) {
      console.error('Error fetching comment:', error);
      return { status: 'error', message: (error as Error).message || 'Error fetching comment', data: null as never };
    }
  }

  /**
   * Cập nhật comment
   */
  static async updateComment(
    commentId: string,
    data: { content?: string; author?: string },
  ): Promise<BaseResponse<IComment | null>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid commentId format');
      }

      if (!data.content && !data.author) {
        throw new Error('At least one field (content or author) is required for update');
      }

      const updateData: Partial<Pick<IComment, 'content' | 'author'>> = {};
      if (data.content) updateData.content = data.content.trim();
      if (data.author) updateData.author = data.author.trim();

      const updatedComment = await Comment.findByIdAndUpdate(commentId, updateData, { new: true, runValidators: true });
      return { status: 'success', data: updatedComment };
    } catch (error) {
      console.error('Error updating comment:', error);
      return { status: 'error', message: (error as Error).message || 'Error updating comment', data: null as never };
    }
  }

  /**
   * Xóa comment
   */
  static async deleteComment(commentId: string): Promise<BaseResponse<boolean>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid commentId format');
      }

      // Find comment first to get postId
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }

      // Delete comment
      await Comment.findByIdAndDelete(commentId);

      // Remove comment from post's comments array
      await Post.findByIdAndUpdate(comment.postId, { $pull: { comments: commentId } });

      return { status: 'success', data: true };
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { status: 'error', message: (error as Error).message || 'Error deleting comment', data: false };
    }
  }

  /**
   * Lấy tất cả comment với phân trang
   */
  static async getAllComments(page: number = 1, limit: number = 10): Promise<BasePaginationResponse<IComment>> {
    try {
      await connectDB();

      const skip = (page - 1) * limit;

      const [comments, total] = await Promise.all([
        Comment.find().populate('postId', 'title slug').sort({ createdAt: -1 }).skip(skip).limit(limit),
        Comment.countDocuments(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        status: 'success',
        data: comments,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      console.error('Error fetching all comments:', error);
      return {
        status: 'error',
        message: (error as Error).message || 'Error fetching all comments',
        data: [],
        pagination: { total: 0, page: 1, limit, totalPages: 0 },
      };
    }
  }

  /**
   * Đếm số comment của một post
   */
  static async getCommentCount(postId: string): Promise<BaseResponse<{ count: number }>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid postId format');
      }

      const count = await Comment.countDocuments({ postId });
      return { status: 'success', data: { count } };
    } catch (error) {
      console.error('Error counting comments:', error);
      return { status: 'error', message: (error as Error).message || 'Error counting comments', data: { count: 0 } };
    }
  }

  /**
   * Tìm kiếm comment theo nội dung
   */
  static async searchComments({
    searchTerm,
    postId,
    page = 1,
    limit = 10,
  }: {
    searchTerm: string;
    postId?: string;
    page?: number;
    limit?: number;
  }): Promise<BasePaginationResponse<IComment>> {
    try {
      await connectDB();

      const skip = (page - 1) * limit;

      const query: { content: { $regex: string; $options: string }; postId?: string } = {
        content: { $regex: searchTerm, $options: 'i' },
      };

      if (postId) {
        if (!mongoose.Types.ObjectId.isValid(postId)) {
          throw new Error('Invalid postId format');
        }
        query.postId = postId;
      }

      const [comments, total] = await Promise.all([
        Comment.find(query).populate('postId', 'title slug').sort({ createdAt: -1 }).skip(skip).limit(limit),
        Comment.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        status: 'success',
        data: comments,
        pagination: { total, page, limit, totalPages },
      };
    } catch (error) {
      console.error('Error searching comments:', error);
      return {
        status: 'error',
        message: (error as Error).message || 'Error searching comments',
        data: [],
        pagination: { total: 0, page: 1, limit, totalPages: 0 },
      };
    }
  }
}
