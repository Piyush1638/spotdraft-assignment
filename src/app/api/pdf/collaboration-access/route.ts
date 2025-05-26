import connectDB from "@/dbConfig/dbConfig";
import getUserToken from "@/helpers/getTokens";
import { PDF } from "@/models/pdfModel";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    const userToken = getUserToken(req);
    if (userToken instanceof NextResponse) return userToken;

    const { userId } = userToken;

    if (!userId) {
      return NextResponse.json(
        { message: "Please login to continue", success: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const pdfId = searchParams.get("pdfId");

    if (!pdfId) {
      return NextResponse.json(
        { message: "Invalid request", success: false },
        { status: 400 }
      );
    }

    const existingPdf = await PDF.findById(pdfId);

    if (!existingPdf) {
      return NextResponse.json(
        {
          message: "PDF not found. It may have been deleted or does not exist.",
          success: false,
        },
        { status: 404 }
      );
    }

    const isShared = existingPdf.sharedWith.some(
      (id: Types.ObjectId) => id.toString() === userId.toString()
    );

    // New check: allow if user is the author (owner) of the PDF
    const isAuthor = existingPdf.authorId?.toString() === userId.toString();

    if (!isShared && !isAuthor) {
      return NextResponse.json(
        { message: "You do not have access to this PDF.", success: false },
        { status: 403 }
      );
    }

    return NextResponse.json({ shared: true, success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An unexpected error occurred. Please try again later.",
        success: false,
      },
      { status: 500 }
    );
  }
};
