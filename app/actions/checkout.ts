"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function processOrder(formData: FormData) {
  // Grab everything from the form
  const artworkId = formData.get("artworkId") as string;
  const customerEmail = formData.get("customerEmail") as string; 
  const shippingAddress = formData.get("shippingAddress") as string;
  const city = formData.get("city") as string;
  const postalCode = formData.get("postalCode") as string;

  // 1. Find the customer in your User table
  const customer = await prisma.user.findUnique({
    where: { email: customerEmail }
  });

  if (!customer) {
    throw new Error(`Customer with email ${customerEmail} not found in database.`);
  }

  // 2. Find the artwork
  const artwork = await prisma.artwork.findUnique({
    where: { id: artworkId },
  });

  if (!artwork || artwork.isSold) {
    throw new Error("Artwork no longer available.");
  }

  try {
    // 3. Save Order and Mark Sold
    await prisma.$transaction([
      prisma.order.create({
        data: {
          userId: customer.id,
          artworkId: artwork.id,
          amount: artwork.price,
          status: "COMPLETED",
          shippingAddress,
          city,
          postalCode,
        }
      }),
      prisma.artwork.update({
        where: { id: artwork.id },
        data: { isSold: true }
      })
    ]);
  } catch (error) {
    console.error("Order error:", error);
    throw new Error("Failed to process transaction.");
  }

  revalidatePath('/collection');
  revalidatePath(`/artisan/${artwork.artisanId}/dashboard`, 'page');
  
  redirect('/collection');
}
export async function getArtworkForCheckout(id: string) {
  const artwork = await prisma.artwork.findUnique({
    where: { id },
    include: { author: true }
  });
  return artwork;
}