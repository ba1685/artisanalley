"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthModal from '../../components/AuthModal'; 
import ArtConcierge from '../../components/ArtConcierge';
import { getCollectionArtworks } from '../actions/collection';
import { createClient } from "@supabase/supabase-js";

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
  createdAt?: string | Date; 
};

export default function CollectionPage() {
  const router = useRouter();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Crafts");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("recent");

  const categories = [
    "All Crafts", "Ceramics & Pottery", "Textiles & Handlooms", "Woodworking & Marquetry",
    "Glassblowing & Stained Glass", "Metalwork & Forging", "Fine Jewelry & Silversmithing",
    "Leathercraft & Tooling", "Basketry & Wickerwork", "Paper Arts & Bookbinding",
    "Stone Carving & Sculpture", "Macramé & Fiber Arts", "Embroidery & Needlework",
    "Calligraphy & Letterpress", "Printmaking & Linocut", "Mosaic & Inlay Arts",
    "Bamboo & Rattan", "Folk Art & Tribal Crafts", "Enamel & Cloisonné",
    "Terracotta & Earthenware", "Tapestry & Rug Making", "Natural Dyeing & Shibori",
    "Toymaking & Miniatures", "Upcycled & Eco-Art", "Apothecary & Botanicals",
    "Candlemaking & Wax Arts", "Perfumery & Incense", "Bone & Horn Carving",
    "Resin & Mixed Media", "Luthier & Instruments"
  ];

  const checkUser = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const userData = {
        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || "Member",
        email: authUser.email || ""
      };
      setUser(userData);
      return authUser;
    }
    setUser(null);
    return null;
  }, []);

  useEffect(() => {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "Member",
          email: session.user.email || ""
        });
        if (selectedArtworkId) {
          router.push(`/collection/${selectedArtworkId}`);
          setSelectedArtworkId(null);
        }
      } else {
        setUser(null);
        setIsProfileOpen(false);
      }
    });

    checkUser();

    return () => subscription.unsubscribe();
  }, [router, selectedArtworkId, checkUser]); 

  const handleModalClose = async () => {
    setIsAuthOpen(false);
    const loggedInUser = await checkUser(); 
    if (loggedInUser && selectedArtworkId) {
      router.push(`/collection/${selectedArtworkId}`);
      setSelectedArtworkId(null);
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

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (sortOption === "price-low") return a.price - b.price;
    if (sortOption === "price-high") return b.price - a.price;
    
    if (sortOption === "recent" && a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0; 
  });

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A443F]">
      <AuthModal isOpen={isAuthOpen} onClose={handleModalClose} />
      
      <ArtConcierge />

      <header className="max-w-7xl mx-auto px-6 md:px-10 pt-10 flex justify-between items-center bg-transparent">
        <Link href="/" className="font-serif text-2xl tracking-[0.1em] text-[#2C2926] italic hover:opacity-70 transition-opacity">
          ARTISANALLEY
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C847C]">
            <Link href="/collection" className="text-[#2C2926]">Collection</Link>
            <Link href="/makers" className="hover:text-[#2C2926] transition-colors">The Makers</Link>
          </nav>

          {user ? (
            <div className="relative">
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
                <div className="absolute right-0 mt-2 w-48 bg-[#F9F7F2] border border-[#E5E1DA] shadow-xl py-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 border-b border-[#E5E1DA] mb-2">
                    <p className="text-[9px] text-[#8C847C] uppercase tracking-widest">Signed in as</p>
                    <p className="text-[11px] text-[#2C2926] truncate font-medium">{user.email}</p>
                  </div>
                  
                  <Link 
                    href="/profile" 
                    className="block w-full text-left px-4 py-2 mb-1 text-[10px] uppercase tracking-widest text-[#2C2926] hover:bg-[#F2EFE9] transition-colors font-bold"
                  >
                    My Orders
                  </Link>

                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest text-red-700 hover:bg-red-50 transition-colors font-bold border-t border-[#E5E1DA]"
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
                className="bg-[#2C2926] text-[#F9F7F2] px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#4A443F] transition-all shadow-sm"
              >
                Sign In
              </button>
            )
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20 flex flex-col md:flex-row gap-10 md:gap-20">
        
        <aside className="w-full md:w-60 flex-shrink-0">
          <h3 className="uppercase tracking-[0.3em] text-[10px] font-bold mb-6 md:mb-10 text-[#8C847C] border-b border-[#E5E1DA] pb-3 text-center md:text-left">
            Category
          </h3>
          <ul 
            className="flex flex-row md:flex-col gap-6 md:gap-0 md:space-y-6 overflow-x-auto md:overflow-y-auto md:max-h-[70vh] pb-4 md:pb-10 scrollbar-hide md:pr-4" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => (
              <li 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer text-[12px] md:text-[13px] tracking-wide transition-all duration-300 whitespace-nowrap md:whitespace-normal ${
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
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
            <h1 className="text-4xl md:text-6xl font-serif text-[#2C2926] italic opacity-90">The Collection</h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#A69F96] font-bold">Sort:</span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-transparent text-[10px] uppercase tracking-[0.1em] font-bold text-[#2C2926] border-b border-[#E5E1DA] pb-1 cursor-pointer focus:outline-none focus:border-[#2C2926] transition-colors appearance-none pr-4"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%232C2926%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 top 50%', backgroundSize: '8px auto' }}
                >
                  <option value="recent">Added Recently</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <span className="text-[10px] text-[#A69F96] uppercase tracking-[0.3em] font-medium hidden md:inline">
                {sortedArtworks.length} {sortedArtworks.length === 1 ? 'Piece' : 'Pieces'}
              </span>
            </div>
          </div>

         {isLoading ? (
            <div className="text-[#8C847C] text-sm uppercase tracking-widest animate-pulse text-center md:text-left">
              Curating gallery...
            </div>
          ) : (
            /* --- RESTORED: The Perfect Organized Grid --- */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {sortedArtworks.map((artwork) => (
                <div 
                  key={artwork.id} 
                  className="group cursor-pointer"
                  onClick={async () => {
                    const session = await checkUser();
                    if (session) {
                      router.push(`/collection/${artwork.id}`);
                    } else {
                      setSelectedArtworkId(artwork.id);
                      setIsAuthOpen(true);
                    }
                  }} 
                >
                  {/* RESTORED: aspect-square gives wide and tall images equal billing */}
                  <div className="relative aspect-square overflow-hidden bg-[#F2EFE9] mb-5 shadow-sm rounded-sm">
                    {artwork.imageUrl && (
                      <img 
                        src={artwork.imageUrl} 
                        alt={artwork.title} 
                        /* RESTORED: object-cover to ensure the grid boxes are completely filled */
                        className="object-cover w-full h-full mix-multiply opacity-95 transition duration-700 md:group-hover:scale-105"
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