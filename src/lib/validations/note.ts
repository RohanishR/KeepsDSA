import { z } from 'zod';

export const noteSchema = z.object({
  markdownContent: z.string().default(''),
  diagrams: z.array(z.string().url()).default([]),
  references: z.array(z.string().url()).default([]),
  isSnapshot: z.boolean().optional(),
  attachments: z.array(z.object({
    url: z.string().url(),
    publicId: z.string(),
    originalName: z.string(),
    resourceType: z.string(),
    format: z.string().optional(),
    bytes: z.number().optional(),
    createdAt: z.union([z.string(), z.date()]).optional(),
  })).optional(),
});

export type NoteInput = z.infer<typeof noteSchema>;
