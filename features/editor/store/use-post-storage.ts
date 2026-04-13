import { ITag, IUser, type IPost } from '@/models';
import { create } from 'zustand';

interface PostState {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // JSON content
  contentHtml: string; // HTML content
  keywords: string[];
  featureImage: string;
  featureImageFile: File | null;
  imageCaption: string;
  likes: number;
  authors: string[];
  tags: string[];
  comments: string[];
  metaTitle: string;
  metaDescription: string;
  xMetaTitle: string;
  xMetaDescription: string;
  xMetaImage: string;
  xMetaImageFile: File | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PostActions {
  isSyncing: boolean;
  setIsSyncing: (isSyncing: boolean) => void;
  setField: <K extends keyof PostState>(field: K, value: PostState[K]) => void;
  getCurrentState: () => PostState;
  setInitialState: (post: Omit<IPost, 'tags' | 'authors'> & { tags: ITag[]; authors: IUser[] }) => void;
  resetState: () => void;
}

const initialPostState: PostState = {
  _id: '',
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  contentHtml: '',
  keywords: [],
  featureImageFile: null,
  featureImage: '',
  imageCaption: '',
  likes: 0,
  authors: [],
  tags: [],
  comments: [],
  metaTitle: '',
  metaDescription: '',
  xMetaTitle: '',
  xMetaDescription: '',
  xMetaImage: '',
  xMetaImageFile: null,
  published: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const usePostStorage = create<PostState & PostActions>((set, get) => ({
  ...initialPostState,
  isSyncing: false,

  setIsSyncing: (isSyncing) => set({ isSyncing }),

  setField: (field, value) => {
    set((state) => ({ ...state, [field]: value }));
  },

  getCurrentState: () => {
    const state = get();
    return {
      _id: state._id,
      title: state.title,
      slug: state.slug,
      excerpt: state.excerpt,
      content: state.content,
      contentHtml: state.contentHtml,
      keywords: state.keywords,
      featureImage: state.featureImage,
      featureImageFile: state.featureImageFile,
      imageCaption: state.imageCaption,
      likes: state.likes,
      authors: state.authors,
      tags: state.tags,
      comments: state.comments,
      metaTitle: state.metaTitle,
      metaDescription: state.metaDescription,
      xMetaTitle: state.xMetaTitle,
      xMetaDescription: state.xMetaDescription,
      xMetaImage: state.xMetaImage,
      xMetaImageFile: state.xMetaImageFile,
      published: state.published,
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
    };
  },

  setInitialState: (post: Omit<IPost, 'tags' | 'authors'> & { tags: ITag[]; authors: IUser[] }) => {
    const postState = mapPostToPostInterface(post);
    set((state) => ({
      ...state,
      ...postState,
    }));
  },

  resetState: () => {
    set(() => ({
      ...initialPostState,
      isSyncing: false,
    }));
  },
}));

// helper function to convert Post to PostInterface
export const mapPostToPostInterface = (
  post: Omit<IPost, 'tags' | 'authors'> & { tags: ITag[]; authors: IUser[] },
): PostState => {
  return {
    _id: post._id.toString(),
    authors: post.authors.map((author) => author._id.toString()) || [],
    tags: post.tags.map((tag) => tag._id.toString()) || [],
    excerpt: post.excerpt || '',
    title: post.title,
    featureImage: post.featureImage || '',
    featureImageFile: null,
    imageCaption: post.imageCaption || '',
    slug: post.slug,
    content: post.content,
    contentHtml: post.contentHtml || '',
    keywords: post.keywords || [],
    likes: post.likes || 0,
    comments: post.comments.map((comment) => comment._id.toString()) || [],
    metaTitle: post.metaTitle || '',
    metaDescription: post.metaDescription || '',
    xMetaTitle: post.xMetaTitle || '',
    xMetaDescription: post.xMetaDescription || '',
    xMetaImage: post.xMetaImage || '',
    xMetaImageFile: null,
    published: post.published || false,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};
