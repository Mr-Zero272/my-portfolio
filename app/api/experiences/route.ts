import { auth } from '@/auth';
import { ExperienceService } from '@/services/experience-service';

/**
 * GET /api/experiences
 * Get all experiences for a user
 * Query params:
 * - userId: string (optional) - Get experiences for specific user
 * - owner: boolean (optional) - Get experiences for the owner (admin)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const isOwner = searchParams.get('owner') === 'true';

    if (isOwner) {
      const experiences = await ExperienceService.getOwnerExperiences();
      return Response.json(experiences, { status: 200 });
    }

    if (userId) {
      const experiences = await ExperienceService.getExperiencesByUserId(userId);
      return Response.json(experiences, { status: 200 });
    }

    // If no userId or owner param, get authenticated user's experiences
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // For authenticated user, we might want to show all (including hidden) or just visible?
    // Usually the owner wants to see everything in their dashboard.
    // But this endpoint might be used for public view too if userId is passed.
    // Let's assume if no userId is passed (implied "my experiences"), we show all.
    // But wait, getExperiencesByUserId filters by isVisible=true.
    // getAllExperiencesByUserId shows all.

    const experiences = await ExperienceService.getAllExperiencesByUserId(session.user.id);
    return Response.json(experiences, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/experiences:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to get experiences' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/experiences
 * Create a new experience
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    if (!data.companyName) {
      return Response.json({ message: 'Company name is required' }, { status: 400 });
    }

    // Ensure userId matches authenticated user
    const experienceData = {
      ...data,
      userId: session.user.id,
    };

    const experience = await ExperienceService.createExperience(experienceData);
    return Response.json(experience, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/experiences:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to create experience' },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/experiences
 * Reorder experiences
 * Body:
 * - orderedIds: string[] (required) - Array of experience IDs in desired order
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

    const success = await ExperienceService.reorderExperiences(session.user.id, orderedIds);

    if (!success) {
      return Response.json({ message: 'Failed to reorder experiences' }, { status: 500 });
    }

    return Response.json({ message: 'Experiences reordered successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH /api/experiences:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to reorder experiences' },
      { status: 500 },
    );
  }
}
