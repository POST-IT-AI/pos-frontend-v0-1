---
feature: password-visibility-toggle
status: to-do
created: 2026-03-22 00:00:00
description: เพิ่ม icon ลูกตา toggle แสดง/ซ่อน password ในทุก page ที่มี password field (login, register, reset-password)
---

# Feature Plan: Password Visibility Toggle

## Context

ผู้ใช้ไม่สามารถดูรหัสผ่านที่กรอกได้ ทำให้ยากเมื่อต้องการตรวจสอบความถูกต้อง feature นี้เพิ่ม icon ลูกตาให้กด toggle แสดง/ซ่อน password ในทุก field ที่เกี่ยวข้อง

## Scope

**In scope:**
- สร้าง `PasswordInput` component ที่ reusable
- ใช้ใน login (1 field), register (1 field), reset-password (2 fields)

**Out of scope:**
- เปลี่ยน Input component หลัก
- เพิ่ม i18n keys (icon-only ไม่ต้องการ text label)

---

## Technical Design

### New Component: `src/components/ui/password-input.tsx`
- รับ props เดียวกับ `React.ComponentProps<"input">` (ยกเว้น `type` ซึ่งจัดการภายใน)
- ใช้ `useState<boolean>` toggle `showPassword`
- Layout: `div relative` → `Input` padding-right + `button type="button"` absolute right
- Icon: `Eye` / `EyeOff` จาก `lucide-react`
- ปุ่มใช้ `aria-label` เพื่อ accessibility

ไม่มีการเปลี่ยนแปลง API / hooks / Zod / routes

---

## Implementation Steps

1. สร้าง `src/components/ui/password-input.tsx`
2. แก้ `src/pages/login/index.tsx` — เปลี่ยน `Input type="password"` → `PasswordInput`
3. แก้ `src/pages/register/index.tsx` — เปลี่ยน `Input type="password"` → `PasswordInput`
4. แก้ `src/pages/reset-password/index.tsx` — เปลี่ยน 2 fields → `PasswordInput`

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/ui/password-input.tsx` | Reusable password input with visibility toggle |

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/login/index.tsx` | Replace `Input type="password"` with `PasswordInput` |
| `src/pages/register/index.tsx` | Replace `Input type="password"` with `PasswordInput` |
| `src/pages/reset-password/index.tsx` | Replace 2 `Input type="password"` with `PasswordInput` |

---

## Verification

1. หน้า login — กด icon ลูกตา → password แสดง/ซ่อน
2. หน้า register — กด icon → password แสดง/ซ่อน
3. หน้า reset-password — กด icon แต่ละ field ทำงานอิสระจากกัน
4. Form validation ยังทำงานปกติ (React Hook Form ไม่กระทบ)
5. `pnpm build` ผ่านไม่มี error