import { auth } from '@/auth';
import { ProfileService } from '@/services/profile-service';

/**
 * GET /api/social-links
 * Get all social links for a user
 * Query params:
 * - userId: string (optional) - Get social links for specific user
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (userId) {
      const socialLinks = await ProfileService.getSocialLinksByUserId(userId);
      return Response.json(socialLinks, { status: 200 });
    }

    // If no userId, get authenticated user's social links
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const socialLinks = await ProfileService.getSocialLinksByUserId(session.user.id);
    return Response.json(socialLinks, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/social-links:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to get social links' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/social-links
 * Create a new social link
 * Body:
 * - platform: string (required)
 * - url: string (required)
 * - username: string (optional)
 * - isActive: boolean (optional)
 * - displayOrder: number (optional)
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    if (!data.platform || !data.url) {
      return Response.json({ message: 'Platform and URL are required' }, { status: 400 });
    }

    // Ensure userId matches authenticated user
    const socialLinkData = {
      ...data,
      userId: session.user.id,
    };

    const socialLink = await ProfileService.createSocialLink(socialLinkData);
    return Response.json(socialLink, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/social-links:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to create social link' },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/social-links
 * Reorder social links
 * Body:
 * - orderedIds: string[] (required) - Array of social link IDs in desired order
 */
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { orderedIds } = await req.json();

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return Response.json({ message: 'orderedIds must be a non-empty array' }, { status: 400 });
    }

    const success = await ProfileService.reorderSocialLinks(session.user.id, orderedIds);

    if (!success) {
      return Response.json({ message: 'Failed to reorder social links' }, { status: 500 });
    }

    return Response.json({ message: 'Social links reordered successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH /api/social-links:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to reorder social links' },
      { status: 500 },
    );
  }
}
