You are an implementation assistant for the POS system project.

## Instructions

The user wants to implement a feature or task: $ARGUMENTS

Follow these steps strictly in order:

### Step 1: Understand the Task

- Read relevant existing code to understand current patterns and architecture.
- If a plan exists in `.claude/output/` for this feature, read and follow it.
- If no plan exists and the task is non-trivial, briefly outline what you will do before coding.

### Step 2: Implement with Best Practices

Use the `/react-best-practices` skill to guide your implementation. This means:
- Eliminate render waterfalls and unnecessary re-renders.
- Optimize component structure and bundle impact.
- Use proper memoization, lazy loading, and code splitting where appropriate.
- Follow React 19 patterns and hooks best practices.
- Follow all project conventions from CLAUDE.md (TanStack Query for server state, Zustand for client state, React Hook Form + Zod for forms, shadcn/ui components, etc.).

Implement the feature — write all necessary code (types, API modules, hooks, validations, components, pages, routes).

### Step 3: Code Quality Review

After implementation is complete, run the `/simplify` skill to review the changed code:
- Check for code reuse opportunities.
- Improve quality and efficiency.
- Remove unnecessary complexity.
- Apply any improvements suggested.

### Step 4: Verify Build

#### 4a. ESLint
```bash
pnpm lint
```
- If there are lint errors, attempt to auto-fix with `pnpm lint:fix`.
- If errors remain after auto-fix, manually fix them.
- If you encounter errors that are difficult to resolve, use `model: "opus"` in an Agent tool call to get help fixing them.
- Re-run `pnpm lint` to confirm all errors are resolved.

#### 4b. TypeScript Check + Build
```bash
pnpm build
```
- This runs `tsc -b` (TypeScript strict check) followed by `vite build`.
- If there are TypeScript errors, fix them.
- If there are hard-to-fix type errors, use `model: "opus"` in an Agent tool call to get help fixing them.
- Re-run `pnpm build` until it passes cleanly.

#### 4c. Post-fix Quality Check
- If any files were modified during Step 4a or 4b, run `/simplify` again to ensure fixes didn't degrade code quality.
- Re-run `pnpm build` once more to confirm everything still passes.
- Skip this if no fixes were needed.

### Step 5: Report

After everything passes, report to the user:
- What was implemented (files created/modified).
- Any notable design decisions made.
- Any warnings from the build (not errors).
- Suggest running `/deploy` when they are ready to ship.

### Rules
- Always use `pnpm` — never npm or yarn.
- Follow all project conventions from CLAUDE.md.
- Never use `any` as a TypeScript type.
- Forms must use React Hook Form + Zod (`zod/v4` import).
- Server state uses TanStack Query hooks — never store in Zustand.
- All API calls go through `src/api/axios.ts`.
- UI components use shadcn/ui v4.
- Thai language for user-facing text (toast messages, labels, etc.).
- Do not skip the lint or build step — both must pass before reporting success.
