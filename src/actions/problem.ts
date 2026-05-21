'use server';

import dbConnect from '@/lib/dbConnect';
import { Problem, IProblem } from '@/models/Problem';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function createProblem(data: Partial<IProblem>) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  await dbConnect();

  try {
    const newProblem = await Problem.create({
      ...data,
      userId: session.user.id,
    });
    
    revalidatePath('/dashboard');
    revalidatePath('/explore');
    
    return { success: true, problemId: newProblem._id.toString() };
  } catch (error) {
    console.error('Failed to create problem:', error);
    return { success: false, error: 'Failed to create problem' };
  }
}

export async function getProblems() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  await dbConnect();

  try {
    const problems = await Problem.find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(problems));
  } catch (error) {
    console.error('Failed to fetch problems:', error);
    return [];
  }
}

export async function getProblemById(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  await dbConnect();

  try {
    const problem = await Problem.findOne({ _id: id, userId: session.user.id }).lean();
    return problem ? JSON.parse(JSON.stringify(problem)) : null;
  } catch (error) {
    console.error('Failed to fetch problem:', error);
    return null;
  }
}
