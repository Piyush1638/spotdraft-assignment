import { Types } from "mongoose";

export const mockComments = [
  {
    _id: new Types.ObjectId(),
    content: "This is a top-level comment on page 1.",
    page: 1,
    authorId: new Types.ObjectId(),
    pdfId: new Types.ObjectId(),
    parentCommentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    replies: [
      {
        _id: new Types.ObjectId(),
        content: "This is a reply to the top-level comment.",
        page: 1,
        authorId: new Types.ObjectId(),
        pdfId: new Types.ObjectId(),
        parentCommentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        replies: [
          {
            _id: new Types.ObjectId(),
            content: "A nested reply to the reply.",
            page: 1,
            authorId: new Types.ObjectId(),
            pdfId: new Types.ObjectId(),
            parentCommentId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            replies: [],
          },
        ],
      },
    ],
  },
  {
    _id: new Types.ObjectId(),
    content: "Another top-level comment on page 2.",
    page: 2,
    authorId: new Types.ObjectId(),
    pdfId: new Types.ObjectId(),
    parentCommentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    replies: [],
  },
];
