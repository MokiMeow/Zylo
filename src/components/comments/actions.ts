"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";

export async function submitComment({
  postId,
  content,
}: {
  postId: string;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content: contentValidated } = createCommentSchema.parse({ content });

  const newComment = await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) throw new Error("Post not found");

    const comment = await tx.comment.create({
      data: {
        content: contentValidated,
        postId,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    });

    if (post.userId !== user.id) {
      await tx.notification.create({
        data: {
          issuerId: user.id,
          recipientId: post.userId,
          postId,
          type: "COMMENT",
        },
      });
    }

    return comment;
  });

  return newComment;
}

export async function deleteComment(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
