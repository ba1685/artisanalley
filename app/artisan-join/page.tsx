"use client";

import { useState } from "react";
import Link from "next/link"; // We'll add a way to go back home

export default function ArtisanJoinPage() {
  // This state controls whether we show the Login or Sign Up form
  const [isLogin, setIsLogin] = useState(true);

  // This prevents the page from refreshing when the form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted! (Database connection coming soon)");
  };

  return (
    // Updated page background to the main off-white/beige
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF9F6] font-sans text-stone-800 p-4 relative">
      
      {/* Small "Back to Home" Link */}
      <Link href="/" className="absolute top-6 left-6 text-xs font-medium uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
        ← ArtisanAlley
      </Link>
      
      {/* Main Form Card - Kept pure white for clean pop */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.07)] p-10 border border-stone-100">
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
            Artisan Portal
          </span>
          <h1 className="text-4xl font-serif italic text-stone-900 mt-3">
            {isLogin ? "Welcome Back" : "Join the Alley"}
          </h1>
          <p className="text-stone-500 mt-4 text-base font-light leading-relaxed italic">
            {isLogin
              ? "Log in to manage your soul-crafted art and shop."
              : "Sign up to begin your journey with our curated community."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Only show the Name field if they are signing up */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Full Name</label>
              <input
                type="text"
                required
                className="block w-full rounded-sm border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors"
                placeholder="Da Vinci"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="block w-full rounded-sm border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors"
              placeholder="artisan@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Password</label>
            <input
              type="password"
              required
              className="block w-full rounded-sm border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-4 px-6 h-14 bg-stone-900 text-[#FAF9F6] text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-stone-100 pt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-stone-500 font-medium tracking-widest uppercase hover:text-stone-900 transition-colors underline-offset-4 hover:underline"
          >
            {isLogin
              ? "Don't have an artisan account? Create One"
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
      
      {/* Footer from home page */}
      <footer className="mt-16 text-center text-[10px] tracking-widest text-stone-400 uppercase leading-loose">
        © ArtisanAlley | <br className="sm:hidden" /> |GRP2 | New Horizon Institute Of Technology & Management
      </footer>
    </div>
  );
}