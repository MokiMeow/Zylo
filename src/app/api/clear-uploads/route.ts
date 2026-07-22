import prisma from "@/lib/prisma";
import { getUploadthingFileKey } from "@/lib/uploadthing";
import { UTApi } from "uploadthing/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return Response.json(
        { message: "Invalid authorization header" },
        { status: 401 },
      );
    }

    const unusedMedia = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    await new UTApi().deleteFiles(
      unusedMedia.map((media) => getUploadthingFileKey(media.url)),
    );

    await prisma.media.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((m) => m.id),
        },
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
