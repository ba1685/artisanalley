export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default async function ArtisanDashboard() {
  
  // Replace this with an email that actually exists in your database!
  const loggedInArtisanEmail = "test@artisanalley.com";

  const artisan = await prisma.user.findUnique({
    where: {
      email: loggedInArtisanEmail, 
    },
    include: {
      artworks: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!artisan) {
    return (
      <div className="min-h-screen p-20 bg-[#F9F7F2] font-serif italic text-2xl text-[#8C847C] flex flex-col justify-center items-center text-center">
        <p>Artisan Studio not found.</p>
        <p className="text-sm font-sans not-italic mt-4 text-[#A69F96]">
          Please ensure a user with the email <span className="font-bold">{loggedInArtisanEmail}</span> exists in your database.
        </p>
      </div>
    );
  }

  const totalArtworks = artisan.artworks.length;
  const totalRevenue = 0;

  return (
    <div className="flex min-h-screen bg-[#F9F7F2] font-sans text-[#4A443F]">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#E5E1DA] p-8 flex flex-col justify-between">
        <div>
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-[#2C2926]">ArtisanAlley</h2>
            <p className="text-[9px] tracking-[0.2em] text-[#8C847C] uppercase font-bold mt-1">Creator Portal</p>
          </div>
          <nav className="space-y-6 text-[11px] uppercase tracking-widest font-semibold text-[#8C847C]">
            <Link href="/artisan" className="block text-[#2C2926]">Overview</Link>
            <Link href="#" className="block hover:text-[#2C2926] transition-colors">My Collection</Link>
            <Link href="/artisan/upload" className="block hover:text-[#2C2926] transition-colors">Upload Artwork</Link>
            {/* Settings link completely removed */}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-16">
        <header className="mb-12">
          <h1 className="text-5xl font-serif text-[#2C2926] italic mb-4">Welcome back, Artisan.</h1>
          <p className="text-sm text-[#8C847C] font-serif italic">Your gallery is currently flourishing.</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          <div className="bg-[#FAF9F6] p-10 rounded-sm shadow-sm border border-[#E5E1DA]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69F96] font-bold mb-4">Total Artworks</p>
            <h3 className="text-4xl font-serif text-[#2C2926]">{totalArtworks}</h3>
          </div>
          <div className="bg-[#FAF9F6] p-10 rounded-sm shadow-sm border border-[#E5E1DA]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69F96] font-bold mb-4">Gallery Views</p>
            <h3 className="text-4xl font-serif text-[#2C2926]">128</h3>
          </div>
          <div className="bg-[#FAF9F6] p-10 rounded-sm shadow-sm border border-[#E5E1DA]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69F96] font-bold mb-4">Total Revenue</p>
            <h3 className="text-4xl font-serif text-[#2C2926]">₹{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        {/* Collection Section */}
        <div className="bg-[#FAF9F6] border border-[#E5E1DA] rounded-sm p-16 text-center shadow-sm">
          {totalArtworks === 0 ? (
            <>
              <h2 className="text-2xl font-serif text-[#2C2926] italic mb-4">Your gallery space is ready.</h2>
              <Link href="/artisan/upload" className="inline-block mt-8 bg-[#2C2926] text-[#FAF9F6] px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-black transition-colors">
                Upload First Piece
              </Link>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {artisan.artworks.map((art) => (
                <div key={art.id} className="text-left group cursor-pointer">
                  <div className="aspect-[4/5] bg-[#F2EFE9] mb-4 overflow-hidden rounded-sm relative">
                    {art.imageUrl && (
                      <img 
                        src={art.imageUrl} 
                        alt={art.title} 
                        className="w-full h-full object-cover mix-multiply opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100" 
                      />
                    )}
                  </div>
                  <h4 className="font-serif text-xl text-[#2C2926] group-hover:text-[#8C847C] transition-colors">{art.title}</h4>
                  <p className="text-[11px] uppercase tracking-widest text-[#8C847C] mt-1">₹{art.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}