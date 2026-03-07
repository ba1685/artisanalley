import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FAF9F6] font-sans text-stone-800">
      {/* Navigation Bar - Transparent with a soft blur */}
      <nav className="flex w-full items-center justify-between px-10 py-8 bg-[#FAF9F6]/80 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-xl font-serif italic tracking-widest uppercase text-stone-900">ArtisanAlley</h1>
        <div className="flex gap-8 text-xs font-medium uppercase tracking-widest text-stone-500">
          <a href="#" className="hover:text-stone-900 transition underline-offset-4 hover:underline">Collection</a>
          <a href="/artisan" className="hover:text-stone-900...">The Makers</a>
          <a href="#" className="hover:text-stone-900 transition underline-offset-4 hover:underline">Story</a>
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center px-8 text-center max-w-4xl w-full py-24">
        <div className="flex flex-col gap-8 items-center">
          <span className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
            EST. 2026 
          </span>
          
          <h1 className="text-5xl sm:text-7xl font-serif text-stone-900 leading-[1.1]">
            The beauty of the <br /> 
            <span className="italic">handmade object.</span>
          </h1>
          
          <p className="max-w-lg text-lg font-light leading-relaxed text-stone-500 italic">
            A curated marketplace connecting local master artisans with those who appreciate the soul behind the craft.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-6 sm:flex-row">
          <button className="h-14 px-10 rounded-none bg-stone-900 text-[#FAF9F6] text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all">
            Shop the Collection
          </button>
          <button className="h-14 px-10 rounded-none border border-stone-300 bg-transparent text-xs font-bold uppercase tracking-widest hover:bg-[#F5F5DC] transition-all">
            Join as Artisan
          </button>
        </div>
      </main>

      {/* Aesthetic Section Divider */}
      <section className="w-full bg-[#F5F5DC] py-20 flex justify-center">
        <div className="max-w-5xl w-full px-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="font-serif italic text-xl mb-2">Sustainable</h3>
            <p className="text-sm text-stone-500 font-light">Ethically sourced materials from local vendors.</p>
          </div>
          <div>
            <h3 className="font-serif italic text-xl mb-2">Authentic</h3>
            <p className="text-sm text-stone-500 font-light">Directly supporting households.</p>
          </div>
          <div>
            <h3 className="font-serif italic text-xl mb-2">Timeless</h3>
            <p className="text-sm text-stone-500 font-light">Designs meant to last a lifetime, not a season.</p>
          </div>
        </div>
      </section>

      <footer className="w-full py-12 text-center text-[10px] tracking-widest text-stone-400 uppercase">
        © ArtisanAlley Project | New Horizon Institute Of Technology & Management
      </footer>
    </div>
  );
}