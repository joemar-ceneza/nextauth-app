import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const nameSchema = z.object({
    name: z.string().min(1, "Name is required"),
  });
  const body = await req.json();
  const parsed = nameSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  const normalizedEmail = token.email.toLowerCase().trim();
  const normalizedName = parsed.data.name.trim();
  try {
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { name: normalizedName },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
