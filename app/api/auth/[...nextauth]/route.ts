// app/api/auth/[...nextauth]/route.ts
import { handlers } from './auth';

// Add error handling wrapper
const wrappedHandler = async (req: Request, context: unknown) => {
  try {
    const { GET: originalGET, POST: originalPOST } = handlers;
    const method = req.method;

    if (method === 'GET') {
      return await originalGET(req, context);
    } else if (method === 'POST') {
      return await originalPOST(req, context);
    }

    return new Response('Method not allowed', { status: 405 });
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
