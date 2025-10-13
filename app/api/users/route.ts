import { UserService } from '@/services/user-service';

// get request to get all users
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const limit = params.get('limit') ? parseInt(params.get('limit') as string, 10) : 10;
  const page = params.get('page') ? parseInt(params.get('page') as string, 10) : 1;
  const role = params.get('role') || undefined;

  const users = await UserService.getAllUsers({ limit, page, role });
  return new Response(JSON.stringify(users), { status: 200 });
}

// post request to create a new user
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
