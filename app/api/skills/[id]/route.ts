import { auth } from '@/auth';
import { SkillService } from '@/services/skill-service';

/**
 * GET /api/skills/[id]
 * Get skill by ID
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const skill = await SkillService.getSkillById(id);

    if (!skill) {
      return Response.json({ message: 'Skill not found' }, { status: 404 });
    }

    return Response.json(skill, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/skills/[id]:', error);
    return Response.json({ message: error instanceof Error ? error.message : 'Failed to get skill' }, { status: 500 });
  }
}

/**
 * PUT /api/skills/[id]
 * Update skill
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const skill = await SkillService.updateSkill(id, session.user.id, data);

    if (!skill) {
      return Response.json({ message: 'Skill not found or unauthorized' }, { status: 404 });
    }

    return Response.json(skill, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/skills/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to update skill' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/skills/[id]
 * Delete skill
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const success = await SkillService.deleteSkill(id, session.user.id);

    if (!success) {
      return Response.json({ message: 'Skill not found or unauthorized' }, { status: 404 });
    }

    return Response.json({ message: 'Skill deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/skills/[id]:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to delete skill' },
      { status: 500 },
    );
  }
}
