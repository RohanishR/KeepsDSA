import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';
import { problemSchema } from '@/lib/validations/problem';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty');
    const tag = searchParams.get('tag');

    const query: any = { userId: session.user.id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (tag) {
      query.tags = tag;
    }

    await dbConnect();

    const skip = (page - 1) * limit;

    const [problems, total] = await Promise.all([
      Problem.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Problem.countDocuments(query),
    ]);

    return NextResponse.json({
      problems,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = problemSchema.parse(body);

    await dbConnect();

    // Check if slug already exists for user
    const existingProblem = await Problem.findOne({ 
      userId: session.user.id, 
      slug: validatedData.slug 
    });

    if (existingProblem) {
      return NextResponse.json(
        { error: 'A problem with this slug already exists' },
        { status: 400 }
      );
    }

    const problem = await Problem.create({
      ...validatedData,
      userId: session.user.id,
    });

    return NextResponse.json({ problem }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating problem:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create problem' }, { status: 500 });
  }
}
