"use client";

import React, { useState, useEffect } from 'react';
import AuthModal from '../../components/AuthModal'; 

export default function CollectionPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  // This state simulates if the user is logged in. Later, this will come from your Auth logic.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const categories = ["All Crafts", "Pottery & Clay", "Textiles & Weaves", "Carved Wood"];

  useEffect(() => {
    // Show modal on first load if not logged in
    if (!isLoggedIn) {
      setIsAuthOpen(true);
    }
  }, [isLoggedIn]);

  const handlePurchase = (productName: string) => {
    if (!isLoggedIn) {
      // If guest tries to buy, force the login modal
      setIsAuthOpen(true);
    } else {
      // Logic for adding to cart goes here
      alert(`${productName} added to cart!`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A443F]">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <main className="max-w-7xl mx-auto px-10 py-20 flex gap-20">
        
        {/* Sidebar */}
        <aside className="w-60 flex-shrink-0">
          <h3 className="uppercase tracking-[0.3em] text-[10px] font-bold mb-10 text-[#8C847C] border-b border-[#E5E1DA] pb-3">
            Category
          </h3>
          <ul className="space-y-6">
            {categories.map((cat) => (
              <li key={cat} className="cursor-pointer text-[13px] tracking-wide text-[#8C847C] hover:text-[#2C2926] pl-3 transition-colors">
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        {/* Collection Section */}
        <section className="flex-1">
          <div className="flex justify-between items-baseline mb-12">
            <h1 className="text-6xl font-serif text-[#2C2926] italic opacity-90">The Collection</h1>
            <span className="text-[10px] text-[#A69F96] uppercase tracking-[0.3em] font-medium">3 Items</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            
            {/* Product Card */}
            <div className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F2EFE9] mb-5 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1565191999001-551c187427bb?q=80&w=600" 
                  alt="Pottery" 
                  className="object-cover w-full h-full opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
                
                {/* Overlay Purchase Button - Only visible on hover */}
                <div className="absolute inset-0 bg-[#2C2926]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handlePurchase("Textured Clay Vase")}
                    className="bg-[#F9F7F2] text-[#2C2926] px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#2C2926] hover:text-white transition-colors"
                  >
                    Purchase Piece
                  </button>
                </div>

                <span className="absolute top-5 left-5 bg-[#F9F7F2]/90 backdrop-blur-sm px-3 py-1 text-[9px] uppercase tracking-widest font-bold text-[#4A443F]">
                  Handmade
                </span>
              </div>

              <div className="flex justify-between items-start px-1">
                <div>
                  <h4 className="font-serif text-xl text-[#2C2926]">Textured Clay Vase</h4>
                  <p className="text-[11px] text-[#8C847C] mt-1 uppercase tracking-wider italic">The Clay Studio</p>
                </div>
                <span className="font-serif text-lg text-[#2C2926]">₹1,250</span>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}