"use client";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }
      const data = await response.json();
      if (data.success) {
        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 cursor-pointer border border-red-600 w-full  text-red-600 hover:text-white font-medium rounded-md shadow hover:bg-red-700  "
    >
      Logout
    </button>
  );
};

export default LogoutButton;
