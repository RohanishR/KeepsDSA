import mongoose, { Schema, Document, Model } from 'mongoose';

export type ConfidenceLevel = 'Low' | 'Medium' | 'High';

export interface IRevision extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  confidenceLevel: ConfidenceLevel;
  revisionCount: number;
  nextRevisionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RevisionSchema = new Schema<IRevision>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
    confidenceLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    revisionCount: { type: Number, default: 1 },
    nextRevisionDate: { type: Date },
  },
  { timestamps: true }
);

// Indexes
RevisionSchema.index({ userId: 1, nextRevisionDate: 1 });
RevisionSchema.index({ problemId: 1, userId: 1 });

export const Revision: Model<IRevision> =
  mongoose.models.Revision || mongoose.model<IRevision>('Revision', RevisionSchema);
