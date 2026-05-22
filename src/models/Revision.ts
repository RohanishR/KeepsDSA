import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRevision extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  confidenceScore: number; // 1 to 5
  easeFactor: number; // SM-2 ease factor
  interval: number; // SM-2 interval in days
  revisionCount: number;
  reviewedAt: Date;
  nextRevisionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RevisionSchema = new Schema<IRevision>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
    confidenceScore: { type: Number, required: true, min: 1, max: 5 },
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 0 },
    revisionCount: { type: Number, default: 1 },
    reviewedAt: { type: Date, default: Date.now },
    nextRevisionDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// Indexes
RevisionSchema.index({ userId: 1, nextRevisionDate: 1 });
RevisionSchema.index({ problemId: 1, userId: 1 });

export const Revision: Model<IRevision> =
  mongoose.models.Revision || mongoose.model<IRevision>('Revision', RevisionSchema);
