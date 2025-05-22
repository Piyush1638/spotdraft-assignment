"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FaFilePdf } from "react-icons/fa";
import Navbar from "@/components/shared/Navbar";
import LogoutButton from "@/components/shared/LogoutButton";

type SortOrder = "asc" | "desc";

const pdfFiles = [
  { id: "1", name: "Project Proposal.pdf", uploadedAt: "2024-05-15T10:30:00Z" },
  {
    id: "2",
    name: "Marketing Strategy 2024.pdf",
    uploadedAt: "2024-05-18T14:15:00Z",
  },
  { id: "3", name: "Product Roadmap.pdf", uploadedAt: "2024-05-12T09:00:00Z" },
  { id: "4", name: "Budget Report Q1.pdf", uploadedAt: "2024-05-20T16:45:00Z" },
  { id: "5", name: "Meeting Notes.pdf", uploadedAt: "2024-05-10T08:00:00Z" },
  { id: "6", name: "Project Proposal.pdf", uploadedAt: "2024-05-15T10:30:00Z" },
  {
    id: "7",
    name: "Marketing Strategy 2024.pdf",
    uploadedAt: "2024-05-18T14:15:00Z",
  },
  { id: "8", name: "Product Roadmap.pdf", uploadedAt: "2024-05-12T09:00:00Z" },
  { id: "9", name: "Budget Report Q1.pdf", uploadedAt: "2024-05-20T16:45:00Z" },
  { id: "10", name: "Meeting Notes.pdf", uploadedAt: "2024-05-10T08:00:00Z" },
  { id: "11", name: "Project Proposal.pdf", uploadedAt: "2024-05-15T10:30:00Z" },
  {
    id: "12",
    name: "Marketing Strategy 2024.pdf",
    uploadedAt: "2024-05-18T14:15:00Z",
  },
  { id: "13", name: "Product Roadmap.pdf", uploadedAt: "2024-05-12T09:00:00Z" },
  { id: "14", name: "Budget Report Q1.pdf", uploadedAt: "2024-05-20T16:45:00Z" },
  { id: "15", name: "Meeting Notes.pdf", uploadedAt: "2024-05-10T08:00:00Z" },
  { id: "16", name: "Project Proposal.pdf", uploadedAt: "2024-05-15T10:30:00Z" },
  {
    id: "17",
    name: "Marketing Strategy 2024.pdf",
    uploadedAt: "2024-05-18T14:15:00Z",
  },
  { id: "18", name: "Product Roadmap.pdf", uploadedAt: "2024-05-12T09:00:00Z" },
  { id: "19", name: "Budget Report Q1.pdf", uploadedAt: "2024-05-20T16:45:00Z" },
  { id: "20", name: "Meeting Notes.pdf", uploadedAt: "2024-05-10T08:00:00Z" },
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const filteredFiles = useMemo(() => {
    return pdfFiles.filter((file) =>
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

  if (!hasMounted) return null;

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />

      <header className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your PDFs</h1>
            <p className="text-gray-600">Search, sort, and manage your uploaded PDF files.</p>
          </div>
          <button className="mt-4 sm:mt-0">
            Upload New PDF
          </button>
        </div>

        <LogoutButton/>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search PDFs by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-300"
            aria-label="Search PDF files"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-300"
            aria-label="Sort by upload date"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pb-10">
        {sortedFiles.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            No PDF files found matching your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedFiles.map(({ id, name, uploadedAt }) => (
              <Link
                key={id}
                href={`/pdf/${id}`}
                className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition p-5"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-red-600 text-4xl">
                    <FaFilePdf />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-md font-semibold text-gray-800 group-hover:text-blue-600 truncate">
                      {name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Uploaded on{" "}
                      {new Date(uploadedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
