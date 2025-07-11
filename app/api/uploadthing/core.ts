import { createUploadthing, type FileRouter } from "uploadthing/next";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const self = await getSelf();

      return { user: self };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('[UploadThing] Upload completed:', {
        userId: metadata.user.id,
        fileUrl: file.url,
        fileName: file.name
      });

      try {
        const result = await db.stream.update({
          where: {
            userId: metadata.user.id,
          },
          data: {
            thumbnailUrl: file.url,
          },
        });

        console.log('[UploadThing] Database updated:', {
          streamId: result.id,
          thumbnailUrl: result.thumbnailUrl
        });

        return { fileUrl: file.url };
      } catch (error) {
        console.error('[UploadThing] Database error:', error);
        throw error;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;