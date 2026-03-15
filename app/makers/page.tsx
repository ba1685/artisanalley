import React from 'react';
import Link from 'next/link';

export default function MakersPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#4A443F] flex flex-col items-center justify-center p-10">
      
      {/* Simple Navigation Back */}
      <div className="absolute top-10 left-10 md:top-14 md:left-14">
        <Link href="/" className="text-[10px] uppercase tracking-widest text-[#8C847C] hover:text-[#2C2926] transition-colors border-b border-transparent hover:border-[#2C2926] pb-1">
          ← Back to Alley
        </Link>
      </div>

      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-serif text-[#2C2926] italic">The Makers</h1>
        
        <div className="w-12 h-[1px] bg-[#E5E1DA] mx-auto my-8"></div>
        
        <p className="text-base md:text-lg font-light leading-relaxed text-[#8C847C] italic">
          A curated directory of our master craftspeople is currently being assembled. Soon, you will be able to explore the studios, heritage, and stories behind every handmade piece.
        </p>
        
        <div className="pt-10">
          <Link 
            href="/collection" 
            className="inline-block bg-[#2C2926] text-[#FAF9F6] px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black transition-colors shadow-sm"
          >
            Explore the Collection
          </Link>
        </div>
      </div>

    </div>
  );
}