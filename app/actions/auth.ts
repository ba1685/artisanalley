"use server";

import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

// Prisma setup for Vercel stability
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function handleAuth(formData: FormData, mode: "login" | "signup") {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  // Initialize Supabase INSIDE the action so Vercel doesn't crash during build
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    if (mode === "signup") {
      // 1. Sign up the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) return { error: error.message };
      if (!data.user) return { error: "Failed to create user." };

      // 2. Save the real name to Prisma immediately
      await prisma.user.create({
        data: {
          id: data.user.id,
          name: name, // Saves the exact name they typed into the form
          email: email,
          password: "supabase-auth-linked", 
          role: "ARTISAN",
        },
      });

      // 3. Redirect to their beautifully named dashboard (with the new user flag!)
redirect(`/artisan/${data.user.id}/dashboard?new=true`);

    } else {
      // 1. Log in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error: error.message };
      if (!data.user) return { error: "User not found." };

      // 2. Redirect to dashboard
      redirect(`/artisan/${data.user.id}/dashboard`);
    }
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT" || error.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Auth Error:", error);
    return { error: "Authentication failed. Please check your credentials." };
  }
}