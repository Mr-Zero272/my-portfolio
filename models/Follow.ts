import mongoose, { Document, Schema } from 'mongoose';

export interface IFollow extends Document {
  followerId: mongoose.Types.ObjectId;
  followingId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FollowSchema: Schema = new Schema(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// Ensure a user can only follow another user once
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export default mongoose.models.Follow || mongoose.model<IFollow>('Follow', FollowSchema);
