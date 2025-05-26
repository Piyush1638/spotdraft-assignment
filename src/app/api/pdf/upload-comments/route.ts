import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import { Comment } from "@/models/commentModel";
import getUserToken from "@/helpers/getTokens";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const userToken = await getUserToken(req);

    if (userToken instanceof NextResponse) return userToken;

    const { userId } = userToken;

    const {
      pdfId,
      content,
      page,
      parentCommentId, // optional
      authorImg, // optional
      authorName,
    } = await req.json();

    if (!pdfId || !content || typeof page !== "number") {
      return NextResponse.json(
        { message: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    const newComment = new Comment({
      pdfId,
      authorId: userId,
      authorImg: authorImg || "",
      authorName,
      content,
      page,
      parentCommentId: parentCommentId || null,
    });

    await newComment.save();

    return NextResponse.json(
      {
        message: "Comment uploaded successfully",
        success: true,
        comment: newComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading comment:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
