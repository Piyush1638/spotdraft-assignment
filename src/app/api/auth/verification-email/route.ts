import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import transporter from "@/helpers/nodemailer";
import getUserToken from "@/helpers/getTokens";

await connectDB();

export const POST = async (req: NextRequest) => {
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

    if (user.isAccountVerified) {
      return NextResponse.json(
        { message: "Account already verified", success: false },
        { status: 400 }
      );
    }

    const verificationOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user.verifyOtp = verificationOtp;
    user.verifyOtpExpireAt = verificationOtpExpireAt;
    await user.save();

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "CoDoc Account Verification",
      html: `
        <div style="max-width: 600px; margin: auto; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <h2 style="text-align: center; color: #2c3e50;">Welcome to <span style="color: #007bff;">CoDoc</span>!</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for signing up. To complete your registration, please verify your email address using the OTP below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #007bff; color: white; padding: 15px 30px; font-size: 24px; letter-spacing: 4px; border-radius: 8px; font-weight: bold;">
              ${verificationOtp}
            </span>
          </div>

          <p style="text-align: center; font-size: 14px; color: #555;">This OTP will expire in <strong>24 hours</strong>.</p>
          <p>If you didn’t request this email, please ignore it.</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

          <p style="font-size: 14px; color: #888;">Best regards,<br>Team <strong>CoDoc</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: "Verification email sent successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
};



