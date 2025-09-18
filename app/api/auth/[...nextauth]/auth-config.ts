import { UserService } from '@/services/user-service';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'pitithuong@gmail.com';

export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Tìm user trong database
          const user = await UserService.findUserByCredentials(credentials.email, credentials.password);

          console.log('Found user:', user);

          if (user) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
              image: user.avatar || null,
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Nếu đăng nhập bằng Google
      if (account?.provider === 'google') {
        // Chỉ cho phép email admin duy nhất
        return user.email === ADMIN_EMAIL;
      }

      // Nếu đăng nhập bằng credentials
      if (account?.provider === 'credentials') {
        return true; // Đã được validate trong authorize
      }

      return false;
    },

    async jwt({ token, user }) {
      // Khi đăng nhập lần đầu
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      // Trả về thông tin từ token (có thể từ DB hoặc Google)
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          image: token.image as string,
          role: token.role as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', // Redirect về signin page thay vì error page
  },
  session: {
    strategy: 'jwt',
    maxAge: 365 * 24 * 60 * 60, // 1 năm - session dài hạn cho admin
  },
  secret: process.env.NEXTAUTH_SECRET,
};
