'use client';

import React, { useState } from 'react';
import AddSolutionForm from './AddSolutionForm';
import NotesEditor from './NotesEditor';
import SolutionViewer from './SolutionViewer';
import AttachmentsManager from './AttachmentsManager';
import { formatDistanceToNow } from 'date-fns';

interface ProblemWorkspaceProps {
  problem: any;
  initialSolutions: any[];
  initialNote?: any;
  initialRevisions?: any[];
}

export default function ProblemWorkspace({ problem, initialSolutions, initialNote, initialRevisions = [] }: ProblemWorkspaceProps) {
  // Determine default tab
  const defaultTab = initialSolutions.length > 0 ? initialSolutions[0]._id.toString() : 'add_solution';
  
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeSolution = initialSolutions.find(s => s._id.toString() === activeTab);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      {/* Dynamic Workspace Area */}
      <section className={`bg-surface-container-lowest rounded-xl border border-outline-variant/10 flex flex-col overflow-hidden shadow-inner relative transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-50 col-span-1 lg:col-span-12' : 'col-span-1 lg:col-span-6'}`}>
        
        {/* Tab Bar (VS Code Style) */}
        <div className="h-10 bg-surface-container-low border-b border-outline-variant/10 flex items-center justify-between px-1">
          <div className="flex overflow-x-auto custom-scrollbar h-full">
            {initialSolutions.map((sol: any) => (
              <button 
                key={sol._id.toString()} 
                onClick={() => setActiveTab(sol._id.toString())}
                className={`px-4 h-full font-label-sm text-[12px] flex items-center gap-2 whitespace-nowrap transition-colors border-r border-outline-variant/10
                  ${activeTab === sol._id.toString() 
                    ? 'bg-surface-container-lowest text-on-surface border-t-2 border-t-primary' 
                    : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface border-t-2 border-t-transparent'}
                `}
              >
                <span className={`material-symbols-outlined text-[14px] ${sol.isOptimal ? 'text-primary' : ''}`}>code</span>
                {sol.title}
              </button>
            ))}
            
            <button 
              onClick={() => setActiveTab('add_solution')}
              className={`px-4 h-full font-label-sm text-[12px] flex items-center gap-2 whitespace-nowrap transition-colors border-r border-outline-variant/10
                ${activeTab === 'add_solution' 
                  ? 'bg-surface-container-lowest text-primary border-t-2 border-t-primary' 
                  : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-primary border-t-2 border-t-transparent'}
              `}
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              New
            </button>

            <button 
              onClick={() => setActiveTab('notes')}
              className={`px-4 h-full font-label-sm text-[12px] flex items-center gap-2 whitespace-nowrap transition-colors border-r border-outline-variant/10
                ${activeTab === 'notes' 
                  ? 'bg-surface-container-lowest text-on-surface border-t-2 border-t-primary' 
                  : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface border-t-2 border-t-transparent'}
              `}
            >
              <span className="material-symbols-outlined text-[14px]">edit_note</span>
              Notes
            </button>

            <button 
              onClick={() => setActiveTab('attachments')}
              className={`px-4 h-full font-label-sm text-[12px] flex items-center gap-2 whitespace-nowrap transition-colors border-r border-outline-variant/10
                ${activeTab === 'attachments' 
                  ? 'bg-surface-container-lowest text-on-surface border-t-2 border-t-primary' 
                  : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface border-t-2 border-t-transparent'}
              `}
            >
              <span className="material-symbols-outlined text-[14px]">attachment</span>
              Attachments
            </button>

            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 h-full font-label-sm text-[12px] flex items-center gap-2 whitespace-nowrap transition-colors border-r border-outline-variant/10
                ${activeTab === 'history' 
                  ? 'bg-surface-container-lowest text-on-surface border-t-2 border-t-primary' 
                  : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface border-t-2 border-t-transparent'}
              `}
            >
              <span className="material-symbols-outlined text-[14px]">history</span>
              History
            </button>
          </div>
          
          <div className="flex items-center gap-1 px-2">
            <button 
              onClick={toggleFullscreen}
              className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Workspace Content */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'add_solution' ? (
            <AddSolutionForm 
              slug={problem.slug} 
              onSuccess={() => {}} 
            />
          ) : activeTab === 'notes' ? (
            <NotesEditor slug={problem.slug} initialNote={initialNote} />
          ) : activeTab === 'attachments' ? (
            <AttachmentsManager slug={problem.slug} initialAttachments={initialNote?.attachments || []} />
          ) : activeTab === 'history' ? (
            <div className="h-full bg-surface-container-lowest p-6 overflow-y-auto custom-scrollbar">
              <h3 className="font-headline-sm text-[18px] text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">update</span>
                Revision Log
              </h3>
              {initialRevisions.length === 0 ? (
                <div className="text-center py-10 opacity-60">
                  <span className="material-symbols-outlined text-[48px] mb-2">history_toggle_off</span>
                  <p className="text-sm">No revisions recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {initialRevisions.map((rev: any, index: number) => (
                    <div key={rev._id.toString()} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 relative">
                      {index === 0 && (
                        <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-primary/20 text-primary border border-primary/30 tracking-wider">
                          Latest
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2 text-on-surface-variant text-[13px]">
                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                        {formatDistanceToNow(new Date(rev.reviewedAt), { addSuffix: true })}
                      </div>
                      <div className="flex gap-4 text-[14px]">
                        <div>
                          <span className="text-on-surface-variant text-[12px] block">Confidence</span>
                          <span className={`font-medium ${rev.confidenceScore >= 4 ? 'text-[#4ade80]' : rev.confidenceScore === 3 ? 'text-[#facc15]' : 'text-[#f87171]'}`}>
                            {rev.confidenceScore} / 5
                          </span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant text-[12px] block">Next Due</span>
                          <span className="text-on-surface font-medium">{new Date(rev.nextRevisionDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant text-[12px] block">Interval</span>
                          <span className="text-on-surface font-medium">{rev.interval} days</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeSolution ? (
            <SolutionViewer solution={activeSolution} />
          ) : null}
        </div>
      </section>

      {/* Column 3: Analysis & Context Sidebar (Updates based on Active Solution) */}
      {!isFullscreen && (
        <section className="col-span-1 lg:col-span-3 flex flex-col gap-stack-gap-md overflow-hidden">
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
              <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
              AI Explanation
            </h3>
            <div className="overflow-y-auto flex-1 font-body-md text-sm text-on-surface-variant space-y-3 custom-scrollbar">
              {activeSolution?.explanation ? (
                <div 
                  className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: activeSolution.explanation.replace(/\n/g, '<br/>') }}
                />
              ) : activeTab === 'notes' ? (
                <div className="flex flex-col items-center justify-center h-full opacity-60 text-center px-4">
                  <span className="material-symbols-outlined text-[40px] mb-2">edit_note</span>
                  <p>You are viewing your personal notes.</p>
                </div>
              ) : activeTab === 'add_solution' ? (
                <div className="flex flex-col items-center justify-center h-full opacity-60 text-center px-4">
                  <span className="material-symbols-outlined text-[40px] mb-2">psychology</span>
                  <p>Save a solution to attach an AI explanation.</p>
                </div>
              ) : activeTab === 'history' ? (
                <div className="flex flex-col items-center justify-center h-full opacity-60 text-center px-4">
                  <span className="material-symbols-outlined text-[40px] mb-2">history</span>
                  <p>Viewing Spaced Repetition Logs.</p>
                </div>
              ) : (
                <p className="italic opacity-60">No explanation provided for this solution.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
