import Link from "next/link";
import { products } from "@/lib/data"; // Using the new central data

export default function Home() {
  // We'll just show the first 3 products as a "featured" preview on the home page
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FAF9F6] font-sans text-stone-800">
      
      {/* Navigation Bar - Sticking to the sleek original look */}
      <nav className="flex w-full flex-col md:flex-row items-center justify-between px-6 md:px-10 py-6 md:py-8 bg-[#FAF9F6]/80 backdrop-blur-md sticky top-0 z-50 gap-4 md:gap-0"
      data-cur="cursor"
      >
        <h1 className="text-lg md:text-xl font-serif italic tracking-widest uppercase text-stone-900">ArtisanAlley</h1>
        <div className="flex gap-4 md:gap-8 text-[10px] md:text-xs font-medium uppercase tracking-widest text-stone-500">
          <Link href="/collection" className="hover:text-stone-900 transition underline-offset-4 hover:underline">Collection</Link>
          <Link href="/artisan" className="hover:text-stone-900 transition underline-offset-4 hover:underline">The Makers</Link>
          <Link href="/story" className="hover:text-stone-900 transition underline-offset-4 hover:underline">Story</Link>
        </div>
      </nav>

      
      <main className="flex flex-1 flex-col items-center justify-center px-6 md:px-8 text-center max-w-4xl w-full py-16 md:py-24"
      dat-cur="cursor"
      >
        <div className="flex flex-col gap-6 md:gap-8 items-center">
          <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] text-stone-400 uppercase">
            EST. 2026 — NHITM - Comp-A-Group 2
          </span>
          
          <h1 className="text-4xl sm:text-7xl font-serif text-stone-900 leading-[1.2] md:leading-[1.1]">
  The beauty of the <br className="hidden sm:block" />
  <span className="italic text-stone-900">handmade object.</span>
</h1>
          
          <p className="max-w-md md:max-w-lg text-base md:text-lg font-light leading-relaxed text-stone-500 italic">
            A curated marketplace connecting local master artisans with those who appreciate the soul behind the craft.
          </p>
        </div>

        {/* Buttons - Routing correctly to your new pages */}
        <div className="mt-10 md:mt-12 flex flex-col gap-4 sm:flex-row w-full sm:w-auto px-4 sm:px-0">
          <Link 
            href="/collection" 
            className="flex items-center justify-center h-14 px-10 bg-stone-900 text-[#FAF9F6] text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all w-full sm:w-auto"
          >
            Shop the Collection
          </Link>
          <Link 
            href="/artisan-join" 
            className="flex items-center justify-center h-14 px-10 border border-stone-300 bg-transparent text-xs font-bold uppercase tracking-widest hover:bg-[#F5F5DC] transition-all w-full sm:w-auto"
          >
            Join as Artisan
          </Link>
        </div>
      </main>

      {/* Values Section */}
      <section className="w-full bg-[#F5F5DC] py-16 md:py-20 flex justify-center border-y border-stone-200">
        <div className="max-w-5xl w-full px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center">
          <div className="flex flex-col items-center">
            <h3 className="font-serif italic text-xl mb-2">Sustainable</h3>
            <p className="text-sm text-stone-500 font-light max-w-62.5">Ethically sourced materials from local vendors.</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-serif italic text-xl mb-2">Authentic</h3>
            <p className="text-sm text-stone-500 font-light max-w-62.5">Directly supporting households.</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-serif italic text-xl mb-2">Timeless</h3>
            <p className="text-sm text-stone-500 font-light max-w-62.5">Designs meant to last a lifetime, not a season.</p>
          </div>
        </div>
      </section>

      {/* Featured Collection Section - Now uses Dynamic Data from lib/data.ts */}
      <section id="collections" className="py-20 w-full bg-stone-50">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-serif text-stone-900">Explore the Alley</h2>
            <p className="mt-4 text-stone-500 font-light italic">Handpicked treasures from local master-makers.</p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative cursor-pointer">
                <div className="w-full h-80 overflow-hidden rounded-sm bg-stone-200 relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                </div>
                <h3 className="mt-4 text-[11px] uppercase tracking-widest text-stone-400 font-bold">{product.artisanName}</h3>
                <p className="mt-1 text-lg font-serif italic text-stone-900">{product.name}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <Link href="/collection" className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-500 hover:border-stone-500 transition-colors">
                View Full Collection
             </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 md:py-12 px-6 text-center text-[9px] md:text-[10px] tracking-widest text-stone-400 uppercase leading-loose">
        © ArtisanAlley | <br className="sm:hidden" /> New Horizon Institute Of Technology & Management
      </footer>
    </div>
  );
}