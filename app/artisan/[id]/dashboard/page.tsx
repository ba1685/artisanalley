// File: app/artisan/[id]/dashboard/page.tsx
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage({ 
  params 
}: { 
  params: Promise<{ id: string }> // Change to Promise
}) {
  const resolvedParams = await params; // Await the params
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
      {/* Rest of your UI code stays exactly the same */}
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
    </div>
  );
}