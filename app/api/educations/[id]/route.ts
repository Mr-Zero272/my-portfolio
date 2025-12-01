import { auth } from '@/auth';
import { EducationService } from '@/services/education-service';

/**
 * GET /api/educations/[id]
 * Get education by ID
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const education = await EducationService.getEducationById(id);

    if (!education) {
      return Response.json({ message: 'Education not found' }, { status: 404 });
    }

    return Response.json(education, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/educations/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to get education' },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/educations/[id]
 * Update education
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const education = await EducationService.updateEducation(id, session.user.id, data);

    if (!education) {
      return Response.json({ message: 'Education not found or unauthorized' }, { status: 404 });
    }

    return Response.json(education, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/educations/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to update education' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/educations/[id]
 * Delete education
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const success = await EducationService.deleteEducation(id, session.user.id);

    if (!success) {
      return Response.json({ message: 'Education not found or unauthorized' }, { status: 404 });
    }

    return Response.json({ message: 'Education deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/educations/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to delete education' },
      { status: 500 },
    );
  }
}
