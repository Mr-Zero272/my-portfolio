import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get session from Next-auth to extract the access token
    const session = await getSession();

    // If session exists and has access token, add it to the Authorization header
    if (session?.accessToken && session.accessToken !== 'anonymous_token') {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Do something before response is sent
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.error('Response error:', error.response.data);

      // Handle 401 Unauthorized errors - token might be expired
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Get current session
          const session = await getSession();

          if (session?.error === 'RefreshAccessTokenError') {
            // If refresh token is also expired, sign out user
            console.log('❌ Refresh token expired, signing out user');
            await signOut({ callbackUrl: '/onboarding' });
            return Promise.reject(error);
          }

          // Check if we have a session and it's not anonymous
          if (session?.accessToken && session.accessToken !== 'anonymous_token') {
            console.log('🔄 Token expired, attempting to refresh session...');

            // Use our utility function to refresh the session
            // const refreshSuccess = await refreshSession();

            // if (refreshSuccess) {
            //   // Get the refreshed session
            //   const refreshedSession = await getSession();
            //   if (refreshedSession?.accessToken) {
            //     // Update the request with new token
            //     originalRequest.headers.Authorization = `Bearer ${refreshedSession.accessToken}`;
            //     console.log('✅ Session refreshed successfully, retrying request');
            //     return axiosInstance(originalRequest);
            //   }
            // }

            // If we can't refresh, sign out the user
            console.log('❌ Failed to refresh session, signing out user');
            await signOut({ callbackUrl: '/onboarding' });
          }
        } catch (refreshError) {
          console.error('❌ Error during token refresh:', refreshError);
          // If refresh fails, sign out the user
          await signOut({ callbackUrl: '/onboarding' });
        }
      }
    }
    // Do something with response error
    return Promise.reject(error);
  },
);

export default axiosInstance;
