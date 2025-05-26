import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import getUserToken from "@/helpers/getTokens";
import { PDF } from "@/models/pdfModel";

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

    // ✅ Find all PDFs where userId is in the sharedWith array
    const sharedPdfs = await PDF.find({ sharedWith: userId });

    return NextResponse.json(
      {
        message: "Shared PDFs retrieved successfully",
        success: true,
        data: sharedPdfs,
      },
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
