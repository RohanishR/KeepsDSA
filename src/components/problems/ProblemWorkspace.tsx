'use client';

import React, { useState, useEffect } from 'react';
import AddSolutionForm from './AddSolutionForm';
import NotesEditor from './NotesEditor';
import SolutionViewer from './SolutionViewer';
import AttachmentsManager from './AttachmentsManager';
import { formatDistanceToNow } from 'date-fns';
import { Panel, Group, Separator } from 'react-resizable-panels';

interface ProblemWorkspaceProps {
  problem: any;
  initialSolutions: any[];
  initialNote?: any;
  initialRevisions?: any[];
  username?: string;
  isProfilePublic?: boolean;
  leftPanelContent?: React.ReactNode;
}

export default function ProblemWorkspace({ problem, initialSolutions, initialNote, initialRevisions = [], username, isProfilePublic, leftPanelContent }: ProblemWorkspaceProps) {
  const defaultTab = initialSolutions.length > 0 ? initialSolutions[0]._id.toString() : 'add_solution';
  
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia('(max-width: 1024px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const activeSolution = initialSolutions.find(s => s._id.toString() === activeTab);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsEditing(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleShare = () => {
    if (!username || !isProfilePublic) {
      alert("Enable your public profile in Settings to share solutions.");
      return;
    }
    const url = `${window.location.origin}/u/${username}/problem/${problem.slug}`;
    navigator.clipboard.writeText(url);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleDeleteSolution = async (solutionId: string) => {
    if (!confirm('Are you sure you want to delete this solution?')) return;
    try {
      const res = await fetch(`/api/problems/${problem.slug}/solutions/${solutionId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const getDifficultyIcon = (confidence: number) => {
    if (confidence >= 4) return { icon: 'sentiment_very_satisfied', color: 'text-[#4ade80]' };
    if (confidence === 3) return { icon: 'sentiment_neutral', color: 'text-[#facc15]' };
    return { icon: 'sentiment_very_dissatisfied', color: 'text-[#f87171]' };
  };

  const showRightPanel = !isFullscreen && activeTab !== 'notes' && activeTab !== 'attachments' && activeTab !== 'history';

  const centerPanelContent = (
    <section className="bg-card rounded-xl border border-border/10 flex flex-col overflow-hidden shadow-inner relative h-full">
      {/* Tab Bar */}
        <div className="h-11 bg-muted border-b border-border/10 flex items-center justify-between px-1 shrink-0 select-none">
          <div className="flex overflow-x-auto custom-scrollbar h-full items-center gap-1">
            {initialSolutions.map((sol: any) => (
              <button 
                key={sol._id.toString()} 
                onClick={() => handleTabChange(sol._id.toString())}
                className={`px-3 py-1.5 h-[34px] rounded-md text-[12px] flex items-center gap-2 whitespace-nowrap transition-all font-medium border
                  ${activeTab === sol._id.toString() 
                    ? 'bg-accent text-foreground border-border/20 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 border-transparent'}
                `}
              >
                <span className={`material-symbols-outlined text-[16px] ${sol.isOptimal ? 'text-primary' : 'opacity-70'}`}>
                  {sol.isOptimal ? 'star' : 'code'}
                </span>
                <span className="max-w-[120px] truncate">{sol.title}</span>
              </button>
            ))}
            
            {initialSolutions.length > 0 && <div className="w-px h-5 bg-outline-variant/20 mx-1 shrink-0"></div>}

            <button 
              onClick={() => handleTabChange('add_solution')} 
              className={`px-3 py-1.5 h-[34px] rounded-md text-[12px] flex items-center gap-2 whitespace-nowrap transition-all font-medium border
                ${activeTab === 'add_solution' 
                  ? 'bg-primary/10 text-primary border-primary/20 shadow-sm' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5 border-transparent'}`}
            >
              <span className="material-symbols-outlined text-[16px]">add</span> New Solution
            </button>

            <button 
              onClick={() => handleTabChange('notes')} 
              className={`px-3 py-1.5 h-[34px] rounded-md text-[12px] flex items-center gap-2 whitespace-nowrap transition-all font-medium border
                ${activeTab === 'notes' 
                  ? 'bg-accent text-foreground border-border/20 shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 border-transparent'}`}
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span> Notes
            </button>

            <button 
              onClick={() => handleTabChange('attachments')} 
              className={`px-3 py-1.5 h-[34px] rounded-md text-[12px] flex items-center gap-2 whitespace-nowrap transition-all font-medium border
                ${activeTab === 'attachments' 
                  ? 'bg-accent text-foreground border-border/20 shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 border-transparent'}`}
            >
              <span className="material-symbols-outlined text-[16px]">attachment</span> Files
            </button>

            <button 
              onClick={() => handleTabChange('history')} 
              className={`px-3 py-1.5 h-[34px] rounded-md text-[12px] flex items-center gap-2 whitespace-nowrap transition-all font-medium border
                ${activeTab === 'history' 
                  ? 'bg-accent text-foreground border-border/20 shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 border-transparent'}`}
            >
              <span className="material-symbols-outlined text-[16px]">history</span> History
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 px-1 shrink-0">
            <button onClick={handleShare} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Share Solution">
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
            <button onClick={toggleFullscreen} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <span className="material-symbols-outlined text-[18px]">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Workspace Content */}
        <div className="flex-1 overflow-hidden relative min-h-0 bg-background">
        {activeTab === 'add_solution' ? (
          <AddSolutionForm slug={problem.slug} onSuccess={() => { window.location.reload(); }} />
        ) : activeTab === 'notes' ? (
          <NotesEditor slug={problem.slug} initialNote={initialNote} />
        ) : activeTab === 'attachments' ? (
          <AttachmentsManager slug={problem.slug} initialAttachments={initialNote?.attachments || []} />
        ) : activeTab === 'history' ? (
          <div className="h-full bg-background p-6 overflow-y-auto custom-scrollbar flex gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[16px] text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">update</span>
                  Revision Log
                </h3>
                <span className="text-xs text-muted-foreground">{initialRevisions.length} revision{initialRevisions.length !== 1 ? 's' : ''}</span>
              </div>
              {initialRevisions.length === 0 ? (
                <div className="text-center py-16 opacity-50">
                  <span className="material-symbols-outlined text-[48px] mb-3 block text-muted-foreground">history_toggle_off</span>
                  <p className="text-sm text-muted-foreground">No revisions recorded yet.</p>
                  <p className="text-xs text-muted-foreground mt-1">Complete a review session to start tracking.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {initialRevisions.map((rev: any, index: number) => {
                    const { icon, color } = getDifficultyIcon(rev.confidenceScore);
                    return (
                      <div key={rev._id.toString()} className="bg-card p-4 rounded-xl border border-border flex items-center gap-4 relative group hover:border-border transition-colors">
                        <div className={`w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0 border border-border`}>
                          <span className={`material-symbols-outlined text-[22px] ${color}`}>{icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm ${color}`}>{rev.confidenceScore}/5</span>
                            {index === 0 && <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-primary/20 text-primary border border-primary/30 tracking-wider">Latest</span>}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                            <span>{rev.reviewedAt ? formatDistanceToNow(new Date(rev.reviewedAt), { addSuffix: true }) : 'Just now'}</span>
                            <span>•</span>
                            <span>Next: {rev.nextRevisionDate ? new Date(rev.nextRevisionDate).toLocaleDateString() : 'TBD'}</span>
                            <span>•</span>
                            <span>{rev.interval}d interval</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {initialRevisions.length > 0 && (
              <div className="w-[280px] shrink-0 space-y-4 bg-card p-5 rounded-xl border border-border h-fit">
                <div className="text-center">
                  <span className="text-3xl font-bold text-foreground">{initialRevisions.length}</span>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Total Reviews</p>
                </div>
                <div className="h-px bg-[#3c3c3c]"></div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Avg Confidence</span>
                  <p className="text-lg font-bold text-foreground mt-1">
                    {(initialRevisions.reduce((acc: number, r: any) => acc + (r.confidenceScore || 0), 0) / initialRevisions.length).toFixed(1)} / 5
                  </p>
                </div>
                {initialRevisions[0]?.nextRevisionDate && (
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Next Review</span>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {new Date(initialRevisions[0].nextRevisionDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : activeSolution ? (
          isEditing ? (
            <AddSolutionForm slug={problem.slug} initialSolution={activeSolution} onSuccess={() => { setIsEditing(false); window.location.reload(); }} />
          ) : (
            <SolutionViewer solution={activeSolution} />
          )
        ) : null}
      </div>
    </section>
  );

  const rightPanelContent = (
    <section className="h-full flex flex-col gap-3 overflow-hidden">
      {activeSolution && (
        <div className="bg-card/50/50 backdrop-blur-md rounded-xl border border-border/10 overflow-hidden shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] shrink-0">
          <div className="p-4 space-y-2">
            <h3 className="font-subheading text-[12px] uppercase tracking-wider text-[10px] text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">speed</span> Complexity
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-card px-3 py-2 rounded-lg border border-border/10">
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold block mb-0.5">Time</span>
                <span className="font-mono text-sm text-secondary font-bold">{activeSolution.timeComplexity || '—'}</span>
              </div>
              <div className="bg-card px-3 py-2 rounded-lg border border-border/10">
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold block mb-0.5">Space</span>
                <span className="font-mono text-sm text-secondary font-bold">{activeSolution.spaceComplexity || '—'}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/10 p-3 flex gap-2">
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="flex-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary py-1.5 rounded-lg hover:bg-accent transition-colors">
                <span className="material-symbols-outlined text-[14px]">edit</span> Edit
              </button>
            )}
            <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary py-1.5 rounded-lg hover:bg-accent transition-colors">
              <span className="material-symbols-outlined text-[14px]">share</span> Share
            </button>
            <button onClick={() => navigator.clipboard.writeText(activeSolution.code)} className="flex-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground py-1.5 rounded-lg hover:bg-accent transition-colors">
              <span className="material-symbols-outlined text-[14px]">content_copy</span> Copy
            </button>
            <button onClick={() => handleDeleteSolution(activeSolution._id)} className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-destructive py-1.5 px-2 rounded-lg hover:bg-destructive/10 transition-colors">
              <span className="material-symbols-outlined text-[14px]">delete</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 bg-card/50/50 backdrop-blur-md rounded-xl border border-border/10 flex flex-col overflow-hidden shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
        <div className="px-4 py-3 border-b border-border/10 flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
          <h3 className="font-subheading text-[12px] uppercase tracking-wider text-[11px] text-foreground uppercase tracking-wider font-bold">
            {activeTab === 'notes' ? 'Notes Mode' : activeTab === 'history' ? 'Revision Stats' : activeTab === 'add_solution' ? 'New Solution' : 'Explanation'}
          </h3>
        </div>
        <div className="overflow-y-auto flex-1 p-4 text-sm text-muted-foreground custom-scrollbar">
          {activeSolution?.explanation ? (
            <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:text-[13px]" dangerouslySetInnerHTML={{ __html: activeSolution.explanation.replace(/\n/g, '<br/>') }} />
          ) : activeTab === 'notes' ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 text-center px-4 py-8">
              <span className="material-symbols-outlined text-[36px] mb-3">edit_note</span>
              <p className="text-xs">Write your personal notes using Markdown.</p>
              <p className="text-[10px] mt-1 text-muted-foreground/60">Supports math formulas and code blocks.</p>
            </div>
          ) : activeTab === 'add_solution' ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 text-center px-4 py-8">
              <span className="material-symbols-outlined text-[36px] mb-3">psychology</span>
              <p className="text-xs">Paste your code and save to attach an explanation.</p>
              <p className="text-[10px] mt-1 text-muted-foreground/60">Tip: Mark as ⭐ Optimal for your best approach.</p>
            </div>
          ) : activeTab === 'history' ? (
            <div className="space-y-4">
              {initialRevisions.length > 0 ? (
                <>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-foreground">{initialRevisions.length}</span>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Total Reviews</p>
                  </div>
                  <div className="h-px bg-outline-variant/10"></div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Avg Confidence</span>
                    <p className="text-lg font-bold text-foreground mt-1">
                      {(initialRevisions.reduce((acc: number, r: any) => acc + (r.confidenceScore || 0), 0) / initialRevisions.length).toFixed(1)} / 5
                    </p>
                  </div>
                  {initialRevisions[0]?.nextRevisionDate && (
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Next Review</span>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {new Date(initialRevisions[0].nextRevisionDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-50 text-center py-8">
                  <span className="material-symbols-outlined text-[36px] mb-3">history</span>
                  <p className="text-xs">Start reviewing to build your memory.</p>
                </div>
              )}
            </div>
          ) : activeTab === 'attachments' ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 text-center px-4 py-8">
              <span className="material-symbols-outlined text-[36px] mb-3">folder_open</span>
              <p className="text-xs">Upload images and PDFs of handwritten notes.</p>
            </div>
          ) : (
            <p className="italic opacity-40 text-xs">No explanation provided for this solution.</p>
          )}
        </div>
      </div>

      {problem.tags && problem.tags.length > 0 && (
        <div className="bg-card/50/50 backdrop-blur-md rounded-xl border border-border/10 p-3 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {problem.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent text-muted-foreground border border-border/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );

  // Return empty or fallback until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-stack-gap-md h-full">
        <div className="col-span-1 lg:col-span-3">{leftPanelContent}</div>
        <div className="col-span-1 lg:col-span-6">{centerPanelContent}</div>
        {showRightPanel && <div className="col-span-1 lg:col-span-3">{rightPanelContent}</div>}
      </div>
    );
  }

  const resizeHandleClass = `bg-transparent hover:bg-primary/20 transition-colors flex items-center justify-center group z-10 relative
    ${isMobile ? 'h-3 cursor-row-resize my-[-4px]' : 'w-3 cursor-col-resize mx-[-4px]'}`;
  const resizeHandleIndicatorClass = `bg-outline-variant/30 group-hover:bg-primary/50 rounded-full transition-colors
    ${isMobile ? 'h-0.5 w-12' : 'w-0.5 h-12'}`;

  return (
    <>
      {shareToast && (
        <div className="fixed top-20 right-6 z-50 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg shadow-2xl text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Link copied to clipboard!
        </div>
      )}

      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-background/90 backdrop-blur-sm z-[90] transition-opacity animate-in fade-in duration-200"
          onClick={toggleFullscreen}
        />
      )}
      
      <div className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-2 md:inset-4 z-[100] shadow-2xl ring-1 ring-primary/20 animate-in zoom-in-95 duration-200 bg-background rounded-xl' : 'w-full h-full'}`}>
        <Group 
          orientation={isMobile ? 'vertical' : 'horizontal'} 
          id="workspace-group"
          className="w-full h-full"
        >
        <Panel defaultSize={30} minSize={20} className="flex flex-col h-full">
          {leftPanelContent}
        </Panel>

        <Separator className={resizeHandleClass}>
          <div className={resizeHandleIndicatorClass} />
        </Separator>

        <Panel defaultSize={showRightPanel ? 45 : 70} minSize={30} className="flex flex-col h-full relative">
          {centerPanelContent}
        </Panel>

        {showRightPanel && (
          <>
            <Separator className={resizeHandleClass}>
              <div className={resizeHandleIndicatorClass} />
            </Separator>
            
            <Panel defaultSize={25} minSize={20} className="flex flex-col h-full">
              {rightPanelContent}
            </Panel>
          </>
        )}
      </Group>
      </div>
    </>
  );
}
