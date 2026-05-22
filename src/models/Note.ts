import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  markdownContent: string;
  diagrams: string[]; // URLs to diagram images
  references: string[]; // Array of external links
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
    markdownContent: { type: String, default: '' },
    diagrams: [{ type: String }],
    references: [{ type: String }],
  },
  { timestamps: true }
);

NoteSchema.index({ problemId: 1, userId: 1 });

export const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
