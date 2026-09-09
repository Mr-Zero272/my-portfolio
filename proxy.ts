import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import picomatch from 'picomatch';
import { auth } from './lib/auth';

const authPaths = ['/api/auth/**', '/auth/**'];
const publicPaths = [
  '/',
  '/about-me',
  '/projects',
  '/contact',
  '/favorite',
  '/blogs/**',
  '/settings',
];
const apiPathsHandledByRoute = ['/api/site-setting/**'];
const guardedPagePaths = ['/admin/**', '/onboarding', '/dashboard/**', '/app-settings/**'];

function redirectToSignIn(request: NextRequest) {
  const url = new URL('/auth/sign-in', request.url);
  url.searchParams.set('callbackUrl', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (picomatch.isMatch(pathname, authPaths)) {
    return NextResponse.next();
  }

  if (picomatch.isMatch(pathname, apiPathsHandledByRoute)) {
    return NextResponse.next();
  }

  if (picomatch.isMatch(pathname, publicPaths)) {
    return NextResponse.next();
  }

  if (!picomatch.isMatch(pathname, guardedPagePaths)) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id || !session.user.email) {
    return redirectToSignIn(request);
  }

  const setting = await prisma.siteSetting.findFirst({
    select: {
      id: true,
      setupCompleted: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const isAdmin = session.user.id === process.env.ADMIN_ID;
  const isOnboarding = pathname === '/onboarding';

  if (!isAdmin) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (setting?.setupCompleted && isOnboarding) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!setting || !setting.setupCompleted) {
    if (isOnboarding) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and metadata files.
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
