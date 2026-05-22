'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { solutionSchema, SolutionInput } from '@/lib/validations/solution';
import { useRouter } from 'next/navigation';

interface AddSolutionFormProps {
  slug: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type FormValues = {
  title: string;
  language: string;
  approachType?: 'Brute Force' | 'Better' | 'Optimal' | 'Other';
  code: string;
  explanation?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  isOptimal?: boolean;
};

export default function AddSolutionForm({ slug, onSuccess, onCancel }: AddSolutionFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(solutionSchema),
    defaultValues: {
      title: '',
      language: 'Python',
      approachType: 'Optimal',
      code: '',
      explanation: '',
      timeComplexity: '',
      spaceComplexity: '',
      isOptimal: false,
    },
  });

  const onSubmit = async (data: any) => {
    setError('');
    const processedData = data as SolutionInput;
    
    try {
      const res = await fetch(`/api/problems/${slug}/solutions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to create solution');
      }

      reset();
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 text-on-surface">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Add New Solution</h2>

        {error && (
          <div className="bg-error/10 text-error px-4 py-3 rounded-lg mb-6 text-[14px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-on-surface-variant mb-1">Title (e.g. Optimized Hash Map)</label>
              <input 
                {...register('title')}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                placeholder="Title"
              />
              {errors.title && <p className="text-error text-[12px] mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-[12px] font-medium text-on-surface-variant mb-1">Language</label>
              <select 
                {...register('language')}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="Go">Go</option>
                <option value="Rust">Rust</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-on-surface-variant mb-1">Approach Type</label>
              <select 
                {...register('approachType')}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="Optimal">Optimal</option>
                <option value="Better">Better</option>
                <option value="Brute Force">Brute Force</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input 
                type="checkbox"
                id="isOptimal"
                {...register('isOptimal')}
                className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary bg-surface-container-low"
              />
              <label htmlFor="isOptimal" className="text-[14px] text-on-surface-variant select-none cursor-pointer">
                Mark as the optimal solution
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-on-surface-variant mb-1">Code</label>
            <textarea 
              {...register('code')}
              className="w-full h-48 font-mono text-[14px] bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary resize-y"
              placeholder="def twoSum(self, nums: List[int], target: int) -> List[int]:..."
              spellCheck={false}
            />
            {errors.code && <p className="text-error text-[12px] mt-1">{errors.code.message}</p>}
          </div>

          <div>
            <label className="block text-[12px] font-medium text-on-surface-variant mb-1">Explanation (Markdown supported)</label>
            <textarea 
              {...register('explanation')}
              className="w-full h-32 bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary resize-y"
              placeholder="Explain the intuition and steps..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-on-surface-variant mb-1">Time Complexity</label>
              <input 
                {...register('timeComplexity')}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                placeholder="O(N)"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-on-surface-variant mb-1">Space Complexity</label>
              <input 
                {...register('spaceComplexity')}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                placeholder="O(N)"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/20 flex justify-end gap-3">
            {onCancel && (
              <button 
                type="button" 
                onClick={onCancel}
                className="px-6 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-colors font-medium"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors font-bold disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Solution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
