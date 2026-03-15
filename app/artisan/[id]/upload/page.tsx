"use client";

export const maxDuration = 60; 
import React, { useState, use } from 'react';
// We use useFormStatus to handle the button state inside a sub-component
import { useFormStatus } from 'react-dom';
import { submitArtwork } from '@/app/actions/upload';

// 1. Create a dedicated Button component to use useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`w-full py-5 text-[11px] uppercase tracking-[0.3em] font-bold transition-all duration-300 shadow-md mt-4 ${
        pending 
          ? "bg-[#8C847C] cursor-not-allowed text-[#F2EFE9]" 
          : "bg-[#4A443F] text-[#F9F7F2] hover:bg-[#2C2926] hover:shadow-lg"
      }`}
    >
      {pending ? "Publishing to Gallery..." : "Publish to Collection"}
    </button>
  );
}

export default function ArtisanUploadPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const artisanId = resolvedParams.id;
  const [fileName, setFileName] = useState<string | null>(null);

  const categories = ["Pottery & Clay", "Textiles & Weaves", "Carved Wood"];

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A443F] py-20 px-10">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-12 border-b border-[#E5E1DA] pb-6">
          <h1 className="text-5xl font-serif text-[#2C2926] italic mb-3">Add to Studio</h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C847C] font-semibold">
            Upload a new handcrafted piece to your collection
          </p>
        </div>

        {/* Note: Ensure submitArtwork is a 'use server' function in your actions file */}
        <form action={submitArtwork} className="space-y-8 bg-[#F2EFE9] p-10 shadow-sm border border-[#E5E1DA]">
          <input type="hidden" name="artisanId" value={artisanId} />

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-3">Piece Title</label>
            <input type="text" name="title" required className="w-full p-4 bg-[#F9F7F2] border border-[#E5E1DA] text-[13px] outline-none focus:border-[#8C847C] transition-colors text-[#2C2926] font-serif" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-3">Price (₹)</label>
              <input type="number" name="price" required className="w-full p-4 bg-[#F9F7F2] border border-[#E5E1DA] text-[13px] outline-none focus:border-[#8C847C] transition-colors text-[#2C2926] font-serif" />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-3">Category</label>
              <select name="category" required className="w-full p-4 bg-[#F9F7F2] border border-[#E5E1DA] text-[13px] outline-none focus:border-[#8C847C] transition-colors text-[#2C2926] font-serif">
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-3">Upload Photography</label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed cursor-pointer transition-colors ${fileName ? 'border-[#8C847C] bg-[#E5E1DA]' : 'border-[#E5E1DA] bg-[#F9F7F2]'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="text-[11px] text-[#8C847C] tracking-widest uppercase">
                    {fileName ? fileName : "Click to upload image"}
                  </p>
                </div>
                <input id="dropzone-file" type="file" name="image" accept="image/*" required className="hidden" onChange={(e) => e.target.files && setFileName(e.target.files[0].name)} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-3">Story / Description</label>
            <textarea name="description" rows={4} className="w-full p-4 bg-[#F9F7F2] border border-[#E5E1DA] text-[13px] outline-none focus:border-[#8C847C] transition-colors text-[#2C2926] font-serif resize-none"></textarea>
          </div>

          {/* Use the new sub-component here */}
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}