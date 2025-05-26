import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { PDF } from "@/models/pdfModel";

const pdfSharedUserList = async (req: NextRequest) => {
  try {
    await connectDB();

    const { pdfId } = await req.json();

    if (!pdfId) {
      return NextResponse.json(
        {
          message: "Pdf does not exist",
          success: false,
        },
        { status: 400 }
      );
    }

    const existingPdf = await PDF.findById(pdfId);

    if (!existingPdf) {
      return NextResponse.json(
        {
          message: "PDF not found",
          success: false,
        },
        { status: 404 }
      );
    }

    const sharedUserIds = existingPdf.sharedWith; // Array of user IDs

    // 🧠 Fetch users whose _id is in sharedUserIds
    const sharedUsers = await User.find(
      { _id: { $in: sharedUserIds } },
      "email profilePicture" // Select both email and profilePicture
    );

    const sharedUserDetails = sharedUsers.map((user) => ({
      email: user.email,
      profilePicture: user.profilePicture,
      userId: user._id
    }));

    return NextResponse.json(
      {
        message: "Shared user emails fetched successfully",
        success: true,
        users: sharedUserDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching shared users:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};

export { pdfSharedUserList as POST };
