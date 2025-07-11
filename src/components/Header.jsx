import LogoutButton from "@/components/LogoutButton";

export default function Header() {
  return (
    <header className="w-full text-black py-4 px-8 flex justify-between items-center shadow-md">
      <div className="text-xl font-semibold">NextAuth App</div>
      <LogoutButton />
    </header>
  );
}
