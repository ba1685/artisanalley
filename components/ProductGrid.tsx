import React from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Handcrafted Ceramic Vase', price: 45.00, category: 'Pottery' },
  { id: '2', name: 'Woven Linen Throw', price: 85.00, category: 'Textiles' },
  { id: '3', name: 'Beeswax Pillar Candle', price: 24.00, category: 'Home Fragrance' },
  { id: '4', name: 'Olive Wood Serving Board', price: 60.00, category: 'Woodwork' },
];

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
      {mockProducts.map((product) => (
        <div key={product.id} className="group cursor-pointer flex flex-col">
          {/* Updated to native v4 variable syntax */}
          <div className="w-full aspect-square bg-(--color-secondary-beige) rounded-lg overflow-hidden mb-4 transition-opacity group-hover:opacity-80 flex items-center justify-center">
             <span className="text-(--color-foreground) opacity-40 text-sm tracking-wide">
               Product Image
             </span>
          </div>
          
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-medium text-base text-(--color-foreground) leading-tight">
                {product.name}
              </h3>
              <p className="text-sm text-(--color-foreground) opacity-60 mt-1">
                {product.category}
              </p>
            </div>
            <span className="font-medium text-(--color-foreground)">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}