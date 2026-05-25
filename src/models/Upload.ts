import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUpload extends Document {
  userId: mongoose.Types.ObjectId;
  url: string;
  publicId: string; // Cloudinary public ID
  originalName: string; // Original file name
  resourceType: string; // 'image', 'raw', etc.
  format: string; // 'png', 'pdf', etc.
  size: number; // in bytes
  topics?: string[]; // Array of topics
  createdAt: Date;
  updatedAt: Date;
}

const UploadSchema = new Schema<IUpload>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    originalName: { type: String, required: true },
    resourceType: { type: String, default: 'image' },
    format: { type: String },
    size: { type: Number },
    topics: [{ type: String }],
  },
  { timestamps: true }
);

UploadSchema.index({ userId: 1 });

export const Upload: Model<IUpload> =
  mongoose.models.Upload || mongoose.model<IUpload>('Upload', UploadSchema);
