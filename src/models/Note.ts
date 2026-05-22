import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  markdownContent: string;
  diagrams: string[];
  references: string[];
  history: Array<{
    content: string;
    timestamp: Date;
  }>;
  attachments: Array<{
    url: string;
    publicId: string;
    originalName: string;
    resourceType: 'image' | 'raw' | 'video' | 'auto';
    format: string;
    bytes: number;
    createdAt: Date;
  }>;
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
    history: [
      {
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    attachments: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        originalName: { type: String, required: true },
        resourceType: { type: String, required: true },
        format: { type: String },
        bytes: { type: Number },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

NoteSchema.index({ problemId: 1, userId: 1 });

export const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
