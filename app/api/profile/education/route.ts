import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const DegreeList = await prisma.degreeList.findMany();
    const InstitutionList = await prisma.institutionList.findMany();
    const response = NextResponse.json({
      DegreeList,
      InstitutionList,
    });
    response.headers.set("Cache-Control", "public, max-age=3600");
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
