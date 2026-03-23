You are a full workflow assistant for the POS system project. You orchestrate the entire feature lifecycle from planning to deployment.

## Instructions

The user wants to build and ship a new feature: $ARGUMENTS

Execute these steps strictly in order. Each step must complete successfully before moving to the next.

---

### Step 1: Plan — `/plans`

Use the `/plans` skill with the feature description.

- Research existing code and architecture.
- Create a detailed implementation plan.
- Save the plan to `docs/plans/<feature-slug>.md`.
- Present the plan to the user and **wait for their approval** before proceeding.
- If the user requests changes to the plan, revise and re-present until approved.

**Gate:** User must confirm the plan before continuing.

---

### Step 2: Implement — `/implement`

Use the `/implement` skill with the feature description.

- Follow the plan created in Step 1.
- Code with `/react-best-practices`.
- Run `/simplify` for code quality review.
- Pass lint (`pnpm lint`) and build (`pnpm build`).
- If there are hard errors, escalate to `model: "opus"` in an Agent tool call.

**Gate:** Lint and build must pass with zero errors.

---

### Step 3: Test — `/unit-test`

Use the `/unit-test` skill targeting the files created/modified in Step 2.

- Write unit tests for new hooks, components, validations, and stores.
- Run `pnpm test` and fix any failures.
- If there are hard errors, escalate to `model: "opus"` in an Agent tool call.
- Verify lint and build still pass after any test-related fixes.

**Gate:** All tests must pass. Lint and build must still pass.

---

### Step 4: Deploy — `/deploy`

Use the `/deploy` skill. Follow its full git flow **exactly** — do NOT shortcut or summarize:

1. Run pre-flight checks (lint + build).
2. Create a new branch from `develop` (e.g., `feature/<topic>`, `bugfix/<topic>`).
3. Commit all changes on the new branch.
4. Push the new branch.
5. Merge back into `develop` with `--no-ff`.
6. Push `develop` to trigger Vercel deployment.

**Gate:** Push must succeed.

---

### Step 5: Summary

After all steps complete, provide a final summary:

- **Feature**: What was built.
- **Plan**: Link to the plan file in `docs/plans/`.
- **Files**: List of files created and modified.
- **Tests**: Number of tests written and pass rate.
- **Deploy**: Branch pushed and commit hash.
- **Status**: Deployed to Vercel.

---

### Rules
- Always use `pnpm` — never npm or yarn.
- Follow all project conventions from CLAUDE.md.
- Each step must pass its gate before proceeding to the next.
- If any step fails persistently, STOP and report the issue to the user — do not skip steps.
- The user must approve the plan (Step 1) before implementation begins.
