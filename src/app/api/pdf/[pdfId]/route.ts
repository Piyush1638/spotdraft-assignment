import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import { PDF } from "@/models/pdfModel";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const pdfId = req.nextUrl.searchParams.get("pdfId");

    if (!pdfId) {
      return NextResponse.json(
        { message: "PDF ID is required!", success: false },
        { status: 400 }
      );
    }

    const getPdf = await PDF.findById(pdfId);

    if (!getPdf) {
      return NextResponse.json(
        { message: "PDF not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "PDF fetched successfully",
        success: true,
        pdfDetails: getPdf,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};
