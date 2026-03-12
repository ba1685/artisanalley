// File: app/actions/auth.ts
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerArtisan(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Missing required fields" };
  }

  try {
    // 1. Check if the artisan already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // 2. Scramble the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save the new Artisan to the database
    const newArtisan = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ARTISAN", // We explicitly set them as an artisan here
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating artisan:", error);
    return { error: "Something went wrong. Please try again." };
  }
}