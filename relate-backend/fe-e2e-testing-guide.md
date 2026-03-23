# Frontend E2E Testing Guide

คู่มือสำหรับทดสอบ e2e กับ backend ทั้ง 2 services

---

## Services

| Service | Base URL | Description |
|---------|----------|-------------|
| user-service | `http://localhost:30001` | จัดการ user (register, ดึงข้อมูล) |
| auth-service | `http://localhost:30002` | จัดการ auth (login, token, me) |

---

## Endpoints ทั้งหมด

### user-service (port 30001)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/users/register` | ไม่ต้อง | สร้าง user ใหม่ |
| GET | `/api/v1/users/:id` | ไม่ต้อง | ดึงข้อมูล user ตาม ID |

### auth-service (port 30002)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/login` | ไม่ต้อง | Login รับ token |
| POST | `/api/v1/auth/refresh` | ไม่ต้อง | แลก token ใหม่ |
| GET | `/api/v1/auth/me` | ต้องใส่ Bearer token | ดึงข้อมูล user ที่ login อยู่ |

---

## Flow ทดสอบทั้งหมด (ทำตามลำดับ)

```
Register → Login → เก็บ token → เรียก /me ด้วย token → Refresh token เมื่อหมดอายุ
```

```
FE                      auth-service (:30002)         user-service (:30001)
│                              │                              │
├── 1. Register ──────────────────────────────────────────────►│ POST /users/register
│◄─────────────────────────────────────────────── user data ──┤
│                              │                              │
├── 2. Login ─────────────────►│ POST /auth/login             │
│                              ├── (internal) verify ────────►│ POST /users/verify
│                              │◄──────────── user data ──────┤
│◄──── access_token + refresh_token ──┤                       │
│                              │                              │
├── 3. Get Me ────────────────►│ GET /auth/me                 │
│   (Bearer access_token)      │   validate JWT               │
│                              ├── (internal) get user ──────►│ GET /users/:id
│                              │◄──────────── user data ──────┤
│◄──────────── user data ─────┤                               │
│                              │                              │
├── 4. Get User by ID ────────────────────────────────────────►│ GET /users/:id
│◄─────────────────────────────────────────────── user data ──┤
│                              │                              │
├── 5. Refresh ───────────────►│ POST /auth/refresh           │
│   (refresh_token in body)    │   validate refresh JWT       │
│◄──── new token pair ────────┤                               │
```

---

## Step 1: Register User

สร้าง user ใหม่ในระบบ

```http
POST http://localhost:30001/api/v1/users/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "testuser",
  "password": "12345678",
  "first_name": "Test",
  "last_name": "User"
}
```

**Validation Rules:**
- `username` — required, 3-255 ตัวอักษร
- `password` — required, อย่างน้อย 8 ตัวอักษร
- `first_name` — required, 1-255 ตัวอักษร
- `last_name` — optional, ไม่เกิน 255 ตัวอักษร

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "user registered successfully",
  "data": {
    "id": 1,
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "role": "user",
    "is_active": true
  }
}
```

> **จด `id` ไว้** — ใช้ใน Step 4 สำหรับดึงข้อมูล user ตรง

---

## Step 2: Login เพื่อรับ Token

ใช้ username/password ที่ register ไว้มา login

```http
POST http://localhost:30002/api/v1/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "testuser",
  "password": "12345678"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 900
  }
}
```

> **สิ่งที่ต้องเก็บ:**
> - `access_token` → ใส่ใน Header `Authorization` ทุกครั้งที่เรียก API ที่ต้อง auth
> - `refresh_token` → เก็บไว้ใช้แลก token ใหม่เมื่อ access_token หมดอายุ

---

## Step 3: ดึงข้อมูล User ที่ Login อยู่

**นี่คือวิธีหลักที่ FE ควรใช้ดึงข้อมูล user**

```http
GET http://localhost:30002/api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

> ⚠️ ต้องใส่ `Authorization: Bearer <access_token>` ใน Header **ทุกครั้ง**

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "user retrieved successfully",
  "data": {
    "id": 1,
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "role": "user",
    "is_active": true
  }
}
```

---

## Step 4: ดึงข้อมูล User ตาม ID (ไม่ต้อง auth)

ดึงข้อมูล user ตรงจาก user-service โดยใช้ `id` ที่ได้จาก Step 1

```http
GET http://localhost:30001/api/v1/users/1
```

> ไม่ต้องใส่ Header อะไร — endpoint นี้เป็น public

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "user retrieved successfully",
  "data": {
    "id": 1,
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "role": "user",
    "is_active": true
  }
}
```

---

## Step 5: Refresh Token (เมื่อ access_token หมดอายุ)

เมื่อ access_token หมดอายุ (15 นาที) ใช้ refresh_token แลก token คู่ใหม่

```http
POST http://localhost:30002/api/v1/auth/refresh
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "token refreshed successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...(ใหม่)",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...(ใหม่)",
    "expires_in": 900
  }
}
```

> หลัง refresh แล้ว **ต้องใช้ token ตัวใหม่** — ตัวเก่าใช้ไม่ได้แล้ว

---

## Token Details

| Token | อายุ | ใช้งาน |
|-------|------|--------|
| `access_token` | **15 นาที** (900 วินาที) | ใส่ใน Header `Authorization: Bearer <token>` |
| `refresh_token` | **7 วัน** | ส่งใน body ของ `/auth/refresh` เพื่อแลก token ใหม่ |

---

## Error Cases ที่ควรทดสอบ

### Register Errors

| Case | Expected Status | Expected Message |
|------|----------------|------------------|
| username ซ้ำ | 409 | `username already exists` |
| password สั้นกว่า 8 ตัว | 400 | validation error |
| ไม่ส่ง username | 400 | validation error |
| ไม่ส่ง first_name | 400 | validation error |

### Login Errors

| Case | Expected Status | Expected Message |
|------|----------------|------------------|
| password ผิด | 401 | `invalid credentials` |
| username ไม่มีในระบบ | 401 | `invalid credentials` |

### Get Me Errors

| Case | Expected Status | Expected Message |
|------|----------------|------------------|
| ไม่ส่ง Authorization header | 401 | `authorization header is required` |
| ส่ง token ผิด/ปลอม | 401 | `invalid access token` |
| token หมดอายุ | 401 | `invalid access token` |

### Refresh Token Errors

| Case | Expected Status | Expected Message |
|------|----------------|------------------|
| refresh_token ผิด/ปลอม | 401 | `invalid refresh token` |
| refresh_token หมดอายุ | 401 | `invalid refresh token` |

### Get User by ID Errors

| Case | Expected Status | Expected Message |
|------|----------------|------------------|
| ID ไม่มีในระบบ (เช่น 999) | 404 | `user not found` |
| ID ไม่ใช่ตัวเลข (เช่น "abc") | 400 | `invalid user id` |

---

## Prerequisites (สิ่งที่ต้องรันก่อนทดสอบ)

1. PostgreSQL running on `localhost:5432`
2. รัน user-service:
   ```bash
   cd user-service && go run cmd/server/main.go
   ```
3. รัน auth-service:
   ```bash
   cd auth-service && go run cmd/server/main.go
   ```

---

## Standard Response Format

ทุก API ใช้ format เดียวกัน:

**Success:**
```json
{
  "status": "success",
  "message": "...",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "..."
}
```
