---
feature: logout-token-revocation
issue: 3
status: to-do
created: 2026-03-24 00:00:00
description: เพิ่ม logout endpoint integration พร้อม token revocation ผ่าน Redis ฝั่ง backend และอัปเดต useLogout() ให้ call API ก่อน clear local state
---

# Feature Plan: Logout Endpoint with Token Revocation

## Context

ปัจจุบัน `useLogout()` ใน `src/hooks/use-auth.ts` ทำเพียงแค่ clear local state (Zustand store + localStorage)
โดยไม่ได้ call API ใดๆ ทำให้ access token ยังคงใช้งานได้จนกว่าจะหมดอายุ

Backend จะเพิ่ม `POST /api/v1/auth/logout` ที่รับ Bearer token แล้วนำ `jti` ไปเก็บลงใน Redis blacklist
ด้วย TTL เท่ากับ remaining lifetime ของ token — ทุก protected endpoint จะตรวจสอบ blacklist ก่อน process request

ฝั่ง frontend ต้องอัปเดตให้:
1. ส่ง token ไป revoke ที่ backend ก่อน
2. จากนั้น clear local state เสมอ (แม้ API จะ fail — ป้องกัน user ค้างอยู่ใน logout loop)

---

## Scope

**In scope:**
- เพิ่ม `authApi.logout()` ใน `src/api/auth.ts`
- อัปเดต `useLogout()` ให้ call API + ใช้ `useMutation` รองรับ loading state
- อัปเดต `AppHeader` ให้ใช้ mutation pattern ที่ถูกต้อง
- เพิ่ม i18n key `toast.logoutError` (EN + TH) สำหรับกรณี API fail แต่ยังต้องออก
- เพิ่ม unit tests ครอบคลุม logout flow ทั้ง success และ API error scenarios

**Out of scope:**
- Backend implementation (Redis, blacklist middleware) — เป็น responsibility ของ auth-service
- Refresh token revocation — issue นี้ focus เฉพาะ access token
- Session management UI

---

## Technical Design

### 1. API Response Type

Logout endpoint returns:
```json
{ "message": "Logged out successfully" }
```

ไม่ต้องเพิ่ม type ใหม่ใน `src/types/api.ts` — ใช้ `BackendResponse<null>` เหมือน `resetPassword`

### 2. API Module — `src/api/auth.ts`

เพิ่ม method `logout` ใน `authApi`:

```ts
logout: () =>
  authAxios
    .post<BackendResponse<null>>("/api/v1/auth/logout")
    .then((r) => r.data),
```

ใช้ `authAxios` (ไม่ใช่ `api`) เพราะ:
- เป็น auth-service endpoint (consistent กับ login, me, refresh)
- `authAxios` ไม่มี 401 → refresh loop ป้องกันไม่ให้เกิด infinite loop กรณี token หมดอายุแล้ว
- Bearer token ถูก attach อัตโนมัติจาก request interceptor เหมือนกับ `me()`

### 3. TanStack Query Hook — `src/hooks/use-auth.ts`

เปลี่ยน `useLogout()` จาก plain function เป็น `useMutation`:

```ts
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // Always clear local state — even if API call fails
      logout();
      navigate("/login");
    },
    onSuccess: () => {
      toast.success(t("toast.logoutSuccess"));
    },
    onError: () => {
      // Token may already be expired — still log out locally
      toast.info(t("toast.logoutSuccess")); // same message — user doesn't need to know about the error
    },
  });
}
```

**Design rationale:**
- `onSettled` (runs on both success and error) guarantees local state is always cleared
- `onSuccess` shows success toast
- `onError` ยังออกจากระบบได้ปกติ — ไม่แสดง error ที่ทำให้ user งง (token expired ก็ควรออกได้)
- `isPending` state พร้อมใช้สำหรับ disable ปุ่ม logout ระหว่าง API call

### 4. AppHeader Update — `src/components/layout/app-header.tsx`

