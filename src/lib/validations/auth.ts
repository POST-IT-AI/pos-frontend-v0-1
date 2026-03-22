import { z } from "zod/v4";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร")
    .max(255, "ชื่อผู้ใช้ต้องไม่เกิน 255 ตัวอักษร"),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร")
    .max(255, "ชื่อผู้ใช้ต้องไม่เกิน 255 ตัวอักษร"),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
  first_name: z
    .string()
    .min(1, "กรุณากรอกชื่อ")
    .max(255, "ชื่อต้องไม่เกิน 255 ตัวอักษร"),
  last_name: z
    .string()
    .max(255, "นามสกุลต้องไม่เกิน 255 ตัวอักษร")
    .optional()
    .or(z.literal("")),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
