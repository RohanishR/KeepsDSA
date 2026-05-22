import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';
import { Solution } from '@/models/Solution';
import { solutionSchema } from '@/lib/validations/solution';

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

    const solutions = await Solution.find({ 
      userId: session.user.id, 
      problemId: problem._id 
    }).sort({ isOptimal: -1, createdAt: -1 }).lean();

    return NextResponse.json({ solutions });
  } catch (error) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json({ error: 'Failed to fetch solutions' }, { status: 500 });
  }
}

export async function POST(
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
    const validatedData = solutionSchema.parse(body);

    await dbConnect();

    const problem = await Problem.findOne({ 
      userId: session.user.id, 
      slug: resolvedParams.slug 
    }).lean();

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    const solution = await Solution.create({
      ...validatedData,
      userId: session.user.id,
      problemId: problem._id,
    });

    return NextResponse.json({ solution }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating solution:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create solution' }, { status: 500 });
  }
}
