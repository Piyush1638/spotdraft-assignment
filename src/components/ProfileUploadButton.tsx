"use client";

import { useState } from "react";
import { uploadFiles } from "@/helpers/uploadthing";
import toast from "react-hot-toast";

export default function ProfileUploadButton({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileInput = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg, image/png, image/jpg";

    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
          alert("Only JPEG, JPG, and PNG files are allowed.");
          return;
        }

        // Validate file size (8MB max)
        const maxSizeMB = 8;
        if (file.size > maxSizeMB * 1024 * 1024) {
          toast.error(`File size exceeds ${maxSizeMB}MB limit.`);
          return;
        }

        try {
          setIsUploading(true);
          setUploadSuccess(false);
          setUploadProgress(0);

          // Simulate progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            if (progress >= 90) {
              clearInterval(interval);
            } else {
              setUploadProgress(progress);
            }
          }, 200);

          const res = await uploadFiles("imageUploader", { files: [file] });

          clearInterval(interval);
          setUploadProgress(100);
          setIsUploading(false);
          setUploadSuccess(true);
          console.log("Upload complete:", res);

          const saveImage = await fetch("/api/user/upload-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: res[0].ufsUrl,
            }),
          });

          if (!saveImage.ok) {
            toast.error("Failed to save image.");
            throw new Error("Failed to save image.");
          }

          const saveImageData = await saveImage.json();
          if (saveImageData.success) {
            toast.success(saveImageData.message);
            onUploadSuccess();
          } else {
            toast.error("Failed to save image.");
          }
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
    <div className="flex flex-col items-center justify-center gap-4 transition-colors duration-300 ease-in-out">
      <div
        onClick={handleFileInput}
        className="cursor-pointer rounded-full border-2 border-dashed border-blue-300 dark:border-blue-600 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-300 px-4 py-10 w-[100px] sm:w-[200px] h-[200px] text-sm font-medium flex items-center justify-center text-center transition"
      >
        Click to upload image
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">JPEG, JPG, PNG — Max size: 8MB</p>

      {isUploading && (
        <div className="w-full max-w-xs">
          <p className="text-blue-500 dark:text-blue-300 text-sm mb-1">Uploading Image...</p>
          <div className="w-full bg-blue-100 dark:bg-blue-800 h-2 rounded overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-blue-400 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {uploadSuccess && (
        <p className="text-green-600 dark:text-green-400 font-medium">Upload successful!</p>
      )}
    </div>
  );
}
