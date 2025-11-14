// proxy.ts (ở root của project - Next.js 16)
import { auth } from '@/auth';
import micromatch from 'micromatch';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Định nghĩa các route cần bảo vệ
const protectedPaths = ['/piti/**', '/api/admin/**'];

// Các route public không cần authentication
const publicPaths = ['/', '/about-me', '/projects', '/contact', '/favorite', '/api/auth/**', '/auth/**', '/blog/**'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Kiểm tra nếu là route public thì cho phép
  if (micromatch.isMatch(pathname, publicPaths)) {
    return NextResponse.next();
  }

  // Kiểm tra nếu là route cần bảo vệ
  if (micromatch.isMatch(pathname, protectedPaths)) {
    // Sử dụng auth() từ NextAuth v5
    const session = await auth();

    console.log({
      session,
    });

    // Nếu không có session, redirect về trang login
    if (!session) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Nếu có session nhưng không phải admin
    if (session.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
