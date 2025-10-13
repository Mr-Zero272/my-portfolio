import { API_URL } from '@/configs/env';
import EditPostFeature from '@/features/edit-post';
import { IPost, ITag, IUser } from '@/models';
import { BaseResponse } from '@/types/response';

// Force dynamic rendering để tránh lỗi build
export const dynamic = 'force-dynamic';

type EditPostPageProps = {
  params: Promise<{ slug: string }>;
};

const getPostBySlug = async (slug: string) => {
  try {
    const res = await fetch(`${API_URL}/api/posts/${slug}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch post data');
    }
    return res.json() as Promise<BaseResponse<Omit<IPost, 'tags' | 'authors'> & { tags: ITag[]; authors: IUser[] }>>;
  } catch (error) {
    console.warn('Failed to fetch post during build:', error);
    // Trả về dữ liệu mặc định khi không thể fetch
    return {
      data: null,
      message: 'Post not found',
      success: false,
    };
  }
};

const EditPostPage = async ({ params }: EditPostPageProps) => {
  const { slug } = await params;
  const postResponse = await getPostBySlug(slug);

  // Nếu không có data, hiển thị thông báo lỗi
  if (!postResponse.data) {
    return (
      <div>
        <p>Post not found or server unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <EditPostFeature
        post={postResponse.data as Omit<IPost, 'tags' | 'authors'> & { tags: ITag[]; authors: IUser[] }}
      />
    </div>
  );
};

export default EditPostPage;
