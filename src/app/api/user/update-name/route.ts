import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  try {
    await prisma.user.update({
      where: { email: token.email },
      data: { name },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update user:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
