import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ userId: string }> }
) {
  const params = await props.params;

  const userId = params.userId;

  if (!userId || typeof userId !== "string") {
    return new Response(JSON.stringify({ error: "UnAuthenticated" }), {
      status: 500,
    });
  }

    const filePath = path.join(process.cwd(), "uploads/profile/", `${userId}.jpg`);

  try {
    const fileBuffer = fs.readFileSync(filePath);
      const base64Image = fileBuffer.toString("base64");
    return NextResponse.json({ data: base64Image });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error occured" }), {
      status: 500,
    });
  }
}
