"use server";

import { supabase } from "../../lib/supabase";
import { redirect } from "next/navigation";

export async function handleAuth(formData: FormData, mode: "login" | "signup") {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

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
      
      // 2. Redirect to dashboard using their Supabase User ID
      redirect(`/artisan/${data.user?.id}/dashboard`);

    } else {
      // 1. Log in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error: error.message };

      // 2. Redirect to dashboard
      redirect(`/artisan/${data.user?.id}/dashboard`);
    }
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT" || error.digest?.includes("NEXT_REDIRECT")) throw error;
    return { error: "Authentication failed. Please check your credentials." };
  }
}