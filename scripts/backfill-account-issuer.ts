/**
 * Backfill `issuer` for existing Account documents (created by better-auth < 1.7).
 *
 * better-auth 1.7 scopes account identity by `issuer`:
 *   - email/password credential accounts -> `local:credential`
 *   - external OAuth-ish providers        -> `local:oauth:<providerId>`
 *
 * Run from repo root:
 *   pnpm dlx tsx --env-file=.env scripts/backfill-account-issuer.ts
 *
 * Idempotent: accounts that already have the correct issuer are left untouched.
 */
import { PrismaClient } from '../lib/generated/prisma/client';

const prisma = new PrismaClient();

function issuerFor(providerId: string): string | null {
  if (providerId === 'credential') return 'local:credential';
  if (providerId === 'siwe') return 'local:siwe';
  if (providerId === 'anonymous') return 'local:anonymous';
  // Anything else is treated as an external (OAuth-like) connection.
  return `local:oauth:${providerId}`;
}

async function main() {
  const accounts = await prisma.account.findMany();
  console.log(`Found ${accounts.length} account(s).`);

  let updated = 0;
  for (const acct of accounts) {
    const target = issuerFor(acct.providerId);
    if (!target) {
      console.log(`- SKIP id=${acct.id} providerId=${acct.providerId} (unknown, left untouched)`);
      continue;
    }

    const needsUpdate = acct.issuer !== target;
    console.log(
      `- id=${acct.id} providerId=${acct.providerId} accountId=${acct.accountId} userId=${acct.userId}` +
        ` issuer=${acct.issuer ?? '(missing)'} -> target=${target}${needsUpdate ? ' (UPDATE)' : ' (ok)'}`,
    );

    if (acct.providerId === 'credential' && acct.accountId !== acct.userId) {
      console.log(
        `  !! credential accountId (${acct.accountId}) != userId (${acct.userId}): better-auth 1.7 expects accountId === user id for credential accounts`,
      );
    }

    if (needsUpdate) {
      await prisma.account.update({ where: { id: acct.id }, data: { issuer: target } });
      updated++;
    }
  }

  console.log(`Done. Updated ${updated} account(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
