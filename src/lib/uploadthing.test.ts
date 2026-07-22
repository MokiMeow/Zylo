import { describe, expect, it } from "vitest";
import { getUploadthingFileKey } from "./uploadthing";

describe("getUploadthingFileKey", () => {
  it.each([
    ["https://utfs.io/f/current-key", "current-key"],
    ["https://utfs.io/a/legacy-app/legacy-key", "legacy-key"],
  ])("extracts the key from %s", (url, expected) => {
    expect(getUploadthingFileKey(url)).toBe(expected);
  });

  it("rejects a URL without a path key", () => {
    expect(() => getUploadthingFileKey("https://utfs.io/")).toThrow();
  });
});
