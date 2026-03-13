"use server";

import { PrismaClient } from '@prisma/client';

// Standard Vercel setup to prevent database connection limits
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function getCollectionArtworks() {
  try {
    const artworks = await prisma.artwork.findMany({
      include: {
        author: true, // This fetches the Artisan's name linked to the artwork
      },
      orderBy: {
        createdAt: 'desc', // Shows newest items first
      }
    });
    return artworks;
  } catch (error) {
    console.error("Failed to fetch artworks:", error);
    return [];
  }
}