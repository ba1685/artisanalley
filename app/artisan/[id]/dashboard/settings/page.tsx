import React from 'react';
import { PrismaClient } from '@prisma/client';
import SettingsForm from './SettingsForm';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

export default async function StoreSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const artisanId = resolvedParams.id;

  // The Server securely fetches the data...
  const artisan = await prisma.user.findUnique({
    where: { id: artisanId }
  });

  if (!artisan) return null;

  return (
    <main className="p-10 md:p-16 animate-in fade-in duration-500 font-sans text-[#4A443F]">
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-[#2C2926] italic mb-2">Store Settings</h1>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C847C] font-bold">Manage your public maker profile</p>
      </div>

      <div className="bg-[#FAF9F6] border border-[#E5E1DA] rounded-3xl p-10 shadow-sm max-w-3xl">
        {/* ...and passes it to the Client form to handle the interactivity! */}
        <SettingsForm artisan={artisan} />
      </div>
    </main>
  );
}