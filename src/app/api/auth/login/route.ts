import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

await connectDB();

const login = async (req: NextRequest) => {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json(
      {
        message: "Please provide all the fields",
        success: false,
      },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "Account with this email does not exist",
          success: false,
        },
        { status: 400 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
          success: false,
        },
        { status: 400 }
      );
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          sharedFiles: user.sharedFiles,
        },
      },
      { status: 200 }
    );

    // Set the token in the cookies
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error); 
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
};

export { login as POST };
