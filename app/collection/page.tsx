"use client";

import React, { useState, useEffect } from 'react';
import AuthModal from '../../components/AuthModal'; 
import { getCollectionArtworks } from '../actions/collection';

// Define the type based on our Prisma schema
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

  // Fetch the data when the page loads
  useEffect(() => {
    async function loadData() {
      const data = await getCollectionArtworks();
      setArtworks(data as Artwork[]);
      setIsLoading(false);
    }
    loadData();
    setIsAuthOpen(true); // Open auth modal for guests
  }, []);

  // Filter logic for the sidebar
  const filteredArtworks = activeCategory === "All Crafts" 
    ? artworks 
    : artworks.filter(art => art.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A443F]">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Changed to flex-col for mobile, md:flex-row for desktop. Adjusted padding/gaps. */}
      <main className="max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-20 flex flex-col md:flex-row gap-10 md:gap-20">
        
        {/* Sidebar - Changed w-60 to w-full on mobile, md:w-60 on desktop */}
        <aside className="w-full md:w-60 flex-shrink-0">
          <h3 className="uppercase tracking-[0.3em] text-[10px] font-bold mb-5 md:mb-10 text-[#8C847C] border-b border-[#E5E1DA] pb-3">
            Category
          </h3>
          
          {/* Made the category list scrollable horizontally on mobile to save vertical space */}
          <ul className="flex flex-row md:flex-col gap-5 md:gap-0 md:space-y-6 overflow-x-auto pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat) => (
              <li 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer text-[13px] tracking-wide transition-all duration-300 whitespace-nowrap md:hover:translate-x-1 ${
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-8 md:mb-12 gap-2 md:gap-0">
            {/* Adjusted heading size for smaller screens */}
            <h1 className="text-4xl md:text-6xl font-serif text-[#2C2926] italic opacity-90">The Collection</h1>
            <span className="text-[10px] text-[#A69F96] uppercase tracking-[0.3em] font-medium">
              {filteredArtworks.length} {filteredArtworks.length === 1 ? 'Piece' : 'Pieces'}
            </span>
          </div>

          {isLoading ? (
            <div className="text-[#8C847C] text-sm uppercase tracking-widest animate-pulse">
              Curating gallery...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              
              {/* Dynamic Product Cards */}
              {filteredArtworks.map((artwork) => (
                <div key={artwork.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#F2EFE9] mb-5 shadow-sm transition-shadow hover:shadow-md">
                    {artwork.imageUrl && (
                      <img 
                        src={artwork.imageUrl} 
                        alt={artwork.title} 
                        className="object-cover w-full h-full mix-multiply opacity-90 transition duration-700 md:group-hover:scale-105 md:group-hover:opacity-100"
                      />
                    )}
                    <span className="absolute top-5 right-5 bg-[#F9F7F2]/90 backdrop-blur-sm px-3 py-1 text-[9px] uppercase tracking-widest font-bold text-[#4A443F]">
                      Handmade
                    </span>
                  </div>
                  <div className="flex justify-between items-start px-1">
                    <div>
                      <h4 className="font-serif text-xl text-[#2C2926] md:group-hover:text-[#8C847C] transition-colors">{artwork.title}</h4>
                      <p className="text-[11px] text-[#8C847C] mt-1 uppercase tracking-wider">{artwork.author.name}</p>
                    </div>
                    <span className="font-serif text-lg text-[#2C2926]">₹{artwork.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}

              {/* Show message if category is empty */}
              {filteredArtworks.length === 0 && (
                <div className="col-span-full text-[#8C847C] text-sm italic">
                  No pieces found in this category yet.
                </div>
              )}

            </div>
          )}
        </section>
      </main>
    </div>
  );
}