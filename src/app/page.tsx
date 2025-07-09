"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Password do not match");
      setIsLoading(false);
      return;
    }

    const normalizedEmail = email.toLocaleLowerCase().trim();
    const result = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });
    const data = await result.json();

    setIsLoading(false);

    if (!result.ok) {
      if (Array.isArray(data.error)) {
        interface ErrorObject {
          message: string;
        }
        setError(data.error.map((err: ErrorObject) => err.message).join(", "));
      } else if (typeof data.error === "string") {
        setError(data.error);
      } else {
        setError("Something went wrong.");
      }
      return;
    }

    const loginResult = await signIn("credentials", {
      redirect: false,
      email: normalizedEmail,
      password,
      callbackUrl: "/welcome",
    });

    if (loginResult?.ok) {
      router.push("/welcome");
    } else {
      setError("Login failed after registration");
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-100 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{isLogin ? "Log in" : "Sign up"}</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={isLogin ? handleLogin : handleSignUp}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          {!isLogin && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Confirm your password"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}>
            {isLoading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-indigo-600 hover:underline">
            Forgot your password?
          </a>
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setEmail("");
              setPassword("");
              setConfirmPassword("");
            }}
            className="text-sm text-indigo-600 hover:underline">
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>
      </div>
    </main>
  );
}
