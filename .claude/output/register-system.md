# Register System Implementation Plan

## Context

ระบบ POS มี login ทำงานได้แล้ว แต่ยังไม่มีหน้า register สำหรับสร้าง user ใหม่ Backend มี endpoint พร้อมแล้ว (`POST /api/v1/users/register` บน user-service port 30001) ต้องสร้าง register flow ฝั่ง frontend ให้ครบ

**Flow**: Register → redirect ไป `/login` พร้อม toast success (ไม่ auto-login เพราะ user-service ไม่ issue token)

---

## Implementation Steps

### 1. Add `RegisterRequest` type — `src/types/api.ts`

เพิ่ม interface ต่อจาก `RefreshRequest` (reuse `AuthUser` สำหรับ response เพราะ shape เหมือนกัน):

```ts
export interface RegisterRequest {
  username: string;
  password: string;
  first_name: string;
  last_name?: string;
}
```

### 2. Create API module — `src/api/users.ts` (NEW)

ใช้ `api` instance (user-service port 30001) **ไม่ใช่** `authAxios`:

```ts
import { api } from "./axios";
import type { BackendResponse, RegisterRequest, AuthUser } from "@/types/api";

export const usersApi = {
  register: (data: RegisterRequest) =>
    api.post<BackendResponse<AuthUser>>("/api/v1/users/register", data).then((r) => r.data.data),
};
```

### 3. Add validation schema — `src/lib/validations/auth.ts`

เพิ่ม `registerSchema` ต่อจาก `loginSchema` (Thai error messages เหมือน login):

- `username`: required, 3-255 chars
- `password`: required, min 8 chars
- `first_name`: required, 1-255 chars
- `last_name`: optional, max 255 chars (ใช้ `.optional().or(z.literal(""))` รองรับ empty string จาก input)

### 4. Add `useRegister` hook — `src/hooks/use-auth.ts`

เพิ่มใน file เดิมเพราะเป็น auth flow เดียวกัน:

- `mutationFn`: เรียก `usersApi.register(data)`
- `onSuccess`: toast success + navigate ไป `/login`
- `onError`: จัดการ 409 (username ซ้ำ), 400 (validation error)

### 5. Create register page — `src/pages/register.tsx` (NEW)

Mirror จาก `login.tsx`:
- Card + CardHeader + CardContent
- React Hook Form + zodResolver(registerSchema)
- 4 fields: username, password, first_name, last_name
- Submit button with Loader2 spinner
- Link ไป `/login` ด้านล่าง ("มีบัญชีแล้ว? เข้าสู่ระบบ")

### 6. Add route — `src/routes/index.tsx`

เพิ่ม `/register` ใน AuthLayout children (line 10):
```ts
{ path: "/register", lazy: () => import("@/pages/register") },
```

### 7. Add link to login page — `src/pages/login.tsx`

เพิ่มลิงก์ใต้ปุ่ม submit: "ยังไม่มีบัญชี? สมัครสมาชิก" → Link to `/register`

---

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `src/types/api.ts` | Modify | เพิ่ม `RegisterRequest` |
| `src/api/users.ts` | **Create** | Register API ใช้ `api` instance |
| `src/lib/validations/auth.ts` | Modify | เพิ่ม `registerSchema` + `RegisterFormValues` |
| `src/hooks/use-auth.ts` | Modify | เพิ่ม `useRegister()` hook |
| `src/pages/register.tsx` | **Create** | หน้า register |
| `src/routes/index.tsx` | Modify | เพิ่ม `/register` route |
| `src/pages/login.tsx` | Modify | เพิ่มลิงก์ไป register |

---

## Verification

1. `pnpm build` — ต้อง pass ไม่มี TypeScript error
2. `pnpm lint` — ต้อง pass
3. Manual test:
   - เปิด `/register` → เห็นฟอร์ม 4 fields
   - Submit ฟอร์มเปล่า → เห็น validation errors (Thai)
   - กรอกข้อมูลถูกต้อง → สมัครสำเร็จ redirect ไป `/login` พร้อม toast
   - กดลิงก์ "มีบัญชีแล้ว?" → ไป `/login`
   - ที่หน้า login กดลิงก์ "สมัครสมาชิก" → ไป `/register`
   - สมัครด้วย username ซ้ำ → เห็น toast error "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว"
