import { prismadb } from "@/lib/prismadb";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const uploadThingFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ metadata, file }) => {
    // TODO: Find Vision Instructions by ID
    // TODO: Update instructions training image
  }),
} satisfies FileRouter;

export type uploadThingFileRouter = typeof uploadThingFileRouter;