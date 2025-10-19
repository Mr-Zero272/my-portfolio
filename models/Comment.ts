import { Document, model, models, Schema, VirtualTypeOptions } from 'mongoose';
import { IUser } from './User';

export interface IComment extends Document {
  _id: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  parentId?: Schema.Types.ObjectId; // null cho comment gốc
  content: string;
  images?: string[]; // array URL ảnh
  author: Schema.Types.ObjectId;
  likes?: Schema.Types.ObjectId[]; // array user IDs đã like
  dislikes?: Schema.Types.ObjectId[]; // array user IDs đã dislike
  createdAt: Date;
  updatedAt: Date;
  replyCount?: number; // virtual field để đếm replies
}

export interface ICommentResponse {
  _id: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  parentId?: Schema.Types.ObjectId;
  content: string;
  images?: string[];
  author: IUser;
  likes?: IUser[];
  dislikes?: IUser[];
  createdAt: Date;
  updatedAt: Date;
  replyCount?: number;
  replies: ICommentResponse[];
}

const CommentSchema: Schema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null, index: true }, // hỗ trợ nested, null cho level 1
    content: { type: String, required: true, minlength: 1 },
    images: [{ type: String }], // array URL ảnh upload
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // array users liked
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // array users disliked
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual để đếm số replies (count comments có parentId = this._id)
CommentSchema.virtual('replyCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentId',
  count: true,
}) as VirtualTypeOptions;

// Index compound cho query nested theo post và parent
CommentSchema.index({ postId: 1, parentId: 1, createdAt: -1 });

export default models.Comment || model<IComment>('Comment', CommentSchema);
