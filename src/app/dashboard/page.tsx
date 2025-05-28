"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LogoutButton from "@/components/shared/LogoutButton";
import MyPdf from "@/components/dashboard/MyPdf";
import SharedPdf from "@/components/dashboard/SharedPdf";
import InvitedPdf from "@/components/dashboard/InvitedPdf";
import UploadPdf from "@/components/dashboard/UploadPdf";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import Profile from "@/components/dashboard/Profile";
import { HiMenu } from "react-icons/hi";

type DashboardView = "my" | "shared" | "invited" | "upload" | "profile";

export default function Dashboard() {
  const [view, setView] = useState<DashboardView>("my");
  const [hasMounted, setHasMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => setHasMounted(true), []);
  if (!hasMounted) return null;

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-[#1e293b] shadow-md border-r border-white/10 transform transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex flex-col justify-between`}
      >
        {/* Top part: Logo + Navigation */}
        <div>
          <div className="p-6 flex items-start justify-between">
            <Link href={"/"} className="flex items-center gap-2">
              <Image
                src="/images/brand.png"
                height={40}
                width={40}
                alt="logo"
              />
              <span className="font-bold text-xl">CoDoc</span>
            </Link>
            <button
              className="md:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>
          <nav className="px-4">
            <ul className="space-y-2">
              {[
                { key: "my", label: "My PDF" },
                { key: "shared", label: "Shared PDF" },
                { key: "invited", label: "Invited PDF" },
                { key: "upload", label: "Upload PDF" },
                { key: "profile", label: "Profile" },
              ].map(({ key, label }) => (
                <li key={key}>
                  <button
                    onClick={() => {
                      setView(key as DashboardView);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-blue-600 transition ${
                      view === key ? "bg-blue-600" : "bg-transparent"
                    }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom part: User info + Logout */}
        <div className="p-4 flex flex-col gap-4 border-t border-white/10">
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white overflow-hidden border relative">
                {user.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt={`${user.name}'s profile picture`}
                    fill
                    className="object-cover" // Remove aspect-square here
                  />
                ) : (
                  <span className="text-[#0f172a] font-semibold flex items-center justify-center h-full">
                    {user.name[0].toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex flex-col overflow-hidden">
                <span className="text-sm truncate">{user.name}</span>
                <span className="text-xs text-gray-300 truncate">
                  {user.email}
                </span>
              </div>
            </div>
          )}
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Nav */}
        <div className="md:hidden p-4 flex justify-between items-center border-b border-white/10 bg-[#0f172a]">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white text-3xl"
          >
            <HiMenu />
          </button>
        </div>

        <main className="flex-1 p-4 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">
            {view === "my" && "Your PDFs"}
            {view === "shared" && "Shared PDFs"}
            {view === "invited" && "Invited PDFs"}
            {view === "upload" && "Upload PDF"}
            {view === "profile" && "Profile"}
          </h1>

          {view === "my" && <MyPdf />}
          {view === "shared" && <SharedPdf />}
          {view === "invited" && <InvitedPdf />}
          {view === "upload" && <UploadPdf />}
          {view === "profile" && <Profile />}
        </main>
      </div>
    </div>
  );
}
