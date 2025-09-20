import { Document, Schema, model, models } from 'mongoose';

export interface ITag extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export default models.Tag || model<ITag>('Tag', TagSchema);
