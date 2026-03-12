// File: app/artisan/dashboard/page.tsx

import Link from "next/link";

export default function ArtisanDashboard() {
  // Temporary mock data until we connect the database
  const artisanName = "Leonardo";
  const myArtworks = [
    {
      id: "1",
      title: "Hand-Thrown Ceramic Vase",
      price: 120,
      status: "AVAILABLE",
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop", 
    },
    {
      id: "2",
      title: "Woven Wall Tapestry",
      price: 85,
      status: "SOLD OUT",
      image: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?q=80&w=800&auto=format&fit=crop", 
    }
  ];

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
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
            View Storefront
          </Link>
          <Link href="/artisan-join" className="text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
            Log Out
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-10 py-12">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
              Dashboard
            </span>
            <h2 className="text-4xl font-serif italic text-stone-900 mt-2">
              Welcome back, {artisanName}.
            </h2>
          </div>
          <Link 
            href="/artisan/upload" 
            className="flex items-center justify-center h-12 px-8 bg-stone-900 text-[#FAF9F6] text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 transition-all"
          >
            + Add New Artwork
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 border border-stone-100 shadow-sm rounded-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Total Views</h3>
            <p className="text-3xl font-serif text-stone-900">1,204</p>
          </div>
          <div className="bg-white p-6 border border-stone-100 shadow-sm rounded-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Items Sold</h3>
            <p className="text-3xl font-serif text-stone-900">1</p>
          </div>
          <div className="bg-white p-6 border border-stone-100 shadow-sm rounded-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Total Revenue</h3>
            <p className="text-3xl font-serif text-stone-900">$85.00</p>
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-serif italic text-stone-900 mb-6 border-b border-stone-200 pb-4">
            Your Collection
          </h3>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {myArtworks.map((art) => (
              <div key={art.id} className="group relative">
                {/* Image */}
                <div className="w-full h-72 overflow-hidden rounded-sm bg-stone-200 relative mb-4">
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${art.status === 'AVAILABLE' ? 'bg-white text-stone-900' : 'bg-stone-900 text-white'}`}>
                    {art.status}
                  </div>
                </div>
                {/* Details */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-serif italic text-stone-900">{art.title}</h4>
                    <p className="text-xs font-bold tracking-widest text-stone-500 mt-1">${art.price}</p>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 underline-offset-4 hover:underline">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}