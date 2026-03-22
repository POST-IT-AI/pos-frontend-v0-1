import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLoginSchema, useRegisterSchema } from "./auth";

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
