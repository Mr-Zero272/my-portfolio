<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-architecture-rules -->

# Project Architecture

Use a feature-based structure for product code:

```txt
features/<feature>/
  components/   # Client/server UI pieces owned by the feature
  screens/      # Route-level compositions imported by app pages
  schemas/      # Zod schemas and validation contracts
  server/       # Server-only data access, auth checks, and secret handling
  services/     # Client-safe service wrappers when needed
  types/        # Feature-specific exported types
  utils/        # Feature-local helpers
  index.ts      # Public feature exports
```

Keep shared design primitives in `components/ui`, app-wide providers in `components/providers`, shared infrastructure in `lib`, and route files in `app` thin. App route handlers should delegate business rules to `features/*/server` modules.

<!-- END:project-architecture-rules -->
