import React from 'react';
import { submitArtwork } from '@/app/actions/upload'; // Adjust path if needed: '../../../actions/upload'

// In Next.js App Router, dynamic params are passed as props to the page
export default async function ArtisanUploadPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params to get the Artisan's ID from the URL
  const resolvedParams = await params;
  const artisanId = resolvedParams.id;

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

        {/* Upload Form */}
        <form action={submitArtwork} className="space-y-8 bg-[#F2EFE9] p-10 shadow-sm border border-[#E5E1DA]">
          
          {/* Hidden input to securely pass the Artisan's ID to the server */}
          <input type="hidden" name="artisanId" value={artisanId} />

          {/* Title */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-3">Piece Title</label>
            <input 
              type="text" 
              name="title"
              required
              placeholder="e.g. Hand-thrown Ceramic Mug" 
              className="w-full p-4 bg-[#F9F7F2] border border-[#E5E1DA] text-[13px] outline-none focus:border-[#8C847C] transition-colors placeholder-[#B5B0AA] text-[#2C2926] font-serif"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-3">Price (₹)</label>
              <input 
                type="number" 
                name="price"
                required
                min="0"
                placeholder="1500" 
                className="w-full p-4 bg-[#F9F7F2] border border-[#E5E1DA] text-[13px] outline-none focus:border-[#8C847C] transition-colors placeholder-[#B5B0AA] text-[#2C2926] font-serif"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-3">Category</label>
              <select 
                name="category"
                required
                className="w-full p-4 bg-[#F9F7F2] border border-[#E5E1DA] text-[13px] outline-none focus:border-[#8C847C] transition-colors text-[#2C2926] font-serif"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-3">
              Upload Photography
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-[#E5E1DA] border-dashed cursor-pointer bg-[#F9F7F2] hover:bg-[#F2EFE9] transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-[11px] text-[#8C847C] tracking-widest uppercase">
                    <span className="font-bold text-[#2C2926]">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-[10px] text-[#B5B0AA] italic">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input 
                  id="dropzone-file" 
                  type="file" 
                  name="image" 
                  accept="image/*" 
                  required 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-3">Story / Description</label>
            <textarea 
              name="description"
              rows={4}
              placeholder="Tell the story behind this piece..." 
              className="w-full p-4 bg-[#F9F7F2] border border-[#E5E1DA] text-[13px] outline-none focus:border-[#8C847C] transition-colors placeholder-[#B5B0AA] text-[#2C2926] font-serif resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full py-5 bg-[#4A443F] text-[#F9F7F2] text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-[#2C2926] transition-all duration-300 shadow-md hover:shadow-lg mt-4"
          >
            Publish to Collection
          </button>
        </form>

      </div>
    </div>
  );
}