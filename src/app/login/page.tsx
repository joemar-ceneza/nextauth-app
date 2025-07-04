"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setIsLoading(false);
    if (result?.error) {
      setError("Invalid email or password");
    } else if (result?.ok) {
      router.push("/welcome");
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border p-2 rounded"
      />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className={`bg-blue-600 text-white px-4 py-2 rounded ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
        {isLoading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
