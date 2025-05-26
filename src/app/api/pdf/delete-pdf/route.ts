import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import { PDF } from "@/models/pdfModel";
import getUserToken from "@/helpers/getTokens";
import User from "@/models/userModel";
import { Types } from "mongoose";

export const DELETE = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const pdfId = searchParams.get("pdfId");
    const userToken = getUserToken(req);
    if (userToken instanceof NextResponse) return userToken;

    const { userId } = userToken;

    if (!pdfId) {
      return NextResponse.json(
        { message: "Invalid Request! pdfId is required.", success: false },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid Request!", success: false },
        { status: 400 }
      );
    }

    // Delete the PDF by id
    const deletedPdf = await PDF.findByIdAndDelete(pdfId);
    if (!deletedPdf) {
      return NextResponse.json(
        { message: "PDF not found", success: false },
        { status: 404 }
      );
    }

    const currentUser = await User.findById(userId);
    if (currentUser) {
      currentUser.sharedFiles = currentUser.sharedFiles.filter(
        (id: Types.ObjectId) => id.toString() !== pdfId
      );
      await currentUser.save();
    }

    return NextResponse.json(
      {
        message: "PDF deleted successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting PDF:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};
