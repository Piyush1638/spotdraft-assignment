"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LogoutButton from "@/components/shared/LogoutButton";
import MyPdf from "@/components/dashboard/MyPdf";
import SharedPdf from "@/components/dashboard/SharedPdf";
import InvitedPdf from "@/components/dashboard/InvitedPdf";
import UploadPdf from "@/components/dashboard/UploadPdf";
import Link from "next/link";

type DashboardView = "my" | "shared" | "invited" | "upload";

export default function Dashboard() {
  const [view, setView] = useState<DashboardView>("my");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);
  if (!hasMounted) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:flex flex-col">
        <Link href={"/"} className="p-6 font-bold text-lg">
          <Image src="/images/brand.png" height={50} width={100} alt="logo" />
        </Link>
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            <li>
              <button onClick={() => setView("my")} className="w-full text-left text-gray-700 hover:bg-blue-100 px-3 py-2 rounded-md">
                My PDF
              </button>
            </li>
            <li>
              <button onClick={() => setView("shared")} className="w-full text-left text-gray-700 hover:bg-blue-100 px-3 py-2 rounded-md">
                Shared PDF
              </button>
            </li>
            <li>
              <button onClick={() => setView("invited")} className="w-full text-left text-gray-700 hover:bg-blue-100 px-3 py-2 rounded-md">
                Invited PDF
              </button>
            </li>
            <li>
              <button onClick={() => setView("upload")} className="w-full text-left text-gray-700 hover:bg-blue-100 px-3 py-2 rounded-md">
                Upload PDF
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {view === "my" && "Your PDFs"}
            {view === "shared" && "Shared PDFs"}
            {view === "invited" && "Invited PDFs"}
            {view === "upload" && "Upload PDF"}
          </h1>

          {view === "my" && <MyPdf />}
          {view === "shared" && <SharedPdf />}
          {view === "invited" && <InvitedPdf />}
          {view === "upload" && <UploadPdf />}
        </main>
      </div>
    </div>
  );
}
