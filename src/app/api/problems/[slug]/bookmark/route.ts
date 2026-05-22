import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    // We are passing the problem _id through the URL, which maps to `slug` due to directory structure.
    const { slug: id } = resolvedParams;

    // Find the problem and toggle the isBookmarked status
    const problem = await Problem.findOne({ _id: id, userId: session.user.id });
    
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    problem.isBookmarked = !problem.isBookmarked;
    await problem.save();

    return NextResponse.json({ success: true, isBookmarked: problem.isBookmarked });
  } catch (error: any) {
    console.error('Bookmark toggle error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
