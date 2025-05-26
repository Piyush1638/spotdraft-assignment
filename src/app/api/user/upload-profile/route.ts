import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import getUserToken from "@/helpers/getTokens";

await connectDB();

export const POST = async (req: NextRequest) => {
  try {
    const userToken = getUserToken(req);

    if (userToken instanceof NextResponse) return userToken;

    const { userId } = userToken;
    const { url } = await req.json();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    user.profilePicture = url;
    await user.save();

    return NextResponse.json(
      {
        message: "Profile picture saved successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
};
