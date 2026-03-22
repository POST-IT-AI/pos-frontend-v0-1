You are a feature planning assistant for the POS system project.

## Instructions

The user wants to plan a new feature: $ARGUMENTS

Follow these steps:

### 1. Research
- Read relevant existing code to understand current patterns and architecture.
- Identify files that will need to be created or modified.
- Check for existing utilities, components, or hooks that can be reused.

### 2. Plan
Create a detailed implementation plan that includes:
- **Context**: Why this feature is needed and what problem it solves.
- **Scope**: What is included and what is explicitly out of scope.
- **Technical Design**:
  - Data types/interfaces needed
  - API endpoints to integrate with (or create)
  - Zustand store changes (if any)
  - TanStack Query hooks needed
  - Zod validation schemas
  - New pages and routes
  - New components
- **Implementation Steps**: Ordered list of discrete steps to implement.
- **Files to Create/Modify**: Explicit list of file paths.
- **Verification**: How to test that the feature works end-to-end.

### 3. Save
After completing the plan, save it as a markdown file at:

`.claude/output/<feature-slug>.md`

Where `<feature-slug>` is a kebab-case version of the feature name (e.g., `product-search`, `receipt-printing`, `daily-report`).

The saved file must include a frontmatter block at the top:

```markdown
---
feature: <feature-slug>
status: to-do          # to-do | in-progress | in-review | done
created: YYYY-MM-DD HH:MM:SS
description: <brief description of the feature in Thai or English>
---
```

Update the `status` field whenever the feature status changes.

### Rules
- Follow all project conventions from CLAUDE.md.
- Prefer reusing existing patterns (check `src/hooks/`, `src/api/`, `src/lib/validations/` for examples).
- New pages must export `function Component()` for lazy loading compatibility.
- Use the query key factory pattern for new TanStack Query hooks.
- All forms must use React Hook Form + Zod.
- Thai language for user-facing text (toast messages, labels, etc.).