import { PrismaClient } from '@/lib/generated/prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { env } from 'process';
import { sendMail } from './send-mail';

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mongodb',
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      await sendMail({
        email: env.APP_MAIL ?? 'pitithuong@gmail.com',
        sendTo: user.email,
        subject: 'Reset your password',
        text: 'Reset your password',
        html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Your Password</title>
<style>
body {
font-family: Arial, sans-serif;
background-color: #f4f4f4;
margin: 0;
padding: 0;
}
.email-container {
max-width: 600px;
margin: 20px auto;
background-color: #ffffff;
padding: 20px;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.header {
text-align: center;
font-size: 24px;
font-weight: bold;
color: #333333;
}
.content {
margin-top: 20px;
font-size: 16px;
color: #555555;
}
.button-container {
text-align: center;
margin-top: 30px;
}
.reset-button {
background-color: #007BFF;
color: #ffffff;
padding: 12px 24px;
text-decoration: none;
border-radius: 5px;
font-size: 16px;
}
.reset-button:hover {
background-color: #0056b3;
}
.footer {
margin-top: 30px;
font-size: 12px;
color: #999999;
text-align: center;
}
a {
color: #007BFF;
}
</style>
</head>
<body>
<div class="email-container">
<div class="header">Reset Your Password</div>
<div class="content">
<p>Hello,</p>
<p>You recently requested to reset your password. Click the button below to proceed:</p>
</div>
<div class="button-container">
<a href="${url}" class="reset-button">Reset Password</a>
</div>
<div class="content">
<p>If the button above doesn't work, copy and paste the following link into your browser:</p>
<p><a href="${url}">${url}</a></p>
</div>
<div class="footer">
<p>If you did not request this password reset, please ignore this email.</p>
</div>
</div>
</body>
</html>`,
      });
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
