import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'x102zaupes.ufs.sh',
      },
      {
        protocol: 'https',
        hostname: 'pub-3ebcc65a5f5143ddaf45e9b0d1aecd3e.r2.dev',
      },
    ],
  },
  outputFileTracingIncludes: {
     '/**/*': ['./lib/generated/prisma/**/*'],
  },
};

export default nextConfig;
