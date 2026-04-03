"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

export async function updateStoreSettings(formData: FormData) {
  const artisanId = formData.get("artisanId") as string;
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const imageFile = formData.get("profileImage") as File | null;

  let profileImageUrl = undefined;

  // 1. Upload to Supabase if a new file was selected
  if (imageFile && imageFile.size > 0) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${artisanId}-${Date.now()}.${fileExt}`;

    // THE FIX: Convert the Next.js File object into a standard Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the buffer instead, and tell Supabase what type of image it is
    const { error } = await supabase.storage
      .from('profiles')
      .upload(fileName, buffer, {
        contentType: imageFile.type,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error("Failed to upload image to Supabase.");
    }

    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);

    profileImageUrl = data.publicUrl;
  }

  // 2. Save everything to Prisma
  try {
    await prisma.user.update({
      where: { id: artisanId },
      data: {
        name: name,
        bio: bio,
        ...(profileImageUrl ? { profileImage: profileImageUrl } : {})
      }
    });

    revalidatePath(`/artisan/${artisanId}/dashboard/settings`);
  } catch (error) {
    console.error("Failed to update settings:", error);
    throw new Error("Could not save settings.");
  }
}