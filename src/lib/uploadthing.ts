import type { AppFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<AppFileRouter>();

export function getUploadthingFileKey(url: string): string {
  const pathname = new URL(url).pathname;
  const key = pathname.split("/").filter(Boolean).at(-1);

  if (!key) {
    throw new Error("UploadThing URL does not contain a file key");
  }

  return key;
}
