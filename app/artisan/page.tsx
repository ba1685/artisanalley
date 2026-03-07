export default function ArtisanProfile() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 p-8 font-sans">
      <div className="max-w-2xl mx-auto border border-stone-200 bg-white p-12 shadow-sm">
        <header className="text-center mb-12">
          <div className="w-32 h-32 bg-stone-200 rounded-full mx-auto mb-6 overflow-hidden">
            {/* Placeholder for Artisan Image */}
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300" alt="Artisan" className="object-cover w-full h-full grayscale" />
          </div>
          <h1 className="text-3xl font-serif italic">Rajesh Prajapati</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mt-2">Master Potter • Dharavi, Mumbai</p>
        </header>

        <section className="space-y-6 leading-relaxed text-stone-600 italic font-light">
          <p>
            "I have been working with clay since I was twelve years old, a craft passed down through four generations of my family."
          </p>
          <p>
            Rajesh specializes in traditional terracotta. Every piece in his collection is fired in a community kiln and hand-painted using natural pigments sourced from local minerals.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-stone-100 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Products in Stock: 14</span>
          <button className="text-xs font-bold uppercase tracking-widest text-stone-900 underline underline-offset-8">View Collection</button>
        </div>
      </div>
    </div>
  );
}