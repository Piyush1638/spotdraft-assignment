import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { PDF } from "@/models/pdfModel";
import transporter from "@/helpers/nodemailer";
import getUserToken from "@/helpers/getTokens";
import { Types } from "mongoose";

const removeAccess = async (req: NextRequest) => {
  try {
    await connectDB();
    const userToken = getUserToken(req);
    if (userToken instanceof NextResponse) return userToken;

    const { userId } = userToken;

    const { pdfId, userIdToRemove } = await req.json();

    if (!pdfId) {
      return NextResponse.json(
        { message: "Pdf does not exist", success: false },
        { status: 400 }
      );
    }

    if (!userIdToRemove) {
      return NextResponse.json(
        { message: "User Not Found!", success: false },
        { status: 400 }
      );
    }

    const existingPdf = await PDF.findById(pdfId);
    if (!existingPdf) {
      return NextResponse.json(
        { message: "PDF not found", success: false },
        { status: 404 }
      );
    }

    // Correct removal of userId from sharedWith
    existingPdf.sharedWith = existingPdf.sharedWith.filter(
      (id: string) => id.toString() !== userIdToRemove
    );

    await existingPdf.save();

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return NextResponse.json(
        {
          message: "Current user not found!",
          success: false,
        },
        { status: 404 }
      );
    }

    currentUser.sharedFiles = currentUser.sharedFiles.filter(
      (id: Types.ObjectId) => id.toString() !== pdfId
    );

    currentUser.save();

    // This below is to send email to the user
    const removedUser = await User.findById(userIdToRemove as string);
    if (!removedUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: removedUser.email,
      subject: "Your Access to a PDF Document Has Been Revoked",
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <p>Dear ${removedUser.name},</p>

          <p>We wanted to let you know that your access to the following PDF document has been removed by ${currentUser.name}:</p>

          <p><strong>Title:</strong> ${existingPdf.name}</p>

          <p>As a result, you will no longer be able to view or collaborate on this document.</p>

          <p>If you believe this was done in error or have any questions, please reach out to the document owner.</p>

          <p>Best regards,<br/>
          Team CoDoc</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Access removed and email sent", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing access:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};

export { removeAccess as POST }; 

