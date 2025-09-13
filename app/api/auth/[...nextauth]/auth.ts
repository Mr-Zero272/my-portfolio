// app/api/auth/[...nextauth]/auth.ts
import NextAuth from 'next-auth';
import { authOptions } from './auth-options';

const { auth, handlers } = NextAuth(await authOptions());

export { auth, handlers };
