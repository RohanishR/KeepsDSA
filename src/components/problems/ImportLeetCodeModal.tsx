'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ImportLeetCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportLeetCodeModal({ isOpen, onClose }: ImportLeetCodeModalProps) {
  const router = useRouter();
  const [urlOrSlug, setUrlOrSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlOrSlug.trim()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/leetcode/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrSlug })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to import problem');
      }

      setSuccess(data.isCached ? 'Problem was already in your workspace!' : 'Problem imported successfully!');
      
      // Clear input and redirect to the problem workspace after short delay
      setTimeout(() => {
        setUrlOrSlug('');
        setSuccess('');
        onClose();
        router.push(`/problem/${data.problem.slug}`);
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={!isLoading ? onClose : undefined}
      ></div>

      {/* Modal */}
      <div className="relative bg-card border border-border/60 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#ffa116]/10 flex items-center justify-center">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" width={20} height={20} className="opacity-80" style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(10000%) hue-rotate(15deg) brightness(1.2)' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Import from LeetCode</h2>
              <p className="text-sm text-muted-foreground">Sync questions, tags, and difficulty.</p>
            </div>
          </div>

          <form onSubmit={handleImport} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-muted-foreground mb-1.5">
                LeetCode URL, Slug, or Question Title
              </label>
              <input
                id="url"
                type="text"
                autoFocus
                placeholder="https://leetcode.com/problems/two-sum/"
                value={urlOrSlug}
                onChange={(e) => setUrlOrSlug(e.target.value)}
                disabled={isLoading || !!success}
                className="w-full bg-background border border-border/60 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary disabled:opacity-50"
              />
              <p className="text-[11px] text-muted-foreground mt-1.5 opacity-70">
                You can paste the full URL, the problem slug (e.g. "two-sum"), or the question title (e.g. "1. Two Sum").
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-[#4ade80]/10 text-[#4ade80] px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <p>{success}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!urlOrSlug.trim() || isLoading || !!success}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#ffa116] hover:bg-[#ffa116]/90 text-black font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                    Importing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Import
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
