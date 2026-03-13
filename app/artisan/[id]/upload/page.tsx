"use client";

import { useState, use } from "react"; // Added 'use' to handle params
import Link from "next/link";

export default function UploadArtworkPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await the params to get the artisan ID
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Ready to save for artisan:", id, { title, description, price });
    // Next step: Create a Server Action to save this to Supabase!
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] font-sans text-stone-800">
      
      {/* Top Navigation Bar */}
      <nav className="flex w-full items-center justify-between px-6 md:px-10 py-6 border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-serif italic tracking-widest uppercase text-stone-900">ArtisanAlley</h1>
          <span className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase hidden sm:block">
            | Creator Studio
          </span>
        </div>
        <Link href={`/artisan/${id}/dashboard`} className="text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors underline-offset-4 hover:underline">
          ← Back to Dashboard
        </Link>
      </nav>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 md:px-10 py-12">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
            New Listing
          </span>
          <h2 className="text-4xl font-serif italic text-stone-900 mt-2">
            Showcase your craft.
          </h2>
          <p className="text-stone-500 mt-4 text-base font-light leading-relaxed italic">
            Add the details of your latest handmade piece to share it with the world.
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 border border-stone-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Artwork Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-sm border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors"
                placeholder="e.g., Hand-Thrown Ceramic Vase"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">The Story (Description)</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-sm border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors resize-none"
                placeholder="Share the inspiration and materials behind this piece..."
              />
            </div>

            {/* Price & Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Price (INR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min="100"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="block w-full rounded-sm border border-stone-200 bg-stone-50 pl-8 pr-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Placeholder for actual image upload feature */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">High-Res Image</label>
                <div className="mt-1 flex justify-center rounded-sm border border-dashed border-stone-300 px-6 py-8 hover:border-stone-900 hover:bg-stone-50 transition-colors cursor-pointer">
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      Click to upload
                    </span>
                    <p className="text-xs text-stone-400 mt-2 font-light">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-stone-100">
              <button
                type="submit"
                className="w-full flex items-center justify-center h-14 bg-stone-900 text-[#FAF9F6] text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900"
              >
                Publish to Storefront
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}