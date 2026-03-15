export default function StoryPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 font-sans selection:bg-[#F5F5DC]">
      <main className="max-w-3xl mx-auto px-8 py-20 md:py-32">
        
        <h1 className="text-5xl font-serif italic text-center text-stone-900 mb-16">
          Beyond the Horizon
        </h1>

        <div className="space-y-12 text-lg leading-relaxed font-light text-stone-600">
          <p>
            More than a marketplace, ArtisanAlley is a quiet gallery. We celebrate the imperfections of the human touch, curating pieces that are meant to last a lifetime, not just a season.
          </p>
          
          <div className="py-8 border-y border-stone-200">
            <h2 className="font-serif text-2xl italic text-stone-900 mb-4 text-center">The Human Hands</h2>
            <p className="text-center italic text-stone-500">
              "We believe that a machine can replicate a shape, but only a human can grant it a soul."
            </p>
          </div>
          
          
            <h2 className="font-serif text-2xl italic text-stone-900 mb-4 text-center">The Origin</h2>
            <p className="text-center italic text-stone-500">
              ArtisanAlley was born from a simple belief: the most beautiful objects aren't manufactured, they are made. We created this space to showcase slow craft in a fast world and to connect those who create with those who appreciate the soul behind the craft.
            </p>
        

          <p className="text-center text-[20px] uppercase tracking-[0.2em] text-[#7d572d] font-bold">
  A Project by Comp A-Group 2<br/>
  Batch of NHITM - 2028
</p>
 

            <p className="text-center text-[15px] uppercase tracking-[0.2em] text-[#7d572d] font-bold">
            Created and designed by Bhavesh Aware, Aadesh Anjankar and Roza Ansari. 
          </p>

    
        </div>

        <div className="mt-20 flex justify-center">
          <a href="/" className="h-14 px-10 flex items-center bg-stone-800 text-[#FAF9F6] text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all">
            Back to Home
          </a>
        </div>
      </main>
      <footer className="w-full py-10 md:py-12 px-6 text-center text-[10px] md:text-[14px] tracking-widest text-stone-400 uppercase leading-loose border-t border-stone-200">
        © ArtisanAlley | <br className="sm:hidden" /> New Horizon Institute Of Technology & Management
      </footer>
    </div>
  );
}
