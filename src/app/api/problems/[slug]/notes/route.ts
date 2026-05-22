import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';
import { Note } from '@/models/Note';
import { noteSchema } from '@/lib/validations/note';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    await dbConnect();

    const problem = await Problem.findOne({ 
      userId: session.user.id, 
      slug: resolvedParams.slug 
    }).lean();

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    let note = await Note.findOne({ 
      userId: session.user.id, 
      problemId: problem._id 
    }).lean();

    // If no note exists yet, return an empty structure rather than 404
    if (!note) {
      return NextResponse.json({ 
        note: { markdownContent: '', diagrams: [], references: [] } 
      });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await req.json();
    const validatedData = noteSchema.parse(body);

    await dbConnect();

    const problem = await Problem.findOne({ 
      userId: session.user.id, 
      slug: resolvedParams.slug 
    }).lean();

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    const { isSnapshot, ...noteData } = validatedData;
    const updatePayload: any = { $set: noteData };

    if (isSnapshot && noteData.markdownContent) {
      updatePayload.$push = {
        history: {
          content: noteData.markdownContent,
          timestamp: new Date(),
        },
      };
    }

    const note = await Note.findOneAndUpdate(
      { userId: session.user.id, problemId: problem._id },
      updatePayload,
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ note });
  } catch (error: any) {
    console.error('Error updating note:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}
