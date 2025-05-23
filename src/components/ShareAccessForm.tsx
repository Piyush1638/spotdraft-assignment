"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

interface ShareAccessFormProps {
  pdfId: string;
}

const ShareAccessForm: React.FC<ShareAccessFormProps> = ({ pdfId }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    try {
      const res = await fetch("/api/pdf/share-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfId, email }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Access granted!");
        setEmail("");
      } else {
        toast.error(data.message || "Failed to share access.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sharing access.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 max-w-md">
      <h2 className="text-lg font-semibold">Share Access</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Share
        </button>
      </div>
    </form>
  );
};

export default ShareAccessForm;
