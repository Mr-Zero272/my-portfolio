import { SortOrder } from '@/types/api';

export type GalleryImageSortByField = 'createdAt' | 'updatedAt' | 'name' | 'size'

export type GalleryImageFilterParams = {
  page: number;
  perPage: number;
  search: string;
  mimeType: string;
  sortBy: GalleryImageSortByField;
  sortOrder: SortOrder;
};
