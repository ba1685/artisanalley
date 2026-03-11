import Link from "next/link";
import { notFound } from "next/navigation";

// 1. Interfaces
interface Maker {
  id: string;
  studioName: string;
  artisanName: string;
  craft: string;
  region: string;
  bioFull: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

// 2. Mock Database
const makersData: Maker[] = [
  {
    id: "m1",
    studioName: "The Clay Studio",
    artisanName: "Kavita Desai",
    craft: "Hand-Thrown Pottery",
    region: "Maharashtra",
    bioFull: "Kavita Desai began her journey with clay over two decades ago in a small village outside Pune. Today, The Clay Studio represents a dedication to the slow, mindful process of wheel-thrown ceramics. Every piece is shaped from locally sourced river clay and fired in a traditional kiln, ensuring that no two items are exactly alike. Her work aims to bring the grounded, tactile beauty of the earth into modern homes.",
    image: "/images/pottery.png",
  },
  {
    id: "m2",
    studioName: "The Loom Room",
    artisanName: "Anil & Meera Weavers",
    craft: "Organic Textiles",
    region: "Gujarat",
    bioFull: "Operating out of a heritage workshop in Gujarat, Anil and Meera are third-generation weavers. They specialize in working with raw, un-dyed silk and organic cotton. By using hand-operated wooden looms, they preserve an ancient rhythm of creation that industrial machines simply cannot replicate. Their textiles are celebrated for their natural breathability and unique, organic textures.",
    image: "/images/weaver.png",
  },
  {
    id: "m3",
    studioName: "The Timber Atelier",
    artisanName: "Rajan Mistry",
    craft: "Sustainable Woodwork",
    region: "Maharashtra",
    bioFull: "Rajan Mistry believes that wood has a memory. At The Timber Atelier, he exclusively uses reclaimed timber and sustainably harvested oak. Rather than forcing the wood into artificial shapes, Rajan lets the natural grain dictate the final form of his minimalist decor. His carving techniques rely heavily on traditional Japanese joinery and hand-sharpened chisels.",
    image: "/images/carpentary.jpg",
  }
];

// Mock Products specifically tied to the studio
const artisanProducts: Record<string, Product[]> = {
  "m1": [
    { id: "p1", name: "Textured Clay Vase", price: 1250, image: "/images/pottery.png" },
    { id: "p4", name: "Terracotta Pitcher", price: 850, image: "/images/pottery.png" },
  ],
  "m2": [
    { id: "p2", name: "Raw Silk Runner", price: 3400, image: "/images/weaver.png" },
  ],
  "m3": [
    { id: "p3", name: "Carved Oak Bowl", price: 2100, image: "/images/carpentary.jpg" },
  ]
};

// 3. The Dynamic Component - NOTE THE 'async' KEYWORD HERE
export default async function ArtisanProfile({ params }: { params: Promise<{ id: string }> }) {
  
  // AWAIT THE PARAMS PROMISE (Crucial step for Next.js 15+)
  const resolvedParams = await params;
  const makerId = resolvedParams.id;

  // Find the maker based on the resolved ID
  const maker = makersData.find((m) => m.id === makerId);

  // If someone types an invalid ID (like /artisan/xyz), show a 404 page
  if (!maker) {
    return notFound();
  }

  // Get this specific artisan's products
  const products = artisanProducts[maker.id] || [];

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] font-sans text-stone-800">
      
      {/* Navigation */}
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

      {/* Artisan Hero Banner */}
      <header className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden bg-stone-900">
        <img 
          src={maker.image} 
          alt={maker.studioName} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-[#FAF9F6]">
          <span className="text-xs font-bold tracking-[0.3em] uppercase mb-4 opacity-80">
            {maker.region} &bull; {maker.craft}
          </span>
          <h1 className="text-5xl md:text-6xl font-serif italic mb-4">{maker.studioName}</h1>
          <p className="text-sm md:text-base tracking-widest uppercase font-light">By {maker.artisanName}</p>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-10 py-16 flex flex-col gap-16">
        
        {/* The Story Section */}
        <section className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          <div className="w-full md:w-1/3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-2 mb-4">
              The Artisan's Story
            </h2>
          </div>
          <div className="w-full md:w-2/3">
            <p className="text-base md:text-lg text-stone-600 font-light leading-relaxed">
              {maker.bioFull}
            </p>
          </div>
        </section>

        {/* Artisan's Specific Collection */}
        <section>
          <div className="mb-8 flex justify-between items-end border-b border-stone-200 pb-4 mt-8">
            <h2 className="text-3xl font-serif text-stone-900">Pieces by {maker.studioName}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group relative cursor-pointer flex flex-col gap-3">
                <div className="w-full aspect-[4/5] bg-stone-200 overflow-hidden relative rounded-md">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-stone-900 font-medium">{product.name}</h3>
                  </div>
                  <span className="text-stone-900 text-sm">₹{product.price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-10 md:py-12 px-6 text-center text-[9px] md:text-[10px] tracking-widest text-stone-400 uppercase leading-loose border-t border-stone-200 mt-10">
        © ArtisanAlley | <br className="sm:hidden" /> New Horizon Institute Of Technology & Management
      </footer>

    </div>
  );
}