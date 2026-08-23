import { prisma } from '@/lib/prisma';

/**
 * Resolves the id of the portfolio owner (the "main user") from the single
 * global SiteSetting. Used ONLY for scoping public read queries — never for
 * authorization gating (auth stays on `ADMIN_ID` via `requireAdmin`).
 *
 * Returns `null` when the site has not been onboarded yet.
 */
export async function getMainUserId(): Promise<string | null> {
  const setting = await prisma.siteSetting.findFirst({
    select: { mainUserId: true },
    orderBy: { createdAt: 'asc' },
  });

  return setting?.mainUserId ?? null;
}
