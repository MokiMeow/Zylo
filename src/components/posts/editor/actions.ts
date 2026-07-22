"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content, mediaIds } = createPostSchema.parse(input);

  const newPost = await prisma.$transaction(async (tx) => {
    const post = await tx.post.create({
      data: {
        content,
        userId: user.id,
      },
    });

    if (mediaIds.length > 0) {
      const claimedMedia = await tx.media.updateMany({
        where: {
          id: { in: mediaIds },
          userId: user.id,
          postId: null,
        },
        data: { postId: post.id },
      });

      if (claimedMedia.count !== mediaIds.length) {
        throw new Error("One or more attachments are unavailable");
      }
    }

    return tx.post.findUniqueOrThrow({
      where: { id: post.id },
      include: getPostDataInclude(user.id),
    });
  });

  return newPost;
}
