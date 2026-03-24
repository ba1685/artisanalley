"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UserBadge() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    async function getUserDetails() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        // We fetch the role from your Prisma User table via a simple API or Server Action
        // For now, we can extract the name from metadata
        const name = authUser.user_metadata?.full_name || "User";
        
        // This is a placeholder - in a real app, you'd fetch the 'role' field from your DB
        // For the demo, let's assume if they have an ID, we've identified them.
        setUser({ name, role: "IDENTIFIED" }); 
      }
    }
    getUserDetails();
  }, []);

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 bg-[#F2EFE9] px-4 py-2 rounded-full border border-[#E5E1DA] shadow-sm">
      <div className="w-2 h-2 rounded-full bg-[#4A443F] animate-pulse"></div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A443F]">
        {user.name} 
      </span>
      <span className="text-[9px] px-2 py-0.5 bg-[#4A443F] text-[#F9F7F2] rounded-sm font-semibold tracking-tighter">
        {/* We will eventually pull this from your Prisma 'role' column */}
        MEMBER
      </span>
    </div>
  );
}