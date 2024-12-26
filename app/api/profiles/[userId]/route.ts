import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CreateProfileDto } from "@/types";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: params.userId },
      include: {
        education: true,
        workHistory: true,
        skills: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const formattedProfile = {
      name: profile.name || "",
      phone: profile.phoneNumber || "",
      address: profile.address || "",
      email: profile.email || "",
      experience: profile.workHistory.map((work) => ({
        company: work.companyName || "",
        position: work.jobTitle || "",
        startDate: work.startDate || "",
        endDate: work.endDate || "",
      })) || [{ company: "", position: "", duration: "" }],
      skills: [{ skillSet: profile.skills.map((skill) => skill.name) || [] }],
      education: profile.education.map((edu) => ({
        degree: edu.degree || "",
        institution: edu.institution || "",
      })) || [{ degree: "", institution: "", year: "" }],
    };

    return NextResponse.json(formattedProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();

    const profile = await prisma.profile.update({
      where: { userId: params.userId },
      data: {
        address: data.address,
        phoneNumber: data.phoneNumber,
        bio: data.bio,
        personalInfoComplete: calculatePersonalInfoComplete(data),
        education: {
          deleteMany: {},
          create: data.education,
        },
        workHistory: {
          deleteMany: {},
          create: data.workHistory,
        },
        skills: {
          deleteMany: {},
          create: data.skills,
        },
      },
      include: {
        education: true,
        workHistory: true,
        skills: true,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await prisma.profile.delete({
      where: { userId: params.userId },
    });

    return NextResponse.json({ message: "Profile deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}

function calculatePersonalInfoComplete(
  data: Partial<CreateProfileDto>
): number {
  const fields = ["address", "phoneNumber", "bio"];
  const filledFields = fields.filter((field) => !!data[field]).length;
  return (filledFields / fields.length) * 100;
}
