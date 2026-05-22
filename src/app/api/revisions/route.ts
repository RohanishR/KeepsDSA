import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { Revision } from '@/models/Revision';
import { Problem } from '@/models/Problem';
import { calculateSM2 } from '@/lib/sm2';
import { z } from 'zod';

// GET: Fetch all due revisions for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const now = new Date();

    // Fetch due revisions, populate the related Problem data
    const dueRevisions = await Revision.find({
      userId: session.user.id,
      nextRevisionDate: { $lte: now }
    })
    .populate('problemId', 'title slug difficulty tags')
    .sort({ nextRevisionDate: 1 })
    .lean();

    return NextResponse.json({ revisions: dueRevisions });
  } catch (error) {
    console.error('Error fetching due revisions:', error);
    return NextResponse.json({ error: 'Failed to fetch due revisions' }, { status: 500 });
  }
}

const revisionSchema = z.object({
  problemId: z.string(),
  confidenceScore: z.number().min(1).max(5),
});

// POST: Submit a review score and schedule next date
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { problemId, confidenceScore } = revisionSchema.parse(body);

    await dbConnect();

    // Find existing revision stats for this problem/user
    let revision = await Revision.findOne({
      userId: session.user.id,
      problemId: problemId
    });

    if (revision) {
      // Calculate next SM-2 stats based on previous
      const { interval, easeFactor, nextRevisionDate } = calculateSM2(
        confidenceScore,
        revision.interval,
        revision.easeFactor
      );

      revision.confidenceScore = confidenceScore;
      revision.interval = interval;
      revision.easeFactor = easeFactor;
      revision.nextRevisionDate = nextRevisionDate;
      revision.reviewedAt = new Date();
      revision.revisionCount += 1;

      await revision.save();
    } else {
      // First time revision
      const { interval, easeFactor, nextRevisionDate } = calculateSM2(confidenceScore, 0, 2.5);
      
      revision = await Revision.create({
        userId: session.user.id,
        problemId: problemId,
        confidenceScore,
        interval,
        easeFactor,
        nextRevisionDate,
        reviewedAt: new Date(),
        revisionCount: 1
      });
    }

    return NextResponse.json({ success: true, revision });
  } catch (error: any) {
    console.error('Error submitting revision:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to submit revision' }, { status: 500 });
  }
}
