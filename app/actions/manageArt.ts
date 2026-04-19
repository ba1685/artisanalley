"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// --- DELETE ACTION ---
export async function deleteArtwork(formData: FormData) {
  const artworkId = formData.get("artworkId") as string;
  const artisanId = formData.get("artisanId") as string;

  // 1. Verify it hasn't been sold to protect customer receipts
  const artwork = await prisma.artwork.findUnique({
    where: { id: artworkId },
    include: { orderItems: true }
  });

  if (artwork && artwork.orderItems.length === 0) {
    // 2. Safe to delete
    await prisma.artwork.delete({
      where: { id: artworkId }
    });
  }

  // 3. Refresh the dashboard
  revalidatePath(`/artisan/${artisanId}/dashboard`);
  revalidatePath('/collection');
}

// --- UPDATE ACTION ---
export async function updateArtwork(formData: FormData) {
  const artworkId = formData.get("artworkId") as string;
  const artisanId = formData.get("artisanId") as string;
  const title = formData.get("title") as string;
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;

  await prisma.artwork.update({
    where: { id: artworkId },
    data: { 
      title, 
      price, 
      description 
    }
  });

  revalidatePath(`/artisan/${artisanId}/dashboard`);
  revalidatePath('/collection');
  
  // Send them back to their dashboard after editing
  redirect(`/artisan/${artisanId}/dashboard`);
}