import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import getUserToken from "@/helpers/getTokens";
import { PDF } from "@/models/pdfModel";

const isPdfOwner = async (req: NextRequest) => {
  try {
    await connectDB();

    const { pdfId } = await req.json();
    if (!pdfId) {
      return NextResponse.json(
        { message: "Error in fetching Pdf ID!", success: false },
        { status: 400 }
      );
    }

    const userToken = getUserToken(req);
    if (userToken instanceof NextResponse) return userToken;

    const { userId } = userToken;

    const getPdf = await PDF.findById(pdfId);
    if (!getPdf) {
      return NextResponse.json(
        { message: "PDF doesn't exists!", success: false },
        { status: 404 }
      );
    }

    if (getPdf.authorId.toString() !== userId) {
      return NextResponse.json(
        { message: "Unauthorized Access!", success: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "User is the owner of this PDF", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking PDF ownership:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};

export { isPdfOwner as POST };
