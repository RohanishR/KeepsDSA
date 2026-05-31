import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';
import { problemSchema } from '@/lib/validations/problem';

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

    return NextResponse.json({ problem });
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json({ error: 'Failed to fetch problem' }, { status: 500 });
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
    const validatedData = problemSchema.parse(body);

    await dbConnect();

    // Check if updating to a new slug that already exists
    if (validatedData.slug !== resolvedParams.slug) {
      const existingProblem = await Problem.findOne({ 
        userId: session.user.id, 
        slug: validatedData.slug 
      });

      if (existingProblem) {
        return NextResponse.json(
          { error: 'A problem with the new slug already exists' },
          { status: 400 }
        );
      }
    }

    const problem = await Problem.findOneAndUpdate(
      { userId: session.user.id, slug: resolvedParams.slug },
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({ problem });
  } catch (error: any) {
    console.error('Error updating problem:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update problem' }, { status: 500 });
  }
}

export async function DELETE(
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

    const problem = await Problem.findOneAndDelete({ 
      userId: session.user.id, 
      slug: resolvedParams.slug 
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Delete associated notes, solutions, and revisions
    const { Solution } = await import('@/models/Solution');
    const { Revision } = await import('@/models/Revision');
    
    await Solution.deleteMany({ problemId: problem._id });
    await Revision.deleteMany({ problemId: problem._id });
    
    return NextResponse.json({ success: true, message: 'Problem deleted' });
  } catch (error) {
    console.error('Error deleting problem:', error);
    return NextResponse.json({ error: 'Failed to delete problem' }, { status: 500 });
  }
}
