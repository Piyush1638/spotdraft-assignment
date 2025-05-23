"use client";

import React, { useEffect } from "react";
import { mockComments } from "@/data/mockComments";
import CommentThread from "@/components/collaboration/CommentThread";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { IPDF } from "@/models/pdfModel";

const CollaborationPage = () => {
  const params = useParams();
  const pdfId = params.pdfId;
  // const shareId = params.shareId;
  const [pdfDetails, setPdfDetails] = React.useState<IPDF>();

  useEffect(() => {
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
    getPdfDetails();
  }, [pdfId]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* PDF viewer */}
      <div className="w-full lg:w-2/3 p-4">
        <div className="border rounded shadow overflow-hidden aspect-[3/4] max-h-[90vh]">
          <embed
            src={pdfDetails?.url}
            type="application/pdf"
            width="100%"
            height="100%"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Comments */}
      <div className="w-full lg:w-1/3 p-4 overflow-y-auto max-h-screen bg-white border-l">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <div className="space-y-4">
          {mockComments.map((comment) => (
            <CommentThread key={comment._id.toString()} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollaborationPage;
