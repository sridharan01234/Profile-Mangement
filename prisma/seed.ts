import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Delete in reverse order of dependencies
    await prisma.workHistory.deleteMany({});
    await prisma.education.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.degreeList.deleteMany({});
    await prisma.institutionList.deleteMany({});
    await prisma.companyList.deleteMany({});
    await prisma.skillList.deleteMany({});
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
}

async function main() {
  console.log("Starting seed...");

  // Clear existing data
  console.log("Clearing existing data...");
  await clearDatabase();

  // Create reference data
  console.log("Creating reference data...");

  // Create degree list
  const degrees = [
    "Bachelor of Science in Computer Science",
    "Master of Science in Software Engineering",
    "Bachelor of Arts in Business Administration",
    "Master of Business Administration",
    "Bachelor of Engineering",
    "Master of Information Technology",
    "Ph.D. in Computer Science",
    "Associate Degree in Web Development",
  ];

  for (const degreeName of degrees) {
    await prisma.degreeList.create({
      data: { name: degreeName },
    });
  }

  // Create institution list
  const institutions = [
    "Massachusetts Institute of Technology",
    "Stanford University",
    "University of California, Berkeley",
    "Carnegie Mellon University",
    "Georgia Institute of Technology",
    "University of Washington",
    "University of Illinois",
    "California Institute of Technology",
  ];

  for (const institutionName of institutions) {
    await prisma.institutionList.create({
      data: { name: institutionName },
    });
  }

  // Create company list
  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Apple",
    "Meta",
    "Netflix",
    "IBM",
    "Oracle",
    "Salesforce",
    "Adobe",
  ];

  for (const companyName of companies) {
    await prisma.companyList.create({
      data: { name: companyName },
    });
  }

  // Create skill list
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "AWS",
    "Docker",
    "Kubernetes",
    "MongoDB",
    "PostgreSQL",
    "GraphQL",
    "REST API",
    "Git",
    "CI/CD",
  ];

  for (const skillName of skills) {
    await prisma.skillList.create({
      data: { name: skillName },
    });
  }

  // Create users with complete profiles
  console.log("Creating users and profiles...");
  const userCount = 10;

  for (let i = 0; i < userCount; i++) {
    // Create user
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      },
    });

    // Create profile for user
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        address: faker.location.streetAddress(),
        phoneNumber: faker.phone.number(),
        bio: faker.lorem.paragraph(),
        personalInfoComplete: faker.number.float({
          min: 0,
          max: 100,
          fractionDigits: 2,
        }),
        educationComplete: faker.number.float({
          min: 0,
          max: 100,
          fractionDigits: 2,
        }),
        workHistoryComplete: faker.number.float({
          min: 0,
          max: 100,
          fractionDigits: 2,
        }),
        skillsComplete: faker.number.float({
          min: 0,
          max: 100,
          fractionDigits: 2,
        }),
        totalComplete: faker.number.float({
          min: 0,
          max: 100,
          fractionDigits: 2,
        }),
      },
    });

    // Add education entries
    const educationCount = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < educationCount; j++) {
      await prisma.education.create({
        data: {
          degree: faker.helpers.arrayElement(degrees),
          institution: faker.helpers.arrayElement(institutions),
          startDate: faker.date.past({ years: 10 }),
          endDate: faker.date.past({ years: 2 }),
          profileId: profile.id,
        },
      });
    }

    // Add work history entries
    const workHistoryCount = faker.number.int({ min: 1, max: 4 });
    for (let j = 0; j < workHistoryCount; j++) {
      await prisma.workHistory.create({
        data: {
          jobTitle: faker.person.jobTitle(),
          companyName: faker.helpers.arrayElement(companies),
          startDate: faker.date.past({ years: 8 }),
          endDate: j === 0 ? null : faker.date.past({ years: 2 }),
          description: faker.lorem.paragraph(),
          profileId: profile.id,
        },
      });
    }

    // Add skills
    const skillCount = faker.number.int({ min: 3, max: 8 });
    const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
    const selectedSkills = shuffledSkills.slice(0, skillCount);

    for (const skillName of selectedSkills) {
      await prisma.skill.create({
        data: {
          name: skillName,
          profileId: profile.id,
        },
      });
    }
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
