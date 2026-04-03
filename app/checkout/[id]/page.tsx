"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from "@supabase/supabase-js";
import { processOrder, getArtworkForCheckout } from '@/app/actions/checkout';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const artworkId = resolvedParams.id;
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [artwork, setArtwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // 1. Get User
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      } else {
        router.push('/collection');
        return;
      }

      // 2. Get Artwork Details
      try {
        const data = await getArtworkForCheckout(artworkId);
        setArtwork(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [artworkId, router]);

  if (loading) return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center font-serif italic text-[#8C847C] animate-pulse">
      Preparing your studio summary...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A443F] py-20 px-6 md:px-20 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href={`/collection`} className="text-[10px] uppercase tracking-[0.2em] text-[#8C847C] hover:text-[#2C2926] mb-10 inline-block font-bold transition-colors">
          ← Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: The Form */}
          <div className="bg-[#FAF9F6] border border-[#E5E1DA] p-10 shadow-sm">
            <h1 className="text-3xl font-serif text-[#2C2926] italic mb-2">Shipping Details</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-semibold mb-8">Where should we send your piece?</p>

            <form action={processOrder} className="space-y-6">
              <input type="hidden" name="artworkId" value={artworkId} />
              
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-2">Account Email</label>
                <input type="email" name="customerEmail" value={userEmail} readOnly className="w-full p-4 bg-[#F2EFE9] border border-[#E5E1DA] text-[12px] text-[#8C847C] outline-none cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-2">Street Address</label>
                <input type="text" name="shippingAddress" required className="w-full p-4 bg-white border border-[#E5E1DA] text-[12px] outline-none focus:border-[#4A443F] transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-2">City</label>
                  <input type="text" name="city" required className="w-full p-4 bg-white border border-[#E5E1DA] text-[12px] outline-none focus:border-[#4A443F] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-2">Postal Code</label>
                  <input type="text" name="postalCode" required className="w-full p-4 bg-white border border-[#E5E1DA] text-[12px] outline-none focus:border-[#4A443F] transition-colors" />
                </div>
              </div>

              <div className="pt-6 border-t border-[#E5E1DA]">
                <button type="submit" className="w-full bg-[#2C2926] text-[#F9F7F2] py-5 text-[12px] uppercase tracking-[0.3em] font-bold hover:bg-[#4A443F] transition-all shadow-lg active:scale-[0.98]">
                  Confirm Purchase
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary (Art Detail) */}
          {artwork ? (
            <div className="sticky top-10">
              <div className="bg-[#F2EFE9] border border-[#E5E1DA] p-8 shadow-sm">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#8C847C] font-bold mb-8 border-b border-[#E5E1DA] pb-4">Order Summary</h2>
                
                <div className="flex gap-6 mb-10">
                  <div className="w-32 h-44 bg-white border border-[#E5E1DA] overflow-hidden shrink-0 shadow-inner">
                    {artwork.imageUrl && (
                      <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-cover mix-multiply opacity-95" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[9px] uppercase tracking-widest text-[#8C847C] mb-2">{artwork.category}</p>
                    <h3 className="font-serif text-2xl text-[#2C2926] leading-tight mb-2">{artwork.title}</h3>
                    <p className="text-[10px] text-[#4A443F] uppercase tracking-[0.15em]">By {artwork.author?.name || "Master Artisan"}</p>
                  </div>
                </div>

                <div className="flex justify-between items-baseline border-t border-[#E5E1DA] pt-8">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-[#4A443F] font-bold">Total Amount</span>
                  <span className="font-serif text-3xl text-[#2C2926]">₹{artwork.price?.toLocaleString()}</span>
                </div>
                <p className="text-[8px] text-[#A69F96] mt-4 leading-relaxed uppercase tracking-wider italic">
                  * Price includes artisan taxes and handling.
                </p>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#E5E1DA] p-20 flex items-center justify-center text-[#8C847C] italic text-sm text-center">
              Masterpiece data not found. <br/> Please return to the gallery.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}