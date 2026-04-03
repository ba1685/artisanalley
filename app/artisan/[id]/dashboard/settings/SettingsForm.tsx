"use client";

import React, { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateStoreSettings } from '@/app/actions/settings';

// The Smart Save Button
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`px-10 py-4 text-[10px] uppercase tracking-widest font-bold transition-all shadow-sm ${
        pending ? "bg-[#8C847C] text-[#F2EFE9] cursor-not-allowed" : "bg-[#2C2926] text-[#FAF9F6] hover:bg-[#4A443F]"
      }`}
    >
      {pending ? "Saving Profile..." : "Save Changes"}
    </button>
  );
}

// The Interactive Form
export default function SettingsForm({ artisan }: { artisan: any }) {
  const [preview, setPreview] = useState(artisan.profileImage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Instantly preview the image!
    }
  };

  return (
    <form action={updateStoreSettings} className="space-y-8">
      <input type="hidden" name="artisanId" value={artisan.id} />

      {/* Profile Picture Section */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-4">Maker Portrait</label>
        <div className="flex items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-[#F2EFE9] border border-[#E5E1DA] overflow-hidden flex-shrink-0">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover mix-multiply" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[9px] uppercase tracking-widest text-[#8C847C]">
                <span>No</span>
                <span>Image</span>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <input 
              type="file" 
              name="profileImage" 
              id="profileImage" 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
            <label 
              htmlFor="profileImage" 
              className="inline-block border border-[#2C2926] text-[#2C2926] px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#2C2926] hover:text-[#FAF9F6] transition-colors cursor-pointer mb-2"
            >
              Upload New Portrait
            </label>
            <p className="text-[9px] text-[#A69F96] uppercase tracking-wider">Recommended size: 500x500px (Square)</p>
          </div>
        </div>
      </div>

      <hr className="border-[#E5E1DA]" />

      {/* Text Details Section */}
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-3">Store / Maker Name</label>
          <input 
            type="text" 
            name="name"
            defaultValue={artisan.name}
            required
            className="w-full p-4 bg-white border border-[#E5E1DA] text-[13px] outline-none focus:border-[#4A443F] transition-colors font-serif" 
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-3">The Maker's Story (Bio)</label>
          <textarea 
            name="bio"
            defaultValue={artisan.bio || ""}
            rows={5}
            className="w-full p-4 bg-white border border-[#E5E1DA] text-[13px] outline-none focus:border-[#4A443F] transition-colors font-serif resize-none" 
            placeholder="Share your craft, your inspiration, and your journey..." 
          />
        </div>
      </div>

      <div className="pt-6 border-t border-[#E5E1DA] flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}