import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F9F7F2] font-sans text-[#4A443F]">
      
      {/* Artisan Sidebar */}
      <aside className="w-64 border-r border-[#E5E1DA] p-8 flex flex-col bg-[#F9F7F2]">
        <div className="mb-12">
          <h2 className="font-serif text-2xl text-[#2C2926]">ArtisanAlley</h2>
          <p className="text-[9px] tracking-[0.2em] text-[#8C847C] uppercase font-bold mt-1">
            Creator Portal
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-6 text-[11px] uppercase tracking-widest font-semibold text-[#8C847C]">
          <Link href="#" className="hover:text-[#2C2926] transition-colors">Overview</Link>
          <Link href="#" className="hover:text-[#2C2926] transition-colors">My Collection</Link>
          <Link href="#" className="hover:text-[#2C2926] transition-colors">Upload Artwork</Link>
          <Link href="#" className="hover:text-[#2C2926] transition-colors">Sales & Orders</Link>
          <Link href="#" className="hover:text-[#2C2926] transition-colors">Store Settings</Link>

          {/* SIGN OUT - Now directly beneath Store Settings */}
          <div className="pt-6 mt-2 border-t border-[#E5E1DA]">
            <Link href="/" className="block text-[#2C2926] hover:text-[#8C847C] transition-colors">
  SIGN OUT
</Link>
          </div>
        </nav>
      </aside>

      {/* Main Page Content (Where your dashboard/upload pages render) */}
      <div className="flex-1">
        {children}
      </div>

    </div>
  );
}