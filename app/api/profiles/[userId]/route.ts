import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CreateProfileDto } from "@/types";
import { NextRequest } from "next/server";
import { log } from "console";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ userId: string }> },
) {
  const params = await props.params;
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
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    });

    if (!profile || !user) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
      });
    }

    const formattedProfile = {
      name: user.name || "",
      phone: profile.phoneNumber || "",
      address: profile.address || "",
      email: user.email || "",
      experience: profile.workHistory.map((work) => ({
        company: work.companyName || "",
        position: work.jobTitle || "",
        startDate: work.startDate || "",
        endDate: work.endDate || "",
      })) || [{ company: "", position: "", duration: "" }],
      skills: [
        {
          skillSet:
            profile.skills.map((skill) => ({
              name: skill.id,
              label: skill.name,
            })) || [],
        },
      ],
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
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;
  const data: CreateProfileDto = await request.json();
  try {
    // Debug log to see incoming date formats
    console.log("Incoming dates:", {
      educationDates: data.education.map((edu) => ({})),
      workDates: data.experience.map((exp) => ({
        startDate: exp.startDate,
        endDate: exp.endDate,
      })),
    });

    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    let profile;

    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { userId },
        data: {
          address: data.address,
          phoneNumber: data.phone,
          bio: data.bio,
          education: {
            deleteMany: {},
            create: data.education.map((edu) => {
              return {
                degree: edu.degree,
                institution: edu.institution,
                startDate: new Date(),
                endDate: new Date(),
              };
            }),
          },
          workHistory: {
            deleteMany: {},
            create: data.experience.map((exp) => {
              const startDate = formatDate(exp.startDate);
              const endDate = formatDate(exp.endDate);

              if (!startDate) {
                throw new Error(
                  `Invalid start date for work experience: ${exp.position}`,
                );
              }

              return {
                companyName: exp.company,
                jobTitle: exp.position,
                startDate,
                endDate,
              };
            }),
          },
          skills: {
            deleteMany: {},
            create: data.skills.flatMap((skill) =>
              skill.skillSet.map((s) => ({
                name: s.label,
              })),
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
      profile = await prisma.profile.create({
        data: {
          userId,
          address: data.address,
          phoneNumber: data.phone,
          bio: data.bio,
          education: {
            create: data.education.map((edu) => {
              return {
                degree: edu.degree,
                institution: edu.institution,
                startDate: new Date(),
                endDate: new Date(),
              };
            }),
          },
          workHistory: {
            create: data.experience.map((exp) => {
              const startDate = formatDate(exp.startDate);
              const endDate = formatDate(exp.endDate);

              if (!startDate) {
                throw new Error(
                  `Invalid start date for work experience: ${exp.position}`,
                );
              }

              return {
                companyName: exp.company,
                jobTitle: exp.position,
                startDate,
                endDate,
                description: exp.description || null,
              };
            }),
          },
          skills: {
            create: data.skills.flatMap((skill) =>
              skill.skillSet.map((s) => ({
                name: s.label,
              })),
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
    console.error("Profile operation failed:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      data: {
        userId,
        requestData: JSON.stringify(data, null, 2),
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      {
        error: "Failed to create or update profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

const formatDate = (date: Date | null | string): Date | null => {
  if (!date) return null;

  try {
    const dateObject = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObject.getTime())) {
      return null;
    }

    return new Date(
      dateObject.getFullYear(),
      dateObject.getMonth(),
      dateObject.getDate(),
    );
  } catch (error) {
    console.error("Error formatting date:", error);
    return null;
  }
};
