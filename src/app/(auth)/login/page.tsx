'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-[24px] font-bold text-on-surface mb-6 text-center">Welcome Back</h2>
      
      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded mb-6 text-[14px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-on-surface-variant font-label-sm text-[12px] mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="developer@example.com"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-on-surface-variant font-label-sm text-[12px]">Password</label>
            <Link href="#" className="text-primary hover:underline font-label-sm text-[12px]">Forgot?</Link>
          </div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary font-bold py-2.5 rounded-lg shadow-[0_0_15px_rgba(188,195,255,0.2)] hover:shadow-[0_0_25px_rgba(188,195,255,0.4)] transition-all disabled:opacity-50 mt-6"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center text-[14px] text-on-surface-variant">
        Don't have an account? <Link href="/register" className="text-primary hover:underline font-medium">Create one</Link>
      </div>
    </div>
  );
}
