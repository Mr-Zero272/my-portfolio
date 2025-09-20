import { type IPost } from '@/models';
import { create } from 'zustand';

interface PostErrors {
  title?: string;
  slug?: string;
  content?: string;
  tags?: string;
  [key: string]: string | undefined;
}

interface PostState {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featureImage: string;
  featureImageFile: File | null;
  imageCaption: string;
  likes: number;
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
  errors: PostErrors;

  // Original methods
  setField: <K extends keyof PostState>(field: K, value: PostState[K]) => void;
  setError: (field: keyof PostErrors, message: string) => void;
  clearError: (field: keyof PostErrors) => void;
  clearAllErrors: () => void;
  validateField: (field: keyof PostState) => boolean;
  validateForm: () => boolean;
  getCurrentState: () => PostState;
  setInitialState: (post: IPost) => void;
  resetState: () => void;
}

const initialPostState: PostState = {
  _id: '',
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featureImageFile: null,
  featureImage: '',
  imageCaption: '',
  likes: 0,
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
  errors: {},

  setField: (field, value) => {
    set((state) => ({ ...state, [field]: value }));
    // Auto validate field when it changes
    const store = get();
    store.validateField(field);
  },

  setError: (field, message) => {
    set((state) => ({
      ...state,
      errors: { ...state.errors, [field]: message },
    }));
  },

  clearError: (field) => {
    set((state) => ({
      ...state,
      errors: { ...state.errors, [field]: undefined },
    }));
  },

  clearAllErrors: () => {
    set((state) => ({ ...state, errors: {} }));
  },

  validateField: (field) => {
    const state = get();
    let isValid = true;

    // Clear any existing error for this field first
    state.clearError(field);

    const validationRules: Record<keyof PostState, () => boolean> = {
      title: () => {
        if (!state.title?.trim()) {
          state.setError('title', 'Title is required');
          return false;
        }
        return true;
      },
      slug: () => {
        if (!state.slug?.trim()) {
          state.setError('slug', 'Post URL is required');
          return false;
        }
        return true;
      },
      content: () => {
        if (!state.content?.trim()) {
          state.setError('content', 'Content is required');
          return false;
        }
        return true;
      },
      tags: () => {
        if (!state.tags?.length) {
          state.setError('tags', 'At least one tag is required');
          return false;
        }
        return true;
      },
      // Other fields don't need validation
      _id: () => true,
      excerpt: () => true,
      featureImage: () => true,
      featureImageFile: () => true,
      imageCaption: () => true,
      likes: () => true,
      comments: () => true,
      metaTitle: () => true,
      metaDescription: () => true,
      xMetaTitle: () => true,
      xMetaDescription: () => true,
      xMetaImage: () => true,
      xMetaImageFile: () => true,
      published: () => true,
      createdAt: () => true,
      updatedAt: () => true,
    };

    const validate = validationRules[field];
    if (validate) {
      isValid = validate();
    }

    return isValid;
  },

  validateForm: () => {
    const state = get();
    const requiredFields: (keyof PostState)[] = ['title', 'slug', 'content', 'tags'];

    let isFormValid = true;

    requiredFields.forEach((field) => {
      const isFieldValid = state.validateField(field);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  },

  getCurrentState: () => {
    const state = get();
    // Return only the post data, excluding actions and errors
    return {
      _id: state._id,
      title: state.title,
      slug: state.slug,
      excerpt: state.excerpt,
      content: state.content,
      featureImage: state.featureImage,
      featureImageFile: state.featureImageFile,
      imageCaption: state.imageCaption,
      likes: state.likes,
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

  setInitialState: (post: IPost) => {
    const postState = mapPostToPostInterface(post);
    set((state) => ({
      ...state,
      ...postState,
      errors: {},
    }));
  },

  resetState: () => {
    set(() => ({
      ...initialPostState,
      errors: {},
    }));
  },
}));

// helper function to convert Post to PostInterface
export const mapPostToPostInterface = (post: IPost): PostState => {
  return {
    _id: post._id.toString(),
    tags: post.tags.map((tag) => tag._id.toString()) || [],
    excerpt: post.excerpt || '',
    title: post.title,
    featureImage: post.featureImage || '',
    featureImageFile: null,
    imageCaption: post.imageCaption || '',
    slug: post.slug,
    content: post.content,
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
