import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';
import { Solution } from '@/models/Solution';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; solutionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, solutionId } = await params;

    await dbConnect();

    const problem = await Problem.findOne({ userId: session.user.id, slug });
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    const solution = await Solution.findOneAndDelete({
      _id: solutionId,
      userId: session.user.id,
      problemId: problem._id,
    });

    if (!solution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete solution error:', error);
    return NextResponse.json({ error: 'Failed to delete solution' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; solutionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, solutionId } = await params;
    const body = await req.json();

    await dbConnect();

    const problem = await Problem.findOne({ userId: session.user.id, slug });
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    const updatedSolution = await Solution.findOneAndUpdate(
      { _id: solutionId, userId: session.user.id, problemId: problem._id },
      { $set: body },
      { new: true }
    );

    if (!updatedSolution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }

    return NextResponse.json({ solution: updatedSolution });
  } catch (error) {
    console.error('Update solution error:', error);
    return NextResponse.json({ error: 'Failed to update solution' }, { status: 500 });
  }
}
