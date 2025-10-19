import connectDB from '@/lib/mongodb';
import { Comment, Post, type IComment } from '@/models';
import { BasePaginationResponse, BaseResponse } from '@/types/response';
import mongoose from 'mongoose';

export class CommentService {
  /**
   * Tạo comment mới (có thể là comment gốc hoặc reply)
   */
  static async createComment(data: {
    postId: string;
    content: string;
    author: string;
    parentId?: string;
    images?: string[];
  }): Promise<BaseResponse<IComment>> {
    try {
      await connectDB();

      // Validate required fields
      if (!data.postId || !data.content || !data.author) {
        throw new Error('PostId, content, and author are required');
      }

      // Validate ObjectId formats
      if (!mongoose.Types.ObjectId.isValid(data.postId)) {
        throw new Error('Invalid postId format');
      }

      if (!mongoose.Types.ObjectId.isValid(data.author)) {
        throw new Error('Invalid author format');
      }

      if (data.parentId && !mongoose.Types.ObjectId.isValid(data.parentId)) {
        throw new Error('Invalid parentId format');
      }

      // Check if post exists
      const post = await Post.findById(data.postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // Check if parent comment exists (if this is a reply)
      if (data.parentId) {
        const parentComment = await Comment.findById(data.parentId);
        if (!parentComment) {
          throw new Error('Parent comment not found');
        }
        // Ensure parent comment belongs to the same post
        if (parentComment.postId.toString() !== data.postId) {
          throw new Error('Parent comment does not belong to this post');
        }
      }

      // Create comment
      const newComment = new Comment({
        postId: new mongoose.Types.ObjectId(data.postId),
        content: data.content.trim(),
        author: new mongoose.Types.ObjectId(data.author),
        parentId: data.parentId ? new mongoose.Types.ObjectId(data.parentId) : null,
        images: data.images || [],
      });

      const savedComment = await newComment.save();

      // Populate author info
      await savedComment.populate('author', 'username avatar');

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
   * Lấy tất cả comment cấp 1 của một post với phân trang (kèm tối đa 3 reply cấp 1)
   */
  static async getCommentsByPostId({
    postId,
    page = 1,
    limit = 10,
    includeReplies = true,
  }: {
    postId: string;
    page?: number;
    limit?: number;
    includeReplies?: boolean;
  }): Promise<BasePaginationResponse<IComment & { replies?: IComment[] }>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid postId format');
      }

      const skip = (page - 1) * limit;

      // Chỉ lấy comment cấp 1 (parentId = null)
      const [comments, total] = await Promise.all([
        Comment.find({ postId, parentId: null })
          .populate('author', 'username avatar')
          .populate('replyCount')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Comment.countDocuments({ postId, parentId: null }),
      ]);

      let commentsWithReplies = comments;

      // Fetch replies nếu được yêu cầu (tối đa 3 reply cấp 1 cho mỗi comment)
      if (includeReplies) {
        commentsWithReplies = await Promise.all(
          comments.map(async (comment) => {
            const replies = await Comment.find({ parentId: comment._id })
              .populate('author', 'username avatar')
              .populate('replyCount')
              .sort({ createdAt: 1 })
              .limit(3);

            return {
              ...comment.toObject(),
              replies: replies,
            };
          }),
        );
      }

      const totalPages = Math.ceil(total / limit);

      return {
        status: 'success',
        data: commentsWithReplies,
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
   * Lấy comment theo ID với các reply cấp 1 của nó
   */
  static async getCommentById(
    commentId: string,
    options: { includeReplies?: boolean; repliesPage?: number; repliesLimit?: number } = {},
  ): Promise<
    BaseResponse<{
      comment: IComment | null;
      replies?: IComment[];
      repliesPagination?: { total: number; page: number; limit: number; totalPages: number };
    }>
  > {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid commentId format');
      }

      const { includeReplies = true, repliesPage = 1, repliesLimit = 10 } = options;

      // Lấy comment chính
      const comment = await Comment.findById(commentId).populate('author', 'username avatar').populate('replyCount');

      if (!comment) {
        return { status: 'error', message: 'Comment not found', data: { comment: null } };
      }

      const result: {
        comment: IComment;
        replies?: IComment[];
        repliesPagination?: { total: number; page: number; limit: number; totalPages: number };
      } = { comment };

      // Lấy replies nếu được yêu cầu
      if (includeReplies) {
        const repliesSkip = (repliesPage - 1) * repliesLimit;

        const [replies, repliesTotal] = await Promise.all([
          Comment.find({ parentId: commentId })
            .populate('author', 'username avatar')
            .populate('replyCount')
            .sort({ createdAt: 1 })
            .skip(repliesSkip)
            .limit(repliesLimit),
          Comment.countDocuments({ parentId: commentId }),
        ]);

        result.replies = replies;
        result.repliesPagination = {
          total: repliesTotal,
          page: repliesPage,
          limit: repliesLimit,
          totalPages: Math.ceil(repliesTotal / repliesLimit),
        };
      }

      return { status: 'success', data: result };
    } catch (error) {
      console.error('Error fetching comment:', error);
      return {
        status: 'error',
        message: (error as Error).message || 'Error fetching comment',
        data: { comment: null },
      };
    }
  }

  /**
   * Cập nhật comment
   */
  static async updateComment(
    commentId: string,
    data: { content?: string; images?: string[] },
    userId: string,
  ): Promise<BaseResponse<IComment | null>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid commentId format');
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format');
      }

