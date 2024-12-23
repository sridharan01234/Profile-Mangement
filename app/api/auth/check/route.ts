// app/api/auth/check/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);

    return NextResponse.json({
      user: decoded,
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
