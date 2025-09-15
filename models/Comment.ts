import { Document, Schema, model } from 'mongoose';

export interface IComment extends Document {
  postId: Schema.Types.ObjectId;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true },
);

export default model<IComment>('Comment', CommentSchema);
