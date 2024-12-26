import prisma from "@/lib/prisma";

export async function GET() {

  const companies = await prisma.companyList.findMany({
    select: {
      id: true,
      name: true,
    },
  });


  return new Response(JSON.stringify(companies), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}