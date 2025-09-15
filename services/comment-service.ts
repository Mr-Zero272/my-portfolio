import connectDB from '@/lib/mongodb';
import Comment, { IComment } from '@/models/Comment';
import Post from '@/models/Post';
import mongoose from 'mongoose';

export class CommentService {
  /**
   * Tạo comment mới
   */
  static async createComment(data: { postId: string; content: string; author: string }): Promise<IComment> {
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

      return savedComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  /**
   * Lấy tất cả comment của một post
   */
  static async getCommentsByPostId(postId: string): Promise<IComment[]> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid postId format');
      }

      return await Comment.find({ postId })
        .sort({ createdAt: -1 }) // Newest first
        .lean();
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  /**
   * Lấy comment theo ID
   */
  static async getCommentById(commentId: string): Promise<IComment | null> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid commentId format');
      }

      return await Comment.findById(commentId).populate('postId', 'title slug');
    } catch (error) {
      console.error('Error fetching comment:', error);
      throw error;
    }
  }

  /**
   * Cập nhật comment
   */
  static async updateComment(commentId: string, data: { content?: string; author?: string }): Promise<IComment | null> {
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

      return await Comment.findByIdAndUpdate(commentId, updateData, { new: true, runValidators: true });
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  /**
   * Xóa comment
   */
  static async deleteComment(commentId: string): Promise<boolean> {
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

      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  /**
   * Lấy tất cả comment với phân trang
   */
  static async getAllComments(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ comments: IComment[]; total: number; totalPages: number }> {
    try {
      await connectDB();

      const skip = (page - 1) * limit;

      const [comments, total] = await Promise.all([
        Comment.find().populate('postId', 'title slug').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Comment.countDocuments(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        comments,
        total,
        totalPages,
      };
    } catch (error) {
      console.error('Error fetching all comments:', error);
      throw error;
    }
  }

  /**
   * Đếm số comment của một post
   */
  static async getCommentCount(postId: string): Promise<number> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid postId format');
      }

      return await Comment.countDocuments({ postId });
    } catch (error) {
      console.error('Error counting comments:', error);
      throw error;
    }
  }

  /**
   * Tìm kiếm comment theo nội dung
   */
  static async searchComments(searchTerm: string, postId?: string): Promise<IComment[]> {
    try {
      await connectDB();

      const query: { content: { $regex: string; $options: string }; postId?: string } = {
        content: { $regex: searchTerm, $options: 'i' },
      };

      if (postId) {
        if (!mongoose.Types.ObjectId.isValid(postId)) {
          throw new Error('Invalid postId format');
        }
        query.postId = postId;
      }

      return await Comment.find(query).populate('postId', 'title slug').sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('Error searching comments:', error);
      throw error;
    }
  }
}
