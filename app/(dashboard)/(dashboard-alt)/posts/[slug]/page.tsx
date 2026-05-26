import DevelopingPage from '@/components/shared/developing-page';

// Force dynamic rendering để tránh lỗi build
export const dynamic = 'force-dynamic';

type EditPostPageProps = {
  params: Promise<{ slug: string }>;
};

const EditPostPage = async ({ params }: EditPostPageProps) => {
  return <DevelopingPage />;
};

export default EditPostPage;
