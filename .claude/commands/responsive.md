You are a responsive design assistant for the POS system project.

## Task

Apply responsive design to the target files or pages: $ARGUMENTS

If no arguments provided, apply responsive design to **all pages and layout components** in the project.

---

## Breakpoint Strategy

Use Tailwind CSS v4 breakpoints (mobile-first):

| Breakpoint | Width | Target Device |
|------------|-------|---------------|
| (base)     | < 768px | Mobile phones |
| `md:`      | ≥ 768px | iPad / tablet |
| `lg:`      | ≥ 1024px | iPad landscape / laptop |
| `xl:`      | ≥ 1280px | Desktop |

---

## Responsive Rules

### Layout & Navigation
- **Mobile (< md):** Sidebar hidden off-screen, opens as full-overlay via hamburger button in header. Use `fixed inset-y-0 left-0 z-50` + translate transform.
- **Tablet (md–lg):** Sidebar always visible, auto icon-only (`w-16`). No toggle button shown.
- **Desktop (lg+):** Sidebar follows `sidebarCollapsed` from `useUIStore` — full (`w-64`) or icon-only (`w-16`).
- `AppHeader` must show a hamburger `<Menu />` icon button on mobile (`md:hidden`) that calls `toggleSidebarOpen()`.
- `MainLayout` must render a click-away backdrop (`fixed inset-0 z-40 bg-black/50 md:hidden`) when `sidebarOpen` is true.
- Main content padding: `p-4 md:p-6`.

### Page Header (`PageHeader` component)
- Mobile: stack title and action buttons vertically (`flex-col gap-3`).
- Tablet+: row layout (`sm:flex-row sm:items-center sm:justify-between`).
- Title font size: `text-xl sm:text-2xl`.

### Grids & Content
- Single column on mobile → multi-column on tablet/desktop.
- Use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4` patterns.
- Tables: wrap in `overflow-x-auto` on mobile.
- Cards: full width on mobile, auto-sized on larger screens.

### Forms (Auth pages)
- Already constrained to `max-w-md` by `AuthLayout` — no changes needed unless layout breaks.
- Ensure form inputs are `w-full` and touch-friendly (min height `h-10`).

### Typography
- Large display text (e.g., 404 page): `text-4xl sm:text-6xl`.
- Page titles: `text-xl sm:text-2xl`.

### Touch & Spacing
- Minimum tap target: 44×44px. Use `min-h-[44px]` or `p-3` on interactive elements.
- Avoid hover-only states; ensure active/focus states work on touch.

---

## State Required

The `useUIStore` (Zustand) must expose:
```ts
sidebarOpen: boolean          // mobile sidebar overlay open state
setSidebarOpen: (open: boolean) => void
toggleSidebarOpen: () => void
```
This state must NOT be persisted (mobile transient state).

---

## Steps

### Step 1: Audit
Read every target file to understand current layout and CSS classes.

### Step 2: Apply Changes
For each file, apply the minimum necessary changes to support the three breakpoints. Preserve all existing functionality.

Key files (apply in this order to avoid dependency issues):
1. `src/store/ui.ts` — add `sidebarOpen` state
2. `src/components/layout/app-sidebar.tsx` — responsive visibility and collapse
3. `src/components/layout/app-header.tsx` — hamburger button
4. `src/components/layout/main-layout.tsx` — overlay backdrop, padding
5. `src/components/shared/page-header.tsx` — stacking layout
6. All pages in `src/pages/` — grid, spacing, typography adjustments

### Step 3: Verify Build
```bash
pnpm lint
pnpm build
```
Fix any errors before reporting.

### Step 4: Report
List all files modified and describe the responsive behavior added at each breakpoint.

---

## Rules
- Use Tailwind v4 only — no inline styles, no media query JS.
- Never use `any` as a TypeScript type.
- Do not break existing functionality.
- Follow all project conventions in CLAUDE.md.
