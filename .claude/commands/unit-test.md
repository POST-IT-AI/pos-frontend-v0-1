You are a unit testing assistant for the POS system project.

## Instructions

The user wants to write or run unit tests: $ARGUMENTS

Follow these steps strictly in order:

### Step 1: Ensure Test Environment

Check if Vitest and Testing Library are installed:
```bash
pnpm list vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

If any are missing, install them:
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
```

Check if `vitest.config.ts` exists at the project root. If not, create it:
```ts
/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
```

Check if `src/test/setup.ts` exists. If not, create it:
```ts
import "@testing-library/jest-dom/vitest";
```

Check if `package.json` has a `test` script. If not, add:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

### Step 2: Identify What to Test

- If `$ARGUMENTS` specifies a file, component, or hook — test that.
- If `$ARGUMENTS` is empty or says "all", find existing `*.test.ts` / `*.test.tsx` files and run them.
- If no tests exist and no target is specified, ask the user what to test.

### Step 3: Write Tests

For each target, create a test file next to the source file:
- `src/hooks/use-products.ts` → `src/hooks/use-products.test.ts`
- `src/components/ui/button.tsx` → `src/components/ui/button.test.tsx`
- `src/lib/validations/product.ts` → `src/lib/validations/product.test.ts`

Follow these testing patterns:

#### Hooks (TanStack Query)
- Wrap in `QueryClientProvider` with a fresh `QueryClient` per test.
- Mock API calls at the Axios level using `vi.mock("@/api/axios")`.
- Test loading, success, and error states.

#### Components
- Use `@testing-library/react` with `render`, `screen`, `userEvent`.
- Test user interactions, not implementation details.
- Assert on visible text, roles, and accessibility attributes.
- Wrap components that need providers (QueryClient, Router) in appropriate wrappers.

#### Validation Schemas (Zod)
- Test valid inputs pass.
- Test invalid inputs fail with correct error messages.
- Test edge cases and boundary values.

#### Zustand Stores
- Reset store state between tests using `store.setState()` or `store.getState()`.
- Test actions produce correct state changes.

### Step 4: Run Tests

```bash
pnpm test
```

- If tests **pass** — proceed to Step 5.
- If tests **fail**:
  - Read the error output carefully.
  - Fix the test or the source code as appropriate.
  - If the error is hard to diagnose or fix, use `model: "opus"` in an Agent tool call to get help.
  - Re-run `pnpm test` until all tests pass.

### Step 5: Verify Build Still Passes

After any source code changes made while fixing tests:
```bash
pnpm lint
pnpm build
```
- Fix any lint or build errors introduced.
- If errors are hard to fix, use `model: "opus"` in an Agent tool call to get help.

### Step 6: Report

After all tests pass, report to the user:
- How many test files were created or modified.
- How many tests pass / fail / skip.
- Any source code bugs found and fixed during testing.
- Any notable edge cases or gaps in test coverage.

### Rules
- Always use `pnpm` — never npm or yarn.
- Use Vitest — never Jest.
- Use `@testing-library/react` — never Enzyme.
- Test files live next to source files with `.test.ts` / `.test.tsx` extension.
- Never use `any` as a TypeScript type in test files.
- Mock at the API/Axios layer, not at the hook layer — test hooks with real TanStack Query behavior.
- Do not mock Zustand stores — test them directly.
- Keep tests focused: one behavior per test case.
- Use descriptive test names: `it("should show error toast when product creation fails")`.
- Follow all project conventions from CLAUDE.md.
