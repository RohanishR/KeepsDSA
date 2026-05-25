import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';
import { Problem } from '@/models/Problem';
import { Solution } from '@/models/Solution';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    await dbConnect();
    
    const user = await User.findOne({ extensionToken: token });
    if (!user) {
      return NextResponse.json({ error: 'Invalid extension token' }, { status: 401 });
    }

    const payload = await req.json();
    const { title, slug, difficulty, tags, url, code, language, description } = payload;

    if (!slug || !title) {
      return NextResponse.json({ error: 'Invalid payload: slug and title required' }, { status: 400 });
    }

    // 1. Upsert Problem
    let problem = await Problem.findOne({ userId: user._id, slug });
    
    if (!problem) {
      problem = await Problem.create({
        userId: user._id,
        title,
        slug,
        difficulty,
        tags,
        description,
        leetcodeUrl: url,
        source: 'LeetCode',
        importedAt: new Date(),
      });
    } else {
      // Update fields if it already exists but keep source
      await Problem.updateOne(
        { _id: problem._id },
        { 
          $set: { leetcodeUrl: url, source: 'LeetCode', importedAt: new Date(), description: description || problem.description },
          $addToSet: { tags: { $each: tags } }
        }
      );
    }

    // 2. Save Solution if code exists
    if (code) {
      // Check if exact solution already exists to avoid duplicates
      const existingSolution = await Solution.findOne({
        userId: user._id,
        problemId: problem._id,
        code: code
      });

      if (!existingSolution) {
        // Find existing solutions to determine if this should be 'Optimal' or 'Brute Force'
        const existingCount = await Solution.countDocuments({ problemId: problem._id, userId: user._id });
        
        await Solution.create({
          userId: user._id,
          problemId: problem._id,
          title: `Imported Solution ${existingCount + 1}`,
          language: language || 'javascript',
          approachType: existingCount === 0 ? 'Optimal' : 'Better', // Simple heuristic
          code: code,
          isOptimal: existingCount === 0
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Synced successfully', problemId: problem._id });
  } catch (error: any) {
    console.error('Sync Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
