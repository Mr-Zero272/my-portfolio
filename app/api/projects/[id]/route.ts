import { auth } from '@/auth';
import { ProjectService } from '@/services/project-service';

/**
 * GET /api/projects/[id]
 * Get project by ID
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await ProjectService.getProjectById(id);

    if (!project) {
      return Response.json({ message: 'Project not found' }, { status: 404 });
    }

    return Response.json(project, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/projects/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to get project' },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/projects/[id]
 * Update project
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const project = await ProjectService.updateProject(id, session.user.id, data);

    if (!project) {
      return Response.json({ message: 'Project not found or unauthorized' }, { status: 404 });
    }

    return Response.json(project, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/projects/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to update project' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete project
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const success = await ProjectService.deleteProject(id, session.user.id);

    if (!success) {
      return Response.json({ message: 'Project not found or unauthorized' }, { status: 404 });
    }

    return Response.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/projects/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to delete project' },
      { status: 500 },
    );
  }
}
