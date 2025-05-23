import React from "react";
import { Types } from "mongoose";

interface Comment {
  _id: Types.ObjectId;
  content: string;
  replies: Comment[];
}

const CommentThread: React.FC<{ comment: Comment; level?: number }> = ({
  comment,
  level = 0,
}) => {
  return (
    <div
      className={`pl-${level * 4} py-2 border-l-2 ${
        level > 0 ? "border-gray-300" : "border-none"
      }`}
    >
      <div className="bg-white p-3 rounded shadow-sm text-sm">
        <p>{comment.content}</p>
      </div>
      <div className="mt-2 space-y-2">
        {comment.replies.map((reply) => (
          <CommentThread key={reply._id.toString()} comment={reply} level={level + 1} />
        ))}
      </div>
    </div>
  );
};

export default CommentThread;
