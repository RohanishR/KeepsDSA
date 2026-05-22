import { z } from 'zod';

export const solutionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  language: z.string().min(1, 'Language is required'),
  approachType: z.enum(['Brute Force', 'Better', 'Optimal', 'Other']).default('Optimal'),
  code: z.string().min(1, 'Code is required'),
  explanation: z.string().optional(),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
  isOptimal: z.boolean().default(false),
});

export type SolutionInput = z.infer<typeof solutionSchema>;
