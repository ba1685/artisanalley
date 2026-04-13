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

  // 1. Try to find the customer
  let customer = await prisma.user.findUnique({ 
    where: { email: customerEmail } 
  });

  // 2. If they don't exist, create a profile for them instantly
  if (!customer) {
    customer = await prisma.user.create({
      data: {
        email: customerEmail,
        name: "Guest", // Clean default name
        password: "guest-checkout", // Dummy password
        role: "CUSTOMER"
      }
    });
  }

  // 3. Find the artwork
  const artwork = await prisma.artwork.findUnique({
    where: { id: artworkId },
  });

  // We removed the 'isSold' check so you can buy it infinitely!
  if (!artwork) {
    throw new Error("Artwork not found.");
  }

  try {
    // 4. Save Order using the NEW Schema (Order + OrderItem nested creation)
    await prisma.order.create({
      data: {
        userId: customer.id,
        total: artwork.price, // Uses the new 'total' field
        status: "PROCESSING", // Matches your Profile page tracking
        shippingAddress,
        city,
        postalCode,
        // This links the specific artwork to the receipt
        items: {
          create: [
            {
              artworkId: artwork.id,
              price: artwork.price
            }
          ]
        }
      }
    });

  } catch (error) {
    console.error("Order error:", error);
    throw new Error("Failed to process transaction.");
  }

  // 5. Refresh the pages so the new data shows up instantly
  revalidatePath('/collection');
  revalidatePath(`/artisan/${artwork.artisanId}/dashboard`);
  revalidatePath('/profile');
  
  // 6. Send them to their new dashboard instead of the collection
  redirect('/profile');
}

export async function getArtworkForCheckout(id: string) {
  const artwork = await prisma.artwork.findUnique({
    where: { id },
    include: { author: true }
  });
  return artwork;
}