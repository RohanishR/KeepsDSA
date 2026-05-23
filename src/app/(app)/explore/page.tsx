import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';
import ExploreClient from './ExploreClient';

export default async function ExplorerPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  await dbConnect();
  
  // Aggregate all unique tags from the user's problems
  const tagsResult = await Problem.aggregate([
    { $match: { userId: session.user.id } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags" } },
    { $sort: { _id: 1 } }
  ]);
  
  const availableTags = tagsResult.map(t => t._id).filter(Boolean);

  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full"></div>
      </div>
      
      <div className="relative z-10 flex flex-col h-full min-h-[calc(100vh-100px)]">
        <ExploreClient availableTags={availableTags} />
      </div>
    </>
  );
}
