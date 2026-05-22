'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div>
      <h2 className="text-[24px] font-bold text-on-surface mb-6 text-center">Welcome Back</h2>
      
      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded mb-6 text-[14px]">
          {error}
        </div>
      )}

      <button 
        onClick={handleGoogleSignIn}
        type="button"
        className="w-full flex items-center justify-center gap-3 bg-surface-container-high border border-outline-variant/30 hover:bg-surface-container-highest text-on-surface font-medium py-2.5 rounded-lg transition-colors mb-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.37 10H12V14.26H17.92C17.66 15.63 16.89 16.79 15.75 17.55V20.31H19.32C21.4 18.39 22.56 15.58 22.56 12.25Z" fill="#4285F4"/>
          <path d="M12 23C14.97 23 17.46 22.02 19.32 20.31L15.75 17.55C14.74 18.23 13.48 18.63 12 18.63C9.14001 18.63 6.72 16.7 5.86 14.1H2.18V16.95C3.99 20.53 7.7 23 12 23Z" fill="#34A853"/>
          <path d="M5.86 14.1C5.64 13.44 5.51 12.74 5.51 12C5.51 11.26 5.64 10.56 5.86 9.9V7.05H2.18C1.45 8.52 1 10.2 1 12C1 13.8 1.45 15.48 2.18 16.95L5.86 14.1Z" fill="#FBBC05"/>
          <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.03L19.39 3.85C17.45 2.05 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.05L5.86 9.9C6.72 7.3 9.14001 5.38 12 5.38Z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-px bg-outline-variant/30 flex-1"></div>
        <span className="text-[12px] text-on-surface-variant font-medium">OR CONTINUE WITH</span>
        <div className="h-px bg-outline-variant/30 flex-1"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-on-surface-variant font-label-sm text-[12px] mb-1">Email</label>
          <input 
            type="email" 
            {...register('email')}
            className={`w-full bg-surface-container-low border ${errors.email ? 'border-error' : 'border-outline-variant/30'} rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
            placeholder="developer@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-error text-[12px]">{errors.email.message}</p>
          )}
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-on-surface-variant font-label-sm text-[12px]">Password</label>
            <Link href="/forgot-password" className="text-primary hover:underline font-label-sm text-[12px]">Forgot?</Link>
          </div>
          <input 
            type="password" 
            {...register('password')}
            className={`w-full bg-surface-container-low border ${errors.password ? 'border-error' : 'border-outline-variant/30'} rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-error text-[12px]">{errors.password.message}</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary font-bold py-2.5 rounded-lg shadow-[0_0_15px_rgba(188,195,255,0.2)] hover:shadow-[0_0_25px_rgba(188,195,255,0.4)] transition-all disabled:opacity-50 mt-6"
        >
          {isSubmitting ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center text-[14px] text-on-surface-variant">
        Don't have an account? <Link href="/register" className="text-primary hover:underline font-medium">Create one</Link>
      </div>
    </div>
  );
}
