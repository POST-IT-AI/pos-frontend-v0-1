# Login System — Implementation Plan

## Summary
เปลี่ยนระบบ auth จาก mock เป็น real backend (auth-service :30002, user-service :30001)
- เปลี่ยน email → username
- เพิ่ม access_token + refresh_token (แทน single token)
- เพิ่ม auto token refresh ด้วย axios interceptor
- รองรับ backend response format: `{ status, message, data }`

---

## Changes Overview

### 1. Environment Config — `src/lib/env.ts`
- เพิ่ม `AUTH_SERVICE_URL` (VITE_AUTH_SERVICE_URL, default `http://localhost:30002`)
- เพิ่ม `USER_SERVICE_URL` (VITE_USER_SERVICE_URL, default `http://localhost:30001`)

### 2. Axios Instances — `src/api/axios.ts`
- เปลี่ยน `api` instance ให้ใช้ `USER_SERVICE_URL` เป็น baseURL (สำหรับ product, order, user APIs)
- เพิ่ม `authApi` instance ใช้ `AUTH_SERVICE_URL` เป็น baseURL
- ทั้ง 2 instance แนบ Bearer token จาก auth store (ใช้ `accessToken`)
- **Response interceptor (api instance)**: เมื่อเจอ 401 → ลอง refresh token ก่อน → ถ้า refresh สำเร็จ retry request เดิม → ถ้า refresh ล้มเหลว logout + redirect
- **authApi instance**: ไม่ทำ auto-refresh (เพื่อป้องกัน infinite loop จาก /auth/refresh 401)

### 3. Types — `src/types/api.ts`
- เพิ่ม `BackendResponse<T>` type: `{ status: "success" | "error", message: string, data: T }`
- เปลี่ยน `LoginRequest`: `email` → `username`
- เปลี่ยน `LoginResponse` ให้ตรงกับ backend: `{ access_token, refresh_token, expires_in }`
- เพิ่ม `RefreshRequest`: `{ refresh_token: string }`
- เพิ่ม `AuthUser` type: `{ id: number, username: string, first_name: string, last_name: string, role: string, is_active: boolean }`

### 4. Auth Store — `src/store/auth.ts`
- เปลี่ยน `AuthUser` interface ให้ตรงกับ backend (id: number, username, first_name, last_name, role, is_active)
- เปลี่ยน `token: string` → `accessToken: string | null` + `refreshToken: string | null`
- เปลี่ยน `setAuth` ให้รับ user + accessToken + refreshToken
- อัปเดต `isAuthenticated()` ให้ check `accessToken`
- อัปเดต `hasRole()` ให้ map backend role (lowercase "admin") → uppercase "ADMIN"
- อัปเดต `partialize` ให้ persist ทั้ง accessToken และ refreshToken

### 5. Auth API Module — `src/api/auth.ts`
- ใช้ `authApi` instance (ไม่ใช่ `api`)
- `login(data)` → POST `/api/v1/auth/login` → unwrap `BackendResponse`
- `me()` → GET `/api/v1/auth/me` → unwrap `BackendResponse`
- `refresh(data)` → POST `/api/v1/auth/refresh` → unwrap `BackendResponse`
- ลบ `logout` endpoint (backend ไม่มี logout API)

### 6. Validation Schema — `src/lib/validations/auth.ts`
- เปลี่ยน `email` → `username` (string, min 3, max 255)
- เปลี่ยน password min → 8 ตัวอักษร
- อัปเดต error messages เป็นภาษาไทย

### 7. Auth Hook — `src/hooks/use-auth.ts`
- ลบ `mockLogin()` ทั้งหมด
- `useLogin()`: เรียก `authApi.login()` จริง → setAuth(user from /me, accessToken, refreshToken) → navigate /dashboard
  - Flow: login → ได้ tokens → เรียก /me เพื่อได้ user data → setAuth
- `useLogout()`: clear store → navigate /login (ไม่ต้อง call backend)

### 8. Login Page — `src/pages/login.tsx`
- เปลี่ยน email field → username field
- เปลี่ยน placeholder, label
- อัปเดต error message "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"

### 9. Protected Route — `src/routes/protected-route.tsx`
- เปลี่ยน check `token` → `accessToken`

### 10. App Header — `src/components/layout/app-header.tsx`
- อัปเดตแสดงชื่อจาก `user.name` → `user.first_name + user.last_name`
- อัปเดตแสดง username แทน email

### 11. App Sidebar — `src/components/layout/app-sidebar.tsx`
- อัปเดต role check ให้ map lowercase role จาก backend

---

## File Change Summary

| File | Action |
|------|--------|
| `src/lib/env.ts` | Modify — เพิ่ม AUTH/USER service URLs |
| `src/api/axios.ts` | Modify — เพิ่ม authApi instance, token refresh interceptor |
| `src/types/api.ts` | Modify — เปลี่ยน types ตาม backend |
| `src/store/auth.ts` | Modify — dual tokens, new user shape |
| `src/api/auth.ts` | Modify — real API calls |
| `src/lib/validations/auth.ts` | Modify — username + min 8 |
| `src/hooks/use-auth.ts` | Modify — ลบ mock, ใช้ real API |
| `src/pages/login.tsx` | Modify — username field |
| `src/routes/protected-route.tsx` | Modify — check accessToken |
| `src/components/layout/app-header.tsx` | Modify — display name |
| `src/components/layout/app-sidebar.tsx` | Modify — role mapping |

---

## Implementation Order
1. `env.ts` — เพิ่ม env vars
2. `types/api.ts` — เปลี่ยน types
3. `store/auth.ts` — เปลี่ยน store shape
4. `api/axios.ts` — เพิ่ม authApi instance + refresh interceptor
5. `api/auth.ts` — real API calls
6. `lib/validations/auth.ts` — validation schema
7. `hooks/use-auth.ts` — ลบ mock, ใช้ real API
8. `pages/login.tsx` — UI changes
9. `routes/protected-route.tsx` — check accessToken
10. `components/layout/app-header.tsx` — display name
11. `components/layout/app-sidebar.tsx` — role check
