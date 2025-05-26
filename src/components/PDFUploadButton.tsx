"use client";

import { useState } from "react";
import { uploadFiles } from "@/helpers/uploadthing";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PDFUploadButton() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const router = useRouter();

  const handleFileInput = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";

    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];

        if (file.type !== "application/pdf") {
          alert("Only PDF files are allowed.");
          return;
        }

        const maxSizeMB = 8;
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`File size exceeds ${maxSizeMB}MB limit.`);
          return;
        }

        try {
          setIsUploading(true);
          setUploadSuccess(false);
          setUploadProgress(0);

          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            if (progress >= 90) {
              clearInterval(interval);
            } else {
              setUploadProgress(progress);
            }
          }, 200);

          const res = await uploadFiles("pdfUploader", { files: [file] });

          clearInterval(interval);
          setUploadProgress(100);
          setIsUploading(false);
          setUploadSuccess(true);

          const savePdf = await fetch("/api/pdf/upload-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: res[0].name,
              url: res[0].ufsUrl,
              type: res[0].type,
              size: res[0].size,
              fileHash: res[0].fileHash,
              lastModified: res[0].lastModified,
            }),
          });

          if (!savePdf.ok) throw new Error("Failed to save PDF");

          const savePdfData = await savePdf.json();
          if (savePdfData.success) {
            toast.success(savePdfData.message);
          } else {
            toast.error("Failed to save PDF.");
          }

          router.push(`/pdf/${savePdfData.savedPdfId}`);
        } catch (err) {
          setIsUploading(false);
          toast.error("Upload failed.");
          console.error(err);
        }
      }
    };

    input.click();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full min-h-[500px] bg-gray-900 text-gray-100">
      {/* Clickable Area */}
      <div
        onClick={handleFileInput}
        className="cursor-pointer border-2 border-dashed border-gray-700 hover:border-blue-500 bg-gray-800 hover:bg-gray-700 px-4 py-10 rounded-lg w-[350px] sm:w-[500px] h-[300px] text-sm font-medium flex items-center justify-center text-center transition-colors duration-300"
      >
        Click anywhere here to upload a PDF (Max size: 8MB)
      </div>

      {/* Progress Indicator */}
      {isUploading && (
        <div className="w-full max-w-xs">
          <p className="text-blue-400 text-sm mb-1">Uploading PDF...</p>
          <div className="w-full bg-gray-700 h-2 rounded overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Success Message */}
      {uploadSuccess && (
        <p className="text-green-400 font-medium">Upload successful!</p>
      )}
    </div>
  );
}
