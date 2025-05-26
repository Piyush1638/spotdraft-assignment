import { useState, useMemo, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import toast from "react-hot-toast";
import PdfCard from "@/components/dashboard/PdfCard"; // Adjust the path based on your file structure

type SortOrder = "Oldest" | "Newest";

export type PdfFile = {
  _id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  fileHash: string;
  lastModified: number;
  authorId: string;
  sharedWith: string[];
  shareId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  uploadedAt?: string;
  __v?: number;
};

export default function MyPdf() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("Newest");
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPdfFiles = async () => {
      try {
        const response = await fetch("/api/pdf/my-pdf");
        if (!response.ok) {
          toast.error("Failed to fetch PDF files");
          throw new Error("Failed to fetch PDF files");
        }

        const data = await response.json();

        if (!data.success) {
          toast.error(data.message);
          throw new Error(data.message);
        }

        setPdfFiles(data.data || []);
      } catch (error) {
        console.error("Error fetching PDF files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPdfFiles();
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
          className="w-full sm:w-1/2 px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="text-center text-blue-400 mt-10 animate-pulse text-lg font-medium">
          Loading PDFs...
        </div>
      ) : sortedFiles.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">No PDFs found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedFiles.map((file) => (
            <PdfCard key={file._id} file={file} />
          ))}
        </div>
      )}
    </>
  );
}
