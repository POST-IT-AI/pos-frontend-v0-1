# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
```
pnpm dev          # Vite dev server on http://localhost:5173
pnpm build        # TypeScript check (tsc -b) + production build
pnpm lint         # ESLint
pnpm lint:fix     # ESLint with auto-fix
pnpm format       # Prettier on src/
pnpm preview      # Preview production build
pnpm test         # Vitest (run once)
pnpm test:watch   # Vitest (watch mode)
```

## Rules
- Always use `pnpm` — never npm or yarn.
- Never use `any` as a TypeScript type (enforced by ESLint `@typescript-eslint/no-explicit-any: error`).
- Forms must use React Hook Form + Zod (`zod/v4` import) — never raw useState for form state.
- Server state (products, orders, users) uses TanStack Query hooks in `src/hooks/` — never store in Zustand.
- Client-only transient state (cart) uses Zustand.
- Two Axios instances in `src/api/axios.ts` — use `api` for general endpoints, `authAxios` for auth-service endpoints (login, me, refresh). Never import axios directly elsewhere.
- Environment variables are typed and validated in `src/lib/env.ts` — always use this file, never access `import.meta.env` directly.
- Toast notifications use `sonner` — import `{ toast }` from `"sonner"`.
- UI components use shadcn/ui v4 (base-nova style, `@base-ui/react` primitives). The Button component does **not** support `asChild` — use `buttonVariants()` with native elements or `render` prop instead.
- Add new shadcn components via `npx shadcn@latest add <component>`.
- Tailwind CSS v4 — configuration lives in `src/index.css` (no `tailwind.config` file). CSS variables for theming are defined there.
- Never hardcode values — use constants, config, enums, or data from the API.
- If a component file exceeds 500 lines, split it into smaller sub-components.
- Validation schemas are **hook-based and i18n-aware** — use `useMemo` + `useTranslation()` for error messages. See `src/lib/validations/auth.ts` for the pattern.
- All UI text must use `useTranslation()` from `react-i18next` — never hardcode display strings.

## Architecture

React 19 + Vite 8 SPA. TypeScript strict mode. Path alias `@/*` → `src/*`.

### Provider Stack (App.tsx)
`QueryClientProvider` → `RouterProvider` → pages. `Toaster` (sonner) and `ReactQueryDevtools` are siblings at root level. Default query `staleTime` is 60s.

### Routing
React Router v7 with `createBrowserRouter` in `src/routes/index.tsx`. Two layout branches:
- **AuthLayout** — unauthenticated pages (`/login`)
- **MainLayout** (wrapped in `ProtectedRoute`) — sidebar + header + `<Outlet />` for all authenticated pages

Pages use `lazy: () => import(...)` and must export a named `Component` function. Admin-only routes (`/users`, `/settings`) are nested under a second `ProtectedRoute` with `requiredRoles={["ADMIN"]}`.

### Data Flow
```
Backend API → Axios (src/api/axios.ts) → TanStack Query hooks (src/hooks/) → React Components
                                                                                   │
                                                                             Zustand (cart, auth, UI)
```

The Axios instance auto-attaches the Bearer token from `useAuthStore.getState()` and globally handles 401 → logout + redirect.

### State Management
| Data | Where | Persisted? |
|------|-------|------------|
| Products, Orders, Users, Categories | TanStack Query | Cache only |
| Cart (current transaction) | Zustand `src/store/cart.ts` | No — resets on reload |
| Auth (user + JWT token) | Zustand `src/store/auth.ts` | Yes — localStorage |
| UI preferences (sidebar) | Zustand `src/store/ui.ts` | Yes — localStorage |

### Query Key Pattern
Each domain uses a factory object (e.g., `productKeys` in `src/hooks/use-products.ts`):
```ts
productKeys.all        // ["products"]
productKeys.lists()    // ["products", "list"]
productKeys.list({})   // ["products", "list", filters]
productKeys.detail(id) // ["products", "detail", id]
```
Mutations invalidate via these keys. Follow this pattern for new domains.

## Testing

- Framework: Vitest + `@testing-library/react` + `jsdom`
- API mocking: MSW (`msw`) — do not mock fetch/axios directly
- Test setup file: `src/test/setup.ts`
- Store tests live alongside stores (e.g., `src/store/auth.test.ts`)

## Milestone Workflow

GitHub Actions automate feature development via milestones:

| Milestone | Workflow | Action |
|-----------|----------|--------|
| `DOING` | `milestone-generate-plan.yml` | Claude (Opus 4.6) generates an implementation plan as an issue comment |
| `WAITING_APPROVE_PLAN` | — | Waiting for human review of the plan |
| `APPROVE_PLAN` | `milestone-implement.yml` | Claude (Sonnet 4.6) implements the plan, commits, pushes, and opens a PR |
| `WAITING_APPROVE_CODE` | — | Waiting for human review of the PR |
| Rejected plan | `milestone-reject-plan.yml` | Claude revises the plan based on feedback |
| Rejected code | `milestone-reject-code.yml` | Claude revises the implementation based on feedback |
| `DONE` | `milestone-done.yml` | Closes the issue |

### Implementation Guidelines (applied automatically)
The implement workflow enforces these skills on every run:
- `/responsive` — all UI must support mobile, tablet, and desktop breakpoints
- `/react-best-practices` — follow React/Next.js performance and rendering best practices

### Adding a New API Domain
1. Add types in `src/types/index.ts`
2. Create API module in `src/api/<domain>.ts` using the shared `api` instance
3. Create TanStack Query hooks in `src/hooks/use-<domain>.ts` with a `<domain>Keys` factory
4. Add Zod validation schema in `src/lib/validations/<domain>.ts`
5. Create page in `src/pages/<domain>/` (export `function Component()`)
6. Register route in `src/routes/index.tsx`
