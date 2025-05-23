import { nanoid } from "nanoid"; 
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import { PDF } from "@/models/pdfModel";
import User from "@/models/userModel";
import getUserToken from "@/helpers/getTokens";

const uploadPDF = async (req: NextRequest) => {
  await connectDB();

  const userToken = getUserToken(req);
  if (userToken instanceof NextResponse) return userToken;

  const { userId } = userToken;
  const { name, url, type, size, fileHash, lastModified } = await req.json();

  if (!name || !url || !type || !size || !fileHash || !lastModified) {
    return NextResponse.json(
      {
        message: "Please provide all the fields",
        success: false,
      },
      { status: 400 }
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json(
      {
        message: "User not found",
        success: false,
      },
      { status: 400 }
    );
  }

  try {
    // ✅ Generate unique shareId
    let shareId: string;
    let existingPDF;

    do {
      shareId = nanoid(10); // you can adjust length
      existingPDF = await PDF.findOne({ shareId });
    } while (existingPDF);

    const pdf = new PDF({
      name,
      url,
      type,
      size,
      fileHash,
      lastModified,
      authorId: userId,
      sharedWith: [],
      shareId, // ✅ Add shareId here
    });

    const savedPDF = await pdf.save();
    console.log("PDF saved successfully:", savedPDF);

    return NextResponse.json(
      {
        message: "PDF uploaded successfully",
        savedPdfId: savedPDF._id,
        shareId: savedPDF.shareId,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
};

export { uploadPDF as POST };
