import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.artwork.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating Artisans...');
  
  // Create an Artisan for Pottery
  const clayStudio = await prisma.user.create({
    data: {
      name: 'The Clay Studio',
      email: 'clay@artisanalley.com',
      password: 'hashed_password_placeholder', // We don't need real passwords for seed data
      role: Role.ARTISAN,
    },
  });

  // Create an Artisan for Textiles
  const loomRoom = await prisma.user.create({
    data: {
      name: 'The Loom Room',
      email: 'loom@artisanalley.com',
      password: 'hashed_password_placeholder',
      role: Role.ARTISAN,
    },
  });

  console.log('Adding Aesthetic Collection Pieces...');

  await prisma.artwork.createMany({
    data: [
      {
        title: 'Textured Clay Vase',
        description: 'A beautifully handcrafted minimalist vase.',
        price: 1250,
        category: 'Pottery & Clay',
        imageUrl: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?q=80&w=600',
        artisanId: clayStudio.id,
      },
      {
        title: 'Raw Silk Runner',
        description: 'Hand-woven raw silk table runner in natural beige.',
        price: 3400,
        category: 'Textiles & Weaves',
        imageUrl: 'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?q=80&w=600',
        artisanId: loomRoom.id,
      },
      {
        title: 'Carved Oak Bowl',
        description: 'Sustainable carved oak wood bowl with natural grain.',
        price: 2100,
        category: 'Carved Wood',
        imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600',
        artisanId: clayStudio.id, 
      }
    ],
  });

  console.log('Database successfully seeded with aesthetic products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });