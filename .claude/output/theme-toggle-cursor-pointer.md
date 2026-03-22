# Feature: Theme Toggle Button + Global Cursor Pointer

## Overview
Two changes:
1. Replace the theme dropdown with a simple toggle button (click to switch between light/dark)
2. Add `cursor-pointer` globally to all clickable/interactive elements

## Implementation Plan

### 1. Simplify ThemeSwitcher (`src/components/shared/theme-switcher.tsx`)
- Remove DropdownMenu entirely
- Replace with a single `<button>` that calls `toggleTheme()`
- Show Sun icon in light mode, Moon icon in dark mode
- Keep the same styling as current trigger button

### 2. Add Global `cursor-pointer` (`src/index.css`)
- Add a CSS rule in the `@layer base` block targeting all interactive elements:
  `button, [role="button"], a, select, input[type="checkbox"], input[type="radio"], label[for], summary { cursor: pointer; }`
- Change `cursor-default` to `cursor-pointer` in dropdown-menu items (`src/components/ui/dropdown-menu.tsx`)

### 3. Update Settings Page (`src/pages/settings.tsx`)
- Add `cursor-pointer` to theme selection cards

### 4. Update Tests
- Update theme-switcher tests to match new non-dropdown structure

## Files to Modify
| File | Change |
|------|--------|
| `src/components/shared/theme-switcher.tsx` | Replace dropdown with toggle button |
| `src/index.css` | Add global cursor-pointer rule |
| `src/components/ui/dropdown-menu.tsx` | Change `cursor-default` → `cursor-pointer` |
| `src/pages/settings.tsx` | Add cursor-pointer to theme cards |
| `src/components/shared/__tests__/theme-switcher.test.tsx` | Update tests |