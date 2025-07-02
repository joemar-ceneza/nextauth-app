import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const userSchema = z.object({
      email: z.string().email("Invalid email format").trim().toLowerCase(),
      password: z.string().min(8, "Password must be at least 8 characters long"),
    });
    const body = await req.json();
    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }
    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
      },
    });
    return NextResponse.json(
      { message: "User created successfully", user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error: ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
