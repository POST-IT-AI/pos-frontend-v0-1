# Feature Plan: Internationalization (i18n) — Thai & English

## Overview
Add multi-language support (Thai 🇹🇭 and English 🇬🇧) to the POS system using `react-i18next`. Users can switch languages from the header, and the preference persists across sessions via localStorage.

## Library Choice
**react-i18next** + **i18next** — industry standard, lightweight, React 19 compatible, supports lazy loading and namespace separation.

## Architecture

### New Files
```
src/
├── i18n/
│   ├── index.ts              # i18next configuration & initialization
│   ├── locales/
│   │   ├── th/
│   │   │   ├── common.json   # Shared: nav, buttons, actions, general
│   │   │   ├── auth.json     # Login, register, validation
│   │   │   ├── dashboard.json # Dashboard stats, labels
│   │   │   ├── products.json # Products pages
│   │   │   ├── orders.json   # Orders page
│   │   │   ├── pos.json      # POS sales page
│   │   │   ├── users.json    # Users management
│   │   │   └── settings.json # Settings page
│   │   └── en/
│   │       ├── common.json
│   │       ├── auth.json
│   │       ├── dashboard.json
│   │       ├── products.json
│   │       ├── orders.json
│   │       ├── pos.json
│   │       ├── users.json
│   │       └── settings.json
├── components/
│   └── shared/
│       └── language-switcher.tsx  # Language toggle component
```

### Modified Files
1. **src/App.tsx** — Import i18n initialization
2. **src/store/ui.ts** — Add `language` state (persisted to localStorage)
3. **src/components/layout/app-header.tsx** — Add LanguageSwitcher
4. **src/components/layout/app-sidebar.tsx** — Replace hardcoded Thai text with `t()` calls
5. **src/components/shared/page-header.tsx** — Use `t()` if text is passed as keys
6. **src/pages/login.tsx** — Replace Thai strings with `t()` calls
7. **src/pages/register.tsx** — Replace Thai strings with `t()` calls
8. **src/pages/dashboard.tsx** — Replace Thai strings with `t()` calls
9. **src/pages/pos.tsx** — Replace Thai strings with `t()` calls
10. **src/pages/products/index.tsx** — Replace Thai strings with `t()` calls
11. **src/pages/products/new.tsx** — Replace Thai strings with `t()` calls
12. **src/pages/orders/index.tsx** — Replace Thai strings with `t()` calls
13. **src/pages/users/index.tsx** — Replace Thai strings with `t()` calls
14. **src/pages/settings.tsx** — Replace Thai strings with `t()` calls
15. **src/pages/not-found.tsx** — Replace Thai strings with `t()` calls
16. **src/lib/validations/auth.ts** — Use i18n for Zod validation messages
17. **src/lib/validations/product.ts** — Use i18n for Zod validation messages
18. **src/lib/validations/order.ts** — Use i18n for Zod validation messages
19. **src/hooks/use-auth.ts** — Use `t()` for toast messages

## Implementation Steps

### Step 1: Install Dependencies
```bash
pnpm add react-i18next i18next
```

### Step 2: Create i18n Configuration (`src/i18n/index.ts`)
- Initialize i18next with `react-i18next`
- Default language from localStorage `pos-ui` store or fallback to `th`
- Namespaces: `common`, `auth`, `dashboard`, `products`, `orders`, `pos`, `users`, `settings`
- Import all locale JSON files statically (small app, no need for lazy loading)

### Step 3: Create Translation Files
- Extract ALL Thai strings from components into `th/*.json` files
- Create English translations in `en/*.json` files
- Namespace separation by feature area

### Step 4: Update Zustand UI Store
- Add `language: "th" | "en"` to UI store
- Add `setLanguage()` action that also calls `i18next.changeLanguage()`
- Already persisted via localStorage

### Step 5: Create LanguageSwitcher Component
- Simple dropdown/toggle in the header
- Shows current language flag/code
- Switches between TH and EN
- Uses `useUIStore` to persist selection

### Step 6: Update App.tsx
- Import `src/i18n/index.ts` (side-effect import)
- Wrap with `I18nextProvider` if needed (or rely on init)

### Step 7: Replace Hardcoded Strings in Components
- Use `useTranslation()` hook in each component
- Replace all Thai strings with `t('namespace:key')` or `t('key')` calls
- Keep the same Thai text as default/fallback

### Step 8: Handle Zod Validation Messages
- Zod schemas return static strings — use a function that creates schemas with current language
- Or use `t()` at form submission time for error messages

## Translation Key Structure

### common.json (shared across app)
```json
{
  "nav": {
    "dashboard": "แดชบอร์ด / Dashboard",
    "pos": "ขายสินค้า / Sell",
    "products": "สินค้า / Products",
    "orders": "ออเดอร์ / Orders",
    "users": "ผู้ใช้ / Users",
    "settings": "ตั้งค่า / Settings"
  },
  "actions": {
    "save": "บันทึก / Save",
    "cancel": "ยกเลก / Cancel",
    "delete": "ลบ / Delete",
    "edit": "แก้ไข / Edit",
    "add": "เพิ่ม / Add",
    "search": "ค้นหา / Search",
    "back": "กลับ / Back"
  },
  "header": {
    "profile": "โปรไฟล์ / Profile",
    "logout": "ออกจากระบบ / Logout"
  }
}
```

## Language Switcher Location
In the **app-header.tsx**, next to the user dropdown menu — a small button/dropdown showing "TH | EN" or flag icons.

## Considerations
- **Default language**: Thai (matches current state)
- **Fallback**: Thai (if a key is missing in English, show Thai)
- **Persistence**: Via existing Zustand `ui` store (localStorage)
- **Zod validation**: Create schema factory functions that accept `t` function
- **Toast messages**: Use `t()` at the hook level
- **No SSR concerns**: This is a Vite SPA

## Estimated File Changes
- ~3 new config files
- ~16 new translation JSON files (8 per language)
- 1 new component (LanguageSwitcher)
- ~18 modified files (pages, layout, validations, hooks)