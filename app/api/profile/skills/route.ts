import prisma from "@/lib/prisma";

export async function GET() {
  const skills = await prisma.skill.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return new Response(JSON.stringify(skills), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
