"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const normalizedEmail = email.toLocaleLowerCase().trim();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (Array.isArray(data.error)) {
        setError(data.error.map((err: any) => err.message).join(""));
      } else if (typeof data.error === "string") {
        setError(data.error);
      } else {
        setError("Something went wrong.");
      }
      return;
    }
    const loginRes = await signIn("credentials", {
      redirect: false,
      email: normalizedEmail,
      password,
      callbackUrl: "/welcome",
    });

    if (loginRes?.ok) {
      router.push("/welcome");
    } else {
      setError("Login failed after registration");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold">Register</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        disabled={isLoading}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        disabled={isLoading}
        className="w-full border p-2 rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className={`bg-blue-600 text-white px-4 py-2 rounded w-full ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}>
        {isLoading ? "Registering..." : "Sign Up"}
      </button>
    </form>
  );
}
