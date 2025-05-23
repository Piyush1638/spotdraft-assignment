"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { IPDF } from "@/models/pdfModel";
import ShareAccessForm from "@/components/ShareAccessForm";
import Navbar from "@/components/shared/Navbar";

const Page = () => {
  const params = useParams();
  const pdfId = params.id as string;

  const [error, setError] = useState(false);
  const [pdfDetails, setPdfDetails] = useState<IPDF>();

  useEffect(() => {
    if (!pdfId) return;

    const checkOwnership = async () => {
      try {
        const res = await fetch("/api/pdf/pdf-owner", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pdfId }),
        });

        const data = await res.json();
        if (!data.success) {
          setError(true);
          toast.error("You are not authorized to view this PDF.");
        }
      } catch {
        toast.error("Ownership check failed.");
      }
    };

    const getPdfDetails = async () => {
      try {
        const res = await fetch(`/api/pdf/details?pdfId=${pdfId}`);
        const data = await res.json();
        if (data.success) {
          setPdfDetails(data.pdfDetails);
        } else {
          toast.error("Something went wrong! Please try again.");
        }
      } catch {
        toast.error("Error fetching details.");
      }
    };

    checkOwnership();
    getPdfDetails();
  }, [pdfId]);

  if (error)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <p className="text-red-700 text-lg font-semibold">
            You are not authorized to access this PDF.
          </p>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-white to-pink-50 py-10 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6 drop-shadow-sm">
            PDF Viewer
          </h1>

          {pdfDetails && (
            <div className="flex flex-col lg:flex-row gap-10 bg-white rounded-2xl shadow-xl p-8">
              {/* PDF on left for lg+, bottom for smaller */}
              <div className="lg:w-1/2 w-full order-2 lg:order-1 rounded-lg overflow-hidden border border-gray-200 shadow-md aspect-[3/4] max-h-[80vh]">
                <embed
                  src={pdfDetails.url}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  className="w-full h-full"
                />
              </div>

              {/* Info + ShareAccessForm on right for lg+, top for smaller */}
              <div className="lg:w-1/2 w-full space-y-6 order-1 lg:order-2">
                <div className="bg-gradient-to-tr from-indigo-100 to-pink-100 rounded-lg shadow-md p-6 border border-indigo-200">
                  <p className="text-gray-700 text-lg font-semibold">
                    <span className="font-bold">Name:</span> {pdfDetails.name}
                  </p>
                  <p className="text-gray-700 text-lg font-semibold">
                    <span className="font-bold">Size:</span>{" "}
                    {(pdfDetails.size / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-gray-700 text-lg font-semibold">
                    <span className="font-bold">URL:</span>{" "}
                    <a
                      href={pdfDetails.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline hover:text-indigo-800"
                    >
                      Open in New Tab
                    </a>
                  </p>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/pdf/collaborate/${pdfId}/${pdfDetails.shareId}`
                      );
                      toast.success("Shareable link copied!");
                    }}
                    className="mt-4 cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                  >
                    Copy Shareable Link
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <ShareAccessForm pdfId={pdfId} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
