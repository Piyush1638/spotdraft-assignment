// components/Comments.tsx
import { useState } from "react";

const Comments = () => {
  const [comments, setComments] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleAddComment = () => {
    if (input.trim()) {
      setComments((prev) => [...prev, input]);
      setInput("");
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Comments</h2>
      <ul className="mb-2">
        {comments.map((comment, idx) => (
          <li key={idx} className="border p-2 mb-1 rounded">
            {comment}
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Write a comment..."
        className="border p-2 rounded w-full"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleAddComment}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Comment
      </button>
    </div>
  );
};

export default Comments;
