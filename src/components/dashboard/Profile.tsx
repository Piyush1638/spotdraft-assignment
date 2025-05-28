"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import ProfileUploadButton from "../ProfileUploadButton";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

export interface User {
  userId: string;
  name: string;
  email: string;
  profilePicture: string;
  sharedFiles: string[];
}

export default function Profile() {
  const [profile, setProfile] = useState<User>();
  const [apiFetchLoading, setApiFetchLoading] = useState(true);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const { setUser, loading } = useUser();

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/user/data/user-data");
      if (!response.ok) throw new Error("Failed to fetch user details");

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setProfile(data.user);
      setUser({
        _id: data.user.userId, // map userId -> _id here
        name: data.user.name,
        email: data.user.email,
        profilePicture: data.user.profilePicture,
        sharedFiles: data.user.sharedFiles,
      });
    } catch (error: unknown) {
      console.error("Error fetching user details:", error);
      toast.error("Something went wrong");
    } finally {
      setApiFetchLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle successful upload
  const handleUploadSuccess = () => {
    setShowUploadButton(false);
    fetchProfile(); // Refetch the profile to get updated image
  };

  return (
    <div className="flex justify-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-10  transition-colors duration-300 ease-in-out">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md sm:max-w-lg md:max-w-xl space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
          My Profile
        </h1>

        {apiFetchLoading ? (
          <p className="text-center text-gray-500 dark:text-gray-300">
            Loading...
          </p>
        ) : (
          <>
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-3">
              {loading ? (
                <div className="h-10 w-10 rounded-full border-b border-blue-600 animate-spin" />
              ) : !profile?.profilePicture || showUploadButton ? (
                <ProfileUploadButton onUploadSuccess={handleUploadSuccess} />
              ) : (
                <>
                  <Image
                    src={profile.profilePicture || "/default-profile.png"}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="aspect-square rounded-full shadow object-cover border border-gray-300 dark:border-gray-700"
                  />
                  <button
                    onClick={() => setShowUploadButton(true)}
                    className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    Change Photo
                  </button>
                </>
              )}
            </div>

            {/* Details */}
            <div className="text-gray-700 dark:text-gray-300 space-y-2 text-center sm:text-left">
              <div>
                <span className="font-semibold">ID:</span>{" "}
                <span className="break-words">{profile?.userId}</span>
              </div>
              <div>
                <span className="font-semibold">Name:</span> {profile?.name}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {profile?.email}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
