import { z } from "zod/v4";

export const productSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อสินค้า"),
  description: z.string().optional(),
  price: z.number().min(0, "ราคาต้องไม่ติดลบ"),
  cost: z.number().min(0, "ต้นทุนต้องไม่ติดลบ"),
  sku: z.string().min(1, "กรุณากรอก SKU"),
  barcode: z.string().optional(),
  categoryId: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  stock: z.number().int().min(0, "จำนวนสต็อกต้องไม่ติดลบ"),
  isActive: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
