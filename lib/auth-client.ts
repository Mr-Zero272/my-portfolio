import { createAuthClient } from 'better-auth/react';
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: 'https://pitithuong.dev.localhost',
});

export const { signIn, signUp, useSession } = createAuthClient();
