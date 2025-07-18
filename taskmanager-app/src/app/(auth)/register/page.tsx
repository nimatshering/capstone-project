"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Reuse createUser helper
async function createUser(data: {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  photo?: string | null;
}) {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    if (res.status === 400 && result.fieldErrors) {
      return { fieldErrors: result.fieldErrors };
    }
    return { error: result.error || "Failed to create user" };
  }

  return { message: "User created successfully" };
}

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const result = await createUser({ ...formData });

    if ("fieldErrors" in result) {
      setErrors(result.fieldErrors);
      return;
    }

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message || "User registered successfully");
    router.push("/login"); // redirect after successful registration
  };

  return (
    <div className="md:mt-10 w-full container mx-auto lg:w-2/5 md:w-1/2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-lg shadow-lg min-w-full"
      >
        <h1 className="text-center text-2xl mb-6 text-gray-600 font-bold font-sans">
          Register
        </h1>

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullname"
            className="text-gray-800 font-semibold block my-3 text-md"
          >
            Full Name
          </label>
          <input
            autoComplete="name"
            className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
            type="text"
            id="fullname"
            value={formData.fullname}
            onChange={(e) => handleChange("fullname", e.target.value)}
            placeholder="Full name"
          />
          {errors.fullname && (
            <p className="text-sm text-red-600">{errors.fullname}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="text-gray-800 font-semibold block my-3 text-md"
          >
            Username
          </label>
          <input
            autoComplete="username"
            className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Username"
          />
          {errors.username && (
            <p className="text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="text-gray-800 font-semibold block my-3 text-md"
          >
            Email
          </label>
          <input
            autoComplete="email"
            className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="text-gray-800 font-semibold block my-3 text-md"
          >
            Password
          </label>
          <input
            autoComplete="new-password"
            className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="text-gray-800 font-semibold block my-3 text-md"
          >
            Confirm Password
          </label>
          <input
            autoComplete="new-password"
            className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="Confirm password"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-indigo-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-semibold font-sans"
        >
          Register
        </button>
      </form>
    </div>
  );
}
