// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from './auth-options';

const handler = NextAuth(await authOptions());

// Add error handling wrapper
const wrappedHandler = async (req: Request, context: unknown) => {
  try {
    return await handler(req, context);
  } catch (error) {
    console.error('❌ NextAuth Route Error:', error);

    // Return a proper error response instead of letting it crash
    return new Response(
      JSON.stringify({
        error: 'Authentication service temporarily unavailable',
        message: 'Please try again in a few moments',
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
};

export { wrappedHandler as GET, wrappedHandler as POST };
