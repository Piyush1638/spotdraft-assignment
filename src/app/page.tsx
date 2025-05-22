"use client";
import Lottie from "lottie-react";
import pdfAnimation from "../assets/animations/pdf-animation.json";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-20 px-6 min-h-screen sm:px-12 lg:flex lg:items-center">
        <div className="max-w-2xl mx-auto text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Collaborate on PDFs
            <br className="hidden sm:inline" /> like never before.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload, manage, and share PDF documents with ease. Real-time
            commenting, intuitive interface, and seamless sharing—built for
            productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href={"/dashboard"}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-12 lg:mt-0 lg:ml-12 max-w-xl mx-auto">
          <Lottie
            animationData={pdfAnimation}
            loop
            className="w-full h-full rounded-xl"
          />
        </div>
      </section>
    </main>
  );
}
