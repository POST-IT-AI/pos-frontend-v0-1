# Feature Plan: Forgot Password

## Context

POS System ต้องการ flow สำหรับผู้ใช้ที่ลืมรหัสผ่าน เนื่องจากระบบนี้เป็น POS ภายในร้าน
backend จึง return `reset_token` โดยตรงใน API response (ไม่ส่ง email)
token มีอายุ 15 นาที และใช้ได้ครั้งเดียว

## Scope

**In scope:**
- หน้า Forgot Password (`/forgot-password`) — กรอก username → รับ reset_token
- หน้า Reset Password (`/reset-password`) — กรอก token + รหัสผ่านใหม่
- เพิ่ม link "ลืมรหัสผ่าน?" ในหน้า Login
- เพิ่ม i18n keys ทั้ง `th` และ `en`

**Out of scope:**
- Email delivery
- Token expiry countdown UI
- Rate limiting / CAPTCHA

---

## Technical Design

### 1. New Types (`src/types/api.ts`)

```ts
export interface ForgotPasswordRequest {
  username: string;
}

export interface ForgotPasswordResponse {
  message: string;
  reset_token?: string;       // optional — absent when username not found
  expires_at?: string;        // ISO date string
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}
```

### 2. API Module (`src/api/auth.ts`)

เพิ่ม 2 methods ใน `authApi`:

```ts
forgotPassword: (data: ForgotPasswordRequest) =>
  authAxios
    .post<BackendResponse<ForgotPasswordResponse>>("/api/v1/auth/forgot-password", data)
    .then((r) => r.data.data),

resetPassword: (data: ResetPasswordRequest) =>
  authAxios
    .post<BackendResponse<null>>("/api/v1/auth/reset-password", data)
    .then((r) => r.data),
```

### 3. Zod Schemas (`src/lib/validations/auth.ts`)

Hook-based pattern ตาม existing code:

```ts
// useForgotPasswordSchema — validate: username required, min 1 char
// useResetPasswordSchema  — validate: token required, new_password min 6, confirmPassword must match
```

### 4. TanStack Query Hooks (`src/hooks/use-auth.ts`)

เพิ่ม 2 mutations:

- `useForgotPassword()`:
  - `mutationFn`: เรียก `authApi.forgotPassword`
  - `onSuccess`: ถ้ามี `reset_token` → `navigate("/reset-password", { state: { token } })`; ถ้าไม่มี → toast neutral message
  - `onError`: toast error

- `useResetPassword()`:
  - `mutationFn`: เรียก `authApi.resetPassword`
  - `onSuccess`: toast success → `navigate("/login")` หลัง 2s
  - `onError`: map error message จาก API response

### 5. New Pages

#### `/forgot-password` (`src/pages/forgot-password.tsx`)
- Form: `username` field
- React Hook Form + `useForgotPasswordSchema`
- Submit → `useForgotPassword` mutation
- Link กลับ `/login`
- Export `function Component()`

#### `/reset-password` (`src/pages/reset-password.tsx`)
- รับ token จาก `location.state.token` (navigate state) หรือ query param `?token=`
- Form: `token` (pre-filled, editable), `new_password`, `confirmPassword`
- React Hook Form + `useResetPasswordSchema`
- Submit → `useResetPassword` mutation
- Export `function Component()`

### 6. Routes (`src/routes/index.tsx`)

เพิ่ม 2 routes ใต้ `AuthLayout`:

```ts
{ path: "/forgot-password", lazy: () => import("@/pages/forgot-password") },
{ path: "/reset-password",  lazy: () => import("@/pages/reset-password") },
```

### 7. Login Page (`src/pages/login.tsx`)

เพิ่ม link "ลืมรหัสผ่าน?" ใต้ form:

```tsx
<Link to="/forgot-password" className="text-primary hover:underline text-sm">
  {t("login.forgotPassword")}
</Link>
```

### 8. i18n Keys

เพิ่มใน `th/auth.json` และ `en/auth.json`:
- `login.forgotPassword`
- `forgotPassword.*` (title, description, username, submit, backToLogin)
- `resetPassword.*` (title, description, token, tokenPlaceholder, newPassword, confirmPassword, submit, backToLogin)
- `toast.forgotPasswordSent`, `toast.forgotPasswordNotFound`, `toast.resetPasswordSuccess`, `toast.resetPasswordError`, `toast.tokenInvalid`, `toast.tokenExpired`, `toast.tokenUsed`
- `validation.tokenRequired`, `validation.passwordMin6`, `validation.passwordMismatch`

---

## Implementation Steps (Ordered)

1. **Types** — add `ForgotPasswordRequest`, `ForgotPasswordResponse`, `ResetPasswordRequest` to `src/types/api.ts`
2. **API** — add `forgotPassword` + `resetPassword` to `src/api/auth.ts`
3. **i18n** — add all new keys to `th/auth.json` and `en/auth.json`
4. **Validations** — add `useForgotPasswordSchema` + `useResetPasswordSchema` to `src/lib/validations/auth.ts`
5. **Hooks** — add `useForgotPassword` + `useResetPassword` to `src/hooks/use-auth.ts`
6. **Page: Forgot Password** — create `src/pages/forgot-password.tsx`
7. **Page: Reset Password** — create `src/pages/reset-password.tsx`
8. **Routes** — add 2 routes in `src/routes/index.tsx`
9. **Login link** — add "ลืมรหัสผ่าน?" link in `src/pages/login.tsx`

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/forgot-password.tsx` | Forgot Password page |
| `src/pages/reset-password.tsx` | Reset Password page |

## Files to Modify

| File | Change |
|------|--------|
| `src/types/api.ts` | Add 3 new interfaces |
| `src/api/auth.ts` | Add 2 API methods |
| `src/lib/validations/auth.ts` | Add 2 Zod schema hooks |
| `src/hooks/use-auth.ts` | Add 2 TanStack Query mutations |
| `src/routes/index.tsx` | Add 2 routes under AuthLayout |
| `src/pages/login.tsx` | Add "ลืมรหัสผ่าน?" link |
| `src/i18n/locales/th/auth.json` | Add new keys |
| `src/i18n/locales/en/auth.json` | Add new keys |

---

## Verification

1. Navigate to `/login` → เห็น link "ลืมรหัสผ่าน?"
2. คลิก → ไปหน้า `/forgot-password`
3. กรอก username ที่มีในระบบ → submit → ได้ reset_token → redirect ไป `/reset-password` พร้อม token pre-fill
4. กรอก new_password + confirm → submit → toast success → redirect กลับ `/login` หลัง 2s
5. กรอก username ที่ไม่มี → toast neutral message ไม่ leak ว่า user ไม่มี
6. ใช้ token เดิมซ้ำ → toast "Token นี้ถูกใช้แล้ว กรุณาขอใหม่"
7. Validation errors แสดงถูกต้อง (username ว่าง, password < 6, password ไม่ตรงกัน)