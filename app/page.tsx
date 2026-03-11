import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FAF9F6] font-sans text-stone-800">
      {/* Navigation Bar - Responsive padding and flex direction */}
      <nav className="flex w-full flex-col md:flex-row items-center justify-between px-6 md:px-10 py-6 md:py-8 bg-[#FAF9F6]/80 backdrop-blur-md sticky top-0 z-50 gap-4 md:gap-0">
        <h1 className="text-lg md:text-xl font-serif italic tracking-widest uppercase text-stone-900">ArtisanAlley</h1>
        <div className="flex gap-4 md:gap-8 text-[10px] md:text-xs font-medium uppercase tracking-widest text-stone-500">
          <a href="#" className="hover:text-stone-900 transition underline-offset-4 hover:underline">Collection</a>
          <a href="/artisan" className="hover:text-stone-900 transition underline-offset-4 hover:underline">The Makers</a>
          <a href="/story" className="hover:text-stone-900 transition underline-offset-4 hover:underline">Story</a>
        </div>
      </nav>

      {/* Main Hero - Adjusted text sizing for small screens */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 md:px-8 text-center max-w-4xl w-full py-16 md:py-24">
        <div className="flex flex-col gap-6 md:gap-8 items-center">
          <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] text-stone-400 uppercase">
            EST. 2026 — NHITM
          </span>
          
          <h1 className="text-4xl sm:text-7xl font-serif text-stone-900 leading-[1.2] md:leading-[1.1]">
            The beauty of the <br className="hidden sm:block" /> 
            <span className="italic">handmade object.</span>
          </h1>
          
          <p className="max-w-md md:max-w-lg text-base md:text-lg font-light leading-relaxed text-stone-500 italic">
            A curated marketplace connecting local master artisans with those who appreciate the soul behind the craft.
          </p>
        </div>

        {/* Buttons - Stack vertically on mobile */}
        <div className="mt-10 md:mt-12 flex flex-col gap-4 sm:flex-row w-full sm:w-auto px-4 sm:px-0">
          <button className="h-14 px-10 bg-stone-900 text-[#FAF9F6] text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all w-full sm:w-auto">
            Shop the Collection
          </button>
          <button className="h-14 px-10 border border-stone-300 bg-transparent text-xs font-bold uppercase tracking-widest hover:bg-[#F5F5DC] transition-all w-full sm:w-auto">
            Join as Artisan
          </button>
        </div>
      </main>

      {/* Grid Section - Stack on mobile, 3 columns on desktop */}
      <section className="w-full bg-[#F5F5DC] py-16 md:py-20 flex justify-center">
        <div className="max-w-5xl w-full px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center">
          <div className="flex flex-col items-center">
            <h3 className="font-serif italic text-xl mb-2">Sustainable</h3>
            <p className="text-sm text-stone-500 font-light max-w-[250px]">Ethically sourced materials from local vendors.</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-serif italic text-xl mb-2">Authentic</h3>
            <p className="text-sm text-stone-500 font-light max-w-[250px]">Directly supporting households.</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-serif italic text-xl mb-2">Timeless</h3>
            <p className="text-sm text-stone-500 font-light max-w-[250px]">Designs meant to last a lifetime, not a season.</p>
          </div>
        </div>
      </section>
{/* Collections Section */}
<section id="collections" className="py-16 bg-stone-50">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-serif font-bold text-stone-900 sm:text-4xl">Explore the Alley</h2>
      <p className="mt-4 text-lg text-stone-600">Handpicked treasures from local master-makers.</p>
    </div>

    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      
      {/* Collection 1: Pottery */}
      <div className="group relative cursor-pointer">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-stone-200 xl:aspect-h-8 xl:aspect-w-7">
          <img 
            src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600" 
            alt="Handmade Ceramics" 
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        </div>
        <h3 className="mt-4 text-sm text-stone-700">The Clay Studio</h3>
        <p className="mt-1 text-lg font-medium text-stone-900">Hand-Thrown Pottery</p>
      </div>

      {/* Collection 2: Textiles */}
      <div className="group relative cursor-pointer">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-stone-200 xl:aspect-h-8 xl:aspect-w-7">
          <img 
            src="https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?auto=format&fit=crop&q=80&w=600" 
            alt="Woven Textiles" 
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        </div>
        <h3 className="mt-4 text-sm text-stone-700">The Loom Room</h3>
        <p className="mt-1 text-lg font-medium text-stone-900">Organic Hand-Woven Silks</p>
      </div>

      {/* Collection 3: Jewelry */}
      <div className="group relative cursor-pointer">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-stone-200 xl:aspect-h-8 xl:aspect-w-7">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600" 
            alt="Artisan Jewelry" 
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        </div>
        <h3 className="mt-4 text-sm text-stone-700">Forge & Fire</h3>
        <p className="mt-1 text-lg font-medium text-stone-900">Hammered Gold & Silver</p>
      </div>

    </div>
  </div>
</section>

    <footer className="w-full py-10 md:py-12 px-6 text-center text-[9px] md:text-[10px] tracking-widest text-stone-400 uppercase leading-loose">
        © ArtisanAlley | <br className="sm:hidden" /> New Horizon Institute Of Technology & Management
      </footer>
    </div>
  );
} 