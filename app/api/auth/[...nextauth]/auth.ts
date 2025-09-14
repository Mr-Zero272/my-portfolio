// app/api/auth/[...nextauth]/auth.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth-config';

const { auth, handlers } = NextAuth(authConfig);

export { auth, handlers };
