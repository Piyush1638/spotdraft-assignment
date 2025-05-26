import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { PDF } from "@/models/pdfModel";
import getUserToken from "@/helpers/getTokens";
import mongoose from "mongoose";
import transporter from "@/helpers/nodemailer";

const shareAccess = async (req: NextRequest) => {
  try {
    await connectDB();

    const userToken = getUserToken(req);
    if (userToken instanceof NextResponse) return userToken;

    const { userId } = userToken;
    const { email, pdfId } = await req.json();

    if (!pdfId) {
      return NextResponse.json(
        {
          message: "Pdf does not exist",
          success: false,
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          message: "Please provide an email",
          success: false,
        },
        { status: 400 }
      );
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json(
        { message: "Current user not found", success: false },
        { status: 404 }
      );
    }

    // Check if user with provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User with this email does not exist", success: false },
        { status: 404 }
      );
    }

    // Check the mail entered is not the same as the logged in user
    if (user._id.toString() === userId) {
      return NextResponse.json(
        { message: "You cannot share with yourself", success: false },
        { status: 400 }
      );
    }

    // Check if the PDF exists
    const existingPdf = await PDF.findById(pdfId);
    if (!existingPdf) {
      return NextResponse.json(
        { message: "PDF not found", success: false },
        { status: 404 }
      );
    }

    // Check if the access is already shared with the user
    const alreadyShared = existingPdf.sharedWith.some(
      (id: mongoose.Types.ObjectId) => id.toString() === user._id.toString()
    );

    if (alreadyShared) {
      return NextResponse.json(
        { message: "PDF already shared with this user", success: false },
        { status: 400 }
      );
    }

    // Add user's ID to the sharedWith array and save
    existingPdf.sharedWith.push(user._id);

    await existingPdf.save();

    // Store the Sharing Pdf id in the sharedFiles array or the current user

    currentUser.sharedFiles.push(pdfId);
    await currentUser.save();

    // --- Send email notification to the user ---

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "You've Been Granted Access to a PDF Document",
      html: `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Dear ${user.name},</p>
      
      <p>You have been granted access to the following PDF document:</p>
      
      <p><strong>Title:</strong> ${existingPdf.name}</p>
      
      <p>
        You can access it by clicking the link below:<br/>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/pdf/collaborate/${pdfId}/${existingPdf.shareId}" target="_blank">
          Open PDF
        </a>
      </p>

      <p>If the above link doesn’t work, try copying and pasting the following URL into your browser:</p>
      <p style="word-break: break-all;">
        ${process.env.NEXT_PUBLIC_BASE_URL}/pdf/collaborate/${pdfId}/${existingPdf.shareId}
      </p>

      <p>Best regards,<br/>
      The Team</p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "PDF shared successfully and email sent", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sharing access:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};

export { shareAccess as POST };
