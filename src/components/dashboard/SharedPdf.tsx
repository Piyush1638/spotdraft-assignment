import { useState, useMemo, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import { PdfFile } from "./MyPdf";
import toast from "react-hot-toast";
import PdfCard from "./PdfCard";

type SortOrder = "Oldest" | "Newest";

export default function SharedPdf() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("Newest");
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedPdfFiles = async () => {
      try {
        const response = await fetch("/api/pdf/shared-pdf");
        if (!response.ok) {
          toast.error("Failed to fetch PDF files");
          throw new Error("Failed to fetch PDF files");
        }

        const data = await response.json();

        if (!data.success) {
          toast.error(data.message);
          throw new Error(data.message);
        }

        setPdfFiles(data.data);
      } catch (error) {
        console.error("Error fetching PDF files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedPdfFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    return pdfFiles.filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pdfFiles, searchTerm]);

  const sortedFiles = useMemo(() => {
    return [...filteredFiles].sort((a, b) => {
      return sortOrder === "Oldest"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredFiles, sortOrder]);

  function toggleSortOrder() {
    setSortOrder((prev) => (prev === "Newest" ? "Oldest" : "Newest"));
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
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaSort />
          <span className="text-sm capitalize">{sortOrder}</span>
        </button>
      </div>

      {/* Loading Animation */}
      {loading ? (
        <div className="text-center text-blue-500 mt-10 animate-pulse text-lg font-medium">
          Loading PDFs...
        </div>
      ) : sortedFiles.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No PDFs found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* {sortedFiles.map((file) => (
            <Link
              key={file._id}
              href={`/pdf/${file._id}`}
              className="block bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200"
            >
              <div className="flex items-start gap-4">
                <div className="text-red-500 text-3xl">
                  <FaFilePdf />
                </div>
                <div className="w-full">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {file.name.slice(0, 20) + "..."}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center justify-between">
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
          ))} */}
          {sortedFiles.map((file) => (
            <PdfCard key={file._id} file={file} />
          ))}
        </div>
      )}
    </>
  );
}
