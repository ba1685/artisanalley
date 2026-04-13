"use server";

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function getUserOrders(userId: string) {
  if (!userId) return [];
  
  try {
    const orders = await prisma.order.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }, // Newest orders first
      include: {
        items: {
          include: {
            artwork: {
              include: {
                author: true // Get the artisan's name
              }
            }
          }
        }
      }
    });
    
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}