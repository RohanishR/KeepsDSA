'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { problemSchema, ProblemInput } from '@/lib/validations/problem';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

interface AddProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = z.input<typeof problemSchema>;

export default function AddProblemModal({ isOpen, onClose }: AddProblemModalProps) {
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      slug: '',
      difficulty: 'Medium',
      tags: '',
      companies: '',
      leetcodeUrl: '',
    },
  });

  const onSubmit = async (data: any) => {
    setError('');
    
    // Zod schema automatically transforms tags and companies strings into arrays
    const processedData = data as ProblemInput;

    try {
      const res = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to create problem');
      }

      reset();
      onClose();
      router.refresh(); // Refresh current route to show new problem
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-background border-l border-border/20 shadow-2xl z-50 overflow-y-auto slide-in-from-right">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[20px] font-bold text-foreground">Add New Problem</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-primary">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 text-[14px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-muted-foreground mb-1">Title</label>
              <input 
                {...register('title')}
                className="w-full bg-card/50 border border-border/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                placeholder="Two Sum"
                onChange={(e) => {
                  // Auto-generate slug
                  register('title').onChange(e);
                  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                  if (slugInput && !slugInput.value) {
                    slugInput.value = slug;
                  }
                }}
              />
              {errors.title && <p className="text-destructive text-[12px] mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-[12px] font-medium text-muted-foreground mb-1">Slug</label>
              <input 
                {...register('slug')}
                className="w-full bg-card/50 border border-border/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                placeholder="two-sum"
              />
              {errors.slug && <p className="text-destructive text-[12px] mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="block text-[12px] font-medium text-muted-foreground mb-1">Difficulty</label>
              <select 
                {...register('difficulty')}
                className="w-full bg-card/50 border border-border/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-muted-foreground mb-1">LeetCode URL (Optional)</label>
              <input 
                {...register('leetcodeUrl')}
                className="w-full bg-card/50 border border-border/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                placeholder="https://leetcode.com/problems/..."
              />
              {errors.leetcodeUrl && <p className="text-destructive text-[12px] mt-1">{errors.leetcodeUrl.message}</p>}
            </div>

            <div>
              <label className="block text-[12px] font-medium text-muted-foreground mb-1">Tags (comma separated)</label>
              <input 
                {...register('tags')}
                className="w-full bg-card/50 border border-border/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                placeholder="Array, Hash Table"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-muted-foreground mb-1">Companies (comma separated)</label>
              <input 
                {...register('companies')}
                className="w-full bg-card/50 border border-border/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                placeholder="Google, Amazon"
              />
            </div>

            <div className="pt-4 border-t border-border/20 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors text-[14px] font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-[14px] font-bold disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Add Problem'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
