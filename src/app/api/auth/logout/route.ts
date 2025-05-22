import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const logout = async () => {
  try {
    const cookieStore = await cookies(); // Await the Promise to get the cookie store
    cookieStore.delete("token"); // Now this is valid

    return NextResponse.json(
      {
        message: "Logout successful",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        message: "Logout failed",
        success: false,
      },
      { status: 500 }
    );
  }
};

export { logout as POST };
