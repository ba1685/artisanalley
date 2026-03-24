import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ArtworkDetails({ params }: { params: { id: string } }) {
  const { id } = await params; 

  const artwork = await prisma.artwork.findUnique({
    where: { id: id },
    include: { author: true },
  });

  if (!artwork) notFound();

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A443F] py-20 px-6 md:px-20">
      <Link 
        href="/collection" 
        className="text-[10px] uppercase tracking-[0.2em] text-[#8C847C] hover:text-[#2C2926] transition-colors mb-10 inline-block font-bold"
      >
        ← Back to Collection
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left: Image Container */}
        <div className="bg-[#F2EFE9] aspect-[3/4] overflow-hidden shadow-sm border border-[#E5E1DA]">
          {artwork.imageUrl && (
            <img 
              src={artwork.imageUrl} 
              alt={artwork.title} 
              className="w-full h-full object-cover opacity-95 hover:scale-105 transition-transform duration-1000"
            />
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col space-y-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#8C847C] block mb-4 font-bold">
              {artwork.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif italic text-[#2C2926] leading-tight">
              {artwork.title}
            </h1>
            <p className="text-sm text-[#8C847C] mt-4 font-medium uppercase tracking-widest border-b border-[#E5E1DA] pb-6">
              Crafted by {artwork.author.name}
            </p>
            
            {/* --- ADDED DESCRIPTION HERE --- */}
            {artwork.description && (
              <div className="mt-8 text-sm md:text-[15px] leading-loose text-[#4A443F] font-serif opacity-90">
                {artwork.description}
              </div>
            )}
          </div>

          <div className="py-8 border-y border-[#E5E1DA]">
            <span className="text-3xl font-serif text-[#2C2926]">
              ₹{artwork.price.toLocaleString()}
            </span>
            <p className="text-[11px] text-[#A69F96] mt-2 leading-relaxed uppercase tracking-tighter">
              Price includes artisan craft tax and shipping within India.
            </p>
          </div>

          <div className="space-y-4">
            <Link href={`/checkout/${artwork.id}`} className="block w-full">
              <button className="w-full bg-[#2C2926] text-[#F9F7F2] py-5 text-[12px] uppercase tracking-[0.3em] font-bold hover:bg-[#4A443F] transition-all shadow-lg active:scale-[0.98]">
                Proceed to Purchase
              </button>
            </Link>
            
            <p className="text-center text-[10px] text-[#8C847C] italic">
              Every piece in the ArtisanAlley is one-of-a-kind.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}