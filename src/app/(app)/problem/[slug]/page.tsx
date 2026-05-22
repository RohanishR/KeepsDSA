import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';
import { Solution } from '@/models/Solution';
import { Note } from '@/models/Note';
import ProblemWorkspace from '@/components/problems/ProblemWorkspace';

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const resolvedParams = await params;
  const { slug } = resolvedParams;

  await dbConnect();

  const problem = await Problem.findOne({ userId: session.user.id, slug }).lean();

  if (!problem) {
    notFound();
  }

  const [solutions, note] = await Promise.all([
    Solution.find({ 
      userId: session.user.id, 
      problemId: problem._id 
    }).sort({ isOptimal: -1, createdAt: -1 }).lean(),
    Note.findOne({
      userId: session.user.id,
      problemId: problem._id
    }).lean()
  ]);

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-stack-gap-md h-[calc(100vh-8rem)]">
      {/* Column 1: Problem Statement */}
      <section className="col-span-1 md:col-span-3 bg-surface-container-low/50 backdrop-blur-md rounded-xl border border-outline-variant/10 flex flex-col overflow-hidden shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
        <div className="p-4 border-b border-outline-variant/10 flex justify-between items-start">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{problem.title}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border
                ${problem.difficulty === 'Easy' ? 'bg-[#132b1a] text-[#4ade80] border-[#4ade80]/20' : ''}
                ${problem.difficulty === 'Medium' ? 'bg-[#3b2d13] text-[#facc15] border-[#facc15]/20' : ''}
                ${problem.difficulty === 'Hard' ? 'bg-[#3b1313] text-[#f87171] border-[#f87171]/20' : ''}
              `}>
                {problem.difficulty}
              </span>
              <div className="flex gap-1 flex-wrap">
                {problem.companies?.map((company: string) => (
                  <span key={company} className="px-2 py-0.5 rounded-full text-[11px] bg-surface-container-highest text-on-surface-variant border border-outline-variant/20">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {problem.leetcodeUrl && (
            <a href={problem.leetcodeUrl} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">link</span>
            </a>
          )}
        </div>
        <div className="p-5 overflow-y-auto flex-1 font-body-md text-body-md text-on-surface-variant space-y-4 custom-scrollbar">
          {problem.source === 'LeetCode' ? (
            <div 
              className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-surface-container-highest prose-pre:border prose-pre:border-outline-variant/20 prose-code:text-[#ffa116] prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: problem.description || "No description provided." }} 
            />
          ) : (
            <div className="whitespace-pre-wrap">{problem.description || "No description provided."}</div>
          )}
          
          {problem.examples && (
            <div className="mt-6 space-y-4">
              <div className="bg-surface-container-lowest p-3 rounded border border-outline-variant/10">
                <p className="font-bold text-on-surface mb-1 text-sm">Examples:</p>
                <div className="font-mono text-[14px] text-tertiary whitespace-pre-wrap">
                  {problem.examples}
                </div>
              </div>
            </div>
          )}
          
          {problem.constraints && (
            <div className="mt-6 space-y-2">
              <p className="font-bold text-on-surface mb-1 text-sm">Constraints:</p>
              <div className="font-mono text-[14px] text-tertiary whitespace-pre-wrap bg-surface-container-lowest p-3 rounded border border-outline-variant/10">
                {problem.constraints}
              </div>
            </div>
          )}

          {problem.hints && problem.hints.length > 0 && (
            <div className="mt-8 pt-6 border-t border-outline-variant/10">
              <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#facc15]">lightbulb</span>
                Hints
              </h4>
              <div className="space-y-2">
                {problem.hints.map((hint: string, i: number) => (
                  <details key={i} className="group bg-surface-container-low border border-outline-variant/20 rounded-lg overflow-hidden">
                    <summary className="p-3 cursor-pointer text-sm font-medium text-on-surface hover:text-primary transition-colors flex items-center justify-between select-none">
                      Hint {i + 1}
                      <span className="material-symbols-outlined text-[18px] transition-transform group-open:rotate-180">expand_more</span>
                    </summary>
                    <div 
                      className="p-3 pt-0 text-sm text-on-surface-variant border-t border-outline-variant/10 prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: hint }}
                    />
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Columns 2 & 3: Interactive Workspace (Client Component) */}
      <ProblemWorkspace 
        problem={JSON.parse(JSON.stringify(problem))} 
        initialSolutions={JSON.parse(JSON.stringify(solutions))} 
        initialNote={note ? JSON.parse(JSON.stringify(note)) : null} 
      />
    </div>
  );
}
