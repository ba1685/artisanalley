import Link from "next/link";

// 1. TypeScript Interface for the Artisan
interface Maker {
  id: string;
  studioName: string;
  artisanName: string;
  craft: string;
  region: string;
  bioSnippet: string;
  image: string;
}

// 2. Mock Data for the Makers
const makersData: Maker[] = [
  {
    id: "m1",
    studioName: "The Clay Studio",
    artisanName: "Kavita Desai",
    craft: "Hand-Thrown Pottery",
    region: "Maharashtra",
    bioSnippet: "With over 20 years at the wheel, Kavita transforms locally sourced river clay into timeless, functional art.",
    image: "/images/pottery.png", // Reusing your existing images to represent their workspace
  },
  {
    id: "m2",
    studioName: "The Loom Room",
    artisanName: "Anil & Meera Weavers",
    craft: "Organic Textiles",
    region: "Gujarat",
    bioSnippet: "A third-generation weaving family preserving the intricate art of hand-spun raw silk and cotton.",
    image: "/images/weaver.png",
  },
  {
    id: "m3",
    studioName: "The Timber Atelier",
    artisanName: "Rajan Mistry",
    craft: "Sustainable Woodwork",
    region: "Maharashtra",
    bioSnippet: "Rajan utilizes reclaimed and sustainably harvested oak to carve minimalist decor rooted in traditional joinery.",
    image: "/images/carpentary.jpg",
  }
];

export default function MakersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] font-sans text-stone-800">
      
      {/* Navigation (Consistent with other pages) */}
      <nav className="flex w-full flex-col md:flex-row items-center justify-between px-6 md:px-10 py-6 md:py-8 bg-[#FAF9F6]/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200 gap-4 md:gap-0">
        <Link href="/" className="text-lg md:text-xl font-serif italic tracking-widest uppercase text-stone-900">
          ArtisanAlley
        </Link>
        <div className="flex gap-4 md:gap-8 text-[10px] md:text-xs font-medium uppercase tracking-widest text-stone-500">
          <Link href="/collection" className="hover:text-stone-900 transition underline-offset-4 hover:underline">Collection</Link>
          <Link href="/artisan" className="text-stone-900 transition underline-offset-4 underline">The Makers</Link>
          <Link href="/story" className="hover:text-stone-900 transition underline-offset-4 hover:underline">Story</Link>
        </div>
      </nav>

      {/* Hero Section for The Makers */}
      <header className="w-full py-16 md:py-24 px-6 flex flex-col items-center text-center border-b border-stone-200">
        <span className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase mb-6">
          The Faces Behind The Craft
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">
          Meet the <span className="italic">Master Makers.</span>
        </h1>
        <p className="max-w-2xl text-stone-500 font-light leading-relaxed">
          Every piece on ArtisanAlley carries the fingerprint of its creator. We partner directly with independent artisans, ensuring fair compensation and preserving generations of regional heritage.
        </p>
      </header>

      {/* Makers Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {makersData.map((maker) => (
            <div key={maker.id} className="flex flex-col group">
              {/* Maker Workspace Image */}
              <div className="w-full aspect-[4/3] bg-stone-200 overflow-hidden relative mb-6 rounded-sm">
                <img 
                  src={maker.image} 
                  alt={maker.studioName} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[20%] group-hover:grayscale-0"
                />
              </div>
              
              {/* Maker Info */}
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-serif text-stone-900">{maker.studioName}</h2>
                </div>
                
                <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">
                  <span>{maker.artisanName}</span>
                  <span>&bull;</span>
                  <span>{maker.region}</span>
                </div>
                
                <p className="text-sm text-stone-500 font-light leading-relaxed mb-6 flex-1">
                  {maker.bioSnippet}
                </p>
                
                {/* Dynamic Link to individual profile */}
                <Link 
                  href={`/artisan/${maker.id}`} 
                  className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-1 self-start hover:text-stone-500 hover:border-stone-500 transition-colors"
                >
                  Read Their Story
                </Link>
              </div>
            </div>
          ))}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 md:py-12 px-6 text-center text-[9px] md:text-[10px] tracking-widest text-stone-400 uppercase leading-loose border-t border-stone-200 mt-10">
        © ArtisanAlley | <br className="sm:hidden" /> New Horizon Institute Of Technology & Management
      </footer>

    </div>
  );
}