import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import { Comment } from "@/models/commentModel";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const pdfId = searchParams.get("pdfId");

    if (!pdfId) {
      return NextResponse.json(
        { success: false, message: "Missing pdfId in query" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ pdfId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
