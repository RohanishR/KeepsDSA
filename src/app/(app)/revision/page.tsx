'use client';
import React, { useState } from 'react';

export default function RevisionPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center pt-8 pb-16">
      {/* Header / Context */}
      <div className="w-full max-w-[800px] mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-primary font-label-sm text-[12px] font-medium tracking-[0.05em] mb-2">
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>SPACED REPETITION SESSION</span>
          </div>
          <h2 className="font-headline-lg text-[32px] leading-[40px] font-bold text-on-surface tracking-tight">Daily Revision</h2>
        </div>
        <div className="text-right">
          <div className="text-on-surface-variant font-label-sm text-[12px] font-medium tracking-[0.05em] mb-1">Cards Due Today</div>
          <div className="text-2xl font-mono text-primary">12 <span className="text-outline-variant text-lg">/ 45</span></div>
        </div>
      </div>

      {/* Flashcard Container */}
      <div 
        className="w-full max-w-[800px] h-[400px] perspective-1000 relative group cursor-pointer" 
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`w-full h-full relative transform-style-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front of Card (Question) */}
          <div className="absolute inset-0 backface-hidden glass-panel rounded-xl border border-outline-variant/10 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] p-8 flex flex-col justify-between z-20">
            <div className="flex justify-between items-start">
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-surface-container-high border border-outline-variant/30 rounded text-[12px] font-medium tracking-[0.05em] text-primary">Dynamic Programming</span>
                <span className="px-2 py-1 bg-surface-container-high border border-outline-variant/30 rounded text-[12px] font-medium tracking-[0.05em] text-secondary">Trees</span>
              </div>
              <div className="flex items-center gap-1 text-error bg-error/10 px-2 py-1 rounded text-[12px] font-medium tracking-[0.05em] border border-error/20">
                <span className="material-symbols-outlined text-[14px]">local_fire_department</span> Hard
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center text-center px-12">
              <h3 className="text-[24px] leading-[32px] font-medium text-on-surface mb-4">Maximum Path Sum in a Binary Tree</h3>
              <p className="text-[16px] leading-[24px] text-on-surface-variant max-w-lg">
                Given a non-empty binary tree, find the maximum path sum. The path may start and end at any node in the tree.
              </p>
            </div>
            
            <div className="text-center">
              <span className="inline-flex items-center gap-2 text-primary/70 text-[12px] font-medium tracking-[0.05em] animate-pulse">
                <span className="material-symbols-outlined text-[18px]">touch_app</span>
                Click to Reveal Solution
              </span>
            </div>
          </div>

          {/* Back of Card (Answer) */}
          <div className="absolute inset-0 backface-hidden glass-panel rounded-xl border border-outline-variant/10 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] p-8 flex flex-col rotate-y-180 z-10 bg-surface-container-high/90">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/20">
              <h4 className="text-[24px] leading-[32px] font-medium text-primary">Key Insight</h4>
              <button className="text-on-surface-variant hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                <span className="material-symbols-outlined">edit_note</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              <p className="text-[16px] leading-[24px] text-on-surface-variant">
                For each node, we need to consider two things:
              </p>
              <ol className="list-decimal pl-5 text-on-surface-variant text-[16px] leading-[24px] space-y-2">
                <li>The maximum path sum that strictly goes <strong>through</strong> this node (left_child + right_child + node.val). This updates our global maximum.</li>
                <li>What this node <strong>returns</strong> to its parent (node.val + max(left_child, right_child)). If this return value is negative, we return 0 instead (ignore negative paths).</li>
              </ol>
              <div className="bg-surface/80 rounded border border-outline-variant/20 p-4 mt-4">
                <pre className="font-mono text-[14px] text-tertiary-fixed overflow-x-auto"><code>{`def maxPathSum(root):
    res = [root.val]

    def dfs(root):
        if not root: return 0
        leftMax = max(dfs(root.left), 0)
        rightMax = max(dfs(root.right), 0)
        
        # compute max path sum WITH split
        res[0] = max(res[0], root.val + leftMax + rightMax)
        
        return root.val + max(leftMax, rightMax)

    dfs(root)
    return res[0]`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Controls */}
      <div 
        className={`w-full max-w-[800px] mt-8 flex flex-wrap justify-center gap-4 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <button className="px-6 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-high hover:border-error/50 text-error transition-all flex flex-col items-center gap-1 min-w-[120px]">
          <span className="text-[12px] font-medium tracking-[0.05em]">Again</span>
          <span className="text-[10px] font-mono opacity-50">&lt; 1m</span>
        </button>
        <button className="px-6 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-high hover:border-error-container/50 text-error-container transition-all flex flex-col items-center gap-1 min-w-[120px]">
          <span className="text-[12px] font-medium tracking-[0.05em]">Hard</span>
          <span className="text-[10px] font-mono opacity-50">2d</span>
        </button>
        <button className="px-6 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-high hover:border-primary/50 text-primary transition-all flex flex-col items-center gap-1 min-w-[120px] shadow-[0_0_15px_rgba(188,195,255,0.1)]">
          <span className="text-[12px] font-medium tracking-[0.05em]">Good</span>
          <span className="text-[10px] font-mono opacity-50">5d</span>
        </button>
        <button className="px-6 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-high hover:border-secondary/50 text-secondary transition-all flex flex-col items-center gap-1 min-w-[120px]">
          <span className="text-[12px] font-medium tracking-[0.05em]">Easy</span>
          <span className="text-[10px] font-mono opacity-50">14d</span>
        </button>
      </div>
    </div>
  );
}
