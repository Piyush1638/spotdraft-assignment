import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import { Comment } from "@/models/commentModel";
import getUserToken from "@/helpers/getTokens";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const userToken = getUserToken(req);
    if (userToken instanceof NextResponse) return userToken;

    const { userId } = userToken;

    if (!userId) {
      return NextResponse.json(
        { message: "User not found", success: true },
        {
          status: 404,
        }
      );
    }

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { success: false, message: "Missing comment id in request body" },
        { status: 400 }
      );
    }

    const deletedComment = await Comment.findById(commentId);

    if (!deletedComment) {
      return NextResponse.json(
        { success: false, message: "Comment not found or already deleted" },
        { status: 404 }
      );
    }

    if (deletedComment.authorId.toString() !== userId) {
      return NextResponse.json(
        {
          message: "You cannot delete this comment",
          success: false,
        },
        {
          status: 403,
        }
      );
    }

    await Comment.deleteOne({ _id: commentId });

    return NextResponse.json(
      { success: true, message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
