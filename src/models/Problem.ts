import mongoose, { Schema, Document, Model } from 'mongoose';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface IProblem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  difficulty: Difficulty;
  tags: string[];
  companies: string[];
  leetcodeUrl?: string;
  description?: string;
  examples?: string;
  constraints?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProblemSchema = new Schema<IProblem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    tags: [{ type: String }],
    companies: [{ type: String }],
    leetcodeUrl: { type: String },
    description: { type: String },
    examples: { type: String },
    constraints: { type: String },
  },
  { timestamps: true }
);

// Indexes for fast querying and uniqueness
ProblemSchema.index({ userId: 1, slug: 1 }, { unique: true });
ProblemSchema.index({ userId: 1, tags: 1 });
ProblemSchema.index({ userId: 1, difficulty: 1 });

export const Problem: Model<IProblem> =
  mongoose.models.Problem || mongoose.model<IProblem>('Problem', ProblemSchema);
