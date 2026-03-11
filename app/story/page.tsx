export default function StoryPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 font-sans selection:bg-[#F5F5DC]">
      <main className="max-w-3xl mx-auto px-8 py-24">
        <span className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase block mb-4 text-center">
          Our Philosophy
        </span>
        <h1 className="text-5xl font-serif italic text-center text-stone-900 mb-16">
          Beyond the Horizon
        </h1>

        <div className="space-y-12 text-lg leading-relaxed font-light text-stone-600">
          <p>
            ArtisanAlley began in the narrow lanes of Mumbai, where the rhythmic sound of looms and the smell of wet clay have defined neighborhoods for centuries. 
          </p>
          
          <div className="py-8 border-y border-stone-200">
            <h2 className="font-serif text-2xl italic text-stone-900 mb-4 text-center">The Human Hands</h2>
            <p className="text-center italic text-stone-500">
              "We believe that a machine can replicate a shape, but only a human can grant it a soul."
            </p>
          </div>

          <p>
            In an age of mass production, the master craftsmen of our city were losing their voice. Our project was born to bridge that gap—connecting the heritage of Dharavi, Kumbharwada, and beyond with the modern world.
          </p>

          <p>
            Every purchase on ArtisanAlley goes directly to supporting artisan households, ensuring that traditional techniques are preserved for the next generation of Mumbai’s creators.
          </p>
        </div>

        <div className="mt-20 flex justify-center">
          <a href="/" className="h-14 px-10 flex items-center bg-stone-900 text-[#FAF9F6] text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all">
            Back to Collection
          </a>
        </div>
      </main>
    </div>
  );
}
