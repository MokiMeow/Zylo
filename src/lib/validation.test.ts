import { describe, expect, it } from "vitest";
import {
  createPostSchema,
  signUpSchema,
  updateUserProfileSchema,
} from "./validation";

describe("validation schemas", () => {
  it("accepts a valid sign-up payload", () => {
    expect(
      signUpSchema.parse({
        email: "person@example.com",
        username: "person_1",
        password: "correct-horse",
      }),
    ).toEqual({
      email: "person@example.com",
      username: "person_1",
      password: "correct-horse",
    });
  });

  it("rejects unsafe usernames and short passwords", () => {
    expect(() =>
      signUpSchema.parse({
        email: "person@example.com",
        username: "person name",
        password: "short",
      }),
    ).toThrow();
  });

  it("limits post attachments and profile biography length", () => {
    expect(() =>
      createPostSchema.parse({
        content: "hello",
        mediaIds: ["1", "2", "3", "4", "5", "6"],
      }),
    ).toThrow();
    expect(() =>
      createPostSchema.parse({
        content: "hello",
        mediaIds: ["same-media", "same-media"],
      }),
    ).toThrow();
    expect(() =>
      updateUserProfileSchema.parse({
        displayName: "Person",
        bio: "x".repeat(1001),
      }),
    ).toThrow();
  });
});
