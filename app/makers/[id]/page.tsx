import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

export default async function MakerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const makerId = resolvedParams.id;

  // Fetch the specific maker AND all their artworks
  const maker = await prisma.user.findUnique({
    where: { id: makerId },
    include: {
      artworks: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!maker) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex justify-center items-center font-serif italic text-2xl text-[#8C847C]">
        Maker not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F7F2] text-[#4A443F] py-20 px-10 md:px-20 font-sans">
      
      <div className="max-w-6xl mx-auto">
        <Link href="/makers" className="text-[10px] uppercase tracking-widest text-[#8C847C] hover:text-[#2C2926] transition-colors mb-16 inline-block">
          ← Back to Directory
        </Link>

        {/* Top Section: The Full Story */}
        <div className="flex flex-col md:flex-row gap-16 items-start mb-32">
          
          {/* Large Portrait */}
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-[#F2EFE9] border border-[#E5E1DA] shadow-sm flex-shrink-0">
            {maker.profileImage ? (
              <img src={maker.profileImage} alt={maker.name} className="w-full h-full object-cover mix-multiply" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[11px] uppercase tracking-widest text-[#8C847C]">No Image</div>
            )}
          </div>
          
          {/* Full Bio */}
          <div className="flex-1 pt-4">
            <h1 className="text-5xl md:text-7xl font-serif text-[#2C2926] mb-6">{maker.name}</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-8">
              {maker.artworks.length} {maker.artworks.length === 1 ? 'Piece' : 'Pieces'} in Studio
            </p>
            {/* whitespace-pre-wrap ensures paragraph breaks from the text area are respected! */}
            <div className="text-base text-[#4A443F] leading-loose whitespace-pre-wrap">
              {maker.bio}
            </div>
          </div>
        </div>

        {/* Bottom Section: Their Collection */}
        <div className="border-t border-[#E5E1DA] pt-20">
          <h2 className="text-3xl font-serif text-[#2C2926] italic mb-12 text-center">Works by {maker.name}</h2>
          
          {maker.artworks.length === 0 ? (
            <p className="text-center text-[#8C847C] font-serif italic">This maker hasn't published any pieces yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {maker.artworks.map((art) => (
                <Link href={`/collection/${art.id}`} key={art.id} className="text-left group cursor-pointer relative block">
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
                        className={`w-full h-full object-cover mix-multiply transition duration-700 group-hover:scale-105 ${art.isSold ? 'opacity-70 grayscale-[30%]' : ''}`} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8C847C] uppercase tracking-widest">No Image</div>
                    )}
                  </div>
                  <h4 className="font-serif text-xl text-[#2C2926] group-hover:text-[#8C847C] transition-colors">{art.title}</h4>
                  <p className="text-[11px] uppercase tracking-widest text-[#8C847C] mt-1 flex justify-between">
                    <span>₹{art.price.toLocaleString()}</span>
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}