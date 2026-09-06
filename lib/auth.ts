import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { env } from 'process';
import { emailVerificationEmailHtml, resetPasswordEmailHtml } from './auth-email';
import { sendMail } from './send-mail';

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mongodb',
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const htmlContent = await resetPasswordEmailHtml(url);
      await sendMail({
        email: env.APP_MAIL ?? 'pitithuong@gmail.com',
        sendTo: user.email,
        subject: 'Reset your password',
        text: 'Reset your password',
        html: htmlContent,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const htmlContent = await emailVerificationEmailHtml(url);
      await sendMail({
        email: env.APP_MAIL ?? 'pitithuong@gmail.com',
        sendTo: user.email,
        subject: 'Verify your email',
        text: 'Verify your email',
        html: htmlContent,
      });
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 15 * 60,
    },
  },
  // Tuỳ chọn: Google OAuth
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
  },
});
