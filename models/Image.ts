import mongoose, { Document, model, models, Schema } from 'mongoose';

export interface IImage extends Document {
  url: string;
  name: string;
  size: number;
  mineType: string;
  userCreated: mongoose.Types.ObjectId;
  caption?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema: Schema = new Schema(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    mineType: { type: String, required: true },
    caption: { type: String },
    userCreated: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export default models.Gallery || model<IImage>('Gallery', ImageSchema);
