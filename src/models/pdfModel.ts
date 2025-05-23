import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPDF extends Document {
  name: string;
  url: string;
  type: string;
  size: number;
  fileHash: string;
  lastModified: number;
  authorId: Types.ObjectId;
  sharedWith: Types.ObjectId[];
  shareId: string;
}

const PDFSchema = new Schema<IPDF>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    fileHash: { type: String, required: true },
    lastModified: { type: Number, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: "User" }],
    shareId: { type: String, required: true, unique: true }, // <-- Add this line
  },
  {
    timestamps: true,
  }
);

export const PDF =
  mongoose.models.PDF || mongoose.model<IPDF>("PDF", PDFSchema);
