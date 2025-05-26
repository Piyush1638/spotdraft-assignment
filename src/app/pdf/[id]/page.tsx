"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { IPDF } from "@/models/pdfModel";
import ShareAccessForm from "@/components/ShareAccessForm";
import Navbar from "@/components/shared/Navbar";
import Link from "next/link";

const Page = () => {
  const params = useParams();
  const pdfId = params.id as string;
  const router = useRouter();

  const [error, setError] = useState(false);
  const [pdfDetails, setPdfDetails] = useState<IPDF>();
  const [isPdfDeleting, setIsPdfDeleting] = useState(false);

  useEffect(() => {
    if (!pdfId) return;

    const checkOwnership = async () => {
      try {
        const res = await fetch("/api/pdf/pdf-owner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfId }),
        });

        const data = await res.json();
        if (!data.success) {
          setError(true);
          toast.error(data.message);
          return;
        }

        if (data.success) {
          getPdfDetails();
        }
      } catch {
        toast.error("Ownership check failed.");
      }
    };

    const getPdfDetails = async () => {
      console.log("PdfId: ",pdfId);
      try {
        const res = await fetch("/api/pdf/details",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfId }),
        });
        const data = await res.json();
        if (data.success) {
          setPdfDetails(data.pdfDetails);
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Error fetching details.");
      }
    };

    checkOwnership();
  }, [pdfId]);

  const handleDelete = async () => {
    if (!pdfId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this PDF? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setIsPdfDeleting(true);
      const res = await fetch(`/api/pdf/delete-pdf?pdfId=${pdfId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("PDF deleted successfully");
        router.push("/dashboard"); // redirect to dashboard
      } else {
        toast.error(data.message || "Failed to delete PDF");
      }
    } catch (error) {
      toast.error("Error deleting PDF");
      console.log(error)
    } finally {
      setIsPdfDeleting(false);
    }
  };

  if (error)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-red-900 px-4">
          <p className="text-red-400 text-center text-lg font-semibold max-w-md">
            You are not authorized to access this PDF.
          </p>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 py-10 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-12 drop-shadow-lg">
            PDF Viewer & Collaboration
          </h1>

          {pdfDetails && (
            <div className="flex flex-col lg:flex-row gap-10">
              {/* PDF Viewer */}
              <section className="lg:flex-1 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden aspect-[3/4] max-h-[80vh]">
                <embed
                  src={pdfDetails.url}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  className="w-full h-full"
                />
              </section>

              {/* Sidebar Info + Actions */}
              <aside className="lg:w-[450px] flex flex-col space-y-8">
                {/* PDF Metadata */}
                <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 shadow-inner">
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Document Details
                  </h2>
                  <dl className="space-y-4 text-gray-300">
                    <div className="flex gap-4">
                      <dt className="font-medium">Name:</dt>
                      <dd>{pdfDetails.name}</dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="font-medium">Size:</dt>
                      <dd>{(pdfDetails.size / 1024).toFixed(2)} KB</dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="font-medium">URL:</dt>
                      <dd className="break-words">
                        <a
                          href={pdfDetails.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 underline hover:text-indigo-600 transition"
                        >
                          Open in New Tab
                        </a>
                      </dd>
                    </div>
                    {/* Delete Button */}
                    <button
                      onClick={handleDelete}
                      className="mt-4 w-fit p-2 cursor-pointer bg-red-900 hover:bg-red-700 text-white font-semibold text-sm rounded-lg shadow-md transition"
                      aria-label="Delete PDF"
                    >
                      {isPdfDeleting ? "Deleting..." : "Delete PDF"}
                    </button>
                  </dl>

                  {/* Share Links */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/pdf/collaborate/${pdfId}/${pdfDetails.shareId}`
                        );
                        toast.success("Shareable link copied!");
                      }}
                      className="text-sm flex-1 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition"
                      aria-label="Copy shareable link"
                    >
                      Copy Shareable Link
                    </button>

                    <Link
                      href={
                        (process.env.NEXT_PUBLIC_BASE_URL ?? "") +
                        "/pdf/collaborate/" +
                        pdfId +
                        "/" +
                        pdfDetails.shareId
                      }
                      rel="noopener noreferrer"
                      className="text-sm flex-1 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md text-center transition"
                      aria-label="Open collaborative link"
                    >
                      Open in collaboration
                    </Link>
                  </div>
                </div>

                {/* Share Access Form */}
                <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 shadow-lg">
                  <ShareAccessForm pdfId={pdfId} />
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Page;
