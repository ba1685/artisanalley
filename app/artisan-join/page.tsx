"use client";
import { useState } from "react";
import { handleAuth } from "../actions/auth";
import Link from "next/link";

export default function JoinPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await handleAuth(formData, isLogin ? "login" : "signup");
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfaf7] p-4 text-[#333]">
      {/* Back button link - adjust href as needed */}
      <Link href="/" className="absolute left-8 top-8 text-xs uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
        ← ArtisanAlley
      </Link>

      <div className="w-full max-w-[500px] rounded-2xl border border-zinc-100 bg-white p-12 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-4">
            Artisan Portal
          </p>
          <h2 className="font-serif text-[42px] italic leading-tight mb-4">
            {isLogin ? "Welcome Back" : "Join the Alley"}
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-[280px] mx-auto italic">
            {isLogin 
              ? "Continue your journey within our curated community." 
              : "Sign up to begin your journey with our curated community."}
          </p>
        </div>
        
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-center text-sm text-red-500 border border-red-100 animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-1">Full Name</label>
              <input 
                name="name" 
                placeholder="Bhavesh ..." 
                required 
                className="w-full rounded-lg border border-zinc-100 bg-[#f9f9f9] p-4 text-sm outline-none focus:border-zinc-300 focus:bg-white transition-all" 
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              placeholder="artisan@example.com" 
              required 
              className="w-full rounded-lg border border-zinc-100 bg-[#f9f9f9] p-4 text-sm outline-none focus:border-zinc-300 focus:bg-white transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-1">Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••" 
              required 
              className="w-full rounded-lg border border-zinc-100 bg-[#f9f9f9] p-4 text-sm outline-none focus:border-zinc-300 focus:bg-white transition-all" 
            />
          </div>
          
          <button 
            disabled={loading} 
            className="w-full bg-[#1a1a1a] p-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-black active:scale-[0.98] disabled:bg-zinc-300 mt-4 shadow-lg shadow-black/5"
          >
            {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-zinc-50 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In" }
          </button>
        </div>
      </div>
    </div>
  );
}