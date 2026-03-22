import { describe, it, expect } from "vitest";
import { loginSchema } from "./auth";

describe("loginSchema", () => {
  it("accepts valid input", () => {
    const result = loginSchema.safeParse({
      username: "testuser",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });

  it("rejects username shorter than 3 chars", () => {
    const result = loginSchema.safeParse({
      username: "ab",
      password: "12345678",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty username", () => {
    const result = loginSchema.safeParse({
      username: "",
      password: "12345678",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 chars", () => {
    const result = loginSchema.safeParse({
      username: "testuser",
      password: "1234567",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      username: "testuser",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts username at boundary (3 chars)", () => {
    const result = loginSchema.safeParse({
      username: "abc",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });

  it("accepts password at boundary (8 chars)", () => {
    const result = loginSchema.safeParse({
      username: "testuser",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });
});
