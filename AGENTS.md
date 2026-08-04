# AGENTS.md

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
