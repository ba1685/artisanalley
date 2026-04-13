"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from "@supabase/supabase-js";
import { getUserOrders } from '@/app/actions/orders';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type OrderItem = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  artisan: string;
};

type Order = {
  id: string;
  date: string;
  total: number;
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  trackingNumber?: string;
  items: OrderItem[];
};

export default function ProfilePage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'SETTINGS'>('ORDERS');

  const checkUser = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      router.push('/collection'); 
      return;
    }

    setUser({
      name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || "Member",
      email: authUser.email || ""
    });

    // --- NEW: FETCH REAL DATA FROM PRISMA ---
    try {
      const realOrders = await getUserOrders(authUser.id);
      
      // Format the database data to match our UI
      const formattedOrders: Order[] = realOrders.map((order: any) => ({
        id: order.id,
        date: order.createdAt,
        total: order.total,
        status: order.status as 'PROCESSING' | 'SHIPPED' | 'DELIVERED',
        trackingNumber: order.trackingNumber || undefined,
        items: order.items.map((item: any) => ({
          id: item.id,
          title: item.artwork.title,
          price: item.price,
          imageUrl: item.artwork.imageUrl || "",
          artisan: item.artwork.author.name
        }))
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }

  }, [router]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-[#E5E1DA] text-[#2C2926]';
      case 'SHIPPED': return 'bg-[#2C2926] text-[#FAF9F6]';
      case 'PROCESSING': return 'bg-transparent border border-[#8C847C] text-[#8C847C]';
      default: return 'bg-[#E5E1DA] text-[#2C2926]';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center font-serif italic text-2xl text-[#2C2926]">
        Loading your studio...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A443F]">
      
      <nav className="w-full flex justify-between items-center p-10 md:px-20 border-b border-[#E5E1DA] bg-transparent">
        <Link href="/" className="font-serif text-2xl tracking-[0.1em] text-[#2C2926] italic hover:opacity-70 transition-opacity">
          ARTISANALLEY
        </Link>
        <Link href="/collection" className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C847C] hover:text-[#2C2926] transition-colors flex items-center gap-2">
          <span>←</span> Back to Gallery
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 md:px-10 py-16">
        
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-serif text-[#2C2926] italic mb-4">
              Welcome, {user?.name}
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-[#8C847C]">
              {user?.email}
            </p>
          </div>
          <button 
            onClick={handleSignOut}
            className="text-[10px] uppercase tracking-widest font-bold text-red-700 hover:text-red-900 transition-colors border-b border-transparent hover:border-red-900 pb-1 self-start md:self-auto"
          >
            Sign Out
          </button>
        </header>

        <div className="flex flex-col md:flex-row gap-12">
          
          <aside className="w-full md:w-48 flex-shrink-0">
            <div className="flex flex-row md:flex-col gap-6 border-b md:border-b-0 border-[#E5E1DA] pb-4 md:pb-0">
              <button 
                onClick={() => setActiveTab('ORDERS')}
                className={`text-[11px] uppercase tracking-[0.2em] font-bold text-left transition-colors ${activeTab === 'ORDERS' ? 'text-[#2C2926]' : 'text-[#8C847C] hover:text-[#2C2926]'}`}
              >
                Order History
              </button>
              <button 
                onClick={() => setActiveTab('SETTINGS')}
                className={`text-[11px] uppercase tracking-[0.2em] font-bold text-left transition-colors ${activeTab === 'SETTINGS' ? 'text-[#2C2926]' : 'text-[#8C847C] hover:text-[#2C2926]'}`}
              >
                Account Settings
              </button>
            </div>
          </aside>

          <section className="flex-1">
            
            {activeTab === 'ORDERS' && (
              <div className="flex flex-col gap-8">
                {orders.length === 0 ? (
                  <div className="text-center py-20 bg-[#F2EFE9] border border-[#E5E1DA]">
                    <p className="font-serif italic text-xl text-[#8C847C] mb-6">Your collection is currently empty.</p>
                    <Link href="/collection" className="bg-[#2C2926] text-[#FAF9F6] px-8 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#4A443F] transition-colors inline-block">
                      Discover Pieces
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-[#FAF9F6] border border-[#E5E1DA] p-6 md:p-8">
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#E5E1DA] pb-6 mb-6 gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-[#8C847C] mb-1">Order Placed</p>
                          <p className="font-serif text-[#2C2926] text-lg">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-[#8C847C] mb-1">Order Number</p>
                          <p className="font-sans text-sm text-[#4A443F]">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-[#8C847C] mb-1">Total Amount</p>
                          <p className="font-serif text-[#2C2926] text-lg">₹{order.total.toLocaleString()}</p>
                        </div>
                        <div className={`px-4 py-1.5 text-[9px] uppercase tracking-widest font-bold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </div>
                      </div>

                      {order.trackingNumber && order.status === 'SHIPPED' && (
                        <div className="mb-6 bg-[#F2EFE9] p-4 text-[11px] text-[#4A443F] flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                          <span>Your package is on the way. Tracking ID: <span className="font-bold">{order.trackingNumber}</span></span>
                        </div>
                      )}

                      <div className="flex flex-col gap-6">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-6 group">
                            <div className="w-20 h-24 bg-[#F2EFE9] flex-shrink-0 overflow-hidden border border-[#E5E1DA]">
                              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover mix-multiply group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="flex-1 flex justify-between items-center">
                              <div>
                                <h4 className="font-serif text-lg text-[#2C2926]">{item.title}</h4>
                                <p className="text-[10px] uppercase tracking-widest text-[#8C847C] mt-1">By {item.artisan}</p>
                              </div>
                              <span className="font-serif text-[#2C2926]">₹{item.price.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'SETTINGS' && (
              <div className="bg-[#FAF9F6] border border-[#E5E1DA] p-8">
                <h3 className="font-serif text-2xl text-[#2C2926] italic mb-6">Profile Details</h3>
                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#8C847C] mb-2 font-bold">Full Name</label>
                    <input type="text" disabled value={user?.name} className="w-full bg-[#F2EFE9] border border-[#E5E1DA] px-4 py-3 text-sm text-[#4A443F] outline-none opacity-70 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#8C847C] mb-2 font-bold">Email Address</label>
                    <input type="email" disabled value={user?.email} className="w-full bg-[#F2EFE9] border border-[#E5E1DA] px-4 py-3 text-sm text-[#4A443F] outline-none opacity-70 cursor-not-allowed" />
                  </div>
                  <p className="text-[10px] text-[#8C847C] italic">Account details are currently managed through your secure login provider.</p>
                </div>
              </div>
            )}

          </section>
        </div>
      </main>
    </div>
  );
}