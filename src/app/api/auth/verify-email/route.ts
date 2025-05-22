import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import getUserToken from "@/helpers/getTokens";

await connectDB();

const verifyOtpHandler = async (req: NextRequest) => {
  const userToken = getUserToken(req);
  const { otp } = await req.json();

  // If token is invalid, it will return a NextResponse error — handle that
  if (userToken instanceof NextResponse) return userToken;

  const { userId } = userToken;

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized. Please login again.", success: false },
      { status: 401 }
    );
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    if (user.isAccountVerified) {
      return NextResponse.json(
        { message: "Account already verified", success: false },
        { status: 400 }
      );
    }

    if (user.verifyOtp !== otp || user.verifyOtp == "") {
      return NextResponse.json(
        { message: "Invalid OTP", success: false },
        { status: 400 }
      );
    }

    if (Date.now() > user.verifyOtpExpireAt) {
      return NextResponse.json(
        { message: "OTP has expired", success: false },
        { status: 400 }
      );
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
};

export { verifyOtpHandler as POST };
