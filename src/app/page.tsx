"use client";
import dynamic from "next/dynamic";
import pdfAnimation from "../assets/animations/hero.json";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-6 min-h-screen sm:px-12 lg:flex lg:items-center">
        <div className="max-w-2xl mx-auto text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight animate-fade-slide-up">
            Collaborate on PDFs
            <br className="hidden sm:inline" /> like never before.
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Upload, manage, and share PDF documents with ease. <br />
            Intuitive interface, and seamless sharing—built for productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href={"/dashboard"}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div
          className="mt-12 lg:mt-0 lg:ml-12 max-w-xl mx-auto"
          style={{ width: 400, height: 400 }} // reserve space, adjust as needed
        >
          <Lottie
            animationData={pdfAnimation}
            loop
            className="w-full h-full rounded-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900 px-6 sm:px-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <FeatureCard
            title="Real-time Comments"
            description="Collaborate live with teammates or clients directly on the PDF."
          />
          <FeatureCard
            title="Secure Sharing"
            description="Control access with permissions, and revoke access anytime."
          />
          <FeatureCard
            title="Version History"
            description="Track and restore older versions of your documents easily."
          />
          <FeatureCard
            title="Smart Notifications"
            description="Stay updated when someone comments or updates the PDF."
          />
          <FeatureCard
            title="Cross-device Support"
            description="Access and edit PDFs from desktop, tablet, or mobile."
          />
          <FeatureCard
            title="Cloud Sync"
            description="All your PDFs are safely backed up and accessible anywhere."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-950 px-6 sm:px-12">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="flex flex-col lg:flex-row gap-10 max-w-5xl mx-auto text-gray-300">
          <Step
            number={1}
            title="Upload your PDF"
            description="Drag and drop or choose a file from your device."
          />
          <Step
            number={2}
            title="Invite Collaborators"
            description="Enter email addresses to share access securely."
          />
          <Step
            number={3}
            title="Comment & Review"
            description="Add annotations and reply in real-time."
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-900 px-6 sm:px-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          What People Say
        </h2>
        <div className="max-w-4xl mx-auto grid gap-8 sm:grid-cols-2">
          <Testimonial
            name="Alex Carter"
            text="This app completely changed how we review documents across teams. Game-changer!"
          />
          <Testimonial
            name="Riya Mehta"
            text="Love the real-time collaboration and secure sharing features. Highly recommended!"
          />
        </div>
      </section>

      {/* Call To Action */}
      <footer className="py-12 bg-gray-950 px-6 sm:px-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Ready to boost your productivity?
        </h2>
        <p className="mb-6 text-gray-400">
          Start collaborating on your PDFs today.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Get Started Now
        </Link>
      </footer>
    </main>
  );
}

const FeatureCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Step = ({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) => (
  <div className="flex-1 text-center lg:text-left">
    <div className="text-blue-500 text-4xl font-bold mb-2 flex items-center justify-center w-full">
      {number}
    </div>
    <h4 className="text-xl font-semibold mb-2 text-center">{title}</h4>
    <p className="text-gray-400 text-center">{description}</p>
  </div>
);

const Testimonial = ({ name, text }: { name: string; text: string }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
    <p className="text-gray-300 italic mb-4">&quot;{text}&quot;</p>
    <span className="block font-semibold text-blue-400">{name}</span>
  </div>
);
