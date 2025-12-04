import { UserService } from '@/services/user-service';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users with pagination and optional role filter
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by user role
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const limit = params.get('limit') ? parseInt(params.get('limit') as string, 10) : 10;
  const page = params.get('page') ? parseInt(params.get('page') as string, 10) : 1;
  const role = params.get('role') || undefined;

  const users = await UserService.getAllUsers({ limit, page, role });
  return new Response(JSON.stringify(users), { status: 200 });
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user account
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - name
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 default: admin
 *               avatar:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to create user
 */
export async function POST(req: Request) {
  const { username, email, password, name, role, avatar } = await req.json();

  if (!username || !email || !password || !name) {
    return new Response(JSON.stringify({ message: 'Username, email, password, and name are required' }), {
      status: 400,
    });
  }

  const newUser = await UserService.createUser({
    username,
    email,
    password,
    name,
    role: role || 'admin',
    avatar,
  });

  if (!newUser) {
    return new Response(JSON.stringify({ message: 'Failed to create user' }), { status: 500 });
  }

  return new Response(JSON.stringify(newUser), { status: 201 });
}
