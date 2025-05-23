"use client";

import React, { useState } from "react";

type Comment = {
  id: number;
  text: string;
  author: string;
  time: string;
  replies: Reply[];
};

type Reply = {
  id: number;
  text: string;
  author: string;
  time: string;
};

export default function CommentPanel() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      text: "This is a great post!",
      author: "Alice",
      time: "2 hours ago",
      replies: [
        {
          id: 1,
          text: "I agree with you!",
          author: "Bob",
          time: "1 hour ago",
        },
      ],
    },
    {
      id: 2,
      text: "Thanks for sharing this.",
      author: "Charlie",
      time: "3 hours ago",
      replies: [],
    },
  ]);

  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});

  const onReplyChange = (commentId: number, value: string) => {
    setReplyInputs((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };

  const addReply = (commentId: number) => {
    const newReply: Reply = {
      id: Date.now(),
      text: replyInputs[commentId] || "",
      author: "You",
      time: "Just now",
    };

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [...comment.replies, newReply],
            }
          : comment
      )
    );

    setReplyInputs((prev) => ({
      ...prev,
      [commentId]: "",
    }));
  };

  const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, commentId: number) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addReply(commentId);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:gap-6 p-6">
      <main className="flex-1">
        {/* Main content placeholder */}
        <h1 className="text-xl font-bold mb-4">Main Content</h1>
        <p className="text-gray-600">
          This is where your main application content would go. Comments are shown in the side panel on larger screens.
        </p>
      </main>

      {/* Comments Panel for md+ screens */}
      <aside className="hidden md:flex w-1/3 bg-white rounded-lg shadow-lg flex-col h-[calc(100vh-4rem)]">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Comments</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {comments.map(({ id, author, time, text, replies }) => (
            <div key={id} className="bg-gray-50 rounded-lg p-4 shadow-sm space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span className="font-medium">{author}</span>
                <span>{time}</span>
              </div>
              <p className="text-gray-800">{text}</p>

              <div className="pl-4 border-l border-gray-300 space-y-3 mb-3">
                {replies.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white p-3 rounded-md shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span className="font-semibold">{r.author}</span>
                      <span>{r.time}</span>
                    </div>
                    <p className="text-gray-700">{r.text}</p>
                  </div>
                ))}

                <div className="space-y-2">
                  <textarea
                    rows={2}
                    placeholder="Write a reply..."
                    className="w-full resize-none rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={replyInputs[id] || ""}
                    onChange={(e) => onReplyChange(id, e.target.value)}
                    onKeyDown={(e) => handleReplyKeyDown(e, id)}
                  />
                  <button
                    onClick={() => addReply(id)}
                    className="w-full bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700 transition"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
