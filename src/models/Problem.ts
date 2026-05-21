import mongoose, { Schema, Document, Model } from 'mongoose';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Status = 'Todo' | 'Attempted' | 'Solved';

export interface IProblem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  difficulty: Difficulty;
  url?: string;
  tags: string[];
  status: Status;
  isFavorite: boolean;
  needsRevision: boolean;
  nextRevisionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProblemSchema = new Schema<IProblem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    url: { type: String },
    tags: [{ type: String }],
    status: { type: String, enum: ['Todo', 'Attempted', 'Solved'], default: 'Todo' },
    isFavorite: { type: Boolean, default: false },
    needsRevision: { type: Boolean, default: false },
    nextRevisionDate: { type: Date },
  },
  { timestamps: true }
);

// Add index to speed up querying a user's problems
ProblemSchema.index({ userId: 1 });

export const Problem: Model<IProblem> =
  mongoose.models.Problem || mongoose.model<IProblem>('Problem', ProblemSchema);
