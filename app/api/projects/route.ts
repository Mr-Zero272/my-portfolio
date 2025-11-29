import { auth } from '@/auth';
import { ProjectService } from '@/services/project-service';

/**
 * GET /api/projects
 * Get projects by userId (from query param) or owner (default)
 * Query params:
 * - userId: string (optional) - Get projects for specific user
 * - owner: boolean (optional) - Get owner projects
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const isOwner = searchParams.get('owner') === 'true';

    // If userId is provided, get projects for that user
    if (userId) {
      const projects = await ProjectService.getProjectsByUserId(userId);
      return Response.json(projects, { status: 200 });
    }

    // Default to owner's projects (or if owner=true is explicitly set)
    // The user requested: "by default we will get the project of the admin of this page"
    const projects = await ProjectService.getOwnerProjects();
    return Response.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to get projects' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Ensure userId matches authenticated user
    const projectData = {
      ...data,
      userId: session.user.id,
    };

    const project = await ProjectService.createProject(projectData);
    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to create project' },
      { status: 500 },
    );
  }
}
