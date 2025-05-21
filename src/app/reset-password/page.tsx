"use client";
import React, { useState } from "react";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!isPasswordValid) {
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      valid = false;
    } else {
      setConfirmError("");
    }

    if (!valid) return;

    console.log("Password reset to:", password);
    // Add API integration
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-wide">
            CoDoc
          </h1>
          <p className="text-sm text-gray-500">
            Your reliable PDF collaboration tool
          </p>
        </div>

        <h2 className="text-xl font-semibold text-center mb-4 text-black">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={!isPasswordValid}
              className={`w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring ${
                !isPasswordValid
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter new password"
            />
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
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              aria-invalid={!!confirmError}
              className={`w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring ${
                confirmError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Confirm new password"
            />
            {confirmError && (
              <p className="text-red-500 text-sm mt-1">{confirmError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isPasswordValid}
            className={`w-full py-2 px-4 rounded-md font-semibold transition ${
              isPasswordValid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
