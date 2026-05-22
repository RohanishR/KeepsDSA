import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';
import { Solution } from '@/models/Solution';
import { Revision } from '@/models/Revision';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty');
    const tagsParam = searchParams.get('tags'); // comma-separated
    const status = searchParams.get('status'); // 'Solved' | 'Unsolved'
    const isBookmarked = searchParams.get('isBookmarked') === 'true';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const skip = (page - 1) * limit;

    const query: any = { userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }

    if (difficulty) {
      query.difficulty = { $in: difficulty.split(',') };
    }

    if (tagsParam) {
      const tags = tagsParam.split(',');
      query.tags = { $in: tags };
    }

    if (isBookmarked) {
      query.isBookmarked = true;
    }

    // Status filtering requires a lookup in the Solution collection
    if (status) {
      const solvedProblems = await Solution.distinct('problemId', { userId });
      if (status === 'Solved') {
        query._id = { $in: solvedProblems };
      } else if (status === 'Unsolved') {
        query._id = { $nin: solvedProblems };
      }
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    else if (sort === 'difficulty-asc') sortOptions = { difficulty: 1 };
    else if (sort === 'difficulty-desc') sortOptions = { difficulty: -1 };
    else if (sort === 'title-asc') sortOptions = { title: 1 };
    else if (sort === 'title-desc') sortOptions = { title: -1 };

    const problems = await Problem.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    // Populate solution counts and revision status for the fetched problems
    const problemIds = problems.map(p => p._id);
    
    // Aggregations for metadata
    const solutionCounts = await Solution.aggregate([
      { $match: { problemId: { $in: problemIds }, userId: session.user.id } },
      { $group: { _id: '$problemId', count: { $sum: 1 } } }
    ]);
    
    const solutionCountMap = new Map(solutionCounts.map(sc => [sc._id.toString(), sc.count]));

    const revisions = await Revision.find({ problemId: { $in: problemIds }, userId }).lean();
    const revisionMap = new Map();
    revisions.forEach(rev => revisionMap.set(rev.problemId.toString(), rev));

    const enrichedProblems = problems.map(p => {
      const idStr = p._id.toString();
      const rev = revisionMap.get(idStr);
      return {
        ...p,
        _id: idStr,
        solutionCount: solutionCountMap.get(idStr) || 0,
        nextRevisionDate: rev?.nextRevisionDate || null,
        interval: rev?.interval || 0
      };
    });

    const totalCount = await Problem.countDocuments(query);
    const hasNextPage = skip + problems.length < totalCount;

    return NextResponse.json({
      problems: enrichedProblems,
      pagination: {
        total: totalCount,
        page,
        limit,
        hasNextPage
      }
    });
  } catch (error: any) {
    console.error('Explore API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
