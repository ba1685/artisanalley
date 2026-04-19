export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

export default async function MakersPage() {
  // Fetch all users who are Artisans (or have filled out their bio)
  const makers = await prisma.user.findMany({
    where: {
      // We only want to show people who have actually set up their profile
      NOT: { bio: null } 
    },
    include: {
      artworks: true // Include this so we can count how many pieces they have
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <main className="min-h-screen bg-[#F9F7F2] text-[#4A443F] py-20 px-10 md:px-20 font-sans">
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-24">
        <Link href="/" className="text-[10px] uppercase tracking-widest text-[#8C847C] hover:text-[#2C2926] transition-colors mb-8 inline-block">
          ← Back to Alley
        </Link>
        <h1 className="text-6xl font-serif text-[#2C2926] italic mb-6">The Makers</h1>
        <div className="w-16 h-px bg-[#E5E1DA] mx-auto mb-6"></div>
        <p className="text-sm text-[#8C847C] leading-relaxed max-w-2xl mx-auto italic font-serif">
          Explore the studios, heritage, and stories behind every handmade piece. Meet the master craftspeople of ArtisanAlley.
        </p>
      </div>

      {/* The Directory Grid */}
      <div className="max-w-7xl mx-auto">
        {makers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-[#8C847C] font-serif italic mb-6">Our directory is currently being assembled.</p>
            <Link href="/collection" className="bg-[#2C2926] text-[#FAF9F6] px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-[#4A443F] transition-colors">
              Explore the Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {makers.map((maker) => (
              <div key={maker.id} className="group flex flex-col items-center text-center">
                
                {/* Profile Portrait */}
                <div className="w-48 h-48 rounded-full mb-8 overflow-hidden bg-[#F2EFE9] border border-[#E5E1DA] shadow-sm relative">
                  {maker.profileImage ? (
                    <img 
                      src={maker.profileImage} 
                      alt={maker.name} 
                      className="w-full h-full object-cover mix-multiply transition duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-[#8C847C]">
                      No Image
                    </div>
                  )}
                </div>

                {/* Maker Info */}
                <h2 className="text-3xl font-serif text-[#2C2926] mb-2">{maker.name}</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-6">
                  {maker.artworks.length} {maker.artworks.length === 1 ? 'Piece' : 'Pieces'} in Gallery
                </p>
                
                {/* FIXED: Removed the duplicate bio paragraph */}
                <p className="text-sm text-[#4A443F] leading-relaxed mb-8 line-clamp-4 px-4">
                  {maker.bio}
                </p>

                {/* THE NEW ACTIVE LINK */}
                <Link 
                  href={`/makers/${maker.id}`} 
                  className="mt-auto border-b border-[#2C2926] text-[10px] uppercase tracking-widest font-bold text-[#2C2926] pb-1 hover:text-[#8C847C] hover:border-[#8C847C] transition-colors"
                >
                  Read Full Story
                </Link>

              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}