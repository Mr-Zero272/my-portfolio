import { UserService } from '@/services/user-service';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

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
        try {
          // Tìm hoặc tạo user trong database
          const dbUser = await UserService.findOrCreateGoogleUser({
            email: user.email!,
            name: user.name!,
            image: user.image || undefined,
          });

          if (dbUser) {
            // Cập nhật thông tin user từ database
            user.id = dbUser._id.toString();
            user.name = dbUser.name;
            user.email = dbUser.email;
            user.image = dbUser.avatar;
            return true;
          }

          return false;
        } catch (error) {
          console.error('Error in Google sign in:', error);
          return false;
        }
      }

      // Nếu đăng nhập bằng credentials
      if (account?.provider === 'credentials') {
        return true; // Đã được validate trong authorize
      }

      return false;
    },

    async jwt({ token, user, account }) {
      // Khi đăng nhập lần đầu
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;

        // Nếu là Google OAuth, lấy thông tin từ database
        if (account?.provider === 'google') {
          const dbUser = await UserService.findUserByEmail(user.email!);
          if (dbUser) {
            token.role = dbUser.role;
            token.name = dbUser.name;
            token.image = dbUser.avatar;
          }
        } else {
          token.role = 'admin';
        }
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
    error: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 365 * 24 * 60 * 60, // 1 năm - session dài hạn cho admin
  },
  secret: process.env.NEXTAUTH_SECRET,
};
