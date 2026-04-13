export const dynamic = 'force-dynamic';
import React from 'react';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default async function SalesAndOrdersPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const artisanId = resolvedParams.id;

  // 1. Fetch all orders containing AT LEAST ONE item belonging to THIS artisan
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          artwork: { artisanId: artisanId }
        }
      }
    },
    include: {
      customer: true,   // To show who bought it
      items: {
        where: {
          artwork: { artisanId: artisanId } // ONLY pull this artisan's items from the cart!
        },
        include: {
          artwork: true // Gets the artwork details (title, image)
        }
      }
    },
    orderBy: {
      createdAt: 'desc' // Newest orders first
    }
  });

  // 2. Inline Server Action to mark the order as delivered
  async function markAsDelivered(formData: FormData) {
    "use server";
    const orderId = formData.get("orderId") as string;
    
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "DELIVERED" }
    });

    // Refresh the page to show the new status
    revalidatePath(`/artisan/${artisanId}/dashboard/sales`);
  }

  return (
    <main className="p-10 md:p-16 animate-in fade-in duration-500 font-sans text-[#4A443F]">
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-[#2C2926] italic mb-2">Sales & Orders</h1>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C847C] font-bold">Manage your customer shipments</p>
      </div>

      <div className="space-y-8">
        {orders.length === 0 ? (
          <div className="bg-[#FAF9F6] border border-[#E5E1DA] rounded-3xl p-20 text-center shadow-sm">
            <p className="text-lg text-[#8C847C] font-serif italic">You don't have any orders yet.</p>
          </div>
        ) : (
          orders.map((order) => {
            // Calculate the total revenue specifically for THIS artisan in this order
            const artisanEarnings = order.items.reduce((sum, item) => sum + item.price, 0);
            
            // Get the title(s) of the artwork(s) sold in this specific order
            const itemTitles = order.items.map(i => i.artwork.title).join(" + ");

            return (
              <div key={order.id} className="bg-[#FAF9F6] border border-[#E5E1DA] rounded-2xl p-8 shadow-sm flex flex-col md:flex-row gap-8">
                
                {/* Artwork Thumbnail (Shows the first item's image) */}
                <div className="w-full md:w-48 aspect-square bg-[#F2EFE9] rounded-lg overflow-hidden shrink-0 border border-[#E5E1DA]">
                  {order.items[0]?.artwork.imageUrl ? (
                    <img src={order.items[0].artwork.imageUrl} alt="Artwork" className="w-full h-full object-cover mix-multiply opacity-90" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8C847C] uppercase tracking-widest">No Image</div>
                  )}
                </div>

                {/* Order Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-1">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </p>
                        {/* Displays Title, or Title + Title if multiple were bought */}
                        <h3 className="font-serif text-2xl text-[#2C2926]">{itemTitles}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-[#8C847C] mt-1">
                          {order.items.length} Item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-2xl text-[#2C2926]">₹{artisanEarnings.toLocaleString()}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C847C] mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Customer & Shipping Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 border border-[#E5E1DA] rounded-xl mb-6">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-2">Customer Details</p>
                        <p className="text-sm font-medium text-[#2C2926]">{order.customer.name}</p>
                        <p className="text-xs text-[#8C847C]">{order.customer.email}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#8C847C] font-bold mb-2">Shipping Address</p>
                        <p className="text-sm text-[#2C2926]">{order.shippingAddress}</p>
                        <p className="text-xs text-[#8C847C]">{order.city}, {order.postalCode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#E5E1DA]">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-bold">Status:</span>
                      {order.status === "DELIVERED" ? (
                        <span className="bg-[#E5E1DA]/50 text-[#4A443F] px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full">
                          Delivered
                        </span>
                      ) : (
                        <span className="bg-[#2C2926] text-[#FAF9F6] px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full animate-pulse">
                          Processing
                        </span>
                      )}
                    </div>

                    {/* The Action Form */}
                    {order.status !== "DELIVERED" && (
                      <form action={markAsDelivered}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <button 
                          type="submit" 
                          className="border border-[#2C2926] text-[#2C2926] px-6 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-[#2C2926] hover:text-[#FAF9F6] transition-colors"
                        >
                          Mark as Delivered
                        </button>
                      </form>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}