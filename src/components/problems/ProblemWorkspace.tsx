'use client';

import React, { useState } from 'react';
import AddSolutionForm from './AddSolutionForm';
import NotesEditor from './NotesEditor';

interface ProblemWorkspaceProps {
  problem: any;
  initialSolutions: any[];
  initialNote?: any;
}

export default function ProblemWorkspace({ problem, initialSolutions, initialNote }: ProblemWorkspaceProps) {
  // Determine default tab: if solutions exist, pick the first one's ID. Otherwise, default to 'add_solution'.
  const defaultTab = initialSolutions.length > 0 ? initialSolutions[0]._id.toString() : 'add_solution';
  
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const activeSolution = initialSolutions.find(s => s._id.toString() === activeTab);

  return (
    <>
      {/* Column 2: Code Editor / Solutions / Notes Placeholder */}
      <section className="col-span-1 md:col-span-6 bg-surface-container-lowest rounded-xl border border-outline-variant/10 flex flex-col overflow-hidden shadow-inner relative">
        <div className="h-10 bg-surface-container-low border-b border-outline-variant/10 flex items-center justify-between px-3">
          <div className="flex gap-1 overflow-x-auto custom-scrollbar">
            {initialSolutions.map((sol: any) => (
              <button 
                key={sol._id.toString()} 
                onClick={() => setActiveTab(sol._id.toString())}
                className={`px-3 py-1 font-label-sm text-[12px] rounded-t flex items-center gap-2 whitespace-nowrap
                  ${activeTab === sol._id.toString() 
                    ? 'bg-surface-container-highest text-on-surface border-t border-l border-r border-outline-variant/20' 
                    : 'text-on-surface-variant hover:text-on-surface'}
                `}
              >
                <span className={`material-symbols-outlined text-[16px] ${sol.isOptimal ? 'text-primary' : ''}`}>code</span>
                {sol.title}
              </button>
            ))}
            
            <button 
              onClick={() => setActiveTab('add_solution')}
              className={`px-3 py-1 font-label-sm text-[12px] rounded-t flex items-center gap-2 border-l border-outline-variant/10 pl-3 whitespace-nowrap
                ${activeTab === 'add_solution' 
                  ? 'bg-surface-container-highest text-primary border-t border-r border-outline-variant/20' 
                  : 'text-primary hover:text-primary-fixed'}
              `}
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add Solution
            </button>

            <button 
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1 font-label-sm text-[12px] rounded-t flex items-center gap-2 border-l border-outline-variant/10 pl-3 whitespace-nowrap
                ${activeTab === 'notes' 
                  ? 'bg-surface-container-highest text-on-surface border-t border-r border-outline-variant/20' 
                  : 'text-on-surface-variant hover:text-on-surface'}
              `}
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              Notes
            </button>
          </div>
          <div className="flex items-center gap-2 pl-2">
            {activeSolution && (
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">
                {activeSolution.language}
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Workspace Content */}
        {activeTab === 'add_solution' ? (
          <AddSolutionForm 
            slug={problem.slug} 
            onSuccess={() => {
              // Usually we'd want to set active tab to the new solution, but we'd need its ID.
              // A page refresh will pick it up automatically via the page.tsx fetching.
            }} 
          />
        ) : activeTab === 'notes' ? (
          <NotesEditor slug={problem.slug} initialNote={initialNote} />
        ) : activeSolution ? (
          <div className="flex-1 p-4 font-mono text-[14px] overflow-y-auto leading-relaxed text-tertiary relative">
             <pre className="whitespace-pre-wrap"><code>{activeSolution.code}</code></pre>
          </div>
        ) : null}
      </section>

      {/* Column 3: AI Analysis & Context (Updates based on Active Solution) */}
      <section className="col-span-1 md:col-span-3 flex flex-col gap-stack-gap-md overflow-hidden">
        <div className="bg-surface-container-low/50 backdrop-blur-md rounded-xl border border-outline-variant/10 p-4 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
          <h3 className="font-label-sm text-[12px] text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">speed</span>
            Complexity Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-surface-container-lowest px-3 py-2 rounded border border-outline-variant/10">
              <span className="text-sm text-on-surface">Time</span>
              <span className="font-mono text-[14px] text-secondary">
                {activeSolution?.timeComplexity || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center bg-surface-container-lowest px-3 py-2 rounded border border-outline-variant/10">
              <span className="text-sm text-on-surface">Space</span>
              <span className="font-mono text-[14px] text-secondary">
                {activeSolution?.spaceComplexity || '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-surface-container-low/50 backdrop-blur-md rounded-xl border border-outline-variant/10 p-4 flex flex-col overflow-hidden shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
          <h3 className="font-label-sm text-[12px] text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">description</span>
            Explanation
          </h3>
          <div className="overflow-y-auto flex-1 font-body-md text-sm text-on-surface-variant space-y-3">
            {activeSolution?.explanation ? (
              <p className="whitespace-pre-wrap">{activeSolution.explanation}</p>
            ) : activeTab === 'notes' ? (
              <p className="italic opacity-60">You are currently viewing notes.</p>
            ) : activeTab === 'add_solution' ? (
              <p className="italic opacity-60">Add a new solution to see its explanation here.</p>
            ) : (
              <p className="italic opacity-60">No explanation provided for this solution.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
