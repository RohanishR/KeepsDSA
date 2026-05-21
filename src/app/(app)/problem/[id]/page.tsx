import React from 'react';
import Link from 'next/link';

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  // Mock data for UI demonstration based on the provided HTML
  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-stack-gap-md h-[calc(100vh-8rem)]">
      {/* Column 1: Problem Statement (Span 3 on Desktop) */}
      <section className="col-span-1 md:col-span-3 bg-surface-container-low/50 backdrop-blur-md rounded-xl border border-outline-variant/10 flex flex-col overflow-hidden shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
        <div className="p-4 border-b border-outline-variant/10 flex justify-between items-start">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">1. Two Sum</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-secondary/10 text-secondary border border-secondary/20">Easy</span>
              <div className="flex gap-1">
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-surface-container-highest text-on-surface-variant border border-outline-variant/20">Google</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-surface-container-highest text-on-surface-variant border border-outline-variant/20">Amazon</span>
              </div>
            </div>
          </div>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">bookmark_border</span>
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1 font-body-md text-body-md text-on-surface-variant space-y-4">
          <p>Given an array of integers <code className="font-mono text-[14px] bg-surface-container-high px-1 py-0.5 rounded text-primary">nums</code> and an integer <code className="font-mono text-[14px] bg-surface-container-high px-1 py-0.5 rounded text-primary">target</code>, return <em>indices of the two numbers such that they add up to <code className="font-mono text-[14px] bg-surface-container-high px-1 py-0.5 rounded text-primary">target</code></em>.</p>
          <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
          <p>You can return the answer in any order.</p>
          <div className="mt-6 space-y-4">
            <div className="bg-surface-container-lowest p-3 rounded border border-outline-variant/10">
              <p className="font-bold text-on-surface mb-1 text-sm">Example 1:</p>
              <div className="font-mono text-[14px] text-tertiary">
                <div><span className="text-on-surface-variant">Input:</span> nums = [2,7,11,15], target = 9</div>
                <div><span className="text-on-surface-variant">Output:</span> [0,1]</div>
                <div className="text-[12px] mt-1 text-on-surface-variant/70">Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Column 2: Code Editor / Notes Editor Placeholder (Span 6 on Desktop) */}
      <section className="col-span-1 md:col-span-6 bg-surface-container-lowest rounded-xl border border-outline-variant/10 flex flex-col overflow-hidden shadow-inner relative">
        <div className="h-10 bg-surface-container-low border-b border-outline-variant/10 flex items-center justify-between px-3">
          <div className="flex gap-1">
            <button className="px-3 py-1 bg-surface-container-highest text-on-surface font-label-sm text-[12px] rounded-t border-t border-l border-r border-outline-variant/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary">code</span>
              Optimal.py
            </button>
            <button className="px-3 py-1 text-on-surface-variant hover:text-on-surface font-label-sm text-[12px] rounded-t flex items-center gap-2">
              BruteForce.py
            </button>
            <Link href={`/problem/${params.id}/notes`} className="px-3 py-1 text-on-surface-variant hover:text-on-surface font-label-sm text-[12px] rounded-t flex items-center gap-2 ml-2 border-l border-outline-variant/10 pl-3">
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              Notes
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">Python 3</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
          </div>
        </div>
        <div className="flex-1 p-4 font-mono text-[14px] overflow-y-auto leading-relaxed text-tertiary relative">
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-surface-container-lowest border-r border-outline-variant/5 flex flex-col text-right pr-2 py-4 text-on-surface-variant/30 select-none">
            <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
          </div>
          <div className="pl-8">
            <pre><code>
<span className="text-[#c586c0]">class</span> <span className="text-[#4ec9b0]">Solution</span>:
    <span className="text-[#c586c0]">def</span> <span className="text-[#dcdcaa]">twoSum</span>(<span className="text-[#9cdcfe]">self</span>, <span className="text-[#9cdcfe]">nums</span>: List[<span className="text-[#4ec9b0]">int</span>], <span className="text-[#9cdcfe]">target</span>: <span className="text-[#4ec9b0]">int</span>) -&gt; List[<span className="text-[#4ec9b0]">int</span>]:
        <span className="text-[#6a9955]"># Hash map to store value -&gt; index</span>
        numMap = {'{}'}
        <span className="text-[#c586c0]">for</span> i, n <span className="text-[#c586c0]">in</span> <span className="text-[#dcdcaa]">enumerate</span>(nums):
            diff = target - n
            <span className="text-[#c586c0]">if</span> diff <span className="text-[#c586c0]">in</span> numMap:
                <span className="text-[#c586c0]">return</span> [numMap[diff], i]
            numMap[n] = i
            </code></pre>
          </div>
        </div>
      </section>

      {/* Column 3: AI Analysis & Context (Span 3 on Desktop) */}
      <section className="col-span-1 md:col-span-3 flex flex-col gap-stack-gap-md overflow-hidden">
        <div className="bg-surface-container-low/50 backdrop-blur-md rounded-xl border border-outline-variant/10 p-4 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
          <h3 className="font-label-sm text-[12px] text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">speed</span>
            Complexity Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-surface-container-lowest px-3 py-2 rounded border border-outline-variant/10">
              <span className="text-sm text-on-surface">Time</span>
              <span className="font-mono text-[14px] text-secondary">O(n)</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container-lowest px-3 py-2 rounded border border-outline-variant/10">
              <span className="text-sm text-on-surface">Space</span>
              <span className="font-mono text-[14px] text-secondary">O(n)</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-surface-container-low/50 backdrop-blur-md rounded-xl border border-outline-variant/10 p-4 flex flex-col overflow-hidden shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
          <h3 className="font-label-sm text-[12px] text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
            AI Insight
          </h3>
          <div className="overflow-y-auto flex-1 font-body-md text-sm text-on-surface-variant space-y-3">
            <p>The optimal approach uses a single pass hash table.</p>
            <p>While iterating through the array, we calculate the <code className="font-mono text-xs bg-surface px-1 rounded">diff = target - current_value</code>.</p>
            <p>If this <code className="font-mono text-xs bg-surface px-1 rounded">diff</code> exists in our hash map, we've found our pair. If not, we store the current value and its index to check against future elements.</p>
            <div className="mt-4 p-3 bg-primary-container/10 border border-primary/20 rounded-lg text-primary text-xs flex gap-2 items-start">
              <span className="material-symbols-outlined text-[16px] mt-0.5">lightbulb</span>
              <span>This reduces the time complexity from O(n²) in the brute force approach to O(n) by trading space for time.</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low/50 backdrop-blur-md rounded-xl border border-outline-variant/10 p-4 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
          <h3 className="font-label-sm text-[12px] text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">history</span>
            Revision History
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span className="text-on-surface flex-1">Solved</span>
              <span className="text-on-surface-variant text-xs">Today</span>
            </div>
            <div className="flex items-center gap-3 text-sm opacity-60">
              <div className="w-2 h-2 rounded-full border border-outline-variant"></div>
              <span className="text-on-surface flex-1">Attempted</span>
              <span className="text-on-surface-variant text-xs">2w ago</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
