import { auth } from '@/auth';
import { ProfileService } from '@/services/profile-service';

/**
 * GET /api/profile
 * Get profile by userId (from query param) or public profile
 * Query params:
 * - userId: string (optional) - Get profile for specific user
 * - public: boolean (optional) - Get public profile
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const isOwner = searchParams.get('owner') === 'true';

    if (isOwner) {
      const ownerProfile = await ProfileService.getOwnerProfile();
      return Response.json(ownerProfile, { status: 200 });
    }

    if (userId) {
      const profile = await ProfileService.getCompleteProfile(userId);
      return Response.json(profile, { status: 200 });
    }

    // If no params, get authenticated user's profile
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const profile = await ProfileService.getCompleteProfile(session.user.id);
    return Response.json(profile, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/profile:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to get profile' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/profile
 * Create a new profile
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Ensure userId matches authenticated user
    const profileData = {
      ...data,
      userId: session.user.id,
    };

    const profile = await ProfileService.createProfile(profileData);
    return Response.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/profile:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to create profile' },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/profile
 * Update profile
 */
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const profile = await ProfileService.updateProfile(session.user.id, data);

    if (!profile) {
      return Response.json({ message: 'Profile not found' }, { status: 404 });
    }

    return Response.json(profile, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH /api/profile:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/profile
 * Delete profile (soft delete)
 */
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const success = await ProfileService.deleteProfile(session.user.id);

    if (!success) {
      return Response.json({ message: 'Profile not found' }, { status: 404 });
    }

    return Response.json({ message: 'Profile deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/profile:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to delete profile' },
      { status: 500 },
    );
  }
}
