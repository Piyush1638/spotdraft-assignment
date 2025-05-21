"use client";
import React, { useRef, useState } from "react";

const EmailVerificationPage = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleSubmit = () => {
    const code = otp.join("");
    console.log("Verifying OTP:", code);
    // Replace with actual API call
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
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
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
