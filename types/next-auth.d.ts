// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  /**
   * Mở rộng interface Session để thêm accessToken
   */
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // Có thể là 'user', 'admin', 'anonymous', etc.
      id?: string;
      username?: string; // Thêm trường username
      isAnonymous?: boolean; // Flag để dễ dàng kiểm tra anonymous user
      isFirstLogin?: boolean; // Flag để kiểm tra lần đăng nhập đầu tiên
    };
    accessToken?: string;
    error?: string;
    accessTokenExpires?: number;
  }

  /**
   * Mở rộng interface User để thêm accessToken
   */
  interface User {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Mở rộng interface JWT
   */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
