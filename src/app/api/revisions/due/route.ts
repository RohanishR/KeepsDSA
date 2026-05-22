import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';
import { Revision } from '@/models/Revision';
import { Solution } from '@/models/Solution';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;
    const now = new Date();

    // 1. Fetch all problems for the user
    const problems = await Problem.find({ userId }).lean();
    
    // 2. Fetch all revisions for the user
    const revisions = await Revision.find({ userId }).lean();
    const revisionMap = new Map();
    for (const rev of revisions) {
      revisionMap.set(rev.problemId.toString(), rev);
    }

    // 3. Filter for due problems: No revision OR nextRevisionDate <= now
    const dueProblems = [];
    for (const p of problems) {
      const rev = revisionMap.get(p._id.toString());
      if (!rev || !rev.nextRevisionDate || new Date(rev.nextRevisionDate) <= now) {
        dueProblems.push({
          problem: p,
          revision: rev || null
        });
      }
    }

    // Sort: No revision first, then oldest nextRevisionDate first
    dueProblems.sort((a, b) => {
      if (!a.revision && b.revision) return -1;
      if (a.revision && !b.revision) return 1;
      if (!a.revision && !b.revision) return 0;
      return new Date(a.revision.nextRevisionDate).getTime() - new Date(b.revision.nextRevisionDate).getTime();
    });

    // Take top 20
    const queue = dueProblems.slice(0, 20);

    // 4. Fetch the best solution for each problem in the queue
    const queueWithSolutions = await Promise.all(queue.map(async (item) => {
      const solutions = await Solution.find({ 
        userId, 
        problemId: item.problem._id 
      }).sort({ isOptimal: -1, createdAt: -1 }).lean();

      return {
        ...item,
        solution: solutions.length > 0 ? solutions[0] : null
      };
    }));

    return NextResponse.json({ queue: queueWithSolutions });
  } catch (error: any) {
    console.error('Fetch due revisions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
