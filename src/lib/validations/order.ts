import { z } from "zod/v4";

export const checkoutSchema = z.object({
  paymentMethod: z.enum(["CASH", "CARD", "TRANSFER", "PROMPTPAY"]),
  discount: z.number().min(0).optional(),
  note: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
