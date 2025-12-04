import { auth } from '@/auth';
import { SocialLinkService } from '@/services/social-link-service';

/**
 * GET /api/social-links/[id]
 * Get social link by ID
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const socialLink = await SocialLinkService.getSocialLinkById(id);

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
 * PUT /api/social-links/[id]
 * Update social link
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const socialLink = await SocialLinkService.updateSocialLink(id, session.user.id, data);

    if (!socialLink) {
      return Response.json({ message: 'Social link not found or unauthorized' }, { status: 404 });
    }

    return Response.json(socialLink, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/social-links/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to update social link' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/social-links/[id]
 * Delete social link
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const success = await SocialLinkService.deleteSocialLink(id, session.user.id);

    if (!success) {
      return Response.json({ message: 'Social link not found or unauthorized' }, { status: 404 });
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
