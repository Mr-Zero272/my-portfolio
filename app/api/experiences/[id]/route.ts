import { auth } from '@/auth';
import { ExperienceService } from '@/services/experience-service';

/**
 * GET /api/experiences/[id]
 * Get a single experience by ID
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const experience = await ExperienceService.getExperienceById(id);

    if (!experience) {
      return Response.json({ message: 'Experience not found' }, { status: 404 });
    }

    return Response.json(experience, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/experiences/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to get experience' },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/experiences/[id]
 * Update an experience
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    const experience = await ExperienceService.updateExperience(id, session.user.id, data);

    if (!experience) {
      return Response.json({ message: 'Experience not found or unauthorized' }, { status: 404 });
    }

    return Response.json(experience, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH /api/experiences/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to update experience' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/experiences/[id]
 * Delete an experience
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const success = await ExperienceService.deleteExperience(id, session.user.id);

    if (!success) {
      return Response.json({ message: 'Experience not found or unauthorized' }, { status: 404 });
    }

    return Response.json({ message: 'Experience deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/experiences/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to delete experience' },
      { status: 500 },
    );
  }
}
