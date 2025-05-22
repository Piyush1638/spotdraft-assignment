import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import getUserToken from "@/helpers/getTokens";

await connectDB();

const isAccountVerifiedOrNot = async (req: NextRequest) => {
  try {
    const userToken = getUserToken(req);

    // If token is invalid, it will return a NextResponse error — handle that
    if (userToken instanceof NextResponse) return userToken;

    const { userId } = userToken;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      {
        message: "User Account Verification Status Retrieved Successfully",
        isAccountVerified: user.isAccountVerified,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
};



export {isAccountVerifiedOrNot as GET};



