import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Uploaded file:", file);
    console.log("Metadata:", metadata);
    // You can store `file.url` or `file.key` in your database
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
