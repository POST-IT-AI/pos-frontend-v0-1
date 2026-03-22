import { z } from "zod/v4";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร")
    .max(255, "ชื่อผู้ใช้ต้องไม่เกิน 255 ตัวอักษร"),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
