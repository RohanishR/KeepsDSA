import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';
import { fetchLeetCodeProblem } from '@/lib/leetcode';
import { z } from 'zod';

const importSchema = z.object({
  urlOrSlug: z.string().min(1, 'URL or slug is required')
});

function extractSlug(input: string): string {
  try {
    // Try to parse as URL
    if (input.includes('leetcode.com/problems/')) {
      const match = input.match(/leetcode\.com\/problems\/([^/]+)/);
      if (match && match[1]) {
        return match[1].toLowerCase().trim();
      }
    }
    // If it's just a raw slug, clean it up
    return input.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase().trim();
  } catch {
    return input.trim();
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = importSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const slug = extractSlug(parsed.data.urlOrSlug);
    if (!slug) {
      return NextResponse.json({ error: 'Could not extract valid problem slug' }, { status: 400 });
    }

    await dbConnect();
    const userId = session.user.id;

    // 1. Check Cache (Database)
    const existingProblem = await Problem.findOne({ userId, slug }).lean();
    if (existingProblem) {
      return NextResponse.json({ 
        message: 'Problem already exists in your workspace.',
        problem: existingProblem,
        isCached: true 
      });
    }

    // 2. Fetch from LeetCode
    const leetcodeData = await fetchLeetCodeProblem(slug);
    if (!leetcodeData) {
      return NextResponse.json({ error: 'Failed to fetch problem from LeetCode. Ensure the URL or slug is correct and the problem is public.' }, { status: 404 });
    }

    // 3. Transform & Save to MongoDB
    const newProblem = new Problem({
      userId,
      title: leetcodeData.title,
      slug: leetcodeData.slug,
      difficulty: leetcodeData.difficulty,
      tags: leetcodeData.tags,
      companies: [], // LeetCode doesn't expose companies freely via this GraphQL query
      leetcodeUrl: `https://leetcode.com/problems/${leetcodeData.slug}/`,
      description: leetcodeData.content, // Storing raw HTML
      leetcodeId: leetcodeData.leetcodeId,
      source: 'LeetCode',
      importedAt: new Date(),
      hints: leetcodeData.hints,
    });

    await newProblem.save();

    return NextResponse.json({ 
      message: 'Problem imported successfully!',
      problem: newProblem,
      isCached: false 
    }, { status: 201 });

  } catch (error: any) {
    console.error('LeetCode Import Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
