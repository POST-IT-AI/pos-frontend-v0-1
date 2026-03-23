# Forgot Password - Frontend Implementation Guide

## ภาพรวม

ระบบลืมรหัสผ่านสำหรับ POS System ประกอบด้วย 2 หน้า และเรียก 2 API endpoints จาก auth-service

---

## API Endpoints

### Base URL

```
http://localhost:30002
```

---

### 1. POST /api/v1/auth/forgot-password

ขอสร้าง reset token โดยกรอก username

**Request:**

```json
{
  "username": "string (required)"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "reset token generated successfully",
  "data": {
    "message": "reset token generated successfully",
    "reset_token": "a1b2c3d4e5f6...",
    "expires_at": "2026-03-22T20:10:00Z"
  }
}
```

**Response (400 Bad Request):** — username ไม่ได้กรอก

```json
{
  "status": "error",
  "message": "Key: 'ForgotPasswordRequest.Username' Error:Field validation for 'Username' failed on the 'required' tag"
}
```

> **หมายเหตุ**: ถ้า username ไม่มีในระบบ API จะยังคง return 200 OK แต่จะไม่มี `reset_token` ใน response (เพื่อป้องกัน username enumeration)

---

### 2. POST /api/v1/auth/reset-password

ตั้งรหัสผ่านใหม่โดยใช้ reset token

**Request:**

```json
{
  "token": "string (required) — reset token ที่ได้จาก forgot-password",
  "new_password": "string (required, min 6 ตัวอักษร)"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "password has been reset successfully"
}
```

**Response (400 Bad Request):** — token ไม่ถูกต้อง / หมดอายุ / ใช้แล้ว

```json
{
  "status": "error",
  "message": "invalid reset token | reset token has expired | reset token has already been used"
}
```

---

## UI Flow

### หน้าที่ 1: ลืมรหัสผ่าน (Forgot Password Page)

**Route:** `/forgot-password`

**องค์ประกอบ:**
- หัวข้อ: "ลืมรหัสผ่าน"
- Input field: Username (required)
- ปุ่ม: "ขอรีเซ็ตรหัสผ่าน"
- Link กลับไปหน้า Login

**พฤติกรรม:**
1. User กรอก username แล้วกด submit
2. เรียก `POST /api/v1/auth/forgot-password` พร้อม `{ "username": "..." }`
3. ถ้าสำเร็จและมี `reset_token` ใน response:
   - แสดง reset token ให้ user เห็น (copy ได้) **หรือ**
   - redirect ไปหน้า Reset Password พร้อมส่ง token ไปด้วย (ผ่าน state/query param)
4. ถ้าสำเร็จแต่ไม่มี `reset_token` (username ไม่เจอ):
   - แสดงข้อความกลางๆ เช่น "หากชื่อผู้ใช้ถูกต้อง ระบบจะสร้าง token ให้"
5. ถ้า error: แสดง error message

**Validation:**
- Username: ห้ามว่าง

---

### หน้าที่ 2: ตั้งรหัสผ่านใหม่ (Reset Password Page)

**Route:** `/reset-password`

**องค์ประกอบ:**
- หัวข้อ: "ตั้งรหัสผ่านใหม่"
- Input field: Reset Token (required) — อาจ pre-fill จากหน้าก่อน
- Input field: รหัสผ่านใหม่ (required, min 6 ตัวอักษร, type=password)
- Input field: ยืนยันรหัสผ่านใหม่ (required, ต้องตรงกับรหัสผ่านใหม่)
- ปุ่ม: "เปลี่ยนรหัสผ่าน"

**พฤติกรรม:**
1. User กรอก token + รหัสผ่านใหม่ + ยืนยันรหัสผ่าน แล้วกด submit
2. Frontend validate: รหัสผ่านใหม่ต้องตรงกับยืนยันรหัสผ่าน
3. เรียก `POST /api/v1/auth/reset-password` พร้อม `{ "token": "...", "new_password": "..." }`
4. ถ้าสำเร็จ:
   - แสดงข้อความ "เปลี่ยนรหัสผ่านสำเร็จ"
   - redirect ไปหน้า Login หลังจาก 2-3 วินาที
5. ถ้า error: แสดง error message ตาม response
   - "invalid reset token" → "Token ไม่ถูกต้อง"
   - "reset token has expired" → "Token หมดอายุแล้ว กรุณาขอใหม่"
   - "reset token has already been used" → "Token นี้ถูกใช้แล้ว กรุณาขอใหม่"

**Validation:**
- Token: ห้ามว่าง
- รหัสผ่านใหม่: ห้ามว่าง, อย่างน้อย 6 ตัวอักษร
- ยืนยันรหัสผ่าน: ต้องตรงกับรหัสผ่านใหม่

---

## สรุป Flow ทั้งหมด

```
หน้า Login
  └─ คลิก "ลืมรหัสผ่าน?"
      └─ หน้า Forgot Password (/forgot-password)
          └─ กรอก username → POST /forgot-password → ได้ reset_token
              └─ หน้า Reset Password (/reset-password)
                  └─ กรอก token + password ใหม่ → POST /reset-password → สำเร็จ
                      └─ redirect กลับหน้า Login
```

---

## หมายเหตุ

- Reset token มีอายุ **15 นาที** นับจากสร้าง
- Reset token ใช้ได้ **ครั้งเดียว** เท่านั้น
- ระบบนี้ออกแบบสำหรับ POS ภายในร้าน จึง return token ตรงๆ ใน API response (ไม่ส่ง email)
- ถ้าต้องการเพิ่มการส่ง email ในอนาคต ให้แก้ไขที่ backend service layer โดย frontend ไม่ต้องเปลี่ยน flow
