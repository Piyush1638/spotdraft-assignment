import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Uploaded file:", file);
    // You can store `file.url` or `file.key` in your database
  }),

  // New image uploader for profile pictures
  imageUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Uploaded image file:", file);
    // This is where you'd call your backend API to store the image URL in MongoDB
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
