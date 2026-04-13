"use server";

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

export async function getConciergeResponse(message: string) {
  const lowerMessage = message.toLowerCase();

  // 1. Handle casual greetings first
  if (lowerMessage.trim() === "hi" || lowerMessage.trim() === "hello" || lowerMessage.trim() === "hey") {
    return { 
      text: "Hello! I am the ArtisanAlley Concierge. Are you looking for a gift, a specific craft, or something for your home?", 
      artworks: [] 
    };
  }

  let priceLimit = undefined;
  let categoryFilter = undefined;

  // 2. Extract price limit (e.g., "under 3000", "under rs 3000")
  const priceMatch = lowerMessage.match(/under\s*(?:rs|₹)?\s*(\d+)/);
  if (priceMatch) {
    priceLimit = parseInt(priceMatch[1], 10);
  }

  // 3. Check for broad categories
  if (lowerMessage.includes("wood")) categoryFilter = "Woodworking & Marquetry";
  else if (lowerMessage.includes("pottery") || lowerMessage.includes("ceramic")) categoryFilter = "Ceramics & Pottery";
  else if (lowerMessage.includes("leather")) categoryFilter = "Leathercraft & Tooling";
  else if (lowerMessage.includes("jewelry") || lowerMessage.includes("silver")) categoryFilter = "Fine Jewelry & Silversmithing";
  else if (lowerMessage.includes("textile") || lowerMessage.includes("clothes")) categoryFilter = "Textiles & Handlooms";

  // 4. Build the Smart Database Query
  let whereClause: any = { isSold: false };

  // Apply price filter if found
  if (priceLimit) {
    whereClause.price = { lte: priceLimit };
  }

  // Apply category OR Title search
  if (categoryFilter) {
    whereClause.category = { contains: categoryFilter, mode: 'insensitive' };
  } else {
    // SMART KEYWORD SEARCH: If no category matched, extract words to search the artwork TITLE
    // We ignore common words so it only searches for things like "flower" or "vase"
    const stopWords = ["im", "i'm", "looking", "for", "a", "an", "the", "under", "rs", "₹", "some", "any", "do", "you", "have", "gift", "perfect", "piece", "today", "show", "me", "i", "want"];
    
    const cleanText = lowerMessage.replace(/under\s*(?:rs|₹)?\s*\d+/g, '').replace(/[^\w\s]/gi, '');
    const words = cleanText.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));

    if (words.length > 0) {
      // Tell Prisma to find items where the title contains ANY of the keywords
      whereClause.OR = words.map(word => ({
        title: { contains: word, mode: 'insensitive' }
      }));
    }
  }

  // 5. Fetch from Database
  const artworks = await prisma.artwork.findMany({
    where: whereClause,
    include: { author: true },
    take: 3, // Recommend max 3 items
  });

  // 6. Formulate the Reply
  let replyText = "";
  if (artworks.length > 0) {
    replyText = "I found some beautiful pieces that might be exactly what you're looking for. Take a look at these handcrafted selections:";
  } else {
    replyText = "I couldn't find exact matches for that right now, but our collection is always growing. Would you like to explore a different craft?";
  }

  return { text: replyText, artworks };
}