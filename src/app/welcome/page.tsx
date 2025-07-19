import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Header from "@/components/Header";

export default async function WelcomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col items-center justify-center flex-1 space-y-6 px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome, {session.user?.name}!</h1>
        <p className="text-gray-700">You&apos;re logged in 🎉</p>
      </div>
    </main>
  );
}
