import { auth } from '@/auth';
import { ProfileService } from '@/services/profile-service';

/**
 * GET /api/social-links/[id]
 * Get a single social link by ID
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const socialLink = await ProfileService.getSocialLinkById(id);

    if (!socialLink) {
      return Response.json({ message: 'Social link not found' }, { status: 404 });
    }

    return Response.json(socialLink, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/social-links/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to get social link' },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/social-links/[id]
 * Update a social link
 * Body:
 * - platform: string (optional)
 * - url: string (optional)
 * - username: string (optional)
 * - isActive: boolean (optional)
 * - displayOrder: number (optional)
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    const socialLink = await ProfileService.updateSocialLink(id, session.user.id, data);

    if (!socialLink) {
      return Response.json({ message: 'Social link not found' }, { status: 404 });
    }

    return Response.json(socialLink, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH /api/social-links/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to update social link' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/social-links/[id]
 * Delete a social link (soft delete by default, use ?permanent=true for hard delete)
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const isPermanent = searchParams.get('permanent') === 'true';

    let success: boolean;
    if (isPermanent) {
      success = await ProfileService.permanentlyDeleteSocialLink(id, session.user.id);
    } else {
      success = await ProfileService.deleteSocialLink(id, session.user.id);
    }

    if (!success) {
      return Response.json({ message: 'Social link not found' }, { status: 404 });
    }

    return Response.json({ message: 'Social link deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/social-links/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to delete social link' },
      { status: 500 },
    );
  }
}
