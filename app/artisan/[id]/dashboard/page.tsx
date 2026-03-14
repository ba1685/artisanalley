export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Update the function to accept searchParams
export default async function ArtisanDashboard({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams; // Read the URL
  
  const artisanId = resolvedParams.id;
  const isNewUser = resolvedSearchParams.new === 'true'; // Check if it says ?new=true

  const artisan = await prisma.user.findUnique({
    where: { id: artisanId },
    include: {
      artworks: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!artisan) {
    return (
      <div className="p-20 bg-[#F9F7F2] font-serif min-h-screen text-[#4A443F]">
        Studio not found. Please check your credentials.
      </div>
    );
  }

  const totalArtworks = artisan.artworks.length;
  const totalRevenue = artisan.artworks.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <main className="flex-1 p-16 bg-[#F9F7F2] min-h-screen text-[#4A443F]">
      {/* Welcome Header */}
      <header className="mb-12 flex justify-between items-start">
        <div>
          {/* THE CONDITIONAL GREETING */}
          <h1 className="text-5xl font-serif text-[#2C2926] italic mb-4">
            {isNewUser ? 'Welcome,' : 'Welcome back,'} {artisan.name || 'Artisan'}.
          </h1>
          <p className="text-sm text-[#8C847C] font-serif italic">Your studio status as of today.</p>
        </div>
        
        {/* Quick Action Button */}
        <Link 
          href={`/artisan/${artisanId}/upload`}
          className="bg-[#1A1A1A] text-[#F9F7F2] px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#2C2926] transition-all shadow-sm"
        >
          + Add New Piece
        </Link>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#F2EFE9]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69F96] font-bold mb-4">Total Artworks</p>
          <h3 className="text-4xl font-serif text-[#2C2926]">{totalArtworks}</h3>
        </div>
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#F2EFE9]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69F96] font-bold mb-4">Gallery Views</p>
          <h3 className="text-4xl font-serif text-[#2C2926]">0</h3>
        </div>
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#F2EFE9]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69F96] font-bold mb-4">Total Revenue</p>
          <h3 className="text-4xl font-serif text-[#2C2926]">₹{totalRevenue.toLocaleString()}</h3>
        </div>
      </div>

      {/* Collection Gallery */}
      <div className="bg-white/50 border border-[#E5E1DA] rounded-[40px] p-16">
        {totalArtworks === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-serif italic mb-4">Your gallery space is ready.</h2>
            <p className="text-[#8C847C] mb-8">Start building your presence by showcasing your unique craft.</p>
            <Link href={`/artisan/${artisanId}/upload`} className="inline-block bg-[#1A1A1A] text-white px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-bold">
              Upload First Piece
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {artisan.artworks.map((art) => (
              <div key={art.id} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-[#F2EFE9] mb-6 overflow-hidden rounded-lg border border-[#E5E1DA] relative">
                  <img 
                    src={art.imageUrl || ''} 
                    alt={art.title} 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#2C2926]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-serif text-xl text-[#2C2926] mb-1">{art.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest text-[#8C847C]">{art.category}</span>
                  <span className="font-serif text-[#2C2926]">₹{art.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}