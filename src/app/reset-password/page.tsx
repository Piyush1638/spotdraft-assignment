"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ResetPasswordPage = () => {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const router = useRouter();

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const passwordRules = [
    {
      label: "Between 10 and 24 characters",
      valid: password.length >= 10 && password.length <= 24,
    },
    {
      label: "At least one uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "At least one lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "No spaces",
      valid: !password.includes(" "),
    },
  ];
  const isPasswordValid = passwordRules.every((rule) => rule.valid);

  const sendOtpRequest = async () => {
    setSendingOtp(true);
    try {
      const res = await fetch("/api/auth/password-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "OTP sent!");
        setStep("reset");
        setResendTimer(60);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendOtpRequest();
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      sendOtpRequest();
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!isPasswordValid) valid = false;

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      valid = false;
    } else {
      setConfirmError("");
    }

    if (!valid) return;

    console.log("Email:", email);
    console.log("OTP:", otp.join(""));
    console.log("Password:", password);

    setResetting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: otp.join(""),
          newPassword: password,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Failed to reset password");
      } else {
        toast.success(data.message || "Password reset successfully!");
        router.push("/login");
        // setStep("email");
        // setEmail("");
        // setOtp(Array(6).fill(""));
        // setPassword("");
        // setConfirmPassword("");
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to reset password");
    } finally {
      setResetting(false);
    }
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (/^\d+$/.test(value) && value.length === 6) {
      // User pasted full OTP
      const newOtp = value.split("").slice(0, 6);
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
    } else if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          otpRefs.current[index - 1]?.focus();
        }
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:bg-[url(/images/auth-img.jpg)] bg-cover bg-no-repeat bg-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-wide">
            CoDoc
          </h1>
          <p className="text-sm text-gray-500">
            Your reliable PDF collaboration tool
          </p>
        </div>

        {step === "email" ? (
          <>
            <h2 className="text-xl font-semibold text-center mb-4 text-black">
              Enter Your Email
            </h2>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring border-gray-300 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex justify-center items-center"
                disabled={sendingOtp}
              >
                {sendingOtp ? (
                  <span className="loader border-white"></span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-center mb-4 text-black">
              Enter OTP & New Password
            </h2>
            <form onSubmit={handleResetSubmit} className="space-y-4">
              {/* OTP */}
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  OTP
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      ref={(el: HTMLInputElement | null): void => {
                        otpRefs.current[idx] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className="w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500 text-black"
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className={`mt-2 text-sm font-medium ${
                    resendTimer > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:underline"
                  }`}
                >
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </button>
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1 text-black">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-invalid={!isPasswordValid}
                  className={`w-full px-3 py-2 border rounded-md text-black pr-10 focus:outline-none focus:ring ${
                    !isPasswordValid
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter new password"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-xl text-gray-500 cursor-pointer"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  {passwordRules.map((rule, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center gap-2 ${
                        rule.valid ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {rule.valid ? "✅" : "❌"} {rule.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1 text-black">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  aria-invalid={!!confirmError}
                  className={`w-full px-3 py-2 border rounded-md text-black pr-10 focus:outline-none focus:ring ${
                    confirmError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Confirm new password"
                />
                <div
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-9 text-xl text-gray-500 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </div>
                {confirmError && (
                  <p className="text-red-500 text-sm mt-1">{confirmError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  !isPasswordValid || otp.join("").length !== 6 || resetting
                }
                className={`w-full py-2 px-4 rounded-md font-semibold transition flex justify-center items-center ${
                  isPasswordValid && otp.join("").length === 6 && !resetting
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {resetting ? (
                  <span className="loader border-white"></span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
