import mongoose, { Schema, Document, Model } from 'mongoose';

export type ApproachType = 'Brute Force' | 'Better' | 'Optimal' | 'Other';

export interface ISolution extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  title: string;
  language: string;
  approachType: ApproachType;
  code: string;
  explanation?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  isOptimal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SolutionSchema = new Schema<ISolution>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
    title: { type: String, required: true },
    language: { type: String, required: true, default: 'javascript' },
    approachType: { 
      type: String, 
      enum: ['Brute Force', 'Better', 'Optimal', 'Other'], 
      default: 'Optimal' 
    },
    code: { type: String, required: true },
    explanation: { type: String },
    timeComplexity: { type: String },
    spaceComplexity: { type: String },
    isOptimal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
SolutionSchema.index({ problemId: 1, userId: 1 });

export const Solution: Model<ISolution> =
  mongoose.models.Solution || mongoose.model<ISolution>('Solution', SolutionSchema);
