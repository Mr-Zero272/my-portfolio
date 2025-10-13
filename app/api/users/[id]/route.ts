import { UserService } from '@/services/user-service';

// get request to get user by id
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
  }

  const user = await UserService.getUserById(id);

  if (!user) {
    return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true, data: user }), { status: 200 });
}

// patch request to update user
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updateData = await req.json();

  if (!id) {
    return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
  }

  const updatedUser = await UserService.updateUser(id, updateData);

  if (!updatedUser) {
    return new Response(JSON.stringify({ message: 'Failed to update user' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, data: updatedUser }), { status: 200 });
}

// delete request to delete user
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
  }

  const deleted = await UserService.deleteUser(id);

  if (!deleted) {
    return new Response(JSON.stringify({ message: 'Failed to delete user' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, message: 'User deleted successfully' }), { status: 200 });
}
