'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/validations/auth';

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError('');
    setSuccess(false);

    try {
      // In a real application, you would make an API call to send a reset email
      console.log('Sending password reset email to:', data.email);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-[24px] font-bold text-on-surface mb-2 text-center">Reset Password</h2>
      <p className="text-[14px] text-on-surface-variant mb-6 text-center">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded mb-6 text-[14px]">
          {error}
        </div>
      )}

      {success ? (
        <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-6 rounded mb-6 text-center">
          <span className="material-symbols-outlined text-[32px] mb-2 block">mark_email_read</span>
          <p className="font-medium text-[14px]">Check your inbox!</p>
          <p className="text-[12px] opacity-80 mt-1">We've sent a password reset link to your email.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="mt-4 text-[12px] underline hover:text-primary-container"
          >
            Try another email
          </button>
        </div>
      ) : (
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

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary font-bold py-2.5 rounded-lg shadow-[0_0_15px_rgba(188,195,255,0.2)] hover:shadow-[0_0_25px_rgba(188,195,255,0.4)] transition-all disabled:opacity-50 mt-6"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-[14px] text-on-surface-variant">
        Remembered your password? <Link href="/login" className="text-primary hover:underline font-medium">Back to Sign In</Link>
      </div>
    </div>
  );
}
