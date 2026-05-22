import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { Revision } from '@/models/Revision';
import { z } from 'zod';

const revisionInputSchema = z.object({
  problemId: z.string().min(1),
  quality: z.enum(['Again', 'Hard', 'Good', 'Easy'])
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = revisionInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { problemId, quality } = parsed.data;
    await dbConnect();
    const userId = session.user.id;

    // Calculate interval and confidence
    let daysToAdd = 0;
    let confidenceLevel: 'Low' | 'Medium' | 'High' = 'Medium';

    switch (quality) {
      case 'Again':
        daysToAdd = 0; // Due immediately
        confidenceLevel = 'Low';
        break;
      case 'Hard':
        daysToAdd = 2;
        confidenceLevel = 'Medium';
        break;
      case 'Good':
        daysToAdd = 5;
        confidenceLevel = 'High';
        break;
      case 'Easy':
        daysToAdd = 14;
        confidenceLevel = 'High';
        break;
    }

    const nextRevisionDate = new Date();
    if (daysToAdd > 0) {
      nextRevisionDate.setDate(nextRevisionDate.getDate() + daysToAdd);
    } else {
      // Add 1 minute for 'Again'
      nextRevisionDate.setMinutes(nextRevisionDate.getMinutes() + 1);
    }

    // Upsert the revision document
    const revision = await Revision.findOneAndUpdate(
      { userId, problemId },
      {
        $set: {
          confidenceLevel,
          nextRevisionDate,
        },
        $inc: { revisionCount: 1 }
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ revision });
  } catch (error: any) {
    console.error('Save revision error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
