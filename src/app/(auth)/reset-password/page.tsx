'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordInput } from '@/lib/validations/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setError('');
    
    try {
      // In a real application, you would make an API call to verify the token and update the password
      console.log('Resetting password...');
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('An error occurred. The link might be expired or invalid.');
    }
  };

  return (
    <div>
      <h2 className="text-[24px] font-bold text-foreground mb-2 text-center">Set New Password</h2>
      <p className="text-[14px] text-muted-foreground mb-6 text-center">
        Please enter your new password below.
      </p>
      
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded mb-6 text-[14px]">
          {error}
        </div>
      )}

      {success ? (
        <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-6 rounded mb-6 text-center">
          <span className="material-symbols-outlined text-[32px] mb-2 block text-secondary">check_circle</span>
          <p className="font-medium text-[14px]">Password Reset Successfully</p>
          <p className="text-[12px] opacity-80 mt-1">Redirecting you to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-muted-foreground font-subheading text-[12px] uppercase tracking-wider text-[12px] mb-1">New Password</label>
            <input 
              type="password" 
              {...register('password')}
              className={`w-full bg-card/50 border ${errors.password ? 'border-destructive' : 'border-border/30'} rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-destructive text-[12px]">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-muted-foreground font-subheading text-[12px] uppercase tracking-wider text-[12px] mb-1">Confirm New Password</label>
            <input 
              type="password" 
              {...register('confirmPassword')}
              className={`w-full bg-card/50 border ${errors.confirmPassword ? 'border-destructive' : 'border-border/30'} rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-destructive text-[12px]">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold py-2.5 rounded-lg shadow-[0_0_15px_rgba(188,195,255,0.2)] hover:shadow-[0_0_25px_rgba(188,195,255,0.4)] transition-all disabled:opacity-50 mt-6"
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}
