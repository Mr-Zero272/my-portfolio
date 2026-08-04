import { requireAdmin } from '@/lib/auth-guard';

export async function requirePostManager(headers: Headers) {
  return requireAdmin(headers);
}
