import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  useLoginSchema,
  useRegisterSchema,
  useForgotPasswordSchema,
  useResetPasswordSchema,
} from "./auth";

describe("loginSchema", () => {
  function getLoginSchema() {
    const { result } = renderHook(() => useLoginSchema());
    return result.current;
  }

  it("accepts valid input", () => {
    const result = getLoginSchema().safeParse({
      username: "testuser",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });

  it("rejects username shorter than 3 chars", () => {
    const result = getLoginSchema().safeParse({
      username: "ab",
      password: "12345678",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty username", () => {
    const result = getLoginSchema().safeParse({
      username: "",
      password: "12345678",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 chars", () => {
    const result = getLoginSchema().safeParse({
      username: "testuser",
      password: "1234567",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = getLoginSchema().safeParse({
      username: "testuser",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts username at boundary (3 chars)", () => {
    const result = getLoginSchema().safeParse({
      username: "abc",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });

  it("accepts password at boundary (8 chars)", () => {
    const result = getLoginSchema().safeParse({
      username: "testuser",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });
});

describe("registerSchema", () => {
  function getRegisterSchema() {
    const { result } = renderHook(() => useRegisterSchema());
    return result.current;
  }

  it("accepts valid input with all fields", () => {
    const result = getRegisterSchema().safeParse({
      username: "testuser",
      password: "12345678",
      first_name: "Test",
      last_name: "User",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid input without last_name", () => {
    const result = getRegisterSchema().safeParse({
      username: "testuser",
      password: "12345678",
      first_name: "Test",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty string for last_name", () => {
    const result = getRegisterSchema().safeParse({
      username: "testuser",
      password: "12345678",
      first_name: "Test",
      last_name: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty first_name", () => {
    const result = getRegisterSchema().safeParse({
      username: "testuser",
      password: "12345678",
      first_name: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects username shorter than 3 chars", () => {
    const result = getRegisterSchema().safeParse({
      username: "ab",
      password: "12345678",
      first_name: "Test",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 chars", () => {
    const result = getRegisterSchema().safeParse({
      username: "testuser",
      password: "1234567",
      first_name: "Test",
    });
    expect(result.success).toBe(false);
  });

  it("accepts first_name at boundary (1 char)", () => {
    const result = getRegisterSchema().safeParse({
      username: "abc",
      password: "12345678",
      first_name: "T",
    });
    expect(result.success).toBe(true);
  });
});

describe("forgotPasswordSchema", () => {
  function getSchema() {
    const { result } = renderHook(() => useForgotPasswordSchema());
    return result.current;
  }

  it("accepts valid username", () => {
    const result = getSchema().safeParse({ username: "testuser" });
    expect(result.success).toBe(true);
  });

  it("rejects empty username", () => {
    const result = getSchema().safeParse({ username: "" });
    expect(result.success).toBe(false);
  });

  it("accepts single character username", () => {
    const result = getSchema().safeParse({ username: "a" });
    expect(result.success).toBe(true);
  });
});

describe("resetPasswordSchema", () => {
  function getSchema() {
    const { result } = renderHook(() => useResetPasswordSchema());
    return result.current;
  }

  it("accepts valid input", () => {
    const result = getSchema().safeParse({
      token: "sometoken",
      new_password: "abc123",
      confirmPassword: "abc123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty token", () => {
    const result = getSchema().safeParse({
      token: "",
      new_password: "abc123",
      confirmPassword: "abc123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 6 chars", () => {
    const result = getSchema().safeParse({
      token: "sometoken",
      new_password: "12345",
      confirmPassword: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("accepts password at boundary (6 chars)", () => {
    const result = getSchema().safeParse({
      token: "sometoken",
      new_password: "abc123",
      confirmPassword: "abc123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects when passwords do not match", () => {
    const result = getSchema().safeParse({
      token: "sometoken",
      new_password: "password1",
      confirmPassword: "password2",
    });
    expect(result.success).toBe(false);
  });

  it("returns error on confirmPassword path when passwords mismatch", () => {
    const result = getSchema().safeParse({
      token: "sometoken",
      new_password: "password1",
      confirmPassword: "password2",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("confirmPassword");
    }
  });
});
