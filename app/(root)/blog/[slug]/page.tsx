import { API_URL } from '@/configs/env';
import PostPreviewFeature from '@/features/preview-post';
import { IPost, ITag } from '@/models';
import { BaseResponse } from '@/types/response';

export const dynamic = 'force-dynamic';

const getPostBySlug = async (slug: string) => {
  try {
    const res = await fetch(`${API_URL}/api/posts/${slug}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch post data');
    }
    return res.json() as Promise<BaseResponse<Omit<IPost, 'tags'> & { tags: ITag[] }>>;
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

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { slug } = await params;
  const postResponse = await getPostBySlug(slug);

  if (!postResponse.data) {
    return (
      <div>
        <p>Post not found or server unavailable</p>
      </div>
    );
  }

  return <PostPreviewFeature post={postResponse.data} />;
};

export default BlogDetailPage;
