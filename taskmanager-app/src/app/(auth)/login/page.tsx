"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useUser(); //login session usercontext

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        // Login success - redirect to dashboard or home
        await refreshUser();
        router.push("/dashboard");
      }
    } catch (err) {
      console.log(err);
      setError("Failed to login");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="md:mt-10 w-full container mx-auto lg:w-2/5 md:w-1/2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-lg shadow-lg min-w-full"
      >
        <h1 className="text-center text-2xl mb-6 text-gray-600 font-bold">
          Login
        </h1>

        <label htmlFor="username" className="block my-2 font-semibold">
          Username
        </label>
        <input
          className="w-full bg-gray-100 px-4 py-2 rounded-lg"
          type="text"
          name="username"
          id="username"
          required
        />

        <label htmlFor="password" className="block my-2 font-semibold">
          Password
        </label>
        <input
          className="w-full bg-gray-100 px-4 py-2 rounded-lg"
          type="password"
          name="password"
          id="password"
          required
        />

        <button
          type="submit"
          className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className="text-red-500 mt-4 text-sm text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
