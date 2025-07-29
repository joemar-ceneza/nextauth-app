"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CompleteProfile() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    const result = await fetch("/api/user/update-name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    });

    if (result.ok) {
      await update();
      window.location.href = "/welcome";
      console.log("Updated session: ", await update());
    } else {
      console.error("Failed to update name");
    }
  };

  if (!session) return <p>Loading...</p>;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Complete Your Profile</h1>
        <input
          type="text"
          className="border w-full p-2 mb-4 rounded"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer">
          Save
        </button>
      </div>
    </main>
  );
}
