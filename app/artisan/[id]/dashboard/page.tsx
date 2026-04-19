export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import { deleteArtwork } from '@/app/actions/manageArt';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default async function ArtisanDashboard({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const artisanId = resolvedParams.id;

  const artisan = await prisma.user.findUnique({
    where: {
      id: artisanId, 
    },
    include: {
      artworks: {
        orderBy: {
          createdAt: "desc"
        },
        include: {
          orderItems: {
            include: {
              order: true // We include the parent order to check its status (PROCESSING/COMPLETED)
            }
          }
        }
      }
    }
  });

  if (!artisan) {
    return (
      <div className="min-h-screen p-20 bg-[#F9F7F2] font-serif italic text-2xl text-[#8C847C] flex justify-center items-center text-center">
        <p>Artisan Studio not found.</p>
      </div>
    );
  }

  // 1. Calculate Total Artworks
  const totalArtworks = artisan.artworks.length;
  
  // 2. Calculate Pieces Sold (How many individual items have been purchased)
  const piecesSold = artisan.artworks.reduce((total, art) => total + art.orderItems.length, 0);

  // 3. Calculate Total Revenue from actual order items
  const totalRevenue = artisan.artworks.reduce((sum, artwork) => {
    const artworkRevenue = artwork.orderItems.reduce((orderSum, item) => {
      // Include both COMPLETED and PROCESSING since new checkouts start as PROCESSING
      const isValidOrder = item.order.status === "COMPLETED" || item.order.status === "PROCESSING";
      return isValidOrder ? orderSum + item.price : orderSum;
    }, 0);
    return sum + artworkRevenue;
  }, 0);

  return (
    <main className="flex-1 p-10 md:p-16 bg-[#F9F7F2] min-h-screen font-sans text-[#4A443F]">
      
      {/* Header */}
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-serif text-[#2C2926] italic mb-4">Welcome back, {artisan.name || 'Artisan'}.</h1>
          <p className="text-sm text-[#8C847C] font-serif italic">Your studio status as of today.</p>
        </div>
        
        {/* Top Right Upload Button */}
        <Link href={`/artisan/${artisanId}/upload`} className="bg-[#1A1A1A] text-[#FAF9F6] px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black transition-colors shadow-sm whitespace-nowrap">
          + Add New Piece
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-[#FAF9F6] p-10 rounded-2xl shadow-sm border border-[#E5E1DA]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69F96] font-bold mb-4">Total Artworks</p>
          <h3 className="text-4xl font-serif text-[#2C2926]">{totalArtworks}</h3>
        </div>
        <div className="bg-[#FAF9F6] p-10 rounded-2xl shadow-sm border border-[#E5E1DA]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69F96] font-bold mb-4">Pieces Sold</p>
          <h3 className="text-4xl font-serif text-[#2C2926]">{piecesSold}</h3>
        </div>
        <div className="bg-[#FAF9F6] p-10 rounded-2xl shadow-sm border border-[#E5E1DA]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A69F96] font-bold mb-4">Total Revenue</p>
          <h3 className="text-4xl font-serif text-[#2C2926]">₹{totalRevenue.toLocaleString()}</h3>
        </div>
      </div>

      {/* Collection Section */}
      <div className="bg-[#FAF9F6] border border-[#E5E1DA] rounded-3xl p-16 text-center shadow-sm">
        {totalArtworks === 0 ? (
          <>
            <h2 className="text-2xl font-serif text-[#2C2926] italic mb-4">Your gallery space is empty.</h2>
            <Link href={`/artisan/${artisanId}/upload`} className="inline-block mt-8 bg-[#2C2926] text-[#FAF9F6] px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-black transition-colors">
              Upload First Piece
            </Link>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {artisan.artworks.map((art) => {
              // Determine if it has been bought
              const hasBeenSold = art.orderItems.length > 0;
              
              return (
                <div key={art.id} className="text-left group relative">
                  <div className="aspect-4/5 bg-[#F2EFE9] mb-4 overflow-hidden rounded-lg relative border border-[#E5E1DA]">
                    
                    {/* SOLD Tag Overlay */}
                    {hasBeenSold && (
                      <div className="absolute top-4 right-4 bg-[#2C2926] text-[#FAF9F6] text-[9px] uppercase tracking-widest px-3 py-1.5 font-bold z-10 shadow-md">
                        Sold {art.orderItems.length > 1 ? `(${art.orderItems.length})` : ''}
                      </div>
                    )}

                    {art.imageUrl && (
                      <img 
                        src={art.imageUrl} 
                        alt={art.title} 
                        className={`w-full h-full object-cover mix-multiply transition duration-700 group-hover:scale-105 ${hasBeenSold ? 'opacity-90 grayscale-15' : 'opacity-90 group-hover:opacity-100'}`} 
                      />
                    )}
                  </div>
                  
                  {/* Title, Price, and Actions */}
                  <div className="flex justify-between items-start mt-4 px-1">
                    <div>
                      <h4 className="font-serif text-xl text-[#2C2926] transition-colors">{art.title}</h4>
                      <p className="text-[11px] uppercase tracking-widest text-[#8C847C] mt-1">₹{art.price.toLocaleString()}</p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {/* EDIT BUTTON */}
                      <Link 
                        href={`/artisan/${artisanId}/edit/${art.id}`} 
                        className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#2C2926] border-b border-[#2C2926] hover:text-[#8C847C] hover:border-[#8C847C] transition-colors pb-0.5"
                      >
                        Edit
                      </Link>

                      {/* DELETE BUTTON (Only shows if never sold) */}
                      {!hasBeenSold && (
                        <form action={deleteArtwork}>
                          <input type="hidden" name="artworkId" value={art.id} />
                          <input type="hidden" name="artisanId" value={artisanId} />
                          <button 
                            type="submit" 
                            className="text-[9px] uppercase tracking-[0.2em] font-bold text-red-700 hover:text-red-500 transition-colors"
                          >
                            Delete
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}