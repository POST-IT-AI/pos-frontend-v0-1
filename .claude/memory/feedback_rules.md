---
name: POS Project Rules
description: Coding rules and conventions enforced across the POS frontend project
type: feedback
---

## Package Manager
Always use `pnpm` — never npm or yarn.

**Why:** Project is configured with pnpm lockfile; mixing package managers causes dependency issues.
**How to apply:** Every install, add, or script command must use `pnpm`.

## TypeScript
Never use `any` as a TypeScript type (enforced by ESLint `@typescript-eslint/no-explicit-any: error`).

**Why:** Strict typing catches bugs at compile time; `any` defeats the purpose of TypeScript.
**How to apply:** Use `unknown` + type narrowing, generics, or explicit types instead.

## Forms
Forms must use React Hook Form + Zod (`zod/v4` import) — never raw useState for form state.

**Why:** Consistent validation pattern across the app; Zod schemas are reusable for both client and API validation.
**How to apply:** Create schema in `src/lib/validations/`, use `zodResolver` from `@hookform/resolvers/zod`.

## State Management
- Server state (products, orders, users) uses TanStack Query hooks in `src/hooks/` — never store in Zustand.
- Client-only transient state (cart) uses Zustand.

**Why:** TanStack Query handles caching, refetching, and invalidation automatically. Zustand is for ephemeral client state only.
**How to apply:** New server data → create hook in `src/hooks/use-<domain>.ts`. New client state → add to existing or new Zustand store in `src/store/`.

## API Calls
All API calls go through the shared Axios instance in `src/api/axios.ts` — never import axios directly elsewhere.

**Why:** Central instance handles auth token injection and 401 logout automatically.
**How to apply:** Create API module in `src/api/<domain>.ts`, import `{ api }` from `@/api/axios`.

## Toast Notifications
Use `sonner` — import `{ toast }` from `"sonner"`.

**Why:** Consistent toast UI; Sonner integrates with shadcn/ui theming.
**How to apply:** `toast.success()`, `toast.error()` in mutation callbacks.

## UI Components (shadcn/ui v4)
- Uses base-nova style with `@base-ui/react` primitives.
- Button does **not** support `asChild` — use `buttonVariants()` with native elements or `render` prop instead.
- Add new components via `npx shadcn@latest add <component>`.

**Why:** shadcn v4 replaced Radix `asChild` with Base UI `render` prop pattern.
**How to apply:** For link-as-button, use `<Link className={buttonVariants()}>` instead of `<Button asChild><Link>`.

## Tailwind CSS v4
Configuration lives in `src/index.css` (no `tailwind.config` file). CSS variables for theming are defined there.

**Why:** Tailwind v4 moved config to CSS-first approach.
**How to apply:** Theme changes go in `src/index.css` under `@theme inline {}` and `:root` / `.dark` blocks.