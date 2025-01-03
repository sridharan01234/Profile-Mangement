import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Helper function to remove duplicates from an array
const uniqueArray = (arr: any[]) => Array.from(new Set(arr));

// Helper function to get random items from array
const getRandomItems = (arr: any[], min: number, max: number) => {
  const count = faker.number.int({ min, max });
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate Degrees
const degrees = uniqueArray([
  // Common degrees
  "Bachelor of Science (BS)",
  "Bachelor of Arts (BA)",
  "Master of Science (MS)",
  "Master of Arts (MA)",
  "Doctor of Philosophy (PhD)",
  "Master of Business Administration (MBA)",
  // Generate some random degrees
  ...Array.from(
    { length: 20 },
    () =>
      `${faker.helpers.arrayElement([
        "Bachelor of",
        "Master of",
        "Doctor of",
        "Associate of",
      ])} ${faker.helpers.arrayElement([
        "Computer Science",
        "Engineering",
        "Business",
        "Data Science",
        "Information Technology",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Economics",
      ])}`,
  ),
]);

// Generate Universities/Institutions
const institutions = uniqueArray([
  // Top universities
  "Massachusetts Institute of Technology",
  "Stanford University",
  "Harvard University",
  "University of Cambridge",
  "University of Oxford",
  // Generate random universities
  ...Array.from(
    { length: 50 },
    () =>
      `${faker.helpers.arrayElement([
        "University of",
        "Institute of",
        "College of",
        "School of",
      ])} ${faker.location.city()}`,
  ),
]);

// Generate Companies
const companies = uniqueArray([
  // Well-known tech companies
  "Google",
  "Microsoft",
  "Apple",
  "Amazon",
  "Meta",
  "Netflix",
  "Tesla",
  // Generate random companies
  ...Array.from({ length: 100 }, () => {
    const companyName = faker.company.name();
    const suffix = faker.helpers.arrayElement([
      "Inc.",
      "LLC",
      "Corp.",
      "Technologies",
      "Solutions",
      "Group",
    ]);
    return `${companyName} ${suffix}`;
  }),
]);

// Generate Skills
const skills = uniqueArray([
  // Programming Languages
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "TypeScript",
  "Ruby",
  "Go",
  "Swift",
  "Kotlin",
  "PHP",

  // Frameworks & Libraries
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Django",
  "Flask",
  "Spring Boot",
  "Express.js",
  "Next.js",

  // Cloud & DevOps
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "GitLab CI",

  // Databases
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Elasticsearch",

  // Tools & Others
  "Git",
  "REST API",
  "GraphQL",
  "Linux",
  "Agile",
  "Scrum",
]);

async function main() {
  // Clear existing data
  await prisma.skill.deleteMany();
  await prisma.workHistory.deleteMany();
  await prisma.education.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.degreeList.deleteMany();
  await prisma.institutionList.deleteMany();
  await prisma.companyList.deleteMany();
  await prisma.skillList.deleteMany();

  // Create reference data
  await prisma.degreeList.createMany({
    data: degrees.map((name) => ({ name })),
    skipDuplicates: true,
  });

  await prisma.institutionList.createMany({
    data: institutions.map((name) => ({ name })),
    skipDuplicates: true,
  });

  await prisma.companyList.createMany({
    data: companies.map((name) => ({ name })),
    skipDuplicates: true,
  });

  await prisma.skillList.createMany({
    data: skills.map((name) => ({ name })),
    skipDuplicates: true,
  });

  // Create sample users with profiles
  const userCount = 50;
  for (let i = 0; i < userCount; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: await bcrypt.hash("password123", 12),
        profile: {
          create: {
            address: faker.location.streetAddress(true),
            phoneNumber: faker.phone.number(),
            bio: faker.lorem.paragraph(),
            personalInfoComplete: faker.number.float({ min: 0, max: 100 }),
            educationComplete: faker.number.float({ min: 0, max: 100 }),
            workHistoryComplete: faker.number.float({ min: 0, max: 100 }),
            skillsComplete: faker.number.float({ min: 0, max: 100 }),
            totalComplete: faker.number.float({ min: 0, max: 100 }),
          },
        },
      },
      include: {
        profile: true,
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
          endDate: faker.date.past({ years: 5 }),
          profileId: user.profile!.id,
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
          description: faker.lorem.paragraphs(2),
          profileId: user.profile!.id,
        },
      });
    }

    // Add skills
    const userSkills = getRandomItems(skills, 3, 8);
    for (const skill of userSkills) {
      await prisma.skill.create({
        data: {
          name: skill,
          profileId: user.profile!.id,
        },
      });
    }
  }

  console.log(`Seeding completed successfully!`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
