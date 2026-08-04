import { ApiErrorCode, throwApiError } from '@/lib/api';
import { auth } from '@/lib/auth';

/**
 * Requires an authenticated session whose user.id matches the single admin
 * (process.env.ADMIN_ID).
 *
 * - No session -> UNAUTHORIZED (401)
 * - Signed in but user.id !== ADMIN_ID -> FORBIDDEN (403)
 */
export async function requireAdmin(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  const user = session?.user;

  if (!user?.id) {
    throwApiError(ApiErrorCode.UNAUTHORIZED);
  }

  if (user.id !== process.env.ADMIN_ID) {
    throwApiError(ApiErrorCode.FORBIDDEN, {
      message: 'You do not have permission to access this resource.',
    });
  }

  return { user };
}
