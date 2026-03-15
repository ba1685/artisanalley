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

      <main className="max-w-7xl mx-auto px-10 py-20 flex gap-20">
        
        {/* Sidebar - Beige Aesthetic */}
        <aside className="w-60 flex-shrink-0">
          <h3 className="uppercase tracking-[0.3em] text-[10px] font-bold mb-10 text-[#8C847C] border-b border-[#E5E1DA] pb-3">
            Category
          </h3>
          <ul className="space-y-6">
            {categories.map((cat) => (
              <li 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer text-[13px] tracking-wide transition-all duration-300 hover:translate-x-1 ${
                  activeCategory === cat 
                  ? "font-bold text-[#2C2926] border-l-2 border-[#2C2926] pl-3" 
                  : "text-[#8C847C] hover:text-[#2C2926] pl-3"
                }`}
              >
                {cat}
              </li>
            ))}
          </ul>
          
         
        </aside>

        {/* Collection Section */}
        <section className="flex-1">
          <div className="flex justify-between items-baseline mb-12">
            <h1 className="text-6xl font-serif text-[#2C2926] italic opacity-90">The Collection</h1>
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
                        className="object-cover w-full h-full mix-multiply opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                      />
                    )}
                    <span className="absolute top-5 left-5 bg-[#F9F7F2]/90 backdrop-blur-sm px-3 py-1 text-[9px] uppercase tracking-widest font-bold text-[#4A443F]">
                      Handmade
                    </span>
                  </div>
                  <div className="flex justify-between items-start px-1">
                    <div>
                      <h4 className="font-serif text-xl text-[#2C2926] group-hover:text-[#8C847C] transition-colors">{artwork.title}</h4>
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