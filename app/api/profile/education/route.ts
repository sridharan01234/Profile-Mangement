// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const DegreeList = await prisma.degreeList.findMany();
    const InstitutionList = await prisma.institutionList.findMany();
    return NextResponse.json({
      DegreeList: DegreeList,
      InstitutionList: InstitutionList,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
