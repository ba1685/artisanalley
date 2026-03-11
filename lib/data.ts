// 1. Define the Types (The Blueprint)
export interface Artisan {
  id: string;
  studioName: string;
  artisanName: string;
  craft: string;
  region: string;
  bioSnippet: string;
  bioFull: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  artisanId: string; // Foreign Key linking to Artisan
  artisanName: string;
  category: string;
  region: string;
  price: number;
  image: string;
  badge?: string;
}

// 2. The Central Database (Mock)
export const artisans: Artisan[] = [
  {
    id: "m1",
    studioName: "The Clay Studio",
    artisanName: "Kavita Desai",
    craft: "Hand-Thrown Pottery",
    region: "Maharashtra",
    bioSnippet: "Mastering the wheel for over 20 years with local river clay.",
    bioFull: "Kavita Desai began her journey with clay in a small village outside Pune. Today, The Clay Studio represents a dedication to the slow, mindful process of wheel-thrown ceramics. Every piece is shaped from locally sourced river clay and fired in a traditional kiln.",
    image: "/images/pottery.png",
  },
  {
    id: "m2",
    studioName: "The Loom Room",
    artisanName: "Anil & Meera",
    craft: "Organic Textiles",
    region: "Gujarat",
    bioFull: "Third-generation weavers specializing in raw silk and organic cotton using hand-operated wooden looms.",
    bioSnippet: "Preserving the intricate art of hand-spun raw silk and cotton.",
    image: "/images/weaver.png",
  },
  {
    id: "m3",
    studioName: "The Timber Atelier",
    artisanName: "Rajan Mistry",
    craft: "Sustainable Woodwork",
    region: "Maharashtra",
    bioFull: "Rajan Mistry believes wood has a memory. He exclusively uses reclaimed timber and sustainably harvested oak to create minimalist decor.",
    bioSnippet: "Crafting reclaimed oak into minimalist, timeless decor.",
    image: "/images/carpentary.jpg",
  }
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Textured Clay Vase",
    artisanId: "m1",
    artisanName: "The Clay Studio",
    category: "Pottery & Clay",
    region: "Maharashtra",
    price: 1250,
    image: "/images/pottery.png",
    badge: "100% Handmade",
  },
  {
    id: "p2",
    name: "Raw Silk Runner",
    artisanId: "m2",
    artisanName: "The Loom Room",
    category: "Textiles & Weaves",
    region: "Gujarat",
    price: 3400,
    image: "/images/weaver.png",
  },
  {
    id: "p3",
    name: "Carved Oak Bowl",
    artisanId: "m3",
    artisanName: "The Timber Atelier",
    category: "Carved Wood",
    region: "Maharashtra",
    price: 2100,
    image: "/images/carpentary.jpg",
    badge: "Sustainable",
  }
];