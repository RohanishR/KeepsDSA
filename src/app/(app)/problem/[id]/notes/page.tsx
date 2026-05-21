import React from 'react';
import Link from 'next/link';

export default function NotesEditorPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-8rem)] bg-surface-dim relative rounded-xl border border-outline-variant/10 overflow-hidden">
      {/* Editor TopAppBar */}
      <header className="h-16 flex justify-between items-center px-4 md:px-6 w-full bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/10 z-30 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/problem/${params.id}`} className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-md hover:bg-surface-container-high hidden md:flex">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <span className="material-symbols-outlined text-outline">description</span>
          <h2 className="font-headline-md text-[18px] md:text-[20px] font-bold text-on-surface truncate max-w-[200px] md:max-w-md">Binary Tree Level Order Traversal</h2>
          <div className="hidden md:flex items-center gap-2 ml-4 px-2 py-1 rounded bg-surface-container border border-outline-variant/20">
            <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
            <span className="font-label-sm text-[12px] text-on-surface-variant">Saved</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-2 text-on-surface-variant font-label-sm text-[12px] mr-4">
            <span className="material-symbols-outlined text-[16px]">sync</span>
            Syncing...
          </div>
          
          <div className="hidden sm:flex items-center gap-1">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-md hover:bg-surface-container-high">
              <span className="material-symbols-outlined">format_bold</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-md hover:bg-surface-container-high">
              <span className="material-symbols-outlined">format_italic</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-md hover:bg-surface-container-high">
              <span className="material-symbols-outlined">code</span>
            </button>
          </div>
          
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-md hover:bg-surface-container-high sm:border-l sm:border-outline-variant/20 sm:pl-4 sm:ml-2">
            <span className="material-symbols-outlined">share</span>
          </button>
          
          <Link href={`/problem/${params.id}`} className="px-4 py-2 bg-surface-container-high border border-outline-variant/30 rounded-md font-label-sm text-[12px] font-medium text-on-surface hover:border-primary/50 hover:text-primary transition-colors ml-2">
            Done
          </Link>
        </div>
      </header>

      {/* Split Workspace */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Editor Pane */}
        <section className="flex-1 flex flex-col bg-surface-dim relative group">
          <div className="flex items-center justify-between px-4 py-2 bg-surface-container-lowest border-b border-outline-variant/10 shrink-0">
            <span className="font-label-sm text-[12px] text-outline font-bold tracking-wider">MARKDOWN</span>
            <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[16px]">content_copy</span></button>
          </div>
          
          {/* Line Numbers & Editor Canvas */}
          <div className="flex-1 overflow-y-auto p-4 flex font-mono text-[14px] text-on-surface bg-transparent focus-within:shadow-[inset_0_0_0_1px_rgba(188,195,255,1),0_0_10px_0_rgba(188,195,255,0.1)] transition-shadow duration-300">
            <div className="flex-col text-outline-variant select-none pr-4 text-right border-r border-outline-variant/10 mr-4 w-8 shrink-0 hidden sm:flex">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span><span>14</span><span>15</span>
            </div>
            <textarea 
              className="flex-1 bg-transparent border-none outline-none resize-none p-0 focus:ring-0 text-on-surface placeholder-outline-variant/50 leading-[22px]" 
              placeholder="Start typing... Use Markdown for formatting." 
              spellCheck="false"
              defaultValue={`# Algorithm Approach: BFS

To solve the **Binary Tree Level Order Traversal** problem, we should use a Breadth-First Search (BFS) approach.

## Key Insights
1.  **Queue Data Structure**: A queue is perfect here because it naturally processes nodes level by level (FIFO).
2.  **Level Tracking**: To group node values by their level, we need to know how many nodes are currently in the queue *before* we start processing a new level.

### Implementation Details
We will initialize a \`queue\` with the \`root\` node.
While the queue is not empty:
- Get the \`level_size\` (current queue length).
- Iterate \`level_size\` times to process all nodes on the current level.
- Append children to the queue for the next level.`}
            />
          </div>
        </section>
        
        {/* Preview Pane could go here, but omitting for now to match HTML */}
      </div>
    </div>
  );
}
