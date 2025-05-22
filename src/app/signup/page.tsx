"use client";
import React, { useState } from "react";
import { GrFormViewHide } from "react-icons/gr";
import { BiShow } from "react-icons/bi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

const SignupPage = () => {
  const [formData, setFormData] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<SignupForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: Partial<SignupForm> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email";
    return newErrors;
  };

  const passwordRules = [
    {
      label: "Between 10 and 24 characters",
      valid: formData.password.length >= 10 && formData.password.length <= 24,
    },
    {
      label: "At least one uppercase letter",
      valid: /[A-Z]/.test(formData.password),
    },
    {
      label: "At least one lowercase letter",
      valid: /[a-z]/.test(formData.password),
    },
    { label: "No spaces", valid: !formData.password.includes(" ") },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.valid);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (!isPasswordValid) {
      validationErrors.password = "Password does not meet requirements";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Signup failed");
      const data = await res.json();
      console.log("Signup successful:", data);

      // send email verification OTP
      const emailRes = await fetch("/api/auth/verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const emailData = await emailRes.json();
      if (emailData.success) {
        toast.success("Verification email sent");
        router.push("/verify-email");
      } else {
        toast.error(emailData.message || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:bg-[url(/images/auth-img.jpg)] bg-cover bg-no-repeat bg-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 sm:p-8">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-wide">
            CoDoc
          </h1>
          <p className="text-sm text-gray-500">
            Your reliable PDF collaboration tool
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Create your CoDoc account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : "password-rules"
                }
                className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-2 text-sm text-blue-600 hover:underline focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <BiShow size={20} />
                ) : (
                  <GrFormViewHide size={20} />
                )}
              </button>
            </div>

            <ul id="password-rules" className="mt-2 text-sm space-y-1">
              {passwordRules.map(({ label, valid }) => (
                <li
                  key={label}
                  className={valid ? "text-green-600" : "text-red-500"}
                >
                  {valid ? "✔" : "✖"} {label}
                </li>
              ))}
            </ul>

            {errors.password && (
              <p id="password-error" className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
