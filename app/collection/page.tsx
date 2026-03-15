"use client";

import React, { useState, useEffect } from 'react';
import AuthModal from '../../components/AuthModal'; 
import { getCollectionArtworks } from '../actions/collection';

type Artwork = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  category: string;
  author: { name: string };
};

export default function CollectionPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Crafts");
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["All Crafts", "Pottery & Clay", "Textiles & Weaves", "Carved Wood"];

  useEffect(() => {
    async function loadData() {
      const data = await getCollectionArtworks();
      setArtworks(data as Artwork[]);
      setIsLoading(false);
    }
    loadData();
    // Logic for auth modal can be placed here if needed
  }, []);

  const filteredArtworks = activeCategory === "All Crafts" 
    ? artworks 
    : artworks.filter(art => art.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A443F]">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* 1. FLEX-COL for mobile, FLEX-ROW for desktop */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-20 flex flex-col md:flex-row gap-10 md:gap-20">
        
        {/* Sidebar - Adjusts for mobile */}
        <aside className="w-full md:w-60 flex-shrink-0">
          <h3 className="uppercase tracking-[0.3em] text-[10px] font-bold mb-6 md:mb-10 text-[#8C847C] border-b border-[#E5E1DA] pb-3 text-center md:text-left">
            Category
          </h3>
          
          {/* Horizontal scroll for categories on mobile, vertical list on desktop */}
          <ul className="flex flex-row md:flex-col gap-6 md:gap-0 md:space-y-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <li 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer text-[12px] md:text-[13px] tracking-wide transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat 
                  ? "font-bold text-[#2C2926] border-b-2 md:border-b-0 md:border-l-2 border-[#2C2926] pb-1 md:pb-0 md:pl-3" 
                  : "text-[#8C847C] hover:text-[#2C2926] pb-1 md:pb-0 md:pl-3"
                }`}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        {/* Collection Section */}
        <section className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-baseline mb-12 gap-4">
            <h1 className="text-4xl md:text-6xl font-serif text-[#2C2926] italic opacity-90">The Collection</h1>
            <span className="text-[10px] text-[#A69F96] uppercase tracking-[0.3em] font-medium">
              {filteredArtworks.length} {filteredArtworks.length === 1 ? 'Piece' : 'Pieces'}
            </span>
          </div>

          {isLoading ? (
            <div className="text-[#8C847C] text-sm uppercase tracking-widest animate-pulse text-center md:text-left">
              Curating gallery...
            </div>
          ) : (
            /* 2. Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredArtworks.map((artwork) => (
                <div key={artwork.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#F2EFE9] mb-5 shadow-sm">
                    {artwork.imageUrl && (
                      <img 
                        src={artwork.imageUrl} 
                        alt={artwork.title} 
                        className="object-cover w-full h-full mix-multiply opacity-90 transition duration-700 md:group-hover:scale-105"
                      />
                    )}
                    <span className="absolute top-4 right-4 bg-[#F9F7F2]/90 backdrop-blur-sm px-2 py-1 text-[8px] uppercase tracking-widest font-bold text-[#4A443F]">
                      Handmade
                    </span>
                  </div>
                  <div className="flex justify-between items-start px-1">
                    <div>
                      <h4 className="font-serif text-lg md:text-xl text-[#2C2926] transition-colors">{artwork.title}</h4>
                      <p className="text-[10px] md:text-[11px] text-[#8C847C] mt-1 uppercase tracking-wider">{artwork.author.name}</p>
                    </div>
                    <span className="font-serif text-base md:text-lg text-[#2C2926]">₹{artwork.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredArtworks.length === 0 && !isLoading && (
            <div className="text-center py-20 text-[#8C847C] text-sm italic border border-dashed border-[#E5E1DA]">
              No pieces found in this category yet.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}