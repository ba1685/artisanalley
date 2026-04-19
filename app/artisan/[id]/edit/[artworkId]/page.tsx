export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { updateArtwork } from '@/app/actions/manageArt';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// NEXT.JS LOOKS FOR THIS EXACT LINE: "export default"
export default async function EditArtworkPage({ 
  params 
}: { 
  params: Promise<{ id: string, artworkId: string }> 
}) {
  const resolvedParams = await params;
  const artisanId = resolvedParams.id;
  const artworkId = resolvedParams.artworkId;

  // Get the current details to pre-fill the form
  const artwork = await prisma.artwork.findUnique({
    where: { id: artworkId }
  });

  if (!artwork) {
    return <div className="p-20 text-center font-serif text-2xl text-[#8C847C]">Artwork not found.</div>;
  }

  return (
    <main className="min-h-screen bg-[#F9F7F2] py-20 px-6 font-sans text-[#4A443F] flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white p-12 md:p-16 rounded-sm border border-[#E5E1DA] shadow-sm">
        
        <div className="mb-10">
          <Link href={`/artisan/${artisanId}/dashboard`} className="text-[10px] uppercase tracking-widest text-[#8C847C] hover:text-[#2C2926] transition-colors mb-6 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-serif text-[#2C2926] italic mb-2">Edit Artwork</h1>
          <p className="text-[11px] uppercase tracking-widest text-[#8C847C] font-bold">Update the details of your piece</p>
        </div>

        <form action={updateArtwork} className="space-y-8">
          <input type="hidden" name="artworkId" value={artwork.id} />
          <input type="hidden" name="artisanId" value={artisanId} />

          {/* Title */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C847C] mb-2">Title</label>
            <input 
              type="text" 
              name="title" 
              defaultValue={artwork.title}
              required
              className="w-full bg-[#F9F7F2] border border-[#E5E1DA] px-4 py-3 text-[#2C2926] focus:outline-none focus:border-[#2C2926] transition-colors font-serif text-lg"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C847C] mb-2">Price (₹)</label>
            <input 
              type="number" 
              name="price" 
              defaultValue={artwork.price}
              required
              min="0"
              className="w-full bg-[#F9F7F2] border border-[#E5E1DA] px-4 py-3 text-[#2C2926] focus:outline-none focus:border-[#2C2926] transition-colors font-serif text-lg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C847C] mb-2">Description</label>
            <textarea 
              name="description" 
              defaultValue={artwork.description || ""}
              rows={5}
              className="w-full bg-[#F9F7F2] border border-[#E5E1DA] px-4 py-3 text-[#2C2926] focus:outline-none focus:border-[#2C2926] transition-colors resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-[#2C2926] text-[#FAF9F6] py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-black transition-colors shadow-sm mt-4"
          >
            Save Changes
          </button>
        </form>

      </div>
    </main>
  );
}