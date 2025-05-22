import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const getUserToken = (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token missing", success: false },
        { status: 401 }
      );
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { id?: string };

    if (decodedToken?.id) {
      return { userId: decodedToken.id };
    }

    return NextResponse.json(
      { message: "Invalid token", success: false },
      { status: 403 }
    );
  } catch (error) {
    console.error("Token error:", error);
    return NextResponse.json(
      { message: "Token verification failed", success: false },
      { status: 500 }
    );
  }
};

export default getUserToken;
