import { auth } from '@/auth';
import { EducationService } from '@/services/education-service';

/**
 * GET /api/educations
 * Get educations by userId (from query param) or owner (default)
 * Query params:
 * - userId: string (optional) - Get educations for specific user
 * - owner: boolean (optional) - Get owner educations
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    // const isOwner = searchParams.get('owner') === 'true'; // Not strictly used but good for documentation

    // If userId is provided, get educations for that user
    if (userId) {
      const educations = await EducationService.getEducationsByUserId(userId);
      return Response.json(educations, { status: 200 });
    }

    // Default to owner's educations
    const educations = await EducationService.getOwnerEducations();
    return Response.json(educations, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/educations:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to get educations' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/educations
 * Create a new education entry
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Ensure userId matches authenticated user
    const educationData = {
      ...data,
      userId: session.user.id,
    };

    const education = await EducationService.createEducation(educationData);
    return Response.json(education, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/educations:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to create education' },
      { status: 500 },
    );
  }
}
