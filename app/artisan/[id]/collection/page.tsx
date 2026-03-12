"use client";

import { useState, use } from "react";
import Link from "next/link";
// Make sure this path is correct based on where your data file is
import { products } from "@/lib/data"; 

export default function CollectionPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await the artisan ID
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [selectedCategory, setSelectedCategory] = useState<string>("All Crafts");

  // Filter logic: Currently filters by category from your global 'products'
  // In a real app, you would also filter by product.artisanId === id
  const filteredProducts = selectedCategory === "All Crafts" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] font-sans text-stone-800">
      
      {/* Navigation */}
      <nav className="flex w-full flex-col md:flex-row items-center justify-between px-6 md:px-10 py-6 md:py-8 bg-[#FAF9F6]/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200 gap-4 md:gap-0">
        <div className="flex items-center gap-4">
          <Link href={`/artisan/${id}/dashboard`} className="text-lg md:text-xl font-serif italic tracking-widest uppercase text-stone-900">
            ArtisanAlley
          </Link>
          <span className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase hidden sm:block">
            | My Gallery
          </span>
        </div>
        
        <div className="flex gap-4 md:gap-8 text-[10px] md:text-xs font-medium uppercase tracking-widest text-stone-500">
          <Link href={`/artisan/${id}/dashboard`} className="hover:text-stone-900 transition underline-offset-4 hover:underline">Dashboard</Link>
          <Link href={`/artisan/${id}/collection`} className="text-stone-900 transition underline-offset-4 underline">Collection</Link>
          <Link href={`/artisan/${id}/upload`} className="hover:text-stone-900 transition underline-offset-4 hover:underline">Upload</Link>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-12 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex flex-col gap-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-2 mb-4">
              Category
            </h2>
            <ul className="flex flex-col gap-3 text-sm text-stone-500">
              {["All Crafts", "Pottery & Clay", "Textiles & Weaves", "Carved Wood"].map((category) => (
                <li 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer transition hover:text-stone-900 ${selectedCategory === category ? "text-stone-900 font-bold" : ""}`}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-stone-100 rounded-lg">
            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Artisan ID</p>
            <p className="text-xs font-mono text-stone-600 truncate">{id}</p>
          </div>
        </aside>

        {/* Dynamic Product Grid */}
        <section className="flex-1">
          <div className="mb-8 flex justify-between items-end border-b border-stone-200 pb-4">
            <h1 className="text-3xl font-serif text-stone-900">{selectedCategory}</h1>
            <span className="text-xs text-stone-500 uppercase tracking-widest">
              Showing {filteredProducts.length} Items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative cursor-pointer flex flex-col gap-3">
                <div className="w-full aspect-[4/5] bg-stone-200 overflow-hidden relative rounded-md">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-[#FAF9F6] px-2 py-1 text-[9px] uppercase tracking-widest text-stone-800 shadow-sm">
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-stone-900 font-medium">{product.name}</h3>
                    <p className="text-stone-500 text-xs mt-1">By {product.artisanName}</p>
                  </div>
                  <span className="text-stone-900 text-sm">₹{product.price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-stone-200 rounded-xl">
              <p className="text-stone-400 italic">No pieces found in this category.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}