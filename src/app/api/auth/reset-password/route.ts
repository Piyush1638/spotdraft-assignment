import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

await connectDB();

const resetPassword = async (req: NextRequest) => {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        {
          message: "Email, OTP and new password are required.",
          success: false,
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format", success: false },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // Respond generically regardless of user existence
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found.",
          success: true,
        },
        { status: 200 }
      );
    }

    if (user.resetOtp !== otp && user.resetOtp === "") {
      return NextResponse.json(
        { message: "Invalid OTP.", success: false },
        { status: 400 }
      );
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return NextResponse.json(
        { message: "OTP expired. Please request a new one.", success: false },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    return NextResponse.json(
      {
        message:
          "Password reset successful. You can now log in with your new password.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Internal server error.", success: false },
      { status: 500 }
    );
  }
};

export { resetPassword as POST };
