"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60); // countdown timer
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let countdown: NodeJS.Timeout;

    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(paste)) {
      const pasteArray = paste.split("");
      setOtp(pasteArray);
      pasteArray.forEach((char, idx) => {
        if (inputsRef.current[idx]) {
          inputsRef.current[idx]!.value = char;
        }
      });
      inputsRef.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter a valid OTP");
      return;
    }
    try {
      setIsSubmitting(true);
      const verifyOTPRes = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: code }),
      });
      // if (!verifyOTPRes.ok) throw new Error("OTP verification failed");
      const data = await verifyOTPRes.json();
      if (data.success) {
        toast.success("Email verified successfully!");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          error.message || "Failed to verify email. Please try again."
        );
        console.error("Error verifying OTP:", error.message);
      } else {
        toast.error("An unknown error occurred.");
        console.error("Unknown error verifying OTP:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const emailRes = await fetch("/api/auth/verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await emailRes.json();

      if (data.success) {
        toast.success("OTP resent successfully!");
        setTimer(60); // Reset timer
      } else {
        toast.error(data.message || "Failed to resend OTP. Try again.");
      }
    } catch (error) {
      console.log("Failed to resend OTP: ",error)
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 sm:bg-[url(/images/auth-img.jpg)] bg-cover bg-no-repeat bg-center">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-wide">
            CoDoc
          </h1>
          <p className="text-sm text-gray-500">
            Your reliable PDF collaboration tool
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-2 text-center text-black">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Please enter the 6-digit code sent to your email address.
        </p>
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              ref={(el: HTMLInputElement | null): void => {
                inputsRef.current[index] = el;
              }}
              className="w-10 h-12 text-center text-xl text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`OTP Digit ${index + 1}`}
              aria-invalid={digit === "" ? "true" : "false"}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full cursor-pointer py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>

        <button
          onClick={handleResendOtp}
          disabled={isResending || timer > 0}
          className="w-full cursor-pointer py-2 px-4 my-2 border border-blue-600 text-blue-600 font-semibold rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending
            ? "Resending..."
            : timer > 0
            ? `Resend OTP in ${formatTimer(timer)}`
            : "Resend OTP"}
        </button>

        {timer > 0 && (
          <p className="text-center text-sm text-gray-500 mt-1">
            You can resend OTP after{" "}
            <span className="text-blue-600 font-bold">
              {formatTimer(timer)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
