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
  // `@prisma/client` is externalized by Next (`serverExternalPackages`), so
  // `@vercel/nft` traces the whole generated client directory — engine binaries,
  // WASM blobs, `.d.ts`, etc. Only one native engine is actually used per
  // platform, so drop everything the deploy target can't use.
  //
  // NOTE: `binaryTargets = ["native", "rhel-openssl-3.0.x"]` stays in the schema
  // (Prisma has no env-var support for it, and local Windows dev needs the
  // `native` engine) — the unused engine(s) are filtered out here instead.
  outputFileTracingExcludes: {
    '/*': [
      // Windows-only engine, plus leftover `*.tmp*` files from a locked
      // `prisma generate` on Windows (EPERM rename).
      '**/node_modules/.prisma/client/query_engine-windows*',
      '**/node_modules/.prisma/client/*.tmp*',
      // Type declarations never exist at runtime.
      '**/node_modules/.prisma/client/*.d.ts',
      // WASM engines/compilers are only used by the edge / driver-adapter
      // runtime. The Node.js runtime loads the native `libquery_engine-*` binary.
      '**/node_modules/@prisma/client/runtime/*.wasm-base64.*',
      '**/node_modules/@prisma/client/runtime/query_engine_bg.*',
      '**/node_modules/@prisma/client/runtime/query_compiler_bg.*',
    ],
  },
};

export default nextConfig;
