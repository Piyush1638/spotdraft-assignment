import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import transporter from "@/helpers/nodemailer";

await connectDB();

const signUp = async (req: NextRequest) => {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Please provide all the fields", success: false },
      { status: 400 }
    );
  }

  if (!email.includes("@")) {
    return NextResponse.json(
      { message: "Please provide a valid email", success: false },
      { status: 400 }
    );
  }

  if (password.length < 10) {
    return NextResponse.json(
      {
        message: "Password must be at least 10 characters long",
        success: false,
      },
      { status: 400 }
    );
  }

  if (password.length > 24) {
    return NextResponse.json(
      {
        message: "Password must be at most 24 characters long",
        success: false,
      },
      { status: 400 }
    );
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", success: false },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedNewUser = await newUser.save();
    console.log("New user created:", savedNewUser);

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // ✅ Create response and set cookie on it
    const response = NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user: {
          id: savedNewUser._id,
          name: savedNewUser.name,
          email: savedNewUser.email,
          createdAt: savedNewUser.createdAt,
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days (in seconds)
      path: "/",
    });

    // Send a welcome email
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Welcome to CoDoc",
      text: `Hello ${savedNewUser.name},\n\nThank you for signing up! We're glad to have you on board. We have created your account with email id: ${savedNewUser.email}\n\nBest regards,\nTeam CoDoc`,
    };

    await transporter.sendMail(mailOptions);

    return response;
  } catch (error) {
    console.error("Login error:", error);

    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
};

export { signUp as POST };
