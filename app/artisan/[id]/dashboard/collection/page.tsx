import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

export default async function MyCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const artisanId = resolvedParams.id;

  const artworks = await prisma.artwork.findMany({
    where: { artisanId: artisanId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="p-10 md:p-16 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-serif text-[#2C2926] italic mb-2">My Collection</h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C847C] font-bold">Manage your gallery pieces</p>
        </div>
        <Link 
          href={`/artisan/${artisanId}/dashboard/upload`} 
          className="bg-[#2C2926] text-[#FAF9F6] px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#4A443F] transition-colors shadow-sm"
        >
          + Add Masterpiece
        </Link>
      </div>

      <div className="bg-[#FAF9F6] border border-[#E5E1DA] rounded-3xl p-10 shadow-sm min-h-[500px]">
        {artworks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20">
            <p className="text-lg text-[#8C847C] font-serif italic mb-6">Your gallery is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {artworks.map((art) => (
              <div key={art.id} className="text-left group cursor-pointer relative">
                <div className="aspect-[4/5] bg-[#F2EFE9] mb-4 overflow-hidden rounded-lg relative border border-[#E5E1DA]">
                  
                  {art.isSold && (
                    <div className="absolute top-4 right-4 bg-[#2C2926] text-[#FAF9F6] text-[9px] uppercase tracking-widest px-3 py-1.5 font-bold z-10 shadow-md">
                      Sold
                    </div>
                  )}

                  {art.imageUrl ? (
                    <img 
                      src={art.imageUrl} 
                      alt={art.title} 
                      className={`w-full h-full object-cover mix-multiply transition duration-700 group-hover:scale-105 ${art.isSold ? 'opacity-70 grayscale-[30%]' : 'opacity-90 group-hover:opacity-100'}`} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8C847C] uppercase tracking-widest">No Image</div>
                  )}
                </div>
                <h4 className="font-serif text-xl text-[#2C2926] group-hover:text-[#8C847C] transition-colors">{art.title}</h4>
                <p className="text-[11px] uppercase tracking-widest text-[#8C847C] mt-1 flex justify-between">
                  <span>₹{art.price.toLocaleString()}</span>
                  <span className="truncate ml-2">{art.category}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}