ปัจจุบัน `useLogout()` return เป็น plain function → เรียกตรงๆ

หลังแก้เป็น mutation ต้องเปลี่ยนเป็น:

```tsx
const logoutMutation = useLogout();

// onClick:
logoutMutation.mutate();

// Optional: disable during pending
disabled={logoutMutation.isPending}
```

### 5. i18n Keys

เพิ่ม key `toast.logoutError` สำหรับกรณีที่ต้องการแสดง error toast แยก (future use):

**`src/i18n/locales/th/auth.json`:**
```json
"logoutError": "เกิดข้อผิดพลาดขณะออกจากระบบ"
```

**`src/i18n/locales/en/auth.json`:**
```json
"logoutError": "An error occurred while logging out"
```

> หมายเหตุ: `toast.logoutSuccess` มีอยู่แล้วในทั้ง 2 locale files ไม่ต้องเพิ่ม

### 6. Unit Tests — `src/hooks/use-auth.test.ts`

เพิ่ม test suite `useLogout` ครอบคลุม:

1. **Success path:**
   - API call สำเร็จ → `authApi.logout` ถูกเรียก 1 ครั้ง
   - `useAuthStore.getState().logout()` ถูกเรียก
   - navigate ไป `/login`
   - toast.success ถูกเรียกด้วย `logoutSuccess` key

2. **API error path:**
   - API call fail (500 / network error)
   - `useAuthStore.getState().logout()` ยังถูกเรียก (onSettled guarantee)
   - navigate ไป `/login`
   - ไม่ block user

---

## Implementation Steps

1. **API method** — เพิ่ม `logout()` ใน `src/api/auth.ts`
2. **i18n keys** — เพิ่ม `toast.logoutError` ใน `th/auth.json` และ `en/auth.json`
3. **Hook** — อัปเดต `useLogout()` ใน `src/hooks/use-auth.ts` เป็น `useMutation` pattern
4. **AppHeader** — อัปเดต `src/components/layout/app-header.tsx` ให้ใช้ `logoutMutation.mutate()`
5. **Tests** — เพิ่ม `useLogout` test suite ใน `src/hooks/use-auth.test.ts`

---

## Files to Modify

| File | การเปลี่ยนแปลง |
|------|----------------|
| `src/api/auth.ts` | เพิ่ม `logout()` method ใน `authApi` |
| `src/hooks/use-auth.ts` | เปลี่ยน `useLogout()` เป็น `useMutation` pattern |
| `src/components/layout/app-header.tsx` | เปลี่ยนการเรียก logout จาก plain function เป็น mutation |
| `src/i18n/locales/th/auth.json` | เพิ่ม `toast.logoutError` |
| `src/i18n/locales/en/auth.json` | เพิ่ม `toast.logoutError` |
| `src/hooks/use-auth.test.ts` | เพิ่ม test suite สำหรับ `useLogout` |

## Files to Create

ไม่มี — ไม่ต้องสร้างไฟล์ใหม่

---

## Verification

### Manual Testing
1. Login ปกติ → ได้ access token
2. กด Logout → ปุ่ม disable ชั่วขณะ (pending state)
3. หลัง logout สำเร็จ:
   - redirect ไป `/login`
   - toast "ออกจากระบบแล้ว" แสดง
   - localStorage `pos-auth` ถูก clear
4. นำ access token เดิม (ก่อน logout) ไปเรียก protected endpoint → ได้ `401 Unauthorized` (token ถูก revoke ใน Redis)
5. ทดสอบ network error ระหว่าง logout → ยังคง redirect ไป `/login` (ไม่ stuck)

### Unit Tests
```
pnpm test src/hooks/use-auth.test.ts
```

- `useLogout › calls logout API and clears local state on success` ✓
- `useLogout › clears local state even when API call fails` ✓
- `useLogout › navigates to /login after logout` ✓

### Integration Check
- `pnpm build` — TypeScript strict mode ไม่มี error
- `pnpm lint` — ESLint ไม่มี warning
