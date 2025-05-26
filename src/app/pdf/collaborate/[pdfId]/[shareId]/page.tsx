"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { IPDF } from "@/models/pdfModel";
import Navbar from "@/components/shared/Navbar";
import CommentEditor from "@/components/CommentEditor";
import dynamic from "next/dynamic";
import { FiTrash2, FiCornerDownLeft } from "react-icons/fi";
import Image from "next/image";
import formatCommentTime from "@/helpers/formatCommentTime";
import { useUser } from "@/context/UserContext";
import { LuRefreshCcw } from "react-icons/lu";

const PDFViewer = dynamic(
  () => import("@/components/collaboration/PDFViewer"),
  { ssr: false }
);

export interface Comment {
  _id: string;
  pdfId: string;
  authorId: string;
  authorImg: string;
  authorName: string;
  content: string;
  page: number;
  parentCommentId: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const CollaborationPage = () => {
  const params = useParams();
  const pdfId = params.pdfId;
  const { user } = useUser();
  const [pdfDetails, setPdfDetails] = useState<IPDF>();
  const [loading, setLoading] = useState(false);
  const [isAuthorizedToAccessOrNot, setIsAuthorizedToAccessOrNot] = useState<
    boolean | null
  >(null);
  const [parentCommentId, setParentCommentId] = useState<string | null>(null);
  const [replyToAuthor, setReplyToAuthor] = useState<string | null>(null); // store name to mention
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
  const [showRepliesMap, setShowRepliesMap] = useState<Record<string, boolean>>(
    {}
  );

  const checkAccess = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/pdf/collaboration-access?pdfId=${pdfId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        toast.error("Invalid Request!");
        setIsAuthorizedToAccessOrNot(false);
        return;
      }

      const data = await response.json();

      if (data.success === true) {
        setIsAuthorizedToAccessOrNot(data.success);
      } else {
        toast.error(data.message || "Access denied.");
        setIsAuthorizedToAccessOrNot(data.success);
      }
    } catch (error) {
      toast.error("Network error. Please check your connection.");
      console.error("Something went wrong", error);
      setIsAuthorizedToAccessOrNot(false);
    } finally {
      setLoading(false);
    }
  }, [pdfId]);

  const getPdfDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pdf/details?pdfId=${pdfId}`);
      const data = await res.json();
      if (data.success) {
        setPdfDetails(data.pdfDetails);
      } else {
        toast.error("Something went wrong! Please try again.");
      }
    } catch {
      toast.error("Error fetching details.");
    } finally {
      setLoading(false);
    }
  }, [pdfId]);

  const getAllComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/pdf/fetch-comments?pdfId=${pdfId}`);
      const data = await res.json();
      if (data.success) {
        setAllComments(data.comments);
      } else {
        toast.error("Something went wrong! Please try again.");
      }
    } catch {
      toast.error("Error fetching comments.");
    }
  }, [pdfId]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await checkAccess(); // Sets isAuthorizedToAccessOrNot
    };
    init();
  }, [checkAccess]);

  useEffect(() => {
    if (isAuthorizedToAccessOrNot) {
      getPdfDetails();
      getAllComments();
      setLoading(false);
    }
  }, [isAuthorizedToAccessOrNot, getPdfDetails, getAllComments]);

  const fetchCommentAfterEveryComment = () => {
    // reset reply state on new comment
    setParentCommentId(null);
    setReplyToAuthor(null);
    getAllComments();
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `/api/pdf/delete-comment?commentId=${commentId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Comment Deleted!");
        getAllComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error deleting comment.");
    }
  };

  // Filter comments by parentCommentId for nested replies
  const renderReplies = (parentId: string, level = 1) => {
    const replies = allComments.filter(
      (comment) => comment.parentCommentId === parentId
    );
    if (replies.length === 0) return null;

    const isShown = showRepliesMap[parentId];

    return (
      <div className={` mt-2 space-y-2`}>
        {level === 1 && (
          <button
            className="text-sm text-blue-400 underline mb-2"
            onClick={() =>
              setShowRepliesMap((prev) => ({
                ...prev,
                [parentId]: !prev[parentId],
              }))
            }
          >
            {isShown ? "Hide Replies" : `Show Replies (${replies.length})`}
          </button>
        )}

        {(level === 1 ? isShown : true) &&
          replies.map((reply) => (
            <div
              key={reply._id}
              className="bg-gray-700  rounded-lg shadow-inner  relative"
              onMouseEnter={() => setHoveredCommentId(reply._id)}
              onMouseLeave={() => setHoveredCommentId(null)}
            >
              <div className="flex items-start gap-3 p-2">
                <Image
                  src={reply.authorImg || "/images/default-avatar.png"}
                  alt="avatar"
                  width={32} // for w-8 h-8
                  height={32}
                  className="rounded-full object-cover ring-1 ring-blue-400"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white text-sm">
                      {reply.authorName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p
                    className="text-gray-300 text-sm"
                    dangerouslySetInnerHTML={{ __html: reply.content }}
                  />
                </div>
              </div>

              {hoveredCommentId === reply._id && (
                <div className="absolute -top-4 right-2 flex space-x-2 text-sm text-gray-300 z-20">
                  <button
                    className="rounded-full bg-red-800 text-white transition-colors cursor-pointer p-2"
                    onClick={() => deleteComment(reply._id)}
                    aria-label="Delete reply"
                  >
                    <FiTrash2 size={18} />
                  </button>
                  <button
                    className="bg-blue-800 text-white rounded-full transition-colors cursor-pointer p-2"
                    onClick={() => {
                      setParentCommentId(reply._id);
                      setReplyToAuthor(reply.authorName);
                      setHoveredCommentId(null);
                    }}
                    aria-label="Reply to reply"
                  >
                    <FiCornerDownLeft size={18} />
                  </button>
                </div>
              )}

              {/* 🧠 Recursive call to render nested replies */}
              {renderReplies(reply._id, level + 1)}
            </div>
          ))}
      </div>
    );
  };

  if (loading || isAuthorizedToAccessOrNot === null) {
    return (
      <div className="flex justify-center bg-gray-800 items-center h-screen text-white text-lg">
        Checking access...
      </div>
    );
  } else {
    return (
      <div className="bg-gray-900 text-gray-100 flex flex-col w-screen h-screen overflow-hidden">
        <Navbar />
        {isAuthorizedToAccessOrNot ? (
          <main
            className="flex-1 grid grid-cols-1 lg:grid-cols-3 py-4 overflow-hidden"
            style={{ height: "calc(100vh - 56px)" }}
          >
            <div className="col-span-2 p-4 flex flex-col overflow-hidden">
              <div className="bg-gray-800 rounded-xl shadow-md flex-1 flex justify-center items-center overflow-hidden">
                {loading ? (
                  <div className="text-gray-500 animate-pulse text-lg">
                    Loading PDF...
                  </div>
                ) : (
                  <PDFViewer fileUrl={pdfDetails?.url as string} />
                )}
              </div>
            </div>

            <div className="col-span-1 p-4 bg-gray-800 border-l border-gray-700 flex flex-col max-h-full overflow-hidden">
              <div className="sticky top-0 z-10 bg-gray-800 pb-2 pt-1 border-b border-gray-700 flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-100">Comments</h2>
                <button
                  onClick={getAllComments}
                  className={`bg-gray-700 cursor-pointer rounded-full p-2 flex items-center justify-center text-white ${
                    loading && "animate-spin"
                  }`}
                >
                  <LuRefreshCcw />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mt-4 custom-scrollbar">
                {allComments.length > 0 ? (
                  allComments
                    .filter((comment) => comment.parentCommentId === null)
                    .map((comment) => (
                      <div
                        key={comment._id.toString()}
                        onMouseEnter={() => setHoveredCommentId(comment._id)}
                        onMouseLeave={() => setHoveredCommentId(null)}
                        className="relative bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-700 mt-4"
                      >
                        <div className="flex items-start gap-4">
                          <Image
                            src={
                              comment.authorImg || "/images/default-avatar.png"
                            }
                            alt="avatar"
                            width={40} // for w-10 h-10
                            height={40}
                            className="rounded-full object-cover ring-2 ring-blue-500"
                          />

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-white">
                                {comment.authorName}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatCommentTime(comment.createdAt)}
                              </span>
                            </div>

                            <p
                              className="text-gray-200 text-sm leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: comment.content,
                              }}
                            />
                          </div>
                        </div>

                        {/* Hover popup */}
                        {hoveredCommentId === comment._id && (
                          <div className="absolute -top-4 right-2 flex space-x-2 text-sm text-gray-300 z-20">
                            {user?._id === comment.authorId && (
                              <button
                                className="rounded-full bg-red-800 text-white transition-colors cursor-pointer p-2"
                                onClick={() => deleteComment(comment._id)}
                                aria-label="Delete comment"
                              >
                                <FiTrash2 size={20} />
                              </button>
                            )}
                            <button
                              className="bg-blue-800 text-white rounded-full transition-colors cursor-pointer p-2"
                              onClick={() => {
                                setParentCommentId(comment._id);
                                setReplyToAuthor(comment.authorName);
                                setHoveredCommentId(null);
                              }}
                              aria-label="Reply to comment"
                            >
                              <FiCornerDownLeft size={20} />
                            </button>
                          </div>
                        )}

                        {/* Nested replies */}
                        {renderReplies(comment._id)}
                      </div>
                    ))
                ) : (
                  <div className="text-center text-gray-600">No comments</div>
                )}
              </div>

              {/* Comment editor */}
              <div className="mt-4 pt-4 border-t border-gray-700 sticky bottom-0 bg-gray-800">
                <CommentEditor
                  params={{
                    pdfId: pdfId as string,
                    page: 1,
                    parentCommentId,
                    fetchCommentAfterEveryComment,
                    replyToAuthor,
                    setParentCommentId, // pass setter here
                  }}
                />
              </div>
            </div>
          </main>
        ) : (
          <div className="w-full min-h-screen flex items-center justify-center text-white">
            <h1 className="text-center">
              Access to this PDF is restricted. Kindly reach out to the owner to
              obtain the necessary permissions
            </h1>
          </div>
        )}
      </div>
    );
  }
};

export default CollaborationPage;
