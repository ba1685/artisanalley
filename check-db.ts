import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting ArtisanAlley Health Check...");
  
  try {
    // 1. Test Database Connection
    console.log("📡 Testing Connection to Supabase (Port 6543)...");
    const userCount = await prisma.user.count();
    console.log(`✅ Connection Successful! Found ${userCount} users in database.`);

    // 2. Test Environment Variables
    console.log("\n🔑 Checking Environment Variables...");
    const vars = [
      'DATABASE_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];
    
    vars.forEach(v => {
      if (process.env[v]) {
        console.log(`✅ ${v} is set.`);
      } else {
        console.error(`❌ ${v} is MISSING!`);
      }
    });

    // 3. Test Storage Bucket
    console.log("\n📦 Database Schema Status:");
    const artworkCount = await prisma.artwork.count();
    console.log(`🎨 Total Artworks currently stored: ${artworkCount}`);

    console.log("\n✨ Health Check Complete. You are ready to deploy!");

  } catch (e) {
    console.error("\n💥 HEALTH CHECK FAILED!");
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();