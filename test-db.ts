import mongoose from 'mongoose';
import { Schema, Model } from 'mongoose';

const NoteSchema = new Schema(
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
  },
  { timestamps: true }
);
const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);

async function test() {
  // Use memory server or just mock
  console.log('Testing mongoose schema...');
  const payload = { $set: { markdownContent: 'test', diagrams: [], references: [] } };
  console.log(payload);
}
test();
