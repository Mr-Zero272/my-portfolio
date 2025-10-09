// Export all models centrally to ensure proper mongoose registration
import Comment from './Comment';
import Image from './Image';
import Post from './Post';
import Tag from './Tag';
import User from './User';

// Re-export all models
export { Comment, Image, Post, Tag, User };

// Also export the interfaces
export type { IComment } from './Comment';
export type { IImage } from './Image';
export type { IPost } from './Post';
export type { ITag } from './Tag';
export type { IUser } from './User';

// Default export as an object containing all models
const models = {
  Post,
  Tag,
  Comment,
  User,
  Image,
};

export default models;
