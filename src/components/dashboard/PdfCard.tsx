// components/PdfCard.tsx

import Link from "next/link";
import { FaFilePdf } from "react-icons/fa";
import { PdfFile } from "./MyPdf";

interface PdfCardProps {
  file: PdfFile;
}

export default function PdfCard({ file }: PdfCardProps) {
  function formatFileSize(bytes: number): string {
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
  }

  return (
    <Link
      href={`/pdf/${file._id}`}
      className="block bg-gray-800 p-5 rounded-lg shadow-sm hover:shadow-md transition border border-gray-700 hover:bg-gray-700"
    >
      <div className="flex items-start gap-4">
        <div className="text-red-400 text-3xl">
          <FaFilePdf />
        </div>
        <div className="w-full">
          <p className="text-sm font-medium text-gray-100 truncate">
            {file.name.slice(0, 15) + "..."}
          </p>
          <p className="text-xs text-gray-400 mt-1 flex items-center justify-between">
            {new Date(file.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            <span>{formatFileSize(file.size)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
