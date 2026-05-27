'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteAnimatedButtonProps {
  problemSlug: string;
  onDeleted?: () => void;
}

export default function DeleteAnimatedButton({ problemSlug, onDeleted }: DeleteAnimatedButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to permanently delete this problem and all its solutions?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/problems/${problemSlug}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete problem');
      }
      
      if (onDeleted) {
        onDeleted();
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
      alert('Failed to delete problem.');
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete Problem"
      className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full bg-[#141414] border border-border/20 font-semibold flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.164)] cursor-pointer transition-all duration-300 overflow-hidden relative group hover:w-[120px] md:hover:w-[140px] hover:rounded-[50px] hover:bg-[#ff4545] disabled:opacity-50 shrink-0"
    >
      <div className="absolute -top-5 content-['Delete'] text-white transition-all duration-300 text-[2px] font-bold group-hover:text-[13px] group-hover:translate-y-[35px] md:group-hover:translate-y-[30px] opacity-0 group-hover:opacity-100">
        Delete
      </div>
      <svg 
        viewBox="0 0 448 512" 
        className={`w-[12px] transition-all duration-300 fill-white ${isDeleting ? 'animate-bounce' : 'group-hover:translate-y-[200%] md:group-hover:translate-y-[250%]'}`}
      >
        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
      </svg>
    </button>
  );
}
