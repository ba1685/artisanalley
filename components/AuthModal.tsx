"use client";

import React, { useState } from 'react';
import { customerSignUp, customerSignIn } from '@/app/actions/auth'; 
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase on the client side to sync the session
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    // Grab the credentials so we can log the browser in later
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // 1. Run the Server Action to handle the Prisma DB
    const result = mode === 'login' 
      ? await customerSignIn(formData) 
      : await customerSignUp(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    } 

    if (result.success) {
      // 2. THE FIX: Sync the session with the browser!
      await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      setIsLoading(false);
      onClose(); // Close the modal and let the CollectionPage take over
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2926]/40 backdrop-blur-md">
      <div className="bg-[#F9F7F2] p-10 rounded-sm shadow-2xl w-full max-w-md relative mx-4 border border-[#E5E1DA]">
        
        <button onClick={onClose} className="absolute top-5 right-5 text-[#8C847C] hover:text-[#2C2926] transition-colors">✕</button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif italic text-[#2C2926] mb-2">ArtisanAlley</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C847C] font-semibold">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 text-[10px] uppercase tracking-widest text-[#B91C1C] bg-[#FEF2F2] p-3 text-center border border-[#FCA5A5]">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input 
              type="text" 
              name="name"
              placeholder="FULL NAME" 
              required
              className="w-full p-4 bg-[#F2EFE9] border-none text-[11px] tracking-widest outline-none focus:ring-1 focus:ring-[#4A443F] placeholder-[#B5B0AA]"
            />
          )}
          <input 
            type="email" 
            name="email"
            placeholder="EMAIL ADDRESS" 
            required
            className="w-full p-4 bg-[#F2EFE9] border-none text-[11px] tracking-widest outline-none focus:ring-1 focus:ring-[#4A443F] placeholder-[#B5B0AA]"
          />
          <input 
            type="password" 
            name="password"
            placeholder="PASSWORD" 
            required
            className="w-full p-4 bg-[#F2EFE9] border-none text-[11px] tracking-widest outline-none focus:ring-1 focus:ring-[#4A443F] placeholder-[#B5B0AA]"
          />

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#4A443F] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#2C2926] transition-all disabled:opacity-50"
          >
            {isLoading ? 'PROCESSING...' : (mode === 'login' ? 'Sign In' : 'Join Community')}
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] tracking-wide text-[#8C847C]">
          {mode === 'login' ? (
            <p>
              New to ArtisanAlley?{' '}
              <span 
                onClick={() => { setMode('signup'); setError(null); }} 
                className="text-[#2C2926] font-bold cursor-pointer underline underline-offset-4"
              >
                Create Account
              </span>
            </p>
          ) : (
            <p>
              Already a member?{' '}
              <span 
                onClick={() => { setMode('login'); setError(null); }} 
                className="text-[#2C2926] font-bold cursor-pointer underline underline-offset-4"
              >
                Sign In
              </span>
            </p>
          )}
        </div>

        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#E5E1DA]"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-[#F9F7F2] px-4 text-[#B5B0AA]">Or</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          type="button"
          className="w-full text-[#8C847C] text-[10px] uppercase tracking-[0.2em] font-bold hover:text-[#2C2926] transition-colors"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default AuthModal;