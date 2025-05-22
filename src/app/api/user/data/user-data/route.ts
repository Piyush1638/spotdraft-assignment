import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import getUserToken from "@/helpers/getTokens";

await connectDB();

const getUserData = async (req: NextRequest) => {
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
        message: "User data retrieved successfully",
        user: {
            userId: user._id,
            name: user.name,
            email: user.email,
            isAccountVerified: user.isAccountVerified,
            sharedFiles: user.sharedFiles,
        },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
};



export {getUserData as GET};



