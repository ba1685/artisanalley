import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// The { params } object automatically gets the 'id' from the URL
export default async function DashboardPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { id } = params;

  // Find the artist in Supabase using the ID from the URL
  const artist = await prisma.user.findUnique({
    where: { id: id },
  });

  // If someone types a fake ID in the URL, show a 404
  if (!artist) {
    notFound();
  }

  return (
    <div className="bg-[#fcfaf7] min-h-screen p-8">
      {/* This replaces the fixed "Leonardo" name with the real one */}
      <h1 className="text-4xl font-serif italic text-[#1a1a1a]">
        Welcome back, {artist.name}.
      </h1>

      {/* Keep the rest of your dashboard UI below this */}
      <div className="grid grid-cols-3 gap-6 mt-10">
          {/* Your Stats Cards... */}
      </div>
    </div>
  );
}