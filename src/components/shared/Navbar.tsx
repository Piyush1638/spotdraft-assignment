"use client";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { user, loading } = useUser();

  return (
    <nav className="backdrop-blur-md bg-[#0f172a]/70 text-white sticky top-0 z-50 shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/brand.png"
            height={40}
            width={40}
            alt="logo"
            className="object-contain h-6 w-6 sm:h-10 sm:w-10"
          />
          <span className="font-bold text-xl sm:text-2xl">CoDoc</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-5 sm:gap-10 text-sm font-medium">
          <Link
            href="/dashboard"
            className="hover:text-blue-400 transition duration-200"
          >
            Dashboard
          </Link>

          {!loading &&
            (user ? (
              <div className="h-10 w-10 rounded-full overflow-hidden border border-white relative">
                <Image
                  src={user.profilePicture || "/images/default-avatar.png"}
                  alt="profile"
                  height={40}
                  width={40}
                  className="object-cover rounded-full"
                />
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Login
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
}
