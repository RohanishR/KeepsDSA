import { z } from 'zod';

export const noteSchema = z.object({
  markdownContent: z.string().default(''),
  diagrams: z.array(z.string().url()).default([]),
  references: z.array(z.string().url()).default([]),
});

export type NoteInput = z.infer<typeof noteSchema>;
