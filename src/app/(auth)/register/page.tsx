'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
      } else {
        router.push('/login');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-[24px] font-bold text-on-surface mb-6 text-center">Create an Account</h2>
      
      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded mb-6 text-[14px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-on-surface-variant font-label-sm text-[12px] mb-1">Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="Alex Chen"
          />
        </div>
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
          <label className="block text-on-surface-variant font-label-sm text-[12px] mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary font-bold py-2.5 rounded-lg shadow-[0_0_15px_rgba(188,195,255,0.2)] hover:shadow-[0_0_25px_rgba(188,195,255,0.4)] transition-all disabled:opacity-50 mt-6"
        >
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center text-[14px] text-on-surface-variant">
        Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </div>
    </div>
  );
}
