# AGENTS.md

## Principles for working with shadcn/ui components

- When using the Button component, Icon components do not require size classNames or manual spacing utilities (such as `pr-2`), as the button itself automatically adjusts the SVG size and spacing via the `gap` property.
- Prioritize using components from base-ui; radix ui is currently considered legacy and will be migrated later.

## API Query Building

Every list GET endpoint **must** build its query with `buildListQuery` from `lib/api` (search / sort / filter / pagination). Never hand-roll `where`, `orderBy`, or pagination logic.

```ts
const query = buildListQuery<Prisma.XWhereInput>(searchParams, {
  searchFields: ['name', 'slug'],        // fields matched by `?search=`
  sortableFields: ['createdAt', 'name'], // whitelist for `?sortBy=` / `?sortOrder=`
  filterFields: {                        // `?filter.<key>=` -> Prisma where
    published: { parse: parseBooleanParam },
    likes: { operator: FilterOperator.GTE, parse: parseNumberParam },
  },
  baseWhere: { ... },                    // always-applied constraint
});
```

Supported URL params: `search`, `sortBy`, `sortOrder`, `limit`, `page`, `filter.<key>` (or `filters.<key>`).

## Server Services

Each feature exposes **one service object** in `features/<feature>/server/<name>.service.ts`:

```ts
export const tagService = {
  getAll(headers, searchParams), // buildListQuery + Promise.all(findMany, count)
  getById(headers, id),
  create(headers, input),
  update(headers, id, input),
  delete(headers, id),
};
```

Rules:

- `headers` is always the first argument (required by `requireAdmin`).
- `getAll` returns `{ pagination, <pluralEntity>, total }`; `getById` / `create` / `update` return `{ <entity> }`; `delete` returns `{ id }`.
- Write methods explicitly — do **not** use a CRUD factory/generator. Custom logic lives naturally inside each method.
- Route files stay thin: parse params/body -> call `xService.*` -> wrap with `apiOk` / `apiCreated` / `apiPaginated`.

## Auth — Single Admin

This is a **single-admin** app: exactly one user (identified by `ADMIN_ID` in env) manages the portfolio.

- Server services gate with `requireAdmin(headers)` from `lib/auth-guard.ts`.
- `requireAdmin` reads the Better Auth session: no session -> `UNAUTHORIZED` (401); `session.user.id !== ADMIN_ID` -> `FORBIDDEN` (403).
- Never authorize via `ADMIN_EMAIL` or `SiteSetting.mainUserId`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
