// middleware.ts (ở root của project)
import micromatch from 'micromatch';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Định nghĩa các route cần bảo vệ
const protectedPaths = ['/piti/**', '/api/admin/**'];

// Các route public không cần authentication
const publicPaths = ['/', '/about-me', '/projects', '/contact', '/favorite', '/api/auth/**', '/auth/**'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Kiểm tra nếu là route public thì cho phép
  if (micromatch.isMatch(pathname, publicPaths)) {
    return NextResponse.next();
  }

  // Kiểm tra nếu là route cần bảo vệ
  if (micromatch.isMatch(pathname, protectedPaths)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Nếu không có token, redirect về trang login
    if (!token) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Nếu có token nhưng không phải admin
    if (token.email !== process.env.ADMIN_EMAIL) {
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
