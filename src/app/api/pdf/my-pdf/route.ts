import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import getUserToken from "@/helpers/getTokens";
import { PDF } from "@/models/pdfModel";
import mongoose from "mongoose";

const myPdf = async (req: NextRequest) => {
  try {
    await connectDB();

    const userToken = getUserToken(req);
    if (userToken instanceof NextResponse) return userToken;

    const { userId } = userToken;

    const getPdfs = await PDF.find({
      authorId: new mongoose.Types.ObjectId(userId),
    });

    if (getPdfs.length === 0) {
      return NextResponse.json(
        { message: "No PDFs found for this user", success: true, data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "PDFs retrieved successfully", success: true, data: getPdfs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};

export { myPdf as GET };
