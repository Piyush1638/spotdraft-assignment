"use client";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

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
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <Link
            href="/dashboard"
            className="hover:text-blue-400 transition duration-200"
          >
            Dashboard
          </Link>
          <Link
            href="/about"
            className="hover:text-blue-400 transition duration-200"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-blue-400 transition duration-200"
          >
            Contact
          </Link>
          {user ? (
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
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <ul className="md:hidden bg-[#0f172a]/80 backdrop-blur-md text-white px-6 pb-6 space-y-4 text-base font-medium border-t border-white/10">
          <li>
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/about" onClick={() => setIsOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </li>
          <li>
            {user ? (
              <div className="h-10 w-10 rounded-full overflow-hidden border border-white">
                <Image
                  src={user.profilePicture || "/images/default-avatar.png"}
                  alt="profile"
                  layout="fill"
                  className="object-cover"
                />
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
}
