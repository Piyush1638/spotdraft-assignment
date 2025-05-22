import { NextRequest, NextResponse } from "next/server";
import transporter from "@/helpers/nodemailer";
import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

await connectDB();

const resetPasswordOTP = async (req: NextRequest) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required", success: false },
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
          message: "Account doesn't exist with this email. If it does, an OTP has been sent.",
          success: true,
        },
        { status: 200 }
      );
    }

    // Generate 6-digit OTP (no external package)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpireAt = Date.now() + 15 * 60 * 1000; 

    user.resetOtp = otp;
    user.resetOtpExpireAt = otpExpireAt;
    await user.save();

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <p>Hello${user.name ? ` ${user.name}` : ""},</p>
        <p>You requested a password reset. Use the OTP below to proceed:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 15 minutes.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <br />
        <p>Best regards,<br/>Team CoDoc</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: "An OTP has been sent to your email.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Internal server error.", success: false },
      { status: 500 }
    );
  }
};

export { resetPasswordOTP as POST };
