import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import getUserToken from "@/helpers/getTokens";
import { PDF } from "@/models/pdfModel";
import mongoose from "mongoose";
import User from "@/models/userModel";

const sharedPdf = async (req: NextRequest) => {
  try {
    await connectDB();

    const userToken = getUserToken(req);
    if (userToken instanceof NextResponse) return userToken;

    const { userId } = userToken;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found", success: false },
        { status: 400 }
      );
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const sharedWithUser_pdfIds = existingUser.sharedFiles;

    if (!Array.isArray(sharedWithUser_pdfIds) || sharedWithUser_pdfIds.length === 0) {
      return NextResponse.json(
        { message: "No PDFs are shared with any user", success: true, data: [] },
        { status: 200 }
      );
    }

    // Find PDFs where _id is in the sharedWithUser_pdfIds array
    const sharedPdfs = await PDF.find({
      _id: { $in: sharedWithUser_pdfIds.map(id => new mongoose.Types.ObjectId(id)) },
    });

    return NextResponse.json(
      { message: "Shared PDFs retrieved successfully", success: true, data: sharedPdfs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching shared PDFs:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};

export { sharedPdf as GET };
