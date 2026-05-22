import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlaylist extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  isPublic: boolean;
  problems: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    isPublic: { type: Boolean, default: false },
    problems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
  },
  { timestamps: true }
);

PlaylistSchema.index({ userId: 1 });

export const Playlist: Model<IPlaylist> =
  mongoose.models.Playlist || mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
