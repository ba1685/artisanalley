// File: app/artisan/[id]/dashboard/layout.tsx
import Link from "next/link";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // Change this to a Promise
}) {
  const resolvedParams = await params; // Await the params here
  const id = resolvedParams.id;

  const navItems = [
    { name: "Overview", href: `/artisan/${id}/dashboard` },
    { name: "My Collection", href: `/artisan/${id}/collection` },
    { name: "Upload Artwork", href: `/artisan/${id}/upload` },
    { name: "Sales & Orders", href: "#" },
    { name: "Store Settings", href: "#" },
  ];

  return (
    <div className="flex min-h-screen bg-[#fcfaf7] text-[#1a1a1a]">
      <aside className="w-64 border-r border-zinc-200 p-10 flex flex-col justify-between bg-white/50 backdrop-blur-sm">
        <div>
          <div className="mb-16">
            <h1 className="text-2xl font-serif italic tracking-tighter">ArtisanAlley</h1>
            <p className="text-[9px] uppercase tracking-[0.4em] text-zinc-400 mt-2 ml-1">Creator Portal</p>
          </div>
          <nav className="space-y-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-black hover:translate-x-1 transition-all"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/artisan-join" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors">
          Sign Out
        </Link>
      </aside>
      <main className="flex-1 p-16">
        {children}
      </main>
    </div>
  );
}