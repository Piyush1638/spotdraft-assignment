import { useState, useMemo } from "react";
import Link from "next/link";
import { FaFilePdf, FaSort } from "react-icons/fa";
import { PdfFile } from "./MyPdf";

type SortOrder = "asc" | "desc";

const invitedFiles: PdfFile[] = [
  { id: "201", name: "Partner Agreement.pdf", uploadedAt: "2024-05-09T08:30:00Z" },
  { id: "202", name: "Client Brief.pdf", uploadedAt: "2024-05-07T11:00:00Z" },
  { id: "203", name: "Feature Discussion.pdf", uploadedAt: "2024-05-06T15:20:00Z" },
];

export default function InvitedPdf() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const filteredFiles = useMemo(() => {
    return invitedFiles.filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const sortedFiles = useMemo(() => {
    return [...filteredFiles].sort((a, b) => {
      return sortOrder === "asc"
        ? new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
        : new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    });
  }, [filteredFiles, sortOrder]);

  function toggleSortOrder() {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  }

  return (
  <>
    {/* Search and Sort Header */}
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 items-center">
      <input
        type="text"
        placeholder="Search PDFs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-1/2 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={toggleSortOrder}
        className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-100"
      >
        <FaSort className="text-gray-700" />
      </button>
    </div>

    {/* No PDFs UI */}
    {sortedFiles.length === 0 ? (
      <div className="text-center text-gray-500 mt-10">
        No PDFs found.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedFiles.map((file) => (
          <Link
            key={file.id}
            href={`/pdf/${file.id}`}
            className="block bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200"
          >
            <div className="flex items-start gap-4">
              <div className="text-red-500 text-3xl">
                <FaFilePdf />
              </div>
              <div className="w-full">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                  {new Date(file.uploadedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  <span>10KB</span>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )}
  </>
)
};
