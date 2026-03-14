export const dynamic = 'force-dynamic';
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage({ 
  params 
}: { 
  params: Promise<{ id: string }> // MUST be a Promise
}) {
  // Await the params here as well
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: user } = await supabase
    .from('User') 
    .select('name')
    .eq('id', id)
    .single();

  const artisanName = user?.name || "Artisan";

  return (
    <div className="max-w-5xl">
      <header className="mb-16">
        <h2 className="text-[48px] font-serif italic leading-tight text-[#1a1a1a] mb-4">
          Welcome back, {artisanName}.
        </h2>
        <p className="text-zinc-500 text-sm italic font-serif">
          Your gallery is currently awaiting its first masterpiece.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { label: "Total Artworks", value: "0" },
          { label: "Gallery Views", value: "0" },
          { label: "Total Revenue", value: "₹0.00" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-zinc-100 p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 mb-4 font-bold">{stat.label}</p>
            <p className="text-3xl font-light tracking-tight text-[#1a1a1a]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[32px] border border-zinc-200 bg-white/40 p-24 text-center backdrop-blur-sm">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-serif italic text-[#1a1a1a] mb-4">Your gallery space is ready.</h3>
          <p className="text-zinc-500 text-sm mb-10 leading-relaxed italic">
            Start building your presence in the Alley by showcasing your unique craft to our global community.
          </p>
          <Link 
            href={`/artisan/${id}/upload`}
            className="inline-block bg-[#1a1a1a] text-white px-10 py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all"
          >
            Upload First Piece
          </Link>
        </div>
      </div>
    </div>
  );
}