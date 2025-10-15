import { imageApi } from '@/apis/image';
import { type IImage } from '@/models';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseGalleryImagesParams {
  search?: string;
  limit?: number;
}

interface GalleryResponse {
  images: IImage[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const useGalleryImages = ({ search = '', limit = 12 }: UseGalleryImagesParams = {}) => {
  return useInfiniteQuery<GalleryResponse>({
    queryKey: ['gallery-images', search, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await imageApi.getImages({
        page: pageParam as number,
        limit,
        search: search || undefined,
      });

      return {
        images: response.images,
        total: response.total,
        totalPages: response.totalPages,
        currentPage: pageParam as number,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
