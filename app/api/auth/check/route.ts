import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import winston from "winston";

// Configure winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

interface DecodedToken extends JwtPayload {
  userId: string;
  email: string;
}

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

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET) as DecodedToken;

    return NextResponse.json({
      user: decoded,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.error("Token verification error: ", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    } else {
      logger.error("Authentication error: ", error);
      return NextResponse.json({ error: "Authentication error" }, { status: 500 });
    }
  }
}
