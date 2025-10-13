import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featureImage?: string;
  imageCaption?: string;
  likes: number;
  authors: mongoose.Types.ObjectId[];
  tags: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  metaTitle?: string;
  metaDescription?: string;
  xMetaTitle?: string;
  xMetaDescription?: string;
  xMetaImage?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    featureImage: { type: String },
    imageCaption: { type: String },
    likes: { type: Number, default: 0 },
    authors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    metaTitle: { type: String },
    metaDescription: { type: String },
    xMetaTitle: { type: String },
    xMetaDescription: { type: String },
    xMetaImage: { type: String },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
