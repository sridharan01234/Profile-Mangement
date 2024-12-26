import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received data:", data);

    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate completion percentages
    const personalInfoComplete = calculatePersonalInfoComplete({
      address: data.address,
      phoneNumber: data.phone,
      bio: "",
    });

    const educationComplete = data.education.some(
      (edu) => edu.degree && edu.institution && edu.year
    )
      ? 100
      : 0;

    const workHistoryComplete = data.experience.some(
      (exp) => exp.company && exp.position && exp.duration
    )
      ? 100
      : 0;

    const skillsComplete = data.skills.some(
      (skill) => skill.skillSet && skill.skillSet.length > 0
    )
      ? 100
      : 0;

    const totalComplete =
      (personalInfoComplete +
        educationComplete +
        workHistoryComplete +
        skillsComplete) /
      4;

    let profile;

    if (user.profile) {
      // Update existing profile
      // First, delete existing related records
      await prisma.$transaction([
        prisma.education.deleteMany({
          where: { profileId: user.profile.id },
        }),
        prisma.workHistory.deleteMany({
          where: { profileId: user.profile.id },
        }),
        prisma.skill.deleteMany({
          where: { profileId: user.profile.id },
        }),
      ]);

      // Then update the profile with new data
      profile = await prisma.profile.update({
        where: { id: user.profile.id },
        data: {
          address: data.address,
          phoneNumber: data.phone,
          bio: "",
          personalInfoComplete,
          educationComplete,
          workHistoryComplete,
          skillsComplete,
          totalComplete,
          education: {
            create: data.education
              .filter((edu) => edu.degree || edu.institution || edu.year)
              .map((edu) => ({
                degree: edu.degree || "",
                institution: edu.institution || "",
                startDate: new Date(edu.year),
                endDate: new Date(edu.year),
              })),
          },
          workHistory: {
            create: data.experience
              .filter((exp) => exp.company || exp.position || exp.duration)
              .map((exp) => ({
                jobTitle: exp.position || "",
                companyName: exp.company || "",
                startDate: new Date(),
                endDate: new Date(),
                description: "",
              })),
          },
          skills: {
            create: data.skills.flatMap((skill) =>
              (skill.skillSet || []).map((name: string) => ({
                name,
              }))
            ),
          },
        },
        include: {
          education: true,
          workHistory: true,
          skills: true,
        },
      });
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          address: data.address,
          phoneNumber: data.phone,
          bio: "",
          personalInfoComplete,
          educationComplete,
          workHistoryComplete,
          skillsComplete,
          totalComplete,
          education: {
            create: data.education
              .filter((edu) => edu.degree || edu.institution || edu.year)
              .map((edu) => ({
                degree: edu.degree || "",
                institution: edu.institution || "",
                startDate: new Date(edu.year),
                endDate: new Date(edu.year),
              })),
          },
          workHistory: {
            create: data.experience
              .filter((exp) => exp.company || exp.position || exp.duration)
              .map((exp) => ({
                jobTitle: exp.position || "",
                companyName: exp.company || "",
                startDate: new Date(),
                endDate: new Date(),
                description: "",
              })),
          },
          skills: {
            create: data.skills.flatMap((skill) =>
              (skill.skillSet || []).map((name: string) => ({
                name,
              }))
            ),
          },
        },
        include: {
          education: true,
          workHistory: true,
          skills: true,
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error(
      `Failed to update profile: ${
        error.message
      }`
    );
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function calculatePersonalInfoComplete(data: {
  address?: string;
  phoneNumber?: string;
  bio?: string;
}): number {
  const fields = ["address", "phoneNumber", "bio"];
  const filledFields = fields.filter((field) => !!data[field]).length;
  return (filledFields / fields.length) * 100;
}
