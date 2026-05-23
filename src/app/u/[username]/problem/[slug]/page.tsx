import React from 'react';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';
import { Problem } from '@/models/Problem';
import { Solution } from '@/models/Solution';
import { Note } from '@/models/Note';
import { notFound } from 'next/navigation';
import PublicProblemClient from './PublicProblemClient';

export async function generateMetadata({ params }: { params: Promise<{ username: string, slug: string }> }) {
  const { slug, username } = await params;
  return {
    title: `${slug} - ${username}'s Solution`,
  };
}

export default async function PublicProblemPage({ params }: { params: Promise<{ username: string, slug: string }> }) {
  const { username, slug } = await params;
  await dbConnect();
  
  const user = await User.findOne({ username: username.toLowerCase() }).lean();
  if (!user || !user.privacySettings?.isProfilePublic) {
    notFound(); 
  }

  const problem = await Problem.findOne({ slug: slug }).lean();
  if (!problem) {
    notFound();
  }

  let solution = null;
  if (user.privacySettings.showSolutions) {
    solution = await Solution.findOne({ userId: user._id, problemId: problem._id, type: 'Optimal' }).lean() 
            || await Solution.findOne({ userId: user._id, problemId: problem._id }).lean();
  }

  let note = null;
  if (user.privacySettings.showNotes) {
    note = await Note.findOne({ userId: user._id, problemId: problem._id }).lean();
  }

  if (!solution && !note) {
    // Nothing to show
    notFound();
  }

  const data = {
    user: {
      name: user.name,
      username: user.username,
      image: user.image,
    },
    problem: {
      title: problem.title,
      difficulty: problem.difficulty,
      tags: problem.tags,
      description: problem.description,
      hints: problem.hints,
    },
    solution: solution ? {
      code: solution.code,
      language: solution.language,
      timeComplexity: solution.timeComplexity,
      spaceComplexity: solution.spaceComplexity,
      createdAt: solution.createdAt,
    } : null,
    note: note ? {
      markdownContent: note.markdownContent,
      createdAt: note.createdAt,
    } : null
  };

  return <PublicProblemClient data={JSON.parse(JSON.stringify(data))} />;
}
