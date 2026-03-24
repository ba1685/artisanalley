"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '../../components/AuthModal'; 
import { getCollectionArtworks } from '../actions/collection';
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Artwork = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  category: string;
  author: { name: string };
};

export default function CollectionPage() {
  const router = useRouter();
  
  // UI States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data States
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Crafts");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  
  // CRITICAL: This tracks which piece was clicked for the redirect
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);

  const categories = ["All Crafts", "Pottery & Clay", "Textiles & Weaves", "Carved Wood"];

  // Check Authentication Status
  const checkUser = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      setUser({
        name: authUser.user_metadata?.full_name || "Member",
        email: authUser.email || ""
      });
      return authUser;
    }
    setUser(null);
    return null;
  }, []);

  // Initial Load
useEffect(() => {
    // 1. Load Artworks
    async function loadData() {
      try {
        const data = await getCollectionArtworks();
        setArtworks(data as Artwork[]);
      } catch (error) {
        console.error("Gallery Load Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();

    // 2. The Aggressive Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Current Auth Event:", event);

      if (session?.user) {
        // We set the user state using email as a fallback if name is missing
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "Member",
          email: session.user.email || ""
        });

        // 3. Handle the Buying Page Redirect
        if (selectedArtworkId) {
          console.log("Success! Redirecting to artwork:", selectedArtworkId);
          router.push(`/collection/${selectedArtworkId}`);
          setSelectedArtworkId(null);
        }
      } else {
        setUser(null);
        setIsProfileOpen(false);
      }
    });

    // 3. Manual Check on Mount (in case listener missed the initial load)
    const syncUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || "Member",
          email: authUser.email || ""
        });
      }
    };
    syncUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedArtworkId, router]);

  // Handle Modal Closing & Redirection
  const handleModalClose = async () => {
    console.log("1. Modal closing...");
    setIsAuthOpen(false);
    
    const loggedInUser = await checkUser(); 

    if (loggedInUser && selectedArtworkId) {
      console.log("2. User logged in, redirecting to artwork:", selectedArtworkId);
      router.push(`/collection/${selectedArtworkId}`);
      setSelectedArtworkId(null); // Reset for next time
    } else {
      console.log("3. No redirect triggered. User:", !!loggedInUser, "Target ID:", selectedArtworkId);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsProfileOpen(false);
    router.refresh();
  };

  const filteredArtworks = activeCategory === "All Crafts" 
    ? artworks 
    : artworks.filter(art => art.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A443F]">
      <AuthModal isOpen={isAuthOpen} onClose={handleModalClose} />

      {/* --- USER BADGE / SIGN IN BUTTON --- */}
      {user ? (
        <div className="fixed top-6 right-6 z-50">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 bg-[#F2EFE9] px-4 py-2 border border-[#E5E1DA] shadow-sm hover:bg-[#EBE7E0] transition-all"
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C2926]">
                {user.name}
              </span>
              <span className="text-[8px] text-[#8C847C] tracking-tighter uppercase font-medium">
                Member
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#4A443F] flex items-center justify-center text-[#F9F7F2] text-[10px] font-serif italic">
              {user.name[0]}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#F9F7F2] border border-[#E5E1DA] shadow-xl py-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 border-b border-[#E5E1DA] mb-2">
                <p className="text-[9px] text-[#8C847C] uppercase tracking-widest">Signed in as</p>
                <p className="text-[11px] text-[#2C2926] truncate font-medium">{user.email}</p>
              </div>
              <button 
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest text-red-700 hover:bg-red-50 transition-colors font-bold"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        !isLoading && (
          <button 
            onClick={() => setIsAuthOpen(true)}
            className="fixed top-6 right-6 z-50 bg-[#2C2926] text-[#F9F7F2] px-6 py-2 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#4A443F] transition-all shadow-md"
          >
            Sign In
          </button>
        )
      )}

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-20 flex flex-col md:flex-row gap-10 md:gap-20">
        <aside className="w-full md:w-60 flex-shrink-0">
          <h3 className="uppercase tracking-[0.3em] text-[10px] font-bold mb-6 md:mb-10 text-[#8C847C] border-b border-[#E5E1DA] pb-3 text-center md:text-left">
            Category
          </h3>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredArtworks.map((artwork) => (
                <div 
                  key={artwork.id} 
                  className="group cursor-pointer"
                  onClick={async () => {
                    const session = await checkUser();
                    if (session) {
                      console.log("User already logged in, heading to artwork:", artwork.id);
                      router.push(`/collection/${artwork.id}`);
                    } else {
                      console.log("Guest clicked artwork, saving ID and opening Modal:", artwork.id);
                      setSelectedArtworkId(artwork.id);
                      setIsAuthOpen(true);
                    }
                  }} 
                >
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
        </section>
      </main>
    </div>
  );
}