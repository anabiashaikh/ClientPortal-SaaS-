"use server";

import { prisma } from "@/lib/prisma";

export async function registerUser(data: any) {
  try {
    const { name, email, password } = data;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists with this email" };
    }

    // Creating the user with plain text password to match credentials provider logic.
    // WARNING: In production, ALWAYS hash passwords using bcrypt or argon2!
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Not hashed intentionally for mockup
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong during registration." };
  }
}
