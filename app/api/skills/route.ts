import { auth } from '@/auth';
import { SkillService } from '@/services/skill-service';

/**
 * GET /api/skills
 * Get skills by userId (from query param) or owner (default)
 * Query params:
 * - userId: string (optional) - Get skills for specific user
 * - owner: boolean (optional) - Get owner skills
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // If userId is provided, get skills for that user
    if (userId) {
      const skills = await SkillService.getSkillsByUserId(userId);
      return Response.json(skills, { status: 200 });
    }

    // Default to owner's skills
    const skills = await SkillService.getOwnerSkills();
    return Response.json(skills, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/skills:', error);
    return Response.json({ message: error instanceof Error ? error.message : 'Failed to get skills' }, { status: 500 });
  }
}

/**
 * POST /api/skills
 * Create a new skill entry
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Ensure userId matches authenticated user
    const skillData = {
      ...data,
      userId: session.user.id,
    };

    const skill = await SkillService.createSkill(skillData);
    return Response.json(skill, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/skills:', error);
    return Response.json(
      { message: error instanceof Error ? error.message : 'Failed to create skill' },
      { status: 500 },
    );
  }
}
