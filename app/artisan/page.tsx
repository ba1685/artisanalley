import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default async function ArtisanDashboard({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const artisanId = resolvedParams.id;

  const artisan = await prisma.user.findUnique({
    where: { id: artisanId },
    include: {
      artworks: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!artisan) return <div className="p-20 bg-[#F9F7F2]">Studio not found.</div>;

  // Calculate Real Stats
  const totalArtworks = artisan.artworks.length;
  const totalRevenue = artisan.artworks.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="flex min-h-screen bg-[#F9F7F2] font-sans text-[#4A443F]">
      {/* Sidebar - Matching your screenshot */}
      <aside className="w-64 border-r border-[#E5E1DA] p-8 flex flex-col justify-between">
        <div>
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-[#2C2926]">ArtisanAlley</h2>
            <p className="text-[9px] tracking-[0.2em] text-[#8C847C] uppercase font-bold mt-1">Creator Portal</p>
          </div>
          <nav className="space-y-6 text-[11px] uppercase tracking-widest font-semibold text-[#8C847C]">
            <Link href="#" className="block text-[#2C2926]">Overview</Link>
            <Link href="#" className="block hover:text-[#2C2926] transition-colors">My Collection</Link>
            <Link href={`/artisan/${artisanId}/upload`} className="block hover:text-[#2C2926] transition-colors">Upload Artwork</Link>
            <Link href="#" className="block hover:text-[#2C2926] transition-colors">Sales & Orders</Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-16">
        <header className="mb-12">
          <h1 className="text-5xl font-serif text-[#2C2926] italic mb-4">Welcome back, Artisan.</h1>
          <p className="text-sm text-[#8C847C] font-serif italic">Your gallery is currently flourishing.</p>
        </header>

        {/* Stats Cards - Now Dynamic */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#F2EFE9]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69F96] font-bold mb-4">Total Artworks</p>
            <h3 className="text-4xl font-serif text-[#2C2926]">{totalArtworks}</h3>
          </div>
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#F2EFE9]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69F96] font-bold mb-4">Gallery Views</p>
            <h3 className="text-4xl font-serif text-[#2C2926]">128</h3> {/* Static for now */}
          </div>
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#F2EFE9]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69F96] font-bold mb-4">Total Revenue</p>
            <h3 className="text-4xl font-serif text-[#2C2926]">₹{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        {/* Collection Section */}
        <div className="bg-white/50 border border-[#E5E1DA] rounded-[40px] p-16 text-center">
          {totalArtworks === 0 ? (
            <>
              <h2 className="text-2xl font-serif italic mb-4">Your gallery space is ready.</h2>
              <Link href={`/artisan/${artisanId}/upload`} className="inline-block mt-8 bg-[#1A1A1A] text-white px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-bold">
                Upload First Piece
              </Link>
            </>
          ) : (
            <div className="grid grid-cols-3 gap-10">
              {artisan.artworks.map((art) => (
                <div key={art.id} className="text-left group">
                  <div className="aspect-[4/5] bg-[#F2EFE9] mb-4 overflow-hidden rounded-lg">
                    <img src={art.imageUrl || ''} alt="" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <h4 className="font-serif text-lg">{art.title}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-[#8C847C]">₹{art.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}