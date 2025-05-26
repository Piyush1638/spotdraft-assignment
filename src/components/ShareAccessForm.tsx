"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ShareAccessFormProps {
  pdfId: string;
}

interface List {
  email: string;
  profilePicture: string;
  userId: string;
}

const ShareAccessForm: React.FC<ShareAccessFormProps> = ({ pdfId }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sharedList, setSharedList] = useState<List[]>([]);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!email) {
      toast.error("Email is required");
      setIsSubmitting(false);
      return;
    }

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
        fetchSharedList();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sharing access.");
    } finally {
      setEmail("");
      setIsSubmitting(false);
    }
  };

  const fetchSharedList = async () => {
    try {
      const req = await fetch("/api/pdf/shared-user-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfId }),
      });

      const data = await req.json();
      if (data.success) {
        setSharedList(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Internal Server Error!");
      console.log("Error fetching shared list: ", error);
    }
  };

  const handleRemoveAccess = async (userIdToRemove: string) => {
    try {
      setIsRemoving(userIdToRemove);
      const res = await fetch("/api/pdf/remove-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfId, userIdToRemove }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchSharedList();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Remove access error:", error);
    } finally {
      setIsRemoving(null);
    }
  };

  useEffect(() => {
    fetchSharedList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 mt-6 max-w-md text-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Share Access</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-2 rounded-md cursor-pointer text-white font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition`}
          >
            {isSubmitting ? "Sharing..." : "Share"}
          </button>
        </div>
      </form>

      {sharedList.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-300">Shared With:</h3>
          <ul className="space-y-2 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 rounded-md border border-gray-700 p-2">
            {sharedList.map((user) => (
              <li
                key={user.userId}
                className="flex items-center justify-between p-2 bg-gray-900 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={user.profilePicture || "/images/default-avatar.png"}
                    alt="Profile"
                    width={30} // 10 * 4 (Tailwind's w-10 means 2.5rem = 40px)
                    height={30} // same as width for a square
                    className="rounded-full object-cover border border-gray-700 aspect-square"
                  />
                  <span className="text-gray-200 text-sm">{user.email}</span>
                </div>
                <button
                  onClick={() => handleRemoveAccess(user.userId)}
                  disabled={isRemoving === user.userId}
                  className="text-sm cursor-pointer bg-red-900 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-1 rounded transition"
                >
                  {isRemoving === user.userId ? (
                    <div className="h-4 w-4 border-2 border-l-white border-t-transparent border-r-transparent border-b-transparent animate-spin rounded-full" />
                  ) : (
                    "Remove"
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShareAccessForm;
