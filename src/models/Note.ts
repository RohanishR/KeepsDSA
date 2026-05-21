import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  content: string; // Markdown content
  codeSnippets: { language: string; code: string }[];
  mediaUrls: string[]; // Cloudinary URLs
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
    content: { type: String, default: '' },
    codeSnippets: [
      {
        language: { type: String, default: 'javascript' },
        code: { type: String, required: true },
      },
    ],
    mediaUrls: [{ type: String }],
  },
  { timestamps: true }
);

NoteSchema.index({ problemId: 1 });

export const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
