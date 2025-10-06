import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || name === undefined || name.trim() === "") {
      return NextResponse.json({ error: "Email, password, and name required" }, { status: 400 });
    }

    // cek apakah email sudah ada
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan user baru
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json({ message: "User registered successfully", user: { id: user.id, email: user.email } });
  } catch (err: any) {
    console.error("Registration error:", err);
    // Optionally, return the error message for debugging (remove in production)
    return NextResponse.json({ error: "Internal server error", detail: err?.message }, { status: 500 });
  }
}
