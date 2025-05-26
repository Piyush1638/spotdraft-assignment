import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment extends Document {
  pdfId: Types.ObjectId;             // PDF the comment belongs to
  authorId: Types.ObjectId;          // Who wrote this comment
  authorImg: string;
  authorName: string;
  content: string;                   // Comment text
  page: number;                     // PDF page number
  parentCommentId?: Types.ObjectId; // Optional: points to the parent comment if this is a reply
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  pdfId: { type: Schema.Types.ObjectId, ref: 'PDF', required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  authorImg: { type: String },
  authorName: {type: String, required: true},
  content: { type: String, required: true },
  page: { type: Number, required: true },
  parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }, // New field for replies
}, {
  timestamps: true,  // adds createdAt and updatedAt
});

// Index for faster queries by pdfId + page + parentCommentId + createdAt
CommentSchema.index({ pdfId: 1, page: 1, parentCommentId: 1, createdAt: 1 });

export const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
