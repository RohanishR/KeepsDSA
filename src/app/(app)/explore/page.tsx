import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';
import ExploreHeader from '@/components/problems/ExploreHeader';

export default async function ExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : '';
  const difficulty = typeof resolvedParams.difficulty === 'string' ? resolvedParams.difficulty : '';
  
  await dbConnect();
  
  const query: any = { userId: session.user.id };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } }
    ];
  }
  if (difficulty) {
    query.difficulty = difficulty;
  }

  const problems = await Problem.find(query).sort({ createdAt: -1 }).lean();

  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary-container/5 blur-[100px] rounded-full"></div>
      </div>
      
      <div className="relative z-10 flex flex-col">
        <ExploreHeader />

        {/* List Controls & Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="font-label-sm text-[12px] font-medium tracking-[0.05em] text-on-surface-variant">
            Showing <span className="text-on-surface font-bold">{problems.length}</span> matching problems
          </div>
          <div className="flex items-center gap-4">
            <div className="flex border border-outline-variant/20 rounded-lg overflow-hidden bg-surface-container-low">
              <button aria-label="List View" className="p-1.5 bg-surface-container-highest text-primary">
                <span className="material-symbols-outlined text-[18px]">view_list</span>
              </button>
            </div>
          </div>
        </div>

        {/* Problems List Area */}
        <div className="flex flex-col gap-3">
          {problems.map((problem: any, index: number) => (
            <Link key={problem._id.toString()} href={`/problem/${problem.slug}`} className="glass-panel border-t border-l border-outline-variant/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 hover:-translate-y-[2px] hover:shadow-[inset_0_0_20px_rgba(188,195,255,0.05)] cursor-pointer group transition-all duration-200">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-primary">code</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[18px] leading-[28px] font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{problem.title}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {problem.tags?.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-label-sm uppercase tracking-wider bg-surface-container-highest text-on-surface-variant border border-outline-variant/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:gap-1 mt-2 md:mt-0 md:pl-4 md:border-l md:border-outline-variant/10 md:min-w-[150px]">
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded font-label-sm text-[11px] font-medium border
                    ${problem.difficulty === 'Easy' ? 'bg-[#132b1a] text-[#4ade80] border-[#4ade80]/20' : ''}
                    ${problem.difficulty === 'Medium' ? 'bg-[#3b2d13] text-[#facc15] border-[#facc15]/20' : ''}
                    ${problem.difficulty === 'Hard' ? 'bg-[#3b1313] text-[#f87171] border-[#f87171]/20' : ''}
                  `}>
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {problems.length === 0 && (
            <div className="text-center py-12 glass-panel rounded-xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-[48px] text-outline mb-4">search_off</span>
              <h3 className="text-[18px] font-medium text-on-surface mb-2">No problems found</h3>
              <p className="text-[14px] text-on-surface-variant max-w-sm mx-auto">
                Try adjusting your search or filters, or add a new problem to your collection.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
