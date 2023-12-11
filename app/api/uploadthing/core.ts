import { prismadb } from "@/lib/prismadb";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const uploadThingFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: { maxFileCount: 1 },
  })
    .input(z.object({ itemTypeId: z.string() }))
    .middleware((req) => {
      return req.input;
    })
    .onUploadComplete(async ({ file, metadata }) => {
      const { itemTypeId } = metadata;

      const itemType = await prismadb.itemType.findUnique({
        where: { id: itemTypeId },
      });

      if (!itemType) {
        throw new Error("Item type not found");
      }

      await prismadb.itemType.update({
        where: { id: itemTypeId },
        data: {
          qualityControlImageURL: file.url,
        },
      });
    }),
} satisfies FileRouter;

export type uploadThingFileRouter = typeof uploadThingFileRouter;
