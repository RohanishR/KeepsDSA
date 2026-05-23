import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import { Note } from '@/models/Note';
import { Problem } from '@/models/Problem';
import NotesClient from './NotesClient';

export default async function NotesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  await dbConnect();

  // Fetch all notes for the user, populate the problem details
  const notes = await Note.find({ userId: session.user.id })
    .populate({
      path: 'problemId',
      model: Problem,
      select: 'title slug difficulty tags',
    })
    .sort({ updatedAt: -1 })
    .lean();

  const serializedNotes = notes.map((note: any) => ({
    _id: note._id.toString(),
    problem: note.problemId ? {
      title: note.problemId.title,
      slug: note.problemId.slug,
      difficulty: note.problemId.difficulty,
      tags: note.problemId.tags,
    } : null,
    markdownContent: note.markdownContent || '',
    attachments: (note.attachments || []).map((att: any) => ({
      url: att.url,
      originalName: att.originalName,
      resourceType: att.resourceType,
    })),
    updatedAt: note.updatedAt.toISOString(),
  })).filter(note => note.problem && ((note.markdownContent || '').trim() !== '' || note.attachments.length > 0)) as any;

  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary-container/5 blur-[100px] rounded-full"></div>
      </div>
      
      <div className="relative z-10 flex flex-col h-full min-h-[calc(100vh-100px)]">
        <NotesClient initialNotes={serializedNotes} />
      </div>
    </>
  );
}
