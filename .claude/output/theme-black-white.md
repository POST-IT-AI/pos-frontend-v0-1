# Feature: Black & White Theme (Light/Dark Mode Toggle)

## Overview
Add a theme switcher that allows users to toggle between **light (white)** and **dark (black)** themes. The project already has light/dark CSS variables defined in `src/index.css` using OKLCH color space — this feature wires them up with a toggle UI and persistent state.

## Implementation Plan

### 1. Extend UI Store (`src/store/ui.ts`)
- Add `theme: "light" | "dark"` state (default: `"light"`)
- Add `setTheme(theme)` action
- Add `toggleTheme()` convenience action
- Persist theme choice in localStorage (already using `persist` middleware)
- On init, apply/remove `.dark` class on `document.documentElement`

### 2. Create Theme Initializer (`src/components/shared/theme-initializer.tsx`)
- Small component rendered in `App.tsx` that syncs the Zustand theme state to the `<html>` element's class list on mount and state change
- Ensures `.dark` class is applied before first paint (reads from localStorage)

### 3. Create Theme Switcher Component (`src/components/shared/theme-switcher.tsx`)
- Dropdown button similar to `LanguageSwitcher`
- Shows Sun icon (light) / Moon icon (dark) with current theme indicated
- Two options: Light / Dark with check mark on active
- Uses `useUIStore().setTheme()` to switch

### 4. Add Theme Switcher to Header (`src/components/layout/app-header.tsx`)
- Place `<ThemeSwitcher />` next to `<LanguageSwitcher />` in the header's right section

### 5. Update Settings Page (`src/pages/settings.tsx`)
- Add a "Theme" section with light/dark toggle card
- Visual preview of selected theme

### 6. Add i18n Translations
- **English** (`src/i18n/locales/en/common.json`): Add `theme`, `light`, `dark` keys
- **Thai** (`src/i18n/locales/th/common.json`): Add Thai translations
- **Settings namespace** (`en/settings.json`, `th/settings.json`): Add theme section labels

### 7. Prevent Flash of Wrong Theme
- Add inline script in `index.html` that reads localStorage and applies `.dark` class before React hydrates

## Files to Create
| File | Purpose |
|------|---------|
| `src/components/shared/theme-switcher.tsx` | Theme toggle dropdown component |
| `src/components/shared/theme-initializer.tsx` | Syncs theme state to DOM |

## Files to Modify
| File | Change |
|------|--------|
| `src/store/ui.ts` | Add `theme` state + actions |
| `src/components/layout/app-header.tsx` | Add ThemeSwitcher to header |
| `src/pages/settings.tsx` | Add theme settings section |
| `src/i18n/locales/en/common.json` | Add theme translation keys |
| `src/i18n/locales/th/common.json` | Add Thai theme translations |
| `src/i18n/locales/en/settings.json` | Add theme settings labels |
| `src/i18n/locales/th/settings.json` | Add Thai theme settings labels |
| `src/App.tsx` | Render ThemeInitializer |
| `index.html` | Add inline script for flash prevention |

## Dependencies
- No new packages needed — uses existing Lucide icons (Sun, Moon), shadcn/ui DropdownMenu, Zustand store

## Notes
- The `.dark` CSS variables are already fully defined in `src/index.css` — no CSS changes needed
- All shadcn/ui components automatically adapt via CSS variables
- Sidebar uses `bg-sidebar` etc. which are also defined for `.dark` — will work automatically