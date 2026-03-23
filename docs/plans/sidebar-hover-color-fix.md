---
feature: sidebar-hover-color-fix
issue: 2
status: to-do
created: 2026-03-23 00:00:00
description: Fix sidebar menu item hover color to be visually distinct and theme-consistent in both light and dark modes
---

## Implementation Plan

### Context

เมื่อ hover บน menu item ใน sidebar สีพื้นหลัง (hover state) แทบมองไม่เห็น เนื่องจาก:

1. **Light mode** — `--sidebar` = `oklch(0.985 0 0)` และ `--sidebar-accent` = `oklch(0.97 0 0)` ต่างกันเพียง **0.015** ในค่า lightness ซึ่งแทบจะแยกไม่ออกด้วยตาเปล่า
2. **Active vs Hover ใช้ class เดียวกัน** — ทั้ง active state และ hover state ใช้ `bg-sidebar-accent text-sidebar-accent-foreground` ทำให้ไม่มี visual hierarchy ระหว่าง "กำลัง hover" กับ "active page"

### Scope

**In scope:**
- แก้ CSS variables ใน `src/index.css` ให้ `--sidebar-accent` ต่างจาก `--sidebar` อย่างชัดเจนทั้ง light/dark mode
- แก้ active state ใน `app-sidebar.tsx` ให้ใช้ `bg-sidebar-primary text-sidebar-primary-foreground` เพื่อแสดง visual hierarchy ที่ชัดเจน
- รองรับ light mode และ dark mode
- ทดสอบครบทั้ง mobile, tablet, desktop

**Out of scope:**
- เปลี่ยน design system โดยรวม
- เพิ่ม animation effect ใหม่
- แก้ไข component อื่นนอกจาก sidebar

### Technical Design

#### Root Cause Analysis

**`src/index.css` — CSS variables ปัจจุบัน (Light mode):**
```
--sidebar:          oklch(0.985 0 0)   ← sidebar background
--sidebar-accent:   oklch(0.97 0 0)    ← hover/active bg (ต่างกันแค่ 0.015 !)
```

**`src/components/layout/app-sidebar.tsx` — classes ปัจจุบัน (line 101-103):**
```tsx
isActive
  ? "bg-sidebar-accent text-sidebar-accent-foreground"      // Active ← ใช้ accent
  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"  // Hover ← ใช้ accent เหมือนกัน
```
ปัญหา: active และ hover ใช้สีเดียวกัน ไม่มี visual hierarchy

#### Fix Strategy

แก้ 2 จุด:

**จุดที่ 1 — `src/index.css`:** ปรับ `--sidebar-accent` ให้มี contrast ที่มองเห็นได้ชัดกว่าเดิม

| Variable | Light (ก่อน) | Light (หลัง) | Dark (ก่อน) | Dark (หลัง) |
|---|---|---|---|---|
| `--sidebar-accent` | `oklch(0.97 0 0)` | `oklch(0.92 0 0)` | `oklch(0.269 0 0)` | `oklch(0.30 0 0)` |
| `--sidebar-accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` |

ค่าใหม่ของ light mode: `oklch(0.92 0 0)` ต่างจาก sidebar background `oklch(0.985 0 0)` ถึง **0.065** — มองเห็นได้ชัดเจน

**จุดที่ 2 — `src/components/layout/app-sidebar.tsx`:** แยก active state ให้ใช้ `sidebar-primary` เพื่อ visual hierarchy

```tsx
// Before:
isActive
  ? "bg-sidebar-accent text-sidebar-accent-foreground"
  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"

// After:
isActive
  ? "bg-sidebar-primary text-sidebar-primary-foreground"
  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
```

**Visual Hierarchy หลังแก้ไข:**
- Default: พื้นหลัง transparent, ตัวอักษร 70% opacity
- Hover: พื้นหลัง accent (สีเทาอ่อน light / เทาเข้มกว่า dark), ตัวอักษร 100% opacity
- Active: พื้นหลัง primary (เข้มสุด), ตัวอักษร primary-foreground (ตัดกัน)

#### No New Components Needed

ไม่ต้องสร้าง component, hook, หรือ API ใหม่ — นี่เป็นการแก้ไข CSS variables และ Tailwind classes เท่านั้น

### Implementation Steps

1. **แก้ `src/index.css`** — ปรับ CSS variables สำหรับ sidebar-accent:
   - Light mode (`:root`): เปลี่ยน `--sidebar-accent` จาก `oklch(0.97 0 0)` → `oklch(0.92 0 0)` และ `--sidebar-accent-foreground` จาก `oklch(0.205 0 0)` → `oklch(0.145 0 0)`
   - Dark mode (`.dark`): เปลี่ยน `--sidebar-accent` จาก `oklch(0.269 0 0)` → `oklch(0.30 0 0)` (ให้มองเห็นชัดขึ้น)

2. **แก้ `src/components/layout/app-sidebar.tsx`** — เปลี่ยน active state class:
   - Line 102: เปลี่ยนจาก `"bg-sidebar-accent text-sidebar-accent-foreground"` → `"bg-sidebar-primary text-sidebar-primary-foreground"`

### Files to Create/Modify

| File | Action | Description |
|---|---|---|
| `src/index.css` | Modify | ปรับ CSS variables `--sidebar-accent` และ `--sidebar-accent-foreground` ใน `:root` และ `.dark` |
| `src/components/layout/app-sidebar.tsx` | Modify | เปลี่ยน active state class จาก accent → primary |

### Verification

#### Manual Testing Checklist

- [ ] **Light mode — hover**: เมื่อ hover บน inactive menu item ต้องเห็นสีพื้นหลังเปลี่ยนเป็นสีเทาอ่อน (ชัดเจน ไม่เหมือนเดิมที่แทบมองไม่เห็น)
- [ ] **Light mode — active**: menu item ของหน้าที่กำลัง active ต้องเห็นสีพื้นหลังเข้ม (primary สีดำ) ตัดกับสี hover (สีเทาอ่อน)
- [ ] **Dark mode — hover**: เมื่อ hover บน inactive menu item ต้องเห็นสีพื้นหลังเปลี่ยน (ต่างจาก sidebar background อย่างชัดเจน)
- [ ] **Dark mode — active**: menu item active ต้องใช้ primary (สีฟ้า `oklch(0.488 0.243 264.376)`) แตกต่างจาก hover state
- [ ] **No hardcoded colors**: ไม่มี hex/rgb/oklch value โดยตรงใน className ของ component
- [ ] **Mobile** (< 768px): sidebar overlay ทำงานถูกต้อง, hover สีถูกต้อง
- [ ] **Tablet** (768px–1023px): icon-only mode, hover สีถูกต้อง
- [ ] **Desktop** (≥ 1024px): full sidebar และ collapsed mode, hover สีถูกต้อง
- [ ] **transition-colors**: การเปลี่ยนสียังคง smooth (class `transition-colors` ต้องยังอยู่)

#### Browser DevTools Verification

ตรวจสอบ computed CSS ของ `.dark` class บน `html` element:
- `--sidebar-accent` ต้องเป็น `oklch(0.30 0 0)` ใน dark mode
- `--sidebar-accent` ต้องเป็น `oklch(0.92 0 0)` ใน light mode
- Active link ต้องใช้ `bg-sidebar-primary` ไม่ใช่ `bg-sidebar-accent`
