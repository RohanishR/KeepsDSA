import { z } from 'zod';

const commaSeparatedStringToArray = z.preprocess((val) => {
  if (typeof val === 'string') {
    return val.split(',').map((t) => t.trim()).filter(Boolean);
  }
  return val;
}, z.array(z.string()));

export const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium'),
  tags: commaSeparatedStringToArray.default([]),
  companies: commaSeparatedStringToArray.default([]),
  leetcodeUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  examples: z.string().optional(),
  constraints: z.string().optional(),
});

export type ProblemInput = z.infer<typeof problemSchema>;
