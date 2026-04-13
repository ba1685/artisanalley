export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

export default async function HomePage() {
  // Fetch dynamic data (keeping from previous step)
  const recentArtworks = await prisma.artwork.findMany({ take: 4, orderBy: { createdAt: 'desc' } });
  const featuredMaker = await prisma.user.findFirst({ where: { bio: { not: null }, profileImage: { not: null } }, include: { artworks: { take: 3, orderBy: { createdAt: 'desc' } } } });

  // In a real project, you would place 'texture.webp' in your /public folder.
  // For this exercise, I'm using a placeholder URL representing that texture.
  const textureUrl = '/images/bg.jpg';

  return (
    <main className="min-h-screen bg-[#F9F7F2] text-[#4A443F] font-sans overflow-hidden relative">
      
      {/* --- RESTORED NAVIGATION BAR (Kept from previous) --- */}
      <nav className="absolute top-0 w-full flex flex-col sm:flex-row justify-between items-center p-10 md:px-20 z-50 gap-6 sm:gap-0">
        <Link href="/" className="font-serif text-2xl tracking-[0.1em] text-[#2C2926] italic">
          ARTISANALLEY
        </Link>
        <div className="flex gap-8 md:gap-12 text-[12px] uppercase tracking-[0.2em] font-bold text-[#8C847C]">
          <Link href="/collection" className="hover:text-[#2C2926] transition-colors">Collection</Link>
          <Link href="/makers" className="hover:text-[#2C2926] transition-colors">The Makers</Link>
          <Link href="/story" className="hover:text-[#2C2926] transition-colors">Story</Link>
        </div>
      </nav>
      {/* THE NEW LOCAL IMAGE BACKGROUND */}
        
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 overflow-hidden">
        
      
        <div 
          className="absolute inset-0 z-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage: `url(${textureUrl})`,
            backgroundSize: 'cover',   
            backgroundPosition: 'center',
            mixBlendMode: 'multiply', 
          }}
        />

        {/* The subtle fade to blend into the beige section below */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#F9F7F2]" />

        {/* HERO CONTENT */}
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8C847C] font-bold mb-8 animate-in fade-in slide-in-from-top-4 duration-700">NHITM Comp-A Group 2</p>
          <h1 className="text-6xl md:text-8xl font-serif text-[#2C2926] mb-8 leading-tight animate-in fade-in slide-in-from-top-6 duration-1000 delay-100">
            The beauty of the <br/><span className="italic">handmade object.</span>
          </h1>
          <p className="text-sm text-[#8C847C] leading-relaxed max-w-lg mx-auto italic font-serif mb-12 animate-in fade-in slide-in-from-top-8 duration-1000 delay-300">
            A curated marketplace connecting local master artisans with those who appreciate the soul behind the craft and the stories they tell.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500">
            <Link href="/collection" className="bg-[#2C2926] text-[#FAF9F6] px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#4A443F] transition-colors shadow-sm">
              Shop the Collection
            </Link>
            <Link href="/artisan-join" className="bg-transparent border border-[#2C2926] text-[#2C2926] px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#2C2926] hover:text-[#FAF9F6] transition-colors">
              Join as Artisan
            </Link>
          </div>

          
        </div>
      </section>
      {/* --- VALUES BANNER --- */}
      {/* Updated background color to perfectly match the beige aesthetic */}
      <section className="bg-[#F2EFE9] border-y border-[#E5E1DA] py-20 px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="font-serif text-2xl text-[#2C2926] italic mb-4">Sustainable</h3>
            <p className="text-[11px] text-[#8C847C] uppercase tracking-widest leading-relaxed">Ethically sourced materials from local vendors.</p>
          </div>
          <div>
            <h3 className="font-serif text-2xl text-[#2C2926] italic mb-4">Authentic</h3>
            <p className="text-[11px] text-[#8C847C] uppercase tracking-widest leading-relaxed">Directly supporting the households of the makers.</p>
          </div>
          <div>
            <h3 className="font-serif text-2xl text-[#2C2926] italic mb-4">Timeless</h3>
            <p className="text-[11px] text-[#8C847C] uppercase tracking-widest leading-relaxed">Designs meant to last a lifetime, not a season.</p>
          </div>
        </div>
      </section>

      {/* --- NEW ARRIVALS GALLERY --- */}
      {recentArtworks.length > 0 && (
        <section className="py-32 px-10 md:px-20 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 border-b border-[#E5E1DA] pb-6">
            <h2 className="text-4xl font-serif text-[#2C2926] italic">Recently Added</h2>
            <Link href="/collection" className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C847C] hover:text-[#2C2926] transition-colors hidden sm:block">
              View All Pieces →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentArtworks.map((art) => (
              <Link href={`/collection/${art.id}`} key={art.id} className="group cursor-pointer block">
                <div className="aspect-[4/5] bg-[#F2EFE9] mb-6 overflow-hidden rounded-lg relative border border-[#E5E1DA]">
                  
                  {art.imageUrl ? (
                    <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover mix-multiply transition duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8C847C] uppercase tracking-widest">No Image</div>
                  )}
                </div>
                <h4 className="font-serif text-lg text-[#2C2926] group-hover:text-[#8C847C] transition-colors truncate">{art.title}</h4>
                <p className="text-[11px] uppercase tracking-widest text-[#8C847C] mt-2">₹{art.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center sm:hidden">
             <Link href="/collection" className="border-b border-[#2C2926] text-[10px] uppercase tracking-widest font-bold text-[#2C2926] pb-1">Explore Full Gallery</Link>
          </div>
        </section>
      )}

      {/* --- FEATURED MAKER SPOTLIGHT --- */}
      {featuredMaker && (
        <section className="bg-[#FAF9F6] py-32 px-10 md:px-20 border-t border-[#E5E1DA]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden bg-[#F2EFE9] border border-[#E5E1DA] shadow-sm flex-shrink-0">
              <img src={featuredMaker.profileImage!} alt={featuredMaker.name} className="w-full h-full object-cover mix-multiply" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-4">Artisan Spotlight</p>
              <h2 className="text-5xl font-serif text-[#2C2926] italic mb-6">{featuredMaker.name}</h2>
              <p className="text-sm text-[#4A443F] leading-relaxed mb-10 line-clamp-4 md:line-clamp-none font-serif">
                {featuredMaker.bio}
              </p>
              <Link href={`/makers/${featuredMaker.id}`} className="bg-[#2C2926] text-[#FAF9F6] px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#4A443F] transition-colors shadow-sm inline-block">
                Visit Their Studio
              </Link>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}