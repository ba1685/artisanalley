import React from 'react';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const artisanId = resolvedParams.id;

  return (
    <div className="flex min-h-screen bg-[#F9F7F2] font-sans text-[#4A443F]">
      {/* The Static Sidebar */}
      <aside className="w-64 border-r border-[#E5E1DA] bg-[#FAF9F6] p-10 flex flex-col hidden md:flex">
        <div className="mb-16">
          <h2 className="font-serif text-2xl text-[#2C2926]">ArtisanAlley</h2>
          <p className="text-[9px] uppercase tracking-widest text-[#8C847C] mt-1">Creator Portal</p>
        </div>

        <nav className="space-y-6 flex-1">
          <Link href={`/artisan/${artisanId}/dashboard`} className="block w-full text-left text-[11px] uppercase tracking-[0.2em] font-bold text-[#8C847C] hover:text-[#2C2926] transition-colors">
            Overview
          </Link>
          <Link href={`/artisan/${artisanId}/dashboard/collection`} className="block w-full text-left text-[11px] uppercase tracking-[0.2em] font-bold text-[#8C847C] hover:text-[#2C2926] transition-colors">
            My Collection
          </Link>
          <Link href={`/artisan/${artisanId}/upload`} className="block w-full text-left text-[11px] uppercase tracking-[0.2em] font-bold text-[#8C847C] hover:text-[#2C2926] transition-colors">
            Upload Artwork
          </Link>
          <Link href={`/artisan/${artisanId}/dashboard/sales`} className="block w-full text-left text-[11px] uppercase tracking-[0.2em] font-bold text-[#8C847C] hover:text-[#2C2926] transition-colors">
            Sales & Orders
          </Link>
          <Link href={`/artisan/${artisanId}/dashboard/settings`} className="block w-full text-left text-[11px] uppercase tracking-[0.2em] font-bold text-[#8C847C] hover:text-[#2C2926] transition-colors">
            Store Settings
          </Link>
        </nav>

        <Link href="/" className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#8C847C] hover:text-[#2C2926]">
          Sign Out
        </Link>
      </aside>

      {/* The Dynamic Page Content (Overview, Collection, Upload, etc.) */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}