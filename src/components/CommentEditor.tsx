"use client";
import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";
import { IoMdSend } from "react-icons/io";

export interface Params {
  page: number;
  pdfId: string;
  parentCommentId?: string | null;
  fetchCommentAfterEveryComment: () => void;
  replyToAuthor?: string | null; // new optional param for @ mention
  setParentCommentId: (id: string | null) => void; // add setter for parentCommentId
}

const CommentEditor = ({ params }: { params: Params }) => {
  const {
    page,
    pdfId,
    parentCommentId,
    fetchCommentAfterEveryComment,
    replyToAuthor,
    setParentCommentId, // receive setter
  } = params;
  const [uploadingComment, setUploadingComment] = useState(false);
  const { user } = useUser();

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "max-h-[4.5rem] overflow-y-auto outline-none p-2 text-white whitespace-pre-wrap break-words",
      },
    },
    onUpdate: ({ editor }) => {
      // Check if mention still exists in content
      const content = editor.getText();

      // If replyToAuthor mention missing, clear parentCommentId
      if (replyToAuthor && !content.includes(`@${replyToAuthor}`)) {
        setParentCommentId(null);
      }
    },
  });

  // Prefill editor with @authorName when replyToAuthor changes
  useEffect(() => {
    if (editor && replyToAuthor) {
      editor.commands.setContent(`@${replyToAuthor} `);
      editor.commands.focus();
    } else if (editor && !replyToAuthor) {
      editor.commands.clearContent();
    }
  }, [replyToAuthor, editor]);

  const handleSubmit = async () => {
    if (!editor) return;

    const content = editor.getHTML();

    if (!content || content === "<p></p>") {
      toast.error("Cannot submit empty comment");
      return;
    }

    try {
      setUploadingComment(true);
      const response = await fetch("/api/pdf/upload-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfId,
          content,
          page,
          parentCommentId, // reply link
          authorImg: user?.profilePicture,
          authorName: user?.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        editor.commands.clearContent();
        setParentCommentId(null); // clear after successful submit

        fetchCommentAfterEveryComment();
      } else {
        toast.error(data.message || "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUploadingComment(false);
    }
  };

  return (
    <div className="pt-4 border-t border-gray-700 text-white">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2 flex-wrap">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor?.isActive("bold") ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          <strong>B</strong>
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor?.isActive("italic") ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          <em>I</em>
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded ${
            editor?.isActive("underline") ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          <u>U</u>
        </button>
      </div>

      {/* Editor */}
      <div className="border border-gray-600 rounded-3xl flex items-center px-2">
        <EditorContent editor={editor} className="w-full" />
        <button
          disabled={uploadingComment}
          onClick={handleSubmit}
          className=" p-2 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadingComment ? (
            "Submitting..."
          ) : (
            <IoMdSend className="text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CommentEditor;