      if (!data.content && !data.images) {
        throw new Error('At least one field (content or images) is required for update');
      }

      // Check if comment exists and user is the author
      const existingComment = await Comment.findById(commentId);
      if (!existingComment) {
        throw new Error('Comment not found');
      }

      if (existingComment.author.toString() !== userId) {
        throw new Error('You can only update your own comments');
      }

      const updateData: Partial<Pick<IComment, 'content' | 'images'>> = {};
      if (data.content) updateData.content = data.content.trim();
      if (data.images) updateData.images = data.images;

      const updatedComment = await Comment.findByIdAndUpdate(commentId, updateData, {
        new: true,
        runValidators: true,
      })
        .populate('author', 'username avatar')
        .populate('replyCount');

      return { status: 'success', data: updatedComment };
    } catch (error) {
      console.error('Error updating comment:', error);
      return { status: 'error', message: (error as Error).message || 'Error updating comment', data: null as never };
    }
  }

  /**
   * Xóa comment (và tất cả replies của nó)
   */
  static async deleteComment(commentId: string, userId: string): Promise<BaseResponse<boolean>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid commentId format');
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format');
      }

      // Find comment first
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }

      // Check if user is the author
      if (comment.author.toString() !== userId) {
        throw new Error('You can only delete your own comments');
      }

      // Delete all replies first (if this is a parent comment)
      await Comment.deleteMany({ parentId: commentId });

      // Delete the comment itself
      await Comment.findByIdAndDelete(commentId);

      return { status: 'success', data: true };
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { status: 'error', message: (error as Error).message || 'Error deleting comment', data: false };
    }
  }

  /**
   * Like comment
   */
  static async likeComment(commentId: string, userId: string): Promise<BaseResponse<IComment | null>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid commentId format');
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format');
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);

      // Remove from dislikes if exists, then add to likes
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $pull: { dislikes: userObjectId },
          $addToSet: { likes: userObjectId },
        },
        { new: true },
      )
        .populate('author', 'username avatar')
        .populate('replyCount');

      if (!updatedComment) {
        throw new Error('Comment not found');
      }

      return { status: 'success', data: updatedComment };
    } catch (error) {
      console.error('Error liking comment:', error);
      return { status: 'error', message: (error as Error).message || 'Error liking comment', data: null as never };
    }
  }

  /**
   * Unlike comment
   */
  static async unlikeComment(commentId: string, userId: string): Promise<BaseResponse<IComment | null>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid commentId format');
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format');
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $pull: { likes: userObjectId } },
        { new: true },
      )
        .populate('author', 'username avatar')
        .populate('replyCount');

      if (!updatedComment) {
        throw new Error('Comment not found');
      }

      return { status: 'success', data: updatedComment };
    } catch (error) {
      console.error('Error unliking comment:', error);
      return { status: 'error', message: (error as Error).message || 'Error unliking comment', data: null as never };
    }
  }

  /**
   * Dislike comment
   */
  static async dislikeComment(commentId: string, userId: string): Promise<BaseResponse<IComment | null>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid commentId format');
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format');
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);

      // Remove from likes if exists, then add to dislikes
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $pull: { likes: userObjectId },
          $addToSet: { dislikes: userObjectId },
        },
        { new: true },
      )
        .populate('author', 'username avatar')
        .populate('replyCount');

      if (!updatedComment) {
        throw new Error('Comment not found');
      }

      return { status: 'success', data: updatedComment };
    } catch (error) {
      console.error('Error disliking comment:', error);
      return { status: 'error', message: (error as Error).message || 'Error disliking comment', data: null as never };
    }
  }

  /**
   * Undislike comment
   */
  static async undislikeComment(commentId: string, userId: string): Promise<BaseResponse<IComment | null>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid commentId format');
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format');
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $pull: { dislikes: userObjectId } },
        { new: true },
      )
        .populate('author', 'username avatar')
        .populate('replyCount');

      if (!updatedComment) {
        throw new Error('Comment not found');
      }

      return { status: 'success', data: updatedComment };
    } catch (error) {
      console.error('Error undisliking comment:', error);
      return { status: 'error', message: (error as Error).message || 'Error undisliking comment', data: null as never };
    }
  }

  /**
   * Lấy replies của một comment với phân trang
   * Bao gồm tối đa 3 reply con cho mỗi reply cấp 2
   */
  static async getRepliesByCommentId({
    commentId,
    page = 1,
    limit = 10,
    includeSubReplies = true,
  }: {
    commentId: string;
    page?: number;
    limit?: number;
    includeSubReplies?: boolean;
  }): Promise<BasePaginationResponse<IComment & { replies?: IComment[] }>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid commentId format');
      }

      const skip = (page - 1) * limit;

      const [replies, total] = await Promise.all([
        Comment.find({ parentId: commentId })
          .populate('author', 'username avatar')
          .populate('replyCount')
          .sort({ createdAt: 1 })
          .skip(skip)
          .limit(limit),
        Comment.countDocuments({ parentId: commentId }),
      ]);

      let repliesWithSubReplies = replies;

      // Fetch sub-replies nếu được yêu cầu (tối đa 3 reply con cho mỗi reply cấp 2)
      if (includeSubReplies) {
        repliesWithSubReplies = await Promise.all(
          replies.map(async (reply) => {
            const subReplies = await Comment.find({ parentId: reply._id })
              .populate('author', 'username avatar')
              .populate('replyCount')
              .sort({ createdAt: 1 })
              .limit(3);

            return {
              ...reply.toObject(),
              replies: subReplies,
            };
          }),
        );
      }

      const totalPages = Math.ceil(total / limit);

      return {
        status: 'success',
        data: repliesWithSubReplies,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      console.error('Error fetching replies:', error);
      return {
        status: 'error',
        message: (error as Error).message || 'Error fetching replies',
        data: [],
        pagination: { total: 0, page: 1, limit, totalPages: 0 },
      };
    }
  }

  /**
   * Lấy tất cả comment với phân trang (admin function)
   * Bao gồm tối đa 3 reply cấp 1 cho mỗi comment
   */
  static async getAllComments(
    page: number = 1,
    limit: number = 10,
  ): Promise<BasePaginationResponse<IComment & { replies?: IComment[] }>> {
    try {
      await connectDB();

      const skip = (page - 1) * limit;

      const [comments, total] = await Promise.all([
        Comment.find()
          .populate('author', 'username avatar')
          .populate('postId', 'title slug')
          .populate('replyCount')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Comment.countDocuments(),
      ]);

      // Fetch replies cho mỗi comment (tối đa 3 reply cấp 1)
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replies = await Comment.find({ parentId: comment._id })
            .populate('author', 'username avatar')
            .populate('replyCount')
            .sort({ createdAt: 1 })
            .limit(3);

          return {
            ...comment.toObject(),
            replies: replies,
          };
        }),
      );

      const totalPages = Math.ceil(total / limit);

      return {
        status: 'success',
        data: commentsWithReplies,
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
   * Đếm số comment của một post (bao gồm cả replies)
   */
  static async getCommentCount(postId: string): Promise<BaseResponse<{ count: number; topLevelCount: number }>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid postId format');
      }

      const [totalCount, topLevelCount] = await Promise.all([
        Comment.countDocuments({ postId }),
        Comment.countDocuments({ postId, parentId: null }),
      ]);

      return {
        status: 'success',
        data: {
          count: totalCount,
          topLevelCount,
        },
      };
    } catch (error) {
      console.error('Error counting comments:', error);
      return {
        status: 'error',
        message: (error as Error).message || 'Error counting comments',
        data: { count: 0, topLevelCount: 0 },
      };
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
    parentId,
  }: {
    searchTerm: string;
    postId?: string;
    page?: number;
    limit?: number;
    parentId?: string | null;
  }): Promise<BasePaginationResponse<IComment>> {
    try {
      await connectDB();

      const skip = (page - 1) * limit;

      const query: {
        content: { $regex: string; $options: string };
        postId?: string;
        parentId?: string | null;
      } = {
        content: { $regex: searchTerm, $options: 'i' },
      };

      if (postId) {
        if (!mongoose.Types.ObjectId.isValid(postId)) {
          throw new Error('Invalid postId format');
        }
        query.postId = postId;
      }

      if (parentId !== undefined) {
        if (parentId === null) {
          query.parentId = null;
        } else if (mongoose.Types.ObjectId.isValid(parentId)) {
          query.parentId = parentId;
        } else {
          throw new Error('Invalid parentId format');
        }
      }

      const [comments, total] = await Promise.all([
        Comment.find(query)
          .populate('author', 'username avatar')
          .populate('postId', 'title slug')
          .populate('replyCount')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
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

  /**
   * Lấy comment của một user với phân trang
   */
  static async getCommentsByUserId({
    userId,
    page = 1,
    limit = 10,
  }: {
    userId: string;
    page?: number;
    limit?: number;
  }): Promise<BasePaginationResponse<IComment>> {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format');
      }

      const skip = (page - 1) * limit;

      const [comments, total] = await Promise.all([
        Comment.find({ author: userId })
          .populate('author', 'username avatar')
          .populate('postId', 'title slug')
          .populate('replyCount')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Comment.countDocuments({ author: userId }),
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
      console.error('Error fetching user comments:', error);
      return {
        status: 'error',
        message: (error as Error).message || 'Error fetching user comments',
        data: [],
        pagination: { total: 0, page: 1, limit, totalPages: 0 },
      };
    }
  }

  /**
   * Lấy thống kê like/dislike của một comment
   */
  static async getCommentStats(commentId: string): Promise<
    BaseResponse<{
      likesCount: number;
      dislikesCount: number;
      repliesCount: number;
    }>
  > {
    try {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid commentId format');
      }

      const comment = await Comment.findById(commentId).populate('replyCount');
      if (!comment) {
        throw new Error('Comment not found');
      }

      return {
        status: 'success',
        data: {
          likesCount: comment.likes?.length || 0,
          dislikesCount: comment.dislikes?.length || 0,
          repliesCount: comment.replyCount || 0,
        },
      };
    } catch (error) {
      console.error('Error fetching comment stats:', error);
      return {
        status: 'error',
        message: (error as Error).message || 'Error fetching comment stats',
        data: { likesCount: 0, dislikesCount: 0, repliesCount: 0 },
      };
    }
  }
}
