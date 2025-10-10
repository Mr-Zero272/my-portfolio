import { PostService } from '@/services/post-service';

export async function GET() {
  try {
    const res = await PostService.getStatisticsByStatus();
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/posts/stats/status:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to retrieve post statistics',
        data: null,
      }),
      { status: 500 },
    );
  }
}
