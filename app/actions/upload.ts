"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


export async function submitArtwork(formData: FormData) {
  // Initialize Supabase INSIDE the action. 
  // Vercel won't run this during build time, solving all our errors!
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const artisanId = formData.get("artisanId") as string;
  const imageFile = formData.get("image") as File;

  if (!title || !price || !artisanId || !imageFile) {
    throw new Error("Missing required fields");
  }

  // 1. Upload Image to Supabase Storage
  // Create a unique file name so images don't overwrite each other
  const uniqueFilename = `${artisanId}-${Date.now()}-${imageFile.name}`;
  
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('artworks') // The bucket name you created in Step 1
    .upload(uniqueFilename, imageFile, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw new Error("Failed to upload image.");
  }

 // 2. Get the Public URL of the uploaded image
  const { data: publicUrlData } = supabase
    .storage
    .from('artworks')
    .getPublicUrl(uploadData.path);

  const imageUrl = publicUrlData.publicUrl;

  // --- NEW AUTO-HEAL FIX ---
  // If Supabase created the user but Prisma doesn't know them yet, sync them!
  const existingUser = await prisma.user.findUnique({
    where: { id: artisanId }
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: artisanId,
        name: "My Studio", // Default name until they edit their profile
        email: `studio-${artisanId.substring(0, 5)}@artisanalley.com`,
        password: "supabase-auth-linked",
        role: "ARTISAN"
      }
    });
  }
  // --------------------------

 // 3. Save to Prisma Database
  await prisma.artwork.create({
    data: {
      title,
      description: description || "", // Ensure description isn't undefined
      price: Number(price),           // Ensure price is a number
      category,
      imageUrl: imageUrl, 
      artisanId: artisanId,
    },
  });

  revalidatePath('/collection');
  revalidatePath(`/artisan/${artisanId}/dashboard`); // <-- Add this new line!
  redirect(`/artisan/${artisanId}/dashboard`);
}