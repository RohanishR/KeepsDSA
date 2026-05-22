import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import { Revision } from '@/models/Revision';
import { Problem } from '@/models/Problem';
import { Solution } from '@/models/Solution';
import { Note } from '@/models/Note';
import ReviewClient from './ReviewClient';

export const metadata = {
  title: 'Daily Review Queue - KeepsDSA',
  description: 'Spaced Repetition Review Queue',
};

export default async function ReviewPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/');
  }

  await dbConnect();
  const now = new Date();
  const userId = session.user.id;

  // Find due revisions
  const dueRevisions = await Revision.find({
    userId: userId,
    nextRevisionDate: { $lte: now }
  }).sort({ nextRevisionDate: 1 }).lean();

  if (dueRevisions.length === 0) {
    return <ReviewClient initialCards={[]} />;
  }

  // Fetch full data for each due problem
  const flashcards = await Promise.all(dueRevisions.map(async (rev: any) => {
    const problem = await Problem.findById(rev.problemId).lean();
    if (!problem) return null;

    // Find the Optimal solution
    const optimalSolution = await Solution.findOne({
      problemId: problem._id,
      userId: userId,
      type: 'Optimal'
    }).lean() || await Solution.findOne({
      problemId: problem._id,
      userId: userId
    }).lean(); // Fallback to any solution if no Optimal

    const note = await Note.findOne({
      problemId: problem._id,
      userId: userId
    }).lean();

    return {
      revisionId: rev._id.toString(),
      problem: {
        _id: problem._id.toString(),
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        tags: problem.tags,
        description: problem.description,
        hints: problem.hints,
      },
      solution: optimalSolution ? {
        code: optimalSolution.code,
        language: optimalSolution.language,
        timeComplexity: optimalSolution.timeComplexity,
        spaceComplexity: optimalSolution.spaceComplexity,
      } : null,
      note: note ? {
        markdownContent: note.markdownContent
      } : null
    };
  }));

  // Filter out any nulls
  const validFlashcards = flashcards.filter(card => card !== null);

  return <ReviewClient initialCards={JSON.parse(JSON.stringify(validFlashcards))} />;
}